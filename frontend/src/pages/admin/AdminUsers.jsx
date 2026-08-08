import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import SortableTable from '../../components/SortableTable';

const roleLabels = { admin: 'Admin', user: 'Normal User', store_owner: 'Store Owner' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const res = await api.get('/admin/users', { params });
      setUsers(res.data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'rating', label: 'Rating (Store Owner)', sortable: true },
    { key: 'actions', label: '' },
  ];

  const renderCell = (row, col) => {
    if (col.key === 'role') return roleLabels[row.role] || row.role;
    if (col.key === 'rating') return row.role === 'store_owner' ? (row.rating ?? '—') : '—';
    if (col.key === 'actions') {
      return (
        <Link to={`/admin/users/${row.id}`} className="text-brand-600 hover:underline text-sm">
          View
        </Link>
      );
    }
    return row[col.key];
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Link to="/admin/users/new" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-md text-sm font-medium">
          + Add User
        </Link>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchUsers();
        }}
        className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-6 bg-white p-4 rounded-lg border border-gray-200"
      >
        <input
          placeholder="Filter by name"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          placeholder="Filter by email"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
        />
        <input
          placeholder="Filter by address"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })}
        />
        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">Normal User</option>
          <option value="store_owner">Store Owner</option>
        </select>
        <button type="submit" className="bg-gray-800 hover:bg-gray-900 text-white rounded-md text-sm font-medium">
          Apply Filters
        </button>
      </form>

      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</div>}
      {loading ? <p className="text-gray-500 text-sm">Loading...</p> : <SortableTable columns={columns} data={users} renderCell={renderCell} />}
    </div>
  );
}
