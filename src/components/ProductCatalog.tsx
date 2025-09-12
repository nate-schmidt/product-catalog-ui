import React, { useState, useEffect } from 'react';
import { Product } from '../types/Product';
import { useCart } from '../contexts/CartContext';
import { apiClient } from '../api/client';
import { formatCurrency, formatDimensions, formatWeight, isInStock, getStockStatus, truncateText } from '../utils/formatters';

interface ProductCatalogProps {
  className?: string;
}

export function ProductCatalog({ className = '' }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'category'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const { addToCart, isInCart, getItemQuantity } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await apiClient.getProducts();
        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    try {
      addToCart(product, 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    }
  };

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category))).sort();

  // Filter and sort products
  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(product => 
      selectedCategory === '' || product.category === selectedCategory
    )
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-white">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-8 ${className}`}>
        <div className="bg-red-900 border border-red-600 text-red-200 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Error</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-700 hover:bg-red-600 rounded transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-6">Product Catalog</h2>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
              setSortBy(field);
              setSortOrder(order);
            }}
            className="p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low-High)</option>
            <option value="price-desc">Price (High-Low)</option>
            <option value="category-asc">Category (A-Z)</option>
            <option value="category-desc">Category (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4">
        <p className="text-gray-300">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No products found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors"
            >
              {/* Product Image Placeholder */}
              <div className="w-full h-48 bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>

              {/* Product Info */}
              <h3 className="text-white font-semibold text-lg mb-2">{product.name}</h3>
              
              <p className="text-gray-300 text-sm mb-3" title={product.description}>
                {truncateText(product.description, 100)}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-white">
                    {formatCurrency(product.price, product.currency)}
                  </span>
                  <span className="text-sm text-gray-400">{product.category}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className={`font-medium ${isInStock(product.stockQuantity) ? 'text-green-400' : 'text-red-400'}`}>
                    {getStockStatus(product.stockQuantity)}
                  </span>
                  <span className="text-gray-400">Stock: {product.stockQuantity}</span>
                </div>

                {product.dimensions && (
                  <div className="text-sm text-gray-400">
                    Dimensions: {formatDimensions(product.dimensions)}
                  </div>
                )}

                {product.weight && (
                  <div className="text-sm text-gray-400">
                    Weight: {formatWeight(product.weight)}
                  </div>
                )}

                {product.material && (
                  <div className="text-sm text-gray-400">
                    Material: {product.material}
                  </div>
                )}

                {product.color && (
                  <div className="text-sm text-gray-400">
                    Color: {product.color}
                  </div>
                )}
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(product)}
                disabled={!isInStock(product.stockQuantity)}
                className={`w-full p-3 rounded-lg font-medium transition-colors ${
                  isInStock(product.stockQuantity)
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isInCart(product.id) 
                  ? `In Cart (${getItemQuantity(product.id)})` 
                  : 'Add to Cart'
                }
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductCatalog;