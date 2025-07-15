import React, { useState } from 'react';
import { useCart } from '../CartContext';

export const CartDisplay: React.FC = () => {
  const {
    items,
    coupon,
    appliedCouponCode,
    couponError,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    getCartTotal,
    getDiscountAmount,
    getFinalTotal,
    getItemCount,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    
    setIsApplyingCoupon(true);
    await applyCoupon(couponInput.trim());
    setIsApplyingCoupon(false);
    
    if (!couponError) {
      setCouponInput('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600">Add some items to your cart to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Shopping Cart ({getItemCount()} items)</h2>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Clear Cart
        </button>
      </div>

      <div className="space-y-4 mb-6">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="flex items-center justify-between border-b pb-4">
            <div className="flex-1">
              <h3 className="font-medium text-lg">{product.name}</h3>
              <p className="text-gray-600">${product.price.toFixed(2)}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                >
                  +
                </button>
              </div>
              
              <div className="text-right">
                <p className="font-medium">${(product.price * quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Code Section */}
      <div className="border-t pt-4 mb-4">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
            placeholder="Enter coupon code"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!!coupon || isApplyingCoupon}
          />
          {!coupon ? (
            <button
              onClick={handleApplyCoupon}
              disabled={!couponInput.trim() || isApplyingCoupon}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isApplyingCoupon ? 'Applying...' : 'Apply'}
            </button>
          ) : (
            <button
              onClick={removeCoupon}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Remove
            </button>
          )}
        </div>
        
        {couponError && (
          <p className="text-red-600 text-sm">{couponError}</p>
        )}
        
        {coupon && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-2">
            <p className="text-green-800 text-sm">
              Coupon <span className="font-semibold">{appliedCouponCode}</span> applied!
              {coupon.discountType === 'percentage' 
                ? ` ${coupon.discountValue}% off`
                : ` $${coupon.discountValue} off`}
            </p>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>${getCartTotal().toFixed(2)}</span>
        </div>
        
        {coupon && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${getDiscountAmount().toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-xl font-semibold pt-2 border-t">
          <span>Total</span>
          <span>${getFinalTotal().toFixed(2)}</span>
        </div>
      </div>

      <button className="w-full mt-6 px-6 py-3 bg-green-600 text-white text-lg font-medium rounded-md hover:bg-green-700">
        Proceed to Checkout
      </button>
    </div>
  );
};