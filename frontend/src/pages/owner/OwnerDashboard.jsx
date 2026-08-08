import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import SortableTable from '../../components/SortableTable';
import StarRating from '../../components/StarRating';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/stores/owner/dashboard')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'));
  }, []);

  const columns = [
    { key: 'name', label: 'User Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'rating', label: 'Rating', sortable: true },
    { key: 'submittedAt', label: 'Submitted On', sortable: true },
  ];

  const rows = data
    ? data.raters.map((r) => ({
        id: r.ratingId,
        name: r.user.name,
        email: r.user.email,
        rating: r.rating,
        submittedAt: new Date(r.submittedAt).toLocaleDateString(),
      }))
    : [];

  const renderCell = (row, col) => {
    if (col.key === 'rating') return <StarRating value={row.rating} readOnly size="text-base" />;
    return row[col.key];
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Store Dashboard</h1>

      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</div>}

      {data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">Store</p>
              <p className="text-lg font-semibold mt-1">{data.store.name}</p>
              <p className="text-sm text-gray-500 mt-1">{data.store.address}</p>
            </div>
            <div className="bg-brand-600 text-white rounded-xl p-6 shadow-sm">
              <p className="text-sm opacity-90">Average Rating</p>
              <p className="text-3xl font-bold mt-2">
                {data.averageRating !== null ? `⭐ ${data.averageRating}` : 'No ratings yet'}
              </p>
              <p className="text-sm opacity-80 mt-1">{data.totalRatings} rating(s) submitted</p>
            </div>
          </div>

          <h2 className="text-lg font-semibold mb-3">Users Who Rated Your Store</h2>
          <SortableTable columns={columns} data={rows} renderCell={renderCell} />
        </>
      )}
    </div>
  );
}
