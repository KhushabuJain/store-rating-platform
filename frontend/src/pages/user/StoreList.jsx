import React, { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import SortableTable from '../../components/SortableTable';
import StarRating from '../../components/StarRating';

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const res = await api.get('/stores', { params });
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

  const submitRating = async (storeId, rating) => {
    setSavingId(storeId);
    try {
      await api.post(`/stores/${storeId}/ratings`, { rating });
      setStores((prev) =>
        prev.map((s) =>
          s.id === storeId
            ? {
                ...s,
                userRating: rating,
                totalRatings: s.userRating ? s.totalRatings : s.totalRatings + 1,
                averageRating: recompute(s, rating),
              }
            : s
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSavingId(null);
    }
  };

  const recompute = (store, newRating) => {
    // Rough client-side recalculation for immediate feedback; server is source of truth.
    if (store.userRating) {
      const total = (store.averageRating || 0) * store.totalRatings - store.userRating + newRating;
      return Number((total / store.totalRatings).toFixed(2));
    }
    const total = (store.averageRating || 0) * store.totalRatings + newRating;
    return Number((total / (store.totalRatings + 1)).toFixed(2));
  };

  const columns = [
    { key: 'name', label: 'Store Name', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'averageRating', label: 'Overall Rating', sortable: true },
    { key: 'userRating', label: 'Your Rating', sortable: false },
    { key: 'action', label: 'Rate this Store', sortable: false },
  ];

  const renderCell = (row, col) => {
    if (col.key === 'averageRating') {
      return row.averageRating !== null ? `⭐ ${row.averageRating} (${row.totalRatings})` : 'No ratings yet';
    }
    if (col.key === 'userRating') {
      return row.userRating ? <StarRating value={row.userRating} readOnly /> : <span className="text-gray-400 text-sm">Not rated</span>;
    }
    if (col.key === 'action') {
      return (
        <StarRating
          value={row.userRating || 0}
          onChange={(val) => submitRating(row.id, val)}
          readOnly={savingId === row.id}
        />
      );
    }
    return row[col.key];
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Browse Stores</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchStores();
        }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 bg-white p-4 rounded-lg border border-gray-200"
      >
        <input
          placeholder="Search by name"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          placeholder="Search by address"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })}
        />
        <button type="submit" className="bg-gray-800 hover:bg-gray-900 text-white rounded-md text-sm font-medium">
          Search
        </button>
      </form>

      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</div>}
      {loading ? <p className="text-gray-500 text-sm">Loading...</p> : <SortableTable columns={columns} data={stores} renderCell={renderCell} />}
    </div>
  );
}
