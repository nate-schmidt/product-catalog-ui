import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { couponService } from '../services/couponService';
import { LoadingSpinner } from './LoadingSpinner';

export function CouponInput() {
  const { cart, applyCoupon, removeCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setMessage('Please enter a coupon code');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const result = await couponService.validateCoupon(couponCode.trim(), cart.subtotal);
      
      if (result.isValid && result.coupon) {
        applyCoupon(result.coupon);
        setMessage(result.message);
        setMessageType('success');
        setCouponCode('');
      } else {
        setMessage(result.message);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Failed to apply coupon. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setMessage('');
    setCouponCode('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyCoupon();
    }
  };

  if (cart.appliedCoupon) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-md p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-800">
              Coupon Applied: {cart.appliedCoupon}
            </p>
            <p className="text-xs text-green-600">
              You saved {cart.couponDiscount ? `$${cart.couponDiscount.toFixed(2)}` : ''}!
            </p>
          </div>
          <button
            onClick={handleRemoveCoupon}
            className="text-xs text-green-600 hover:text-green-800 underline"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          placeholder="Enter coupon code"
          disabled={isLoading}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100"
        />
        
        <button
          onClick={handleApplyCoupon}
          disabled={isLoading || !couponCode.trim()}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors flex items-center"
        >
          {isLoading ? (
            <LoadingSpinner size="sm" />
          ) : (
            'Apply'
          )}
        </button>
      </div>

      {message && (
        <p className={`text-xs ${
          messageType === 'success' ? 'text-green-600' : 'text-red-600'
        }`}>
          {message}
        </p>
      )}

      {/* Helpful coupon codes for testing */}
      <div className="text-xs text-gray-500">
        <p>Try these codes: SAVE10, WELCOME20, FREESHIP</p>
      </div>
    </div>
  );
}