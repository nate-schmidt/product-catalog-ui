import React, { useState, useMemo } from 'react';
import { Product, FilterOptions } from '../types';
import { ProductCard } from './ProductCard';
import { sanitizeSearchQuery } from '../utils/validation';

interface ProductCatalogProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  onProductQuickView?: (product: Product) => void;
  initialFilters?: FilterOptions;
  className?: string;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  loading = false,
  error = null,
  onProductQuickView,
  initialFilters = {},
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
    return uniqueCategories.sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Text search
    if (searchQuery.trim()) {
      const sanitized = sanitizeSearchQuery(searchQuery);
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(sanitized) ||
        product.description.toLowerCase().includes(sanitized) ||
        product.category.toLowerCase().includes(sanitized)
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Stock filter
    if (filters.inStockOnly) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(product =>
        product.price >= filters.priceRange!.min &&
        product.price <= filters.priceRange!.max
      );
    }

    // Sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (filters.sortBy) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'price':
            aValue = a.price;
            bValue = b.price;
            break;
          case 'rating':
            aValue = a.rating || 0;
            bValue = b.rating || 0;
            break;
          default:
            return 0;
        }

        if (filters.sortOrder === 'desc') {
          return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
        } else {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        }
      });
    }

    return filtered;
  }, [products, searchQuery, filters]);

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-red-600 text-lg font-medium">{error}</div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="space-y-4">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              data-testid="search-input"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            <select
              value={filters.category || ''}
              onChange={(e) => handleFilterChange({ category: e.target.value || undefined })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              data-testid="category-filter"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={filters.sortBy || ''}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value as any || undefined })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              data-testid="sort-filter"
            >
              <option value="">Sort By</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
            </select>

            {/* Sort Order */}
            {filters.sortBy && (
              <select
                value={filters.sortOrder || 'asc'}
                onChange={(e) => handleFilterChange({ sortOrder: e.target.value as 'asc' | 'desc' })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                data-testid="sort-order-filter"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            )}

            {/* In Stock Only */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.inStockOnly || false}
                onChange={(e) => handleFilterChange({ inStockOnly: e.target.checked || undefined })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                data-testid="stock-filter"
              />
              <span className="text-sm text-gray-700">In Stock Only</span>
            </label>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
              data-testid="clear-filters"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-gray-600">
        {loading ? (
          <span>Loading products...</span>
        ) : (
          <span>{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found</span>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-lg h-96 animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onProductQuickView}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};