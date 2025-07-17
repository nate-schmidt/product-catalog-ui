import React, { useState } from 'react';
import type { Coupon } from '../types';

interface CouponListProps {
  coupons: Coupon[];
  onCopyCode: (code: string) => void;
}

export const CouponList: React.FC<CouponListProps> = ({ coupons, onCopyCode }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    onCopyCode(code);
    
    // Reset copied state after 2 seconds
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isExpired = (coupon: Coupon) => {
    if (!coupon.valid_until) return false;
    return new Date(coupon.valid_until) < new Date();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Coupons</h2>
      
      {coupons.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No coupons available at the moment</p>
      ) : (
        <div className="space-y-4">
          {coupons.map((coupon) => {
            const expired = isExpired(coupon);
            return (
              <div
                key={coupon.id}
                className={`border rounded-lg p-4 ${
                  expired ? 'border-gray-300 bg-gray-50' : 'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-grow">
                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        className={`font-mono text-lg font-bold ${
                          expired ? 'text-gray-500' : 'text-blue-800'
                        }`}
                      >
                        {coupon.code}
                      </span>
                      {expired && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          Expired
                        </span>
                      )}
                    </div>
                    
                    <p className={`mb-2 ${expired ? 'text-gray-600' : 'text-gray-800'}`}>
                      {coupon.description}
                    </p>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        {coupon.discount_type === 'percentage' ? (
                          <span className="font-medium">{coupon.discount_value}% off</span>
                        ) : (
                          <span className="font-medium">${coupon.discount_value} off</span>
                        )}
                        {coupon.minimum_purchase > 0 && (
                          <span> on orders over ${coupon.minimum_purchase}</span>
                        )}
                      </p>
                      
                      {coupon.valid_until && (
                        <p>Valid until: {formatDate(coupon.valid_until)}</p>
                      )}
                      
                      {coupon.usage_limit && (
                        <p>
                          Uses remaining: {coupon.usage_limit - coupon.times_used} / {coupon.usage_limit}
                        </p>
                      )}
                      
                      {coupon.applicable_products.length > 0 && (
                        <p className="text-xs">
                          Applies to: {coupon.applicable_products.map(p => p.name).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleCopyCode(coupon.code)}
                    disabled={expired}
                    className={`ml-4 px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                      expired
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : copiedCode === coupon.code
                        ? 'bg-green-600 text-white'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {copiedCode === coupon.code ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};