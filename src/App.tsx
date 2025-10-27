import React, { useState, useEffect } from 'react';
import "./index.css";
import { FlashSale, FlashSaleStatus } from './types/flashSales';
import FlashSaleBanner from './components/FlashSaleBanner';
import ProductCatalog from './components/ProductCatalog';
import { sortFlashSalesByPriority } from './utils/flashSaleUtils';

export function App() {
  const [activeFlashSales, setActiveFlashSales] = useState<(FlashSale & { status: FlashSaleStatus })[]>([]);
  const [upcomingFlashSales, setUpcomingFlashSales] = useState<(FlashSale & { status: FlashSaleStatus })[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchFlashSales = async () => {
      try {
        const [activeResponse, upcomingResponse] = await Promise.all([
          fetch('/api/flash-sales/active'),
          fetch('/api/flash-sales/upcoming')
        ]);

        const activeData = await activeResponse.json();
        const upcomingData = await upcomingResponse.json();

        setActiveFlashSales(sortFlashSalesByPriority(activeData));
        setUpcomingFlashSales(upcomingData.slice(0, 2)); // Show only next 2 upcoming
      } catch (error) {
        console.error('Error fetching flash sales:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSales();
    
    // Refresh every 30 seconds to keep timers updated
    const interval = setInterval(fetchFlashSales, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = (productId: string, isFlashSale: boolean) => {
    setCartCount(prev => prev + 1);
    console.log(`Added product ${productId} to cart (Flash Sale: ${isFlashSale})`);
    // Here you would typically integrate with your cart management system
  };

  const handleViewDetails = (productId: string) => {
    console.log(`View details for product ${productId}`);
    // Here you would navigate to product details page
  };

  const handleShopNow = (flashSale: FlashSale) => {
    console.log(`Shop now for flash sale ${flashSale.id}`);
    // Here you would navigate to the product or add to cart
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading Flash Sales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black bg-opacity-20 backdrop-blur-sm border-b border-white border-opacity-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">⚡ FlashMart</h1>
            <span className="text-sm text-gray-300">Premium Flash Sales</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-white">
              🛒 Cart ({cartCount})
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center text-white mb-12">
          <h2 className="text-5xl font-bold mb-4">⚡ Flash Sales</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Don't miss out on incredible deals! Limited time offers with massive discounts on premium products.
          </p>
        </div>

        {/* Active Flash Sales Banners */}
        {activeFlashSales.length > 0 && (
          <section className="space-y-6">
            <h3 className="text-3xl font-bold text-white mb-6">🔥 Live Flash Sales</h3>
            {activeFlashSales.slice(0, 3).map(flashSale => (
              <FlashSaleBanner
                key={flashSale.id}
                flashSale={flashSale}
                onShopNow={() => handleShopNow(flashSale)}
              />
            ))}
          </section>
        )}

        {/* Upcoming Flash Sales */}
        {upcomingFlashSales.length > 0 && (
          <section className="space-y-6">
            <h3 className="text-3xl font-bold text-white mb-6">🔔 Coming Soon</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingFlashSales.map(flashSale => (
                <FlashSaleBanner
                  key={flashSale.id}
                  flashSale={flashSale}
                  onShopNow={() => handleShopNow(flashSale)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Product Catalog */}
        <section className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8">
          <h3 className="text-3xl font-bold text-white mb-6">🛍️ All Products</h3>
          <ProductCatalog
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
          />
        </section>

        {/* No Flash Sales Message */}
        {activeFlashSales.length === 0 && upcomingFlashSales.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-12">
              <h3 className="text-2xl font-bold text-white mb-4">No Flash Sales Right Now</h3>
              <p className="text-gray-300 text-lg mb-6">
                Stay tuned for amazing deals coming soon! Check back regularly for limited-time offers.
              </p>
              <div className="text-6xl mb-4">⏰</div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black bg-opacity-30 backdrop-blur-sm border-t border-white border-opacity-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-300">
          <p>&copy; 2025 FlashMart - Your Premium Flash Sales Destination</p>
          <p className="text-sm mt-2">⚡ Lightning-fast deals, limited-time offers!</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
