import React, { useState, useEffect } from 'react';
import { Product, FlashSale, FlashSaleStatus } from '../types/flashSales';
import FlashSaleCard from './FlashSaleCard';

interface ProductWithFlashSale extends Product {
  flashSale?: FlashSale & { status: FlashSaleStatus };
}

interface ProductCatalogProps {
  onAddToCart?: (productId: string, isFlashSale: boolean) => void;
  onViewDetails?: (productId: string) => void;
}

export function ProductCatalog({ onAddToCart, onViewDetails }: ProductCatalogProps) {
  const [products, setProducts] = useState<ProductWithFlashSale[]>([]);
  const [flashSales, setFlashSales] = useState<(FlashSale & { status: FlashSaleStatus })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'flash-sales' | 'regular'>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products and flash sales in parallel
        const [productsResponse, flashSalesResponse] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/flash-sales')
        ]);

        const productsData = await productsResponse.json();
        const flashSalesData = await flashSalesResponse.json();

        // Merge products with their flash sales
        const mergedProducts = productsData.map((product: Product) => {
          const flashSale = flashSalesData.find((sale: FlashSale) => sale.productId === product.id);
          return {
            ...product,
            flashSale
          };
        });

        setProducts(mergedProducts);
        setFlashSales(flashSalesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh data every 30 seconds to keep flash sale statuses updated
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredProducts = products.filter(product => {
    switch (filter) {
      case 'flash-sales':
        return product.flashSale && (product.flashSale.status.isActive || !product.flashSale.status.hasStarted);
      case 'regular':
        return !product.flashSale || (!product.flashSale.status.isActive && product.flashSale.status.hasEnded);
      default:
        return true;
    }
  });

  const handleAddToCart = (productId: string, isFlashSale: boolean) => {
    if (onAddToCart) {
      onAddToCart(productId, isFlashSale);
    }
  };

  const handleViewDetails = (productId: string) => {
    if (onViewDetails) {
      onViewDetails(productId);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setFilter('all')}
          className={`pb-2 px-1 font-semibold transition-colors ${
            filter === 'all' 
              ? 'border-b-2 border-red-500 text-red-500' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          All Products ({products.length})
        </button>
        <button
          onClick={() => setFilter('flash-sales')}
          className={`pb-2 px-1 font-semibold transition-colors ${
            filter === 'flash-sales' 
              ? 'border-b-2 border-red-500 text-red-500' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          🔥 Flash Sales ({products.filter(p => p.flashSale && (p.flashSale.status.isActive || !p.flashSale.status.hasStarted)).length})
        </button>
        <button
          onClick={() => setFilter('regular')}
          className={`pb-2 px-1 font-semibold transition-colors ${
            filter === 'regular' 
              ? 'border-b-2 border-red-500 text-red-500' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Regular Products ({products.filter(p => !p.flashSale || (!p.flashSale.status.isActive && p.flashSale.status.hasEnded)).length})
        </button>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No products found for the selected filter.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => {
            // If product has an active or upcoming flash sale, show flash sale card
            if (product.flashSale && (product.flashSale.status.isActive || !product.flashSale.status.hasStarted)) {
              return (
                <FlashSaleCard
                  key={product.id}
                  flashSale={product.flashSale}
                  onAddToCart={() => handleAddToCart(product.id, true)}
                  onViewDetails={() => handleViewDetails(product.id)}
                />
              );
            }

            // Otherwise show regular product card
            return (
              <div key={product.id} className="bg-white rounded-lg border border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                  
                  <div className="text-2xl font-bold text-gray-800 mb-4">
                    ${product.originalPrice.toFixed(2)}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product.id, false)}
                      className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-600 transition-colors"
                      disabled={!product.inStock}
                    >
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    
                    <button
                      onClick={() => handleViewDetails(product.id)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProductCatalog;