import { useState, useMemo } from 'react';
import { Product, furnitureData, getFlashSaleProducts } from '../data/furnitureData';
import { ProductCard } from './ProductCard';

type FilterType = 'all' | 'flash-sale' | 'seating' | 'dining' | 'office' | 'bedroom' | 'living-room' | 'storage';

export function ProductGrid() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    let products = furnitureData;

    // Apply filter
    if (filter === 'flash-sale') {
      products = getFlashSaleProducts();
    } else if (filter !== 'all') {
      const categoryMap: Record<FilterType, string> = {
        'seating': 'Seating',
        'dining': 'Dining',
        'office': 'Office',
        'bedroom': 'Bedroom',
        'living-room': 'Living Room',
        'storage': 'Storage',
        'all': '',
        'flash-sale': ''
      };
      products = products.filter(p => p.category === categoryMap[filter]);
    }

    // Apply search
    if (searchTerm) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return products;
  }, [filter, searchTerm]);

  const flashSaleCount = getFlashSaleProducts().length;

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Furniture Catalog
        </h1>
        {flashSaleCount > 0 && (
          <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-bold text-red-700 mb-2">
              ⚡ Flash Sales Active!
            </h2>
            <p className="text-red-600">
              {flashSaleCount} item{flashSaleCount !== 1 ? 's' : ''} on flash sale - Limited time offers!
            </p>
          </div>
        )}
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { key: 'all', label: 'All Products' },
            { key: 'flash-sale', label: `Flash Sales (${flashSaleCount})` },
            { key: 'seating', label: 'Seating' },
            { key: 'dining', label: 'Dining' },
            { key: 'office', label: 'Office' },
            { key: 'bedroom', label: 'Bedroom' },
            { key: 'living-room', label: 'Living Room' },
            { key: 'storage', label: 'Storage' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as FilterType)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === key
                  ? key === 'flash-sale'
                    ? 'bg-red-500 text-white'
                    : 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchTerm ? 'No products found matching your search.' : 'No products found.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Flash Sale Summary */}
      {filter === 'flash-sale' && filteredProducts.length > 0 && (
        <div className="mt-12 bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-2">Don't Miss Out!</h3>
          <p className="text-lg">
            These amazing deals won't last long. Limited quantities available!
          </p>
        </div>
      )}
    </div>
  );
}