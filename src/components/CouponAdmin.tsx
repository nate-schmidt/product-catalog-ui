import { useState, useEffect } from 'react';

interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  minimumOrderValue: number;
  active: boolean;
  description: string;
}

export function CouponAdmin() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form states
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    expiryDate: '',
    usageLimit: '100',
    minimumOrderValue: '0',
    description: ''
  });

  // Note: In production, this should be handled securely
  const AUTH_TOKEN = 'Bearer admin-secret';

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/coupons', {
        headers: { 'Authorization': AUTH_TOKEN }
      });
      
      if (!response.ok) throw new Error('Failed to fetch coupons');
      
      const data = await response.json();
      setCoupons(data.coupons);
    } catch (err) {
      setError('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const createCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': AUTH_TOKEN
        },
        body: JSON.stringify({
          ...formData,
          value: parseFloat(formData.value),
          usageLimit: parseInt(formData.usageLimit),
          minimumOrderValue: parseFloat(formData.minimumOrderValue),
          active: true
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create coupon');
      }

      // Reset form and refresh list
      setFormData({
        code: '',
        type: 'percentage',
        value: '',
        expiryDate: '',
        usageLimit: '100',
        minimumOrderValue: '0',
        description: ''
      });
      setShowAddForm(false);
      fetchCoupons();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleCouponStatus = async (code: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/coupons/${code}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': AUTH_TOKEN
        },
        body: JSON.stringify({ active: !currentStatus })
      });

      if (!response.ok) throw new Error('Failed to update coupon');
      
      fetchCoupons();
    } catch (err) {
      setError('Failed to update coupon status');
    }
  };

  const deleteCoupon = async (code: string) => {
    if (!confirm(`Are you sure you want to delete coupon ${code}?`)) return;

    try {
      const response = await fetch(`/api/coupons/${code}`, {
        method: 'DELETE',
        headers: { 'Authorization': AUTH_TOKEN }
      });

      if (!response.ok) throw new Error('Failed to delete coupon');
      
      fetchCoupons();
    } catch (err) {
      setError('Failed to delete coupon');
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading coupons...</div>;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Coupon Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {showAddForm ? 'Cancel' : 'Add New Coupon'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-300">
          {error}
        </div>
      )}

      {/* Add Coupon Form */}
      {showAddForm && (
        <form onSubmit={createCoupon} className="mb-6 p-4 bg-gray-900 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Create New Coupon</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Value {formData.type === 'percentage' ? '(%)' : '($)'}
              </label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                required
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Expiry Date</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Usage Limit</label>
              <input
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                required
                min="1"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Minimum Order Value ($)</label>
              <input
                type="number"
                value={formData.minimumOrderValue}
                onChange={(e) => setFormData({ ...formData, minimumOrderValue: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="e.g., Summer sale - 20% off"
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Create Coupon
          </button>
        </form>
      )}

      {/* Coupons List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="pb-3 text-gray-400">Code</th>
              <th className="pb-3 text-gray-400">Type</th>
              <th className="pb-3 text-gray-400">Value</th>
              <th className="pb-3 text-gray-400">Usage</th>
              <th className="pb-3 text-gray-400">Min Order</th>
              <th className="pb-3 text-gray-400">Expiry</th>
              <th className="pb-3 text-gray-400">Status</th>
              <th className="pb-3 text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(coupon => (
              <tr key={coupon.code} className="border-b border-gray-700/50">
                <td className="py-3 text-white font-mono">{coupon.code}</td>
                <td className="py-3 text-gray-300">{coupon.type}</td>
                <td className="py-3 text-gray-300">
                  {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                </td>
                <td className="py-3 text-gray-300">
                  {coupon.usedCount} / {coupon.usageLimit}
                </td>
                <td className="py-3 text-gray-300">${coupon.minimumOrderValue}</td>
                <td className="py-3 text-gray-300">
                  {new Date(coupon.expiryDate).toLocaleDateString()}
                </td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    coupon.active 
                      ? 'bg-green-900/50 text-green-400' 
                      : 'bg-red-900/50 text-red-400'
                  }`}>
                    {coupon.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3">
                  <button
                    onClick={() => toggleCouponStatus(coupon.code, coupon.active)}
                    className="text-blue-400 hover:text-blue-300 mr-3 text-sm"
                  >
                    {coupon.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => deleteCoupon(coupon.code)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {coupons.length === 0 && (
          <p className="text-center text-gray-500 py-8">No coupons found. Create your first coupon!</p>
        )}
      </div>
    </div>
  );
}