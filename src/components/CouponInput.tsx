import React, { useState } from 'react';
import { useCoupon } from '../context/CouponContext';
import { useCart } from '../context/CartContext';

interface CouponInputProps {
  onCouponApplied?: (discount: number) => void;
}

export const CouponInput: React.FC<CouponInputProps> = ({ onCouponApplied }) => {
  const [couponCode, setCouponCode] = useState('');
  const { state, validateCoupon, applyCoupon, removeCoupon } = useCoupon();
  const { state: cartState, applyDiscount } = useCart();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    const result = await validateCoupon(couponCode.trim(), cartState.total);
    
    if (result.isValid && result.discount) {
      // Apply the discount to the cart
      applyDiscount(result.discount.amount);
      
      // Find and store the coupon
      const allCoupons = useCoupon().getAllCoupons();
      const coupon = allCoupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase());
      if (coupon) {
        applyCoupon(coupon);
      }
      
      // Clear the input
      setCouponCode('');
      
      // Callback for parent component
      if (onCouponApplied) {
        onCouponApplied(result.discount.amount);
      }
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    applyDiscount(0);
    setCouponCode('');
  };

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  return (
    <div className="space-y-4">
      {state.appliedCoupon ? (
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-medium">✓ Coupon Applied</span>
                <code className="bg-green-900/30 text-green-300 px-2 py-1 rounded text-sm">
                  {state.appliedCoupon.code}
                </code>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                {state.appliedCoupon.description}
              </p>
              <p className="text-green-400 font-medium">
                Discount: -{formatPrice(cartState.discountAmount)}
              </p>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-red-400 hover:text-red-300 text-sm underline"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleApplyCoupon();
                }
              }}
            />
            <button
              onClick={handleApplyCoupon}
              disabled={!couponCode.trim() || state.isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              {state.isLoading ? 'Checking...' : 'Apply'}
            </button>
          </div>
          
          {state.error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">{state.error}</p>
            </div>
          )}
        </div>
      )}
      
      {/* Sample coupons hint */}
      {!state.appliedCoupon && (
        <div className="bg-gray-800/50 rounded-lg p-3">
          <p className="text-gray-400 text-sm mb-2">💡 Try these sample coupons:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <code className="bg-gray-700 text-gray-300 px-2 py-1 rounded">SAVE10</code>
              <span className="text-gray-500 ml-1">- 10% off (min $50)</span>
            </div>
            <div>
              <code className="bg-gray-700 text-gray-300 px-2 py-1 rounded">FLAT20</code>
              <span className="text-gray-500 ml-1">- $20 off (min $80)</span>
            </div>
            <div>
              <code className="bg-gray-700 text-gray-300 px-2 py-1 rounded">FREESHIP</code>
              <span className="text-gray-500 ml-1">- Free shipping (min $30)</span>
            </div>
            <div>
              <code className="bg-gray-700 text-gray-300 px-2 py-1 rounded">BIGDEAL</code>
              <span className="text-gray-500 ml-1">- 25% off (min $150)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};