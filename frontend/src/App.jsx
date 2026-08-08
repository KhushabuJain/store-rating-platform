import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import UpdatePassword from './pages/UpdatePassword';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAddUser from './pages/admin/AdminAddUser';
import AdminStores from './pages/admin/AdminStores';
import AdminAddStore from './pages/admin/AdminAddStore';
import UserDetail from './pages/admin/UserDetail';

import StoreList from './pages/user/StoreList';
import OwnerDashboard from './pages/owner/OwnerDashboard';

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'store_owner') return <Navigate to="/owner/dashboard" replace />;
  return <Navigate to="/stores" replace />;
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/update-password"
          element={
            <PrivateRoute>
              <UpdatePassword />
            </PrivateRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute roles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute roles={['admin']}>
              <AdminUsers />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users/new"
          element={
            <PrivateRoute roles={['admin']}>
              <AdminAddUser />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <PrivateRoute roles={['admin']}>
              <UserDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/stores"
          element={
            <PrivateRoute roles={['admin']}>
              <AdminStores />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/stores/new"
          element={
            <PrivateRoute roles={['admin']}>
              <AdminAddStore />
            </PrivateRoute>
          }
        />

        {/* Normal user routes */}
        <Route
          path="/stores"
          element={
            <PrivateRoute roles={['user']}>
              <StoreList />
            </PrivateRoute>
          }
        />

        {/* Store owner routes */}
        <Route
          path="/owner/dashboard"
          element={
            <PrivateRoute roles={['store_owner']}>
              <OwnerDashboard />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
