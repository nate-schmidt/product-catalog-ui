import React from 'react';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/formatters';

interface HeaderProps {
  onCartClick: () => void;
  onLogoClick: () => void;
}

export function Header({ onCartClick, onLogoClick }: HeaderProps) {
  const { cart, getCartItemCount } = useCart();
  const itemCount = getCartItemCount();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={onLogoClick}
            className="flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
          >
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>FurnitureStore</span>
          </button>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={onLogoClick}
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Products
            </button>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              About
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Contact
            </a>
          </nav>

          {/* Cart Button */}
          <button
            onClick={onCartClick}
            className="relative flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            
            <div className="flex flex-col items-start">
              <span className="text-xs text-gray-500">
                {itemCount} item{itemCount !== 1 ? 's' : ''}
              </span>
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(cart.total)}
              </span>
            </div>

            {/* Cart Item Count Badge */}
            {itemCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                {itemCount > 99 ? '99+' : itemCount}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}