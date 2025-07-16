import { useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutProps {
  cartItems: CartItem[];
}

export function Checkout({ cartItems }: CheckoutProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = subtotal - discount;

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setIsValidating(true);
    setCouponError('');

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode,
          orderValue: subtotal
        })
      });

      const data = await response.json();

      if (data.valid) {
        setAppliedCoupon(data);
        setCouponError('');
      } else {
        setCouponError(data.error || 'Invalid coupon code');
        setAppliedCoupon(null);
      }
    } catch (error) {
      setCouponError('Failed to validate coupon');
    } finally {
      setIsValidating(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const completeOrder = async () => {
    if (appliedCoupon) {
      // Mark coupon as used
      await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: appliedCoupon.coupon.code })
      });
    }

    setOrderComplete(true);
  };

  if (orderComplete) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-green-400 mb-4">Order Complete! 🎉</h2>
        <p className="text-gray-300">Thank you for your purchase!</p>
        <p className="text-gray-400 mt-2">Your total: ${total.toFixed(2)}</p>
        {appliedCoupon && (
          <p className="text-green-400 mt-2">You saved ${discount.toFixed(2)} with coupon {appliedCoupon.coupon.code}!</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Checkout</h2>
      
      {/* Order Summary */}
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-300">Order Summary</h3>
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between text-gray-400">
            <span>{item.name} x{item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-700 pt-4 space-y-2">
        <div className="flex justify-between text-gray-400">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        {appliedCoupon && (
          <div className="flex justify-between text-green-400">
            <span>
              Discount ({appliedCoupon.coupon.description})
            </span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-gray-700">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Coupon Section */}
      <div className="mt-6 p-4 bg-gray-900 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-300 mb-3">Have a coupon code?</h3>
        
        {!appliedCoupon ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="flex-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                disabled={isValidating}
              />
              <button
                onClick={validateCoupon}
                disabled={isValidating}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                {isValidating ? 'Validating...' : 'Apply'}
              </button>
            </div>
            
            {couponError && (
              <p className="text-red-400 text-sm">{couponError}</p>
            )}
            
            <div className="text-sm text-gray-500">
              Try: <code className="bg-gray-800 px-2 py-1 rounded">WELCOME20</code> or <code className="bg-gray-800 px-2 py-1 rounded">SAVE10</code>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-green-900/20 p-3 rounded border border-green-700">
            <div>
              <p className="text-green-400 font-semibold">{appliedCoupon.coupon.code}</p>
              <p className="text-sm text-gray-400">{appliedCoupon.coupon.description}</p>
            </div>
            <button
              onClick={removeCoupon}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Complete Order Button */}
      <button
        onClick={completeOrder}
        className="w-full mt-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
      >
        Complete Order (${total.toFixed(2)})
      </button>
    </div>
  );
}