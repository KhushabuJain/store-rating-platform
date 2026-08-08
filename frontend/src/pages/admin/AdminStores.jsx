import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import SortableTable from '../../components/SortableTable';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const res = await api.get('/admin/stores', { params });
      setStores(res.data.stores);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stores');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'averageRating', label: 'Rating', sortable: true },
  ];

  const renderCell = (row, col) => {
    if (col.key === 'averageRating') return row.averageRating !== null ? `⭐ ${row.averageRating} (${row.totalRatings})` : 'No ratings yet';
    return row[col.key];
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Stores</h1>
        <Link to="/admin/stores/new" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium">
          + Add Store
        </Link>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchStores();
        }}
        className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6 bg-white p-4 rounded-lg border border-gray-200"
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
        <button type="submit" className="bg-gray-800 hover:bg-gray-900 text-white rounded-md text-sm font-medium">
          Apply Filters
        </button>
      </form>

      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</div>}
      {loading ? <p className="text-gray-500 text-sm">Loading...</p> : <SortableTable columns={columns} data={stores} renderCell={renderCell} />}
    </div>
  );
}
