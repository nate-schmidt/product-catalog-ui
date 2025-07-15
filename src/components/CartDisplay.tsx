import React, { useState } from 'react';
import { useCart } from '../CartContext';

export const CartDisplay: React.FC = () => {
  const { 
    items, 
    appliedCoupon, 
    removeFromCart, 
    updateQuantity, 
    applyCoupon, 
    removeCoupon,
    getCartTotal,
    getDiscountAmount,
    getFinalTotal,
    clearCart
  } = useCart();
  
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError('');
    
    const success = await applyCoupon(couponCode);
    
    if (success) {
      setCouponCode('');
    } else {
      setCouponError('Invalid or expired coupon code');
    }
    
    setIsApplyingCoupon(false);
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      
      <div className="space-y-4">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="flex items-center justify-between border-b pb-4">
            <div className="flex-1">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-gray-500 text-sm">{formatPrice(product.price)} each</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                >
                  +
                </button>
              </div>
              
              <div className="w-20 text-right font-semibold">
                {formatPrice(product.price * quantity)}
              </div>
              
              <button
                onClick={() => removeFromCart(product.id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!!appliedCoupon}
          />
          {!appliedCoupon ? (
            <button
              onClick={handleApplyCoupon}
              disabled={isApplyingCoupon}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
            >
              {isApplyingCoupon ? 'Applying...' : 'Apply'}
            </button>
          ) : (
            <button
              onClick={removeCoupon}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Remove
            </button>
          )}
        </div>
        
        {couponError && (
          <p className="text-red-500 text-sm">{couponError}</p>
        )}
        
        {appliedCoupon && (
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-green-700 font-semibold">
              Coupon "{appliedCoupon.code}" applied!
            </p>
            <p className="text-green-600 text-sm">
              {appliedCoupon.discountType === 'percentage' 
                ? `${appliedCoupon.discountValue}% off`
                : `${formatPrice(appliedCoupon.discountValue)} off`}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span className="font-semibold">{formatPrice(getCartTotal())}</span>
        </div>
        
        {appliedCoupon && (
          <div className="flex justify-between text-green-600">
            <span>Discount:</span>
            <span>-{formatPrice(getDiscountAmount())}</span>
          </div>
        )}
        
        <div className="flex justify-between text-xl font-bold pt-2 border-t">
          <span>Total:</span>
          <span>{formatPrice(getFinalTotal())}</span>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <button className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold">
          Checkout
        </button>
        <button 
          onClick={clearCart}
          className="w-full py-2 text-gray-500 hover:text-gray-700"
        >
          Clear Cart
        </button>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p className="font-semibold">Available coupon codes:</p>
        <ul className="list-disc list-inside">
          <li>SAVE10 - 10% off</li>
          <li>FLAT20 - $20 off (min $100)</li>
          <li>WELCOME15 - 15% off</li>
        </ul>
      </div>
    </div>
  );
};