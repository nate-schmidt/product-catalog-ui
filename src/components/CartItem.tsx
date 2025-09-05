import React from 'react';
import { CartItem as CartItemType } from '../types/cart';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/formatters';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(item.product.id);
    } else {
      updateQuantity(item.product.id, newQuantity);
    }
  };

  const total = item.product.price * item.quantity;

  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      <div className="flex-shrink-0 w-16 h-16">
        <img
          src={item.product.imageUrl}
          alt={item.product.name}
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      <div className="flex-1 ml-4">
        <h3 className="text-sm font-medium text-gray-900">
          {item.product.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {formatCurrency(item.product.price)} each
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <span className="text-lg font-medium">-</span>
        </button>
        
        <span className="w-8 text-center text-sm font-medium">
          {item.quantity}
        </span>
        
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <span className="text-lg font-medium">+</span>
        </button>
      </div>

      <div className="ml-4 text-right">
        <p className="text-sm font-medium text-gray-900">
          {formatCurrency(total)}
        </p>
        <button
          onClick={() => removeFromCart(item.product.id)}
          className="text-xs text-red-600 hover:text-red-800 mt-1"
        >
          Remove
        </button>
      </div>
    </div>
  );
}