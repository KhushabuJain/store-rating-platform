import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'));
  }, []);

  const cards = stats
    ? [
        { label: 'Total Users', value: stats.totalUsers, color: 'bg-brand-600' },
        { label: 'Total Stores', value: stats.totalStores, color: 'bg-emerald-600' },
        { label: 'Total Ratings', value: stats.totalRatings, color: 'bg-amber-500' },
      ]
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className={`${c.color} text-white rounded-xl p-6 shadow-sm`}>
            <p className="text-sm opacity-90">{c.label}</p>
            <p className="text-3xl font-bold mt-2">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/admin/users/new" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-md text-sm font-medium">
          + Add User
        </Link>
        <Link to="/admin/stores/new" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium">
          + Add Store
        </Link>
        <Link to="/admin/users" className="bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium">
          View Users
        </Link>
        <Link to="/admin/stores" className="bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium">
          View Stores
        </Link>
      </div>
    </div>
  );
}
