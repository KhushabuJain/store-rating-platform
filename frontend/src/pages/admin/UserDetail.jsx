import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

const roleLabels = { admin: 'System Administrator', user: 'Normal User', store_owner: 'Store Owner' };

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/admin/users/${id}`)
      .then((res) => setUser(res.data.user))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load user'));
  }, [id]);

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Link to="/admin/users" className="text-sm text-brand-600 hover:underline">
        ← Back to Users
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">User Details</h1>

      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</div>}

      {user && (
        <div className="bg-white rounded-xl shadow-md p-8 space-y-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Name</p>
            <p className="font-medium">{user.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Address</p>
            <p className="font-medium">{user.address}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Role</p>
            <p className="font-medium">{roleLabels[user.role]}</p>
          </div>
          {user.role === 'store_owner' && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Store Rating</p>
              <p className="font-medium">{user.rating !== null && user.rating !== undefined ? `⭐ ${user.rating}` : 'No ratings yet'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
