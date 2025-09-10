import React from 'react';
import { useCart } from '../context/CartContext';
import { CouponInput } from './CouponInput';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShoppingCart: React.FC<ShoppingCartProps> = ({ isOpen, onClose }) => {
  const { state, removeItem, updateQuantity, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    alert(`Checkout completed! Total: ${formatPrice(state.finalTotal)}`);
    clearCart();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-gray-800 w-full max-w-md h-full overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          {state.items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">Your cart is empty</p>
              <button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {state.items.map((item) => (
                  <div key={item.product.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/64x64/374151/9CA3AF?text=${encodeURIComponent(item.product.name.charAt(0))}`;
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{item.product.name}</h3>
                        <p className="text-gray-400 text-sm">{formatPrice(item.product.price)}</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-600 hover:bg-gray-500 text-white rounded flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="text-white w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-600 hover:bg-gray-500 text-white rounded flex items-center justify-center"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="ml-auto text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-3">Coupon Code</h3>
                <CouponInput />
              </div>

              {/* Order Summary */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium text-white mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal ({state.items.reduce((count, item) => count + item.quantity, 0)} items)</span>
                    <span>{formatPrice(state.total)}</span>
                  </div>
                  
                  {state.discountAmount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount</span>
                      <span>-{formatPrice(state.discountAmount)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-600 pt-2">
                    <div className="flex justify-between text-white font-bold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(state.finalTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg transition-colors"
                >
                  Clear Cart
                </button>
                <button
                  onClick={onClose}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 rounded-lg transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};