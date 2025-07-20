import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';

export const CartIcon: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getVariantString = (variants?: { [key: string]: string }) => {
    if (!variants || Object.keys(variants).length === 0) return '';
    return Object.entries(variants)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  const calculateItemPrice = (item: typeof cart.items[0]) => {
    let price = item.product.price;
    if (item.selectedVariants && item.product.variants) {
      Object.entries(item.selectedVariants).forEach(([type, value]) => {
        const variant = item.product.variants?.[type]?.find(v => v.value === value);
        if (variant?.priceModifier) {
          price += variant.priceModifier;
        }
      });
    }
    return price * item.quantity;
  };

  return (
    <div className="relative">
      {/* Cart Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {cart.itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {cart.itemCount}
          </span>
        )}
      </button>

      {/* Cart Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Cart Content */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 max-h-[80vh] flex flex-col">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Shopping Cart</h3>
            </div>

            {cart.items.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto">
                  {cart.items.map((item, index) => {
                    const variantKey = JSON.stringify(item.selectedVariants || {});
                    return (
                      <div key={`${item.product.id}-${variantKey}`} className="p-4 border-b">
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0">
                            {item.product.images[0] ? (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                            {item.selectedVariants && (
                              <p className="text-sm text-gray-500">{getVariantString(item.selectedVariants)}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center border border-gray-300 rounded">
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariants)}
                                  className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                >
                                  -
                                </button>
                                <span className="px-3 py-1 text-sm">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariants)}
                                  className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                  disabled={item.quantity >= Math.min(item.product.stock, 10)}
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.product.id, item.selectedVariants)}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="font-medium">{formatPrice(calculateItemPrice(item))}</p>
                            <p className="text-sm text-gray-500">
                              {formatPrice(calculateItemPrice(item) / item.quantity)} each
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Cart Footer */}
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">{formatPrice(cart.total)}</span>
                  </div>
                  <div className="space-y-2">
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                      Proceed to Checkout
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to clear your cart?')) {
                          clearCart();
                        }
                      }}
                      className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};