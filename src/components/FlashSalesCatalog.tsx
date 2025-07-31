import React, { useState } from 'react';
import { useFlashSales } from '../contexts/FlashSalesContext';
import { FlashSaleProduct } from '../types';
import FlashSaleCard from './FlashSaleCard';

interface FlashSalesCatalogProps {
  onAddToCart?: (product: FlashSaleProduct) => void;
}

const FlashSalesCatalog: React.FC<FlashSalesCatalogProps> = ({ onAddToCart }) => {
  const { flashSaleProducts, activeFlashSales } = useFlashSales();
  const [sortBy, setSortBy] = useState<'timeLeft' | 'discount' | 'price'>('timeLeft');
  const [filterBy, setFilterBy] = useState<'all' | 'ending-soon' | 'high-discount'>('all');

  if (activeFlashSales.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="bg-gray-100 rounded-xl py-16 px-8">
          <div className="text-6xl mb-4">⚡</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Flash Sales Active
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Stay tuned for amazing flash deals coming your way. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  // Sort products
  const sortedProducts = [...flashSaleProducts].sort((a, b) => {
    switch (sortBy) {
      case 'timeLeft':
        if (!a.timeRemaining || !b.timeRemaining) return 0;
        const aTime = a.timeRemaining.hours * 3600 + a.timeRemaining.minutes * 60 + a.timeRemaining.seconds;
        const bTime = b.timeRemaining.hours * 3600 + b.timeRemaining.minutes * 60 + b.timeRemaining.seconds;
        return aTime - bTime;
      case 'discount':
        return b.flashSale.discountPercentage - a.flashSale.discountPercentage;
      case 'price':
        return a.price - b.price;
      default:
        return 0;
    }
  });

  // Filter products
  const filteredProducts = sortedProducts.filter(product => {
    switch (filterBy) {
      case 'ending-soon':
        return product.timeRemaining && 
               product.timeRemaining.hours === 0 && 
               product.timeRemaining.minutes < 60;
      case 'high-discount':
        return product.flashSale.discountPercentage >= 30;
      default:
        return true;
    }
  });

  const handleAddToCart = (product: FlashSaleProduct) => {
    if (onAddToCart) {
      onAddToCart(product);
    }
    // Simple feedback
    const button = document.activeElement as HTMLButtonElement;
    if (button) {
      const originalText = button.textContent;
      button.textContent = 'Added! ✓';
      button.disabled = true;
      setTimeout(() => {
        if (button.textContent === 'Added! ✓') {
          button.textContent = originalText;
          button.disabled = false;
        }
      }, 1500);
    }
  };

  return (
    <section id="flash-sales-section" className="max-w-7xl mx-auto px-4 py-12">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 mb-4">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <h1 className="text-4xl font-bold text-gray-900">Flash Sales</h1>
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Limited time offers with incredible discounts. Don't miss out on these exclusive deals!
        </p>
      </div>

      {/* Controls */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilterBy('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              filterBy === 'all'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Sales ({flashSaleProducts.length})
          </button>
          <button
            onClick={() => setFilterBy('ending-soon')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              filterBy === 'ending-soon'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ending Soon ⏰
          </button>
          <button
            onClick={() => setFilterBy('high-discount')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              filterBy === 'high-discount'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            High Discount 🔥
          </button>
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="timeLeft">Time Left</option>
            <option value="discount">Discount %</option>
            <option value="price">Price</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No products match your filters
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters to see more flash sale products.
          </p>
        </div>
      ) : (
        <>
          {/* Stats Bar */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-wrap gap-6 justify-center text-sm">
              <div className="text-center">
                <div className="font-bold text-2xl text-red-600">
                  {filteredProducts.length}
                </div>
                <div className="text-gray-600">Active Deals</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-green-600">
                  {Math.max(...filteredProducts.map(p => p.flashSale.discountPercentage))}%
                </div>
                <div className="text-gray-600">Max Discount</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-blue-600">
                  {filteredProducts.reduce((sum, p) => sum + (p.flashSale.maxQuantity - p.flashSale.soldQuantity), 0)}
                </div>
                <div className="text-gray-600">Items Left</div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <FlashSaleCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </>
      )}

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-2xl p-8 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Don't Miss Out!</h3>
          <p className="mb-6 opacity-90">
            Flash sales are limited time offers. These deals won't last long, so grab them while you can!
          </p>
          <button 
            className="bg-white text-red-600 font-bold py-3 px-8 rounded-full hover:bg-yellow-100 transition-colors duration-200 shadow-lg"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Back to Top ↑
          </button>
        </div>
      </div>
    </section>
  );
};

export default FlashSalesCatalog;