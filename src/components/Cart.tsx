import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartItemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const toggleCart = () => setIsOpen(!isOpen);

  if (!isOpen) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleCart}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-lg flex items-center gap-2"
        >
          <span>Cart ({getCartItemCount()})</span>
          <span className="text-lg">🛒</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-xl border w-96 max-h-96 overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Shopping Cart ({getCartItemCount()})
          </h3>
          <button
            onClick={toggleCart}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
      </div>
      
      <div className="max-h-64 overflow-y-auto">
        {cart.items.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Yer cart be empty, matey!
          </div>
        ) : (
          <div className="p-4">
            {cart.items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3 mb-4 last:mb-0">
                <img 
                  src={item.product.image} 
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-sm text-green-600">
                    ${item.product.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
                  >
                    -
                  </button>
                  <span className="text-sm font-medium w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="ml-2 text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {cart.items.length > 0 && (
        <div className="border-t bg-gray-50 p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-gray-900">Total:</span>
            <span className="text-xl font-bold text-green-600">
              ${cart.total.toFixed(2)}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={clearCart}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm"
            >
              Clear Cart
            </button>
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};