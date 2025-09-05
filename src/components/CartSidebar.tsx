import React from 'react';
import { useCart } from '../contexts/CartContext';
import { CartItem } from './CartItem';
import { CouponInput } from './CouponInput';
import { formatCurrency } from '../utils/formatters';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function CartSidebar({ isOpen, onClose, onCheckout }: CartSidebarProps) {
  const { cart, clearCart } = useCart();

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (cart.items.length > 0) {
      onCheckout();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Shopping Cart ({cart.items.length})
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {cart.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <svg 
                  className="w-16 h-16 text-gray-300 mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1} 
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                  />
                </svg>
                <p className="text-gray-500 text-lg mb-2">Your cart is empty</p>
                <p className="text-gray-400 text-sm">Add some products to get started</p>
              </div>
            ) : (
              <div className="p-4">
                {cart.items.map(item => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary and Actions */}
          {cart.items.length > 0 && (
            <div className="border-t border-gray-200 p-4">
              {/* Coupon Input */}
              <div className="mb-4">
                <CouponInput />
              </div>

              {/* Order Summary */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(cart.subtotal)}</span>
                </div>
                
                {cart.couponDiscount && cart.couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({cart.appliedCoupon}):</span>
                    <span>-{formatCurrency(cart.couponDiscount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span>Shipping:</span>
                  <span>
                    {cart.shipping === 0 ? 'Free' : formatCurrency(cart.shipping)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>{formatCurrency(cart.tax)}</span>
                </div>
                
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(cart.total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  Proceed to Checkout
                </button>
                
                <button
                  onClick={clearCart}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-200 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}