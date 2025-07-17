import React, { useState } from 'react';
import type { CartSummary, CouponValidationResponse } from '../types';
import { couponAPI } from '../api/client';

interface CartProps {
  cartSummary: CartSummary | null;
  onUpdateQuantity: (cartItemId: number, quantity: number) => void;
  onRemoveItem: (cartItemId: number) => void;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
  onCheckout: () => void;
  isLoading?: boolean;
}

export const Cart: React.FC<CartProps> = ({
  cartSummary,
  onUpdateQuantity,
  onRemoveItem,
  onApplyCoupon,
  onRemoveCoupon,
  onCheckout,
  isLoading = false,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [couponValidation, setCouponValidation] = useState<CouponValidationResponse | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || !cartSummary) return;

    setIsValidating(true);
    try {
      const validation = await couponAPI.validate(
        couponCode.toUpperCase(),
        cartSummary.items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
        }))
      );
      
      setCouponValidation(validation);
      if (validation.valid) {
        onApplyCoupon(couponCode.toUpperCase());
        setCouponCode('');
      }
    } catch (error) {
      setCouponValidation({
        valid: false,
        message: 'Failed to validate coupon',
        discount_amount: 0,
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    onRemoveCoupon();
    setCouponValidation(null);
  };

  if (!cartSummary || cartSummary.items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Shopping Cart</h2>
        <p className="text-gray-600 text-center py-8">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Shopping Cart</h2>
      
      <div className="space-y-4 mb-6">
        {cartSummary.items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4 py-4 border-b">
            <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
              {item.product.image_url ? (
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>
            
            <div className="flex-grow">
              <h3 className="font-medium text-gray-900">{item.product.name}</h3>
              <p className="text-gray-600">${item.product.price.toFixed(2)} each</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                disabled={isLoading}
              >
                -
              </button>
              <span className="w-12 text-center">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                disabled={isLoading || item.quantity >= item.product.stock}
              >
                +
              </button>
            </div>
            
            <div className="text-right">
              <p className="font-medium text-gray-900">
                ${(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>
            
            <button
              onClick={() => onRemoveItem(item.id)}
              className="text-red-600 hover:text-red-800"
              disabled={isLoading}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Coupon Code Section */}
      <div className="border-t pt-4 mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Have a coupon code?</h3>
        
        {cartSummary.applied_coupon ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center justify-between">
            <div>
              <p className="text-green-800 font-medium">
                Coupon applied: {cartSummary.applied_coupon.code}
              </p>
              <p className="text-green-600 text-sm">
                {cartSummary.applied_coupon.description}
              </p>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-green-800 hover:text-green-900 font-medium"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
              placeholder="Enter coupon code"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isValidating}
            />
            <button
              onClick={handleApplyCoupon}
              disabled={!couponCode.trim() || isValidating}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isValidating ? 'Validating...' : 'Apply'}
            </button>
          </div>
        )}
        
        {couponValidation && !couponValidation.valid && (
          <p className="text-red-600 text-sm mt-2">{couponValidation.message}</p>
        )}
      </div>

      {/* Order Summary */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>${cartSummary.subtotal.toFixed(2)}</span>
        </div>
        
        {cartSummary.discount_amount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${cartSummary.discount_amount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
          <span>Total</span>
          <span>${cartSummary.total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={isLoading || cartSummary.items.length === 0}
        className="w-full mt-6 px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};