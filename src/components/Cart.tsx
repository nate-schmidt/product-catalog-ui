import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { formatCurrency, isInStock } from '../utils/formatters';

interface CartProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Cart({ className = '', isOpen = true, onClose }: CartProps) {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getItemCount, 
    getCartTotal 
  } = useCart();

  const [error, setError] = useState<string | null>(null);

  const handleQuantityChange = (productId: number, quantity: number) => {
    try {
      setError(null);
      updateQuantity(productId, quantity);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quantity');
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleRemoveItem = (productId: number) => {
    try {
      setError(null);
      removeFromCart(productId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  const totalItems = getItemCount();
  const totalPrice = getCartTotal();

  const cartContent = (
    <div className="bg-gray-900 rounded-lg">
      {/* Cart Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">
          Shopping Cart {totalItems > 0 && `(${totalItems})`}
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
            aria-label="Close cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="m-4 p-3 bg-red-900 border border-red-600 rounded-lg">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Cart Content */}
      <div className="p-4">
        {cart.items.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            <p className="text-gray-400 text-lg mb-2">Your cart is empty</p>
            <p className="text-gray-500 text-sm">Add some products to get started!</p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {cart.items.map(item => (
                <div key={item.product.id} className="flex items-start gap-4 p-4 bg-gray-800 rounded-lg">
                  {/* Product Image */}
                  <div className="w-16 h-16 bg-gray-700 rounded-lg flex-shrink-0 flex items-center justify-center">
                    {item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-gray-500 text-xs">No Image</span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium mb-1">{item.product.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">
                      {formatCurrency(item.product.price, item.product.currency)}
                    </p>
                    
                    {/* Stock Warning */}
                    {!isInStock(item.product.stockQuantity) && (
                      <p className="text-red-400 text-xs mb-2">Out of stock</p>
                    )}
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const quantity = Math.max(1, parseInt(e.target.value) || 1);
                          handleQuantityChange(item.product.id, quantity);
                        }}
                        className="w-16 text-center p-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        min="1"
                        max={item.product.stockQuantity}
                      />
                      
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
                        disabled={item.quantity >= item.product.stockQuantity}
                      >
                        +
                      </button>

                      <button
                        onClick={() => handleRemoveItem(item.product.id)}
                        className="ml-2 p-1 text-red-400 hover:text-red-300 transition-colors"
                        title="Remove item"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="text-white font-semibold">
                      {formatCurrency(item.product.price * item.quantity, item.product.currency)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-white">Total:</span>
                <span className="text-2xl font-bold text-white">
                  {formatCurrency(totalPrice)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleClearCart}
                  className="flex-1 p-3 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-lg transition-colors"
                >
                  Clear Cart
                </button>
                
                <button
                  className="flex-1 p-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
                  disabled={cart.items.some(item => !isInStock(item.product.stockQuantity))}
                >
                  Checkout
                </button>
              </div>

              {/* Out of Stock Warning */}
              {cart.items.some(item => !isInStock(item.product.stockQuantity)) && (
                <p className="text-red-400 text-sm mt-2 text-center">
                  Some items are out of stock and must be removed before checkout.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );

  // If it's not a modal, return the content directly
  if (isOpen && !onClose) {
    return <div className={className}>{cartContent}</div>;
  }

  // If it's a modal and not open, return null
  if (!isOpen) {
    return null;
  }

  // Modal overlay
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-hidden ${className}`}>
        {cartContent}
      </div>
    </div>
  );
}

export default Cart;