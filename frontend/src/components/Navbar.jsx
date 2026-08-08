import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleLabels = {
  admin: 'System Administrator',
  user: 'Normal User',
  store_owner: 'Store Owner',
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-brand-700 text-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg tracking-tight">
          ⭐ Store Ratings
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {user && (
            <>
              {user.role === 'admin' && (
                <>
                  <Link to="/admin/dashboard" className="hover:underline">Dashboard</Link>
                  <Link to="/admin/users" className="hover:underline">Users</Link>
                  <Link to="/admin/stores" className="hover:underline">Stores</Link>
                </>
              )}
              {user.role === 'user' && (
                <Link to="/stores" className="hover:underline">Stores</Link>
              )}
              {user.role === 'store_owner' && (
                <Link to="/owner/dashboard" className="hover:underline">My Store</Link>
              )}
              <Link to="/update-password" className="hover:underline">Change Password</Link>
              <span className="opacity-80">{user.name} · {roleLabels[user.role]}</span>
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
