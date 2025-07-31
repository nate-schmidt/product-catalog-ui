import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';

export function Cart() {
  const {
    state,
    removeItem,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    setCouponCode,
    clearCart,
    getSubtotal,
    getDiscount,
    getTotal,
    getItemCount,
  } = useCart();

  const [couponMessage, setCouponMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleApplyCoupon = () => {
    if (!state.couponCode.trim()) {
      setCouponMessage('Please enter a coupon code');
      setMessageType('error');
      return;
    }

    const result = applyCoupon(state.couponCode);
    setCouponMessage(result.message);
    setMessageType(result.success ? 'success' : 'error');
    
    if (result.success) {
      setCouponCode('');
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponMessage('');
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  if (state.items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Shopping Cart</h2>
        <p className="text-gray-600 text-center py-8">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {getItemCount()} items
        </span>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {state.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{item.name}</h3>
              <p className="text-gray-600">{formatPrice(item.price)} each</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                >
                  -
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                >
                  +
                </button>
              </div>
              
              <div className="text-right min-w-[80px]">
                <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
              </div>
              
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Section */}
      <div className="border-t border-gray-200 pt-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Coupon Code</h3>
        
        {state.appliedCoupon ? (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div>
              <span className="font-medium text-green-800">
                {state.appliedCoupon.code} applied
              </span>
              <span className="text-green-600 text-sm ml-2">
                ({state.appliedCoupon.type === 'percentage' 
                  ? `${state.appliedCoupon.discount}% off`
                  : `$${state.appliedCoupon.discount} off`})
              </span>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <input
              type="text"
              value={state.couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
              placeholder="Enter coupon code"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleApplyCoupon}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Apply
            </button>
          </div>
        )}
        
        {couponMessage && (
          <p className={`mt-2 text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {couponMessage}
          </p>
        )}
        
        <div className="mt-3 text-sm text-gray-600">
          <p><strong>Try these coupons:</strong></p>
          <p>• SAVE10 (10% off)</p>
          <p>• SAVE20 (20% off, min $50)</p>
          <p>• WELCOME15 (15% off)</p>
          <p>• FIXED5 ($5 off)</p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal:</span>
          <span>{formatPrice(getSubtotal())}</span>
        </div>
        
        {getDiscount() > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount:</span>
            <span>-{formatPrice(getDiscount())}</span>
          </div>
        )}
        
        <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t">
          <span>Total:</span>
          <span>{formatPrice(getTotal())}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-6">
        <button
          onClick={clearCart}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Clear Cart
        </button>
        <button className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
          Checkout
        </button>
      </div>
    </div>
  );
}
