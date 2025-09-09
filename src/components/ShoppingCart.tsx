import React, { useState } from 'react';
import { useCart } from '../CartContext';

interface CartItemProps {
  item: any;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

function CartItemComponent({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-200">
      <img
        src={item.product.image}
        alt={item.product.name}
        className="w-16 h-16 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{item.product.name}</h3>
        <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
          className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded"
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
          className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded"
        >
          +
        </button>
      </div>
      <div className="text-right">
        <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
        <button
          onClick={() => onRemove(item.product.id)}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

interface CouponSectionProps {
  onApplyCoupon: (code: string) => Promise<void>;
  onRemoveCoupon: () => void;
  appliedCoupon?: any;
}

function CouponSection({ onApplyCoupon, onRemoveCoupon, appliedCoupon }: CouponSectionProps) {
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      await onApplyCoupon(couponCode.trim());
      setCouponCode('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    onRemoveCoupon();
    setError('');
  };

  return (
    <div className="border-t border-gray-200 pt-4">
      {appliedCoupon ? (
        <div className="flex items-center justify-between bg-green-50 p-3 rounded-md">
          <div>
            <p className="font-medium text-green-800">Coupon Applied: {appliedCoupon.code}</p>
            <p className="text-sm text-green-600">{appliedCoupon.description}</p>
          </div>
          <button
            onClick={handleRemoveCoupon}
            className="text-red-600 hover:text-red-800 text-sm"
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
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleApplyCoupon}
              disabled={isLoading || !couponCode.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              {isLoading ? 'Applying...' : 'Apply'}
            </button>
          </div>
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}

interface ShoppingCartProps {
  onCheckout: () => void;
}

export function ShoppingCart({ onCheckout }: ShoppingCartProps) {
  const { cart, updateQuantity, removeItem, applyCoupon, removeCoupon } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-8">Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          {cart.items.map(item => (
            <CartItemComponent
              key={item.product.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>

        <CouponSection
          onApplyCoupon={applyCoupon}
          onRemoveCoupon={removeCoupon}
          appliedCoupon={cart.appliedCoupon}
        />

        <div className="border-t border-gray-200 pt-4 mt-6 space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal:</span>
            <span>${cart.subtotal.toFixed(2)}</span>
          </div>
          {cart.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount:</span>
              <span>-${cart.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-2">
            <span>Total:</span>
            <span>${cart.total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={onCheckout}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium mt-6 transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}