import React from 'react';
import { CartItem as CartItemType } from '../types/cart';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string | number, quantity: number) => void;
  onRemove: (productId: string | number) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg">
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 object-cover rounded"
        />
      )}
      <div className="flex-1">
        <h3 className="text-white font-semibold">{item.name}</h3>
        <p className="text-gray-400">${item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="text-white w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <div className="text-white font-semibold">
        ${(item.price * item.quantity).toFixed(2)}
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="text-red-500 hover:text-red-400"
        aria-label="Remove item"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}