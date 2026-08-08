import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function AdminAddStore() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [storeOwners, setStoreOwners] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get('/admin/users', { params: { role: 'store_owner' } })
      .then((res) => setStoreOwners(res.data.users))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, owner_id: form.owner_id ? Number(form.owner_id) : undefined };
      await api.post('/admin/stores', payload);
      navigate('/admin/stores');
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      setError(apiErrors ? apiErrors.map((e) => e.msg).join(' ') : err.response?.data?.message || 'Failed to create store');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Store</h1>
      <div className="bg-white rounded-xl shadow-md p-8">
        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Store Name</label>
            <input
              required
              maxLength={60}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Store Email</label>
            <input
              type="email"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              required
              maxLength={400}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Store Owner (optional)</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={form.owner_id}
              onChange={(e) => setForm({ ...form, owner_id: e.target.value })}
            >
              <option value="">No owner assigned yet</option>
              {storeOwners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.email})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Create a Store Owner account first (Add User → role: Store Owner) to assign one here.
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-md transition disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create Store'}
          </button>
        </form>
      </div>
    </div>
  );
}
