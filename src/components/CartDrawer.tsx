import React, { useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/validation';
import { QuantitySelector } from './QuantitySelector';

interface CartDrawerProps {
  onCheckout?: () => void;
  className?: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onCheckout,
  className = ''
}) => {
  const { cart, isOpen, toggleCart, updateQuantity, removeFromCart } = useCart();

  // Handle escape key to close drawer
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        toggleCart();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, toggleCart]);

  const handleCheckout = () => {
    onCheckout?.();
    toggleCart();
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    updateQuantity(productId, quantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={toggleCart}
        data-testid="cart-overlay"
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ${className}`}
        data-testid="cart-drawer"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Shopping Cart ({cart.itemCount})
            </h2>
            <button
              onClick={toggleCart}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
              aria-label="Close cart"
              data-testid="close-cart-button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.39.39-.39 1.024 0 1.414L6.414 17H19M7 13v4a2 2 0 002 2h8a2 2 0 002-2v-4m-8 2h.01M15 15h.01" />
                </svg>
                <p className="text-lg font-medium">Your cart is empty</p>
                <p className="text-sm mt-1">Add some products to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 border border-gray-200 rounded-lg"
                    data-testid={`cart-item-${item.product.id}`}
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate" title={item.product.name}>
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">{item.product.category}</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {formatPrice(item.product.price)}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <QuantitySelector
                          quantity={item.quantity}
                          onQuantityChange={(quantity) => handleQuantityChange(item.product.id, quantity)}
                          size="sm"
                        />
                        
                        <button
                          onClick={() => handleRemoveItem(item.product.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-200"
                          aria-label={`Remove ${item.product.name} from cart`}
                          data-testid={`remove-item-${item.product.id}`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.items.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span data-testid="cart-total">{formatPrice(cart.total)}</span>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
                data-testid="checkout-button"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};