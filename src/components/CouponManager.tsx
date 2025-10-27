import React, { useState } from 'react';
import { useCoupon } from '../context/CouponContext';
import { CouponType } from '../types';

export const CouponManager: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getAllCoupons } = useCoupon();
  
  const coupons = getAllCoupons();

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'No expiry';
    return date.toLocaleDateString();
  };

  const getCouponTypeDisplay = (type: CouponType, value: number) => {
    switch (type) {
      case CouponType.PERCENTAGE:
        return `${value}% off`;
      case CouponType.FIXED_AMOUNT:
        return `${formatPrice(value)} off`;
      case CouponType.FREE_SHIPPING:
        return 'Free shipping';
      default:
        return 'Unknown';
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors z-40"
      >
        Manage Coupons
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Coupon Management</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                className={`border rounded-lg p-4 ${
                  coupon.isActive
                    ? 'border-green-500/30 bg-green-900/10'
                    : 'border-red-500/30 bg-red-900/10'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <h3 className="text-white font-medium mb-1">
                      <code className="bg-gray-700 px-2 py-1 rounded text-sm">
                        {coupon.code}
                      </code>
                    </h3>
                    <p className="text-gray-400 text-sm">{coupon.description}</p>
                  </div>

                  <div>
                    <p className="text-gray-300">
                      <span className="text-gray-500">Type:</span>{' '}
                      {getCouponTypeDisplay(coupon.type, coupon.value)}
                    </p>
                    {coupon.minOrderAmount && (
                      <p className="text-gray-400 text-sm">
                        Min order: {formatPrice(coupon.minOrderAmount)}
                      </p>
                    )}
                    {coupon.maxDiscount && (
                      <p className="text-gray-400 text-sm">
                        Max discount: {formatPrice(coupon.maxDiscount)}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-gray-300">
                      <span className="text-gray-500">Usage:</span>{' '}
                      {coupon.usedCount}
                      {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Expires: {formatDate(coupon.expiresAt)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        coupon.isActive
                          ? 'bg-green-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-white font-medium mb-2">💡 Sample Coupon Codes</h3>
            <p className="text-gray-400 text-sm mb-2">
              These are demo coupons you can test with:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="text-gray-300">
                <code className="bg-gray-600 px-2 py-1 rounded">SAVE10</code> - 10% off orders $50+
              </div>
              <div className="text-gray-300">
                <code className="bg-gray-600 px-2 py-1 rounded">FLAT20</code> - $20 off orders $80+
              </div>
              <div className="text-gray-300">
                <code className="bg-gray-600 px-2 py-1 rounded">FREESHIP</code> - Free shipping on $30+
              </div>
              <div className="text-gray-300">
                <code className="bg-gray-600 px-2 py-1 rounded">BIGDEAL</code> - 25% off orders $150+
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};