import React from 'react';
import { useCart } from '../CartContext';

interface HeaderProps {
  currentView: 'products' | 'cart' | 'checkout' | 'success';
  onNavigate: (view: 'products' | 'cart' | 'checkout' | 'success') => void;
}

export function Header({ currentView, onNavigate }: HeaderProps) {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => onNavigate('products')}
              className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              ShopMart
            </button>
            <nav className="hidden md:flex space-x-6">
              <button
                onClick={() => onNavigate('products')}
                className={`font-medium transition-colors ${
                  currentView === 'products'
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Products
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('cart')}
              className={`relative p-2 rounded-md transition-colors ${
                currentView === 'cart'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m6-5V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}