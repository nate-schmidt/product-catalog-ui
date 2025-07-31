import React, { useState } from 'react';
import "./index.css";
import { FlashSalesProvider } from './contexts/FlashSalesContext';
import { FlashSaleProduct } from './types';
import FlashSaleBanner from './components/FlashSaleBanner';
import FlashSalesCatalog from './components/FlashSalesCatalog';

export function App() {
  const [cart, setCart] = useState<FlashSaleProduct[]>([]);

  const handleAddToCart = (product: FlashSaleProduct) => {
    setCart(prev => [...prev, product]);
    console.log('Added to cart:', product.name);
  };

  return (
    <FlashSalesProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Flash Sales Banner */}
        <FlashSaleBanner />
        
        {/* Main Content */}
        <main className="relative">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                🛍️ FlashMart
              </h1>
              <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
                Your premier destination for lightning-fast deals and incredible savings. 
                Don't blink—these offers disappear faster than you think!
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  ⚡ Lightning Fast Checkout
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  🚚 Free Express Shipping
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  💯 100% Secure Payment
                </div>
              </div>
            </div>
          </div>

          {/* Flash Sales Catalog */}
          <FlashSalesCatalog onAddToCart={handleAddToCart} />

          {/* Footer */}
          <footer className="bg-gray-900 text-white py-16 mt-16">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">FlashMart</h3>
                  <p className="text-gray-400">
                    Your trusted partner for flash sales and amazing deals.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Quick Links</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors">Flash Sales</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Today's Deals</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Clearance</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Customer Service</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Stay Updated</h4>
                  <p className="text-gray-400 text-sm mb-4">
                    Get notified about new flash sales!
                  </p>
                  <div className="flex">
                    <input
                      type="email"
                      placeholder="Enter email"
                      className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-l-lg border border-gray-700 focus:outline-none focus:border-red-500"
                    />
                    <button className="bg-red-600 text-white px-4 py-2 rounded-r-lg hover:bg-red-700 transition-colors">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                <p>&copy; 2024 FlashMart. All rights reserved. Built with ⚡ and ❤️</p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </FlashSalesProvider>
  );
}

export default App;
