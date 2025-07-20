import React from 'react';
import "./index.css";
import { CartProvider } from './contexts/CartContext';
import { CartIcon } from './components/CartIcon';
import { ProductGrid } from './components/ProductGrid';
import { mockProducts } from './data/mockProducts';

export function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">ShopHub</h1>
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Products</a>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Categories</a>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Deals</a>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">About</a>
              </nav>

              {/* Cart Icon */}
              <div className="flex items-center">
                <CartIcon />
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-4">Welcome to ShopHub</h2>
            <p className="text-xl mb-8">Discover amazing products at unbeatable prices</p>
            <div className="flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <p className="text-lg font-semibold">✨ Add to Cart Functionality is Now Live!</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
            <p className="text-gray-600">Check out our latest collection</p>
          </div>

          {/* Product Grid */}
          <ProductGrid products={mockProducts} />
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; 2025 ShopHub. All rights reserved.</p>
            <p className="mt-2 text-gray-400">Built with React, TypeScript, and Tailwind CSS</p>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}

export default App;
