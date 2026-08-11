# Store Rating Platform

A full-stack web application where users can browse stores and submit ratings
(1–5), with three roles: **System Administrator**, **Normal User**, and
**Store Owner**.

- **Backend:** Express.js + Sequelize (PostgreSQL) + JWT auth
- **Frontend:** React (Vite) + Tailwind CSS + React Router
- **Database:** PostgreSQL

## Project structure

```
store-rating-app/
├── backend/     Express API (auth, admin, stores, ratings)
└── frontend/    React SPA
```

## 1. Database setup

Create a PostgreSQL database:

```sql
CREATE DATABASE store_ratings;
```

Sequelize will create/sync all tables automatically on server start
(`users`, `stores`, `ratings`), so no manual migration is required for this
project — just point the `.env` at an existing empty database.

## 2. Backend setup

```bash
cd backend
cp .env.example .env
# edit .env with your PostgreSQL credentials and a strong JWT_SECRET
npm install
npm run seed   # creates the first System Administrator account
npm run dev    # starts the API on http://localhost:5000
```

The seeded admin credentials (from `.env`) default to:
- Email: `admin@storerating.com`
- Password: `Admin@12345`

Change `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `.env` before seeding
if you want different credentials.

## 3. Frontend setup

```bash
cd frontend
npm install
npm run dev    # starts the app on http://localhost:5173
```

The Vite dev server proxies `/api/*` requests to `http://localhost:5000`
(see `frontend/vite.config.js`), so no CORS configuration is needed in dev.

## 4. Using the app

1. Log in as the seeded admin.
2. From the **Admin Dashboard**, create a `store_owner` user (Add User →
   role: Store Owner), then create a store and assign that user as its
   owner (Add Store → Store Owner dropdown).
3. Sign up as a Normal User (or have the admin create one) to browse and
   rate stores.
4. Log in as the Store Owner to see the ratings dashboard for their store.

## Roles & functionality

**System Administrator**
- Dashboard: total users, total stores, total ratings
- Add new users (any role) and new stores
- View/filter/sort users and stores by Name, Email, Address, Role
- View full user detail (Store Owners also show their store's rating)
- Log out

**Normal User**
- Sign up / log in
- Update password
- Browse & search stores by Name / Address
- View overall store rating + their own submitted rating
- Submit or modify a 1–5 star rating
- Log out

**Store Owner**
- Log in, update password
- Dashboard: list of users who rated their store + average rating
- Log out

## Validation rules

- **Name:** 20–60 characters
- **Address:** up to 400 characters
- **Password:** 8–16 characters, at least one uppercase letter and one
  special character
- **Email:** standard email format

These are enforced both on the frontend (immediate feedback) and the
backend (`express-validator`, source of truth).

## API overview

| Method | Endpoint                          | Access              |
|--------|------------------------------------|----------------------|
| POST   | /api/auth/signup                   | Public (Normal User) |
| POST   | /api/auth/login                    | Public               |
| GET    | /api/auth/me                       | Authenticated        |
| PUT    | /api/auth/update-password          | Authenticated        |
| POST   | /api/auth/logout                   | Authenticated        |
| GET    | /api/admin/dashboard               | Admin                |
| POST   | /api/admin/users                   | Admin                |
| GET    | /api/admin/users                   | Admin                |
| GET    | /api/admin/users/:id                | Admin                |
| POST   | /api/admin/stores                  | Admin                |
| GET    | /api/admin/stores                  | Admin                |
| GET    | /api/stores                        | Normal User          |
| POST   | /api/stores/:storeId/ratings       | Normal User          |
| GET    | /api/stores/owner/dashboard        | Store Owner          |

## Notes on design decisions

- Passwords are hashed with bcrypt before storage; the `User` model never
  returns the password field by default (Sequelize `defaultScope`).
- Ratings use a unique `(user_id, store_id)` constraint — submitting again
  updates (upserts) the existing rating rather than creating duplicates.
- All list endpoints support `sortBy` / `sortOrder` query params and
  case-insensitive partial-match filters on Name/Email/Address/Role.
- JWT is stored in `localStorage` on the frontend and attached via an axios
  request interceptor; a response interceptor logs the user out on 401.

  ## Demo Credentials

### System Administrator
Email: `admin@storerating.com`
Password: `Admin@12345`

The administrator can create Store Owner and Normal User accounts from the dashboard.

> For security, these credentials are intended only for local/demo evaluation.
