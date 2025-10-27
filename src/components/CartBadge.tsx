import React from 'react';
import { useCart } from '../cart/CartContext';

interface CartBadgeProps {
  onClick?: () => void;
  className?: string;
}

function CartBadge({ onClick, className = '' }: CartBadgeProps) {
  const { cart } = useCart();
  const { totalItems, totalPrice } = cart;

  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-200 ${className}`}
    >
      {/* Cart Icon */}
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
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6.5-5v5a2 2 0 11-4 0v-5m4 0V8a2 2 0 00-2-2H9a2 2 0 00-2 2v5"
        />
      </svg>

      {/* Item count and price */}
      <div className="flex flex-col items-start">
        <span className="text-sm font-semibold">
          {totalItems === 0 ? 'Cart' : `${totalItems} item${totalItems > 1 ? 's' : ''}`}
        </span>
        {totalPrice > 0 && (
          <span className="text-xs text-gray-600">
            ${totalPrice.toLocaleString()}
          </span>
        )}
      </div>

      {/* Badge for item count */}
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
}

export default CartBadge;