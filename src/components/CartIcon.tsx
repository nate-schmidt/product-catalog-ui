import React from 'react';
import { useCart } from '../contexts/CartContext';

interface CartIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}

export const CartIcon: React.FC<CartIconProps> = ({ 
  className = '', 
  size = 'md',
  showBadge = true 
}) => {
  const { cart, toggleCart } = useCart();

  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const buttonSizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4'
  };

  return (
    <button
      onClick={toggleCart}
      className={`relative inline-flex items-center justify-center ${buttonSizeClasses[size]} text-gray-700 hover:text-gray-900 transition-colors duration-200 ${className}`}
      aria-label={`Shopping cart with ${cart.itemCount} items`}
      data-testid="cart-icon"
    >
      <svg
        className={sizeClasses[size]}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.39.39-.39 1.024 0 1.414L6.414 17H19M7 13v4a2 2 0 002 2h8a2 2 0 002-2v-4m-8 2h.01M15 15h.01"
        />
      </svg>
      
      {showBadge && cart.itemCount > 0 && (
        <span
          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
          data-testid="cart-badge"
        >
          {cart.itemCount > 99 ? '99+' : cart.itemCount}
        </span>
      )}
    </button>
  );
};