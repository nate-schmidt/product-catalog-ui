import { useState } from 'react';
import { CartItem, Coupon } from '../types';
import { validateCoupon, calculateDiscount } from '../data/coupons';

interface CheckoutProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

export function Checkout({ cart, onUpdateQuantity, onRemoveItem }: CheckoutProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountAmount = appliedCoupon
    ? calculateDiscount(appliedCoupon, subtotal)
    : 0;

  const total = subtotal - discountAmount;

  const handleApplyCoupon = () => {
    setCouponError('');
    
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    const coupon = validateCoupon(couponCode, subtotal);
    
    if (!coupon) {
      // Check if coupon exists but doesn't meet minimum
      const allCoupons = [
        { code: 'WELCOME10', minAmount: 0 },
        { code: 'SAVE20', minAmount: 100 },
        { code: 'FLASH50', minAmount: 0 },
        { code: 'VIP30', minAmount: 200 },
      ];
      
      const existingCoupon = allCoupons.find(
        c => c.code.toLowerCase() === couponCode.toLowerCase()
      );
      
      if (existingCoupon && existingCoupon.minAmount > subtotal) {
        setCouponError(`Coupon requires minimum purchase of $${existingCoupon.minAmount.toFixed(2)}`);
      } else {
        setCouponError('Invalid coupon code');
      }
      return;
    }

    setAppliedCoupon(coupon);
    setCouponError('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    alert(`Order placed successfully! Total: $${total.toFixed(2)}`);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/20">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-300">Add some products to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Checkout</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all"
            >
              <div className="flex gap-4">
                <div className="text-5xl">{item.product.image}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {item.product.name}
                  </h3>
                  <p className="text-gray-300 text-sm mb-3">
                    {item.product.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="text-white hover:text-blue-400 font-bold text-lg transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="text-white font-mono w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="text-white hover:text-blue-400 font-bold text-lg transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-red-400 hover:text-red-300 text-sm transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white font-mono">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400 font-mono">
                    ${item.product.price.toFixed(2)} each
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 sticky top-8">
            <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
            
            {/* Coupon Code Input */}
            <div className="mb-6">
              <label className="text-sm text-gray-300 mb-2 block">
                Coupon Code
              </label>
              {appliedCoupon ? (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <div className="text-green-300 font-semibold font-mono">
                      {appliedCoupon.code}
                    </div>
                    <div className="text-xs text-green-400">
                      {appliedCoupon.type === 'percentage'
                        ? `${appliedCoupon.discount}% off`
                        : `$${appliedCoupon.discount} off`}
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-green-300 hover:text-green-200 text-sm transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError('');
                      }}
                      placeholder="Enter code"
                      className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 transition-colors font-mono"
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-red-400 text-sm">{couponError}</p>
                  )}
                  <div className="text-xs text-gray-400 space-y-1 mt-3">
                    <p className="font-semibold">Try these codes:</p>
                    <p className="font-mono">WELCOME10 - 10% off</p>
                    <p className="font-mono">SAVE20 - 20% off $100+</p>
                    <p className="font-mono">FLASH50 - $50 off</p>
                    <p className="font-mono">VIP30 - 30% off $200+</p>
                  </div>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6 pb-6 border-b border-white/20">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-400">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between text-xl font-bold text-white mb-6">
              <span>Total</span>
              <span className="font-mono">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isProcessing ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
