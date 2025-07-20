import React, { useState } from 'react';
import { Product } from '../types/Product';
import { useProducts } from '../hooks/useProducts';
import { useProductSearch } from '../hooks/useProductSearch';
import SearchBar from './SearchBar';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';

export default function ProductCatalog() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Use search hook for search functionality
  const {
    searchQuery,
    setSearchQuery,
    filteredProducts: searchResults,
    loading: searchLoading,
    pendingSearch,
    error: searchError,
    refetch: refetchSearch,
    clearSearch,
  } = useProductSearch('', { autoSearch: true });

  // Use products hook for initial product loading (only when not searching)
  const {
    products: allProducts,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts({ autoLoad: !searchQuery.trim() });

  // Determine which data to display
  const isSearching = searchQuery.trim().length > 0;
  const displayProducts = isSearching ? searchResults : allProducts;
  const isLoading = isSearching ? (searchLoading || pendingSearch) : productsLoading;
  const error = isSearching ? searchError : productsError;

  const handleSearchChange = (query: string) => {
    console.log('ProductCatalog onSearchChange called with:', query);
    setSearchQuery(query);
    
    // If clearing search, refetch all products
    if (!query.trim()) {
      refetchProducts();
    }
  };

  const handleViewDetails = (productId: string) => {
    const product = displayProducts.find(p => p.id === productId);
    setSelectedProduct(product || null);
  };

  const handleBackToList = () => {
    setSelectedProduct(null);
  };

  const handleRetry = () => {
    if (isSearching) {
      refetchSearch();
    } else {
      refetchProducts();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    clearSearch();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Try Again
            </button>
            {isSearching && (
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner 
          size="lg" 
          message={isSearching ? "Searching products..." : "Loading products..."} 
        />
      </div>
    );
  }

  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={handleBackToList}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </button>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={selectedProduct.imageUrl || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop'}
                  alt={selectedProduct.name}
                  className="w-full h-96 md:h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop';
                  }}
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {selectedProduct.name}
                  </h1>
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    selectedProduct.inStock 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                
                <p className="text-lg text-gray-600 mb-4">{selectedProduct.manufacturer}</p>
                
                {selectedProduct.category && (
                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                      {selectedProduct.category}
                    </span>
                  </div>
                )}
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Extended product details */}
                {selectedProduct.specifications && selectedProduct.specifications.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                    <div className="space-y-2">
                      {selectedProduct.specifications.map((spec) => (
                        <div key={spec.id} className="flex justify-between">
                          <span className="text-gray-600">{spec.name}:</span>
                          <span className="text-gray-900 font-medium">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-4xl font-bold text-gray-900">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(selectedProduct.price)}
                    </span>
                    {selectedProduct.compareAtPrice && selectedProduct.compareAtPrice > selectedProduct.price && (
                      <span className="ml-2 text-lg text-gray-500 line-through">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        }).format(selectedProduct.compareAtPrice)}
                      </span>
                    )}
                  </div>
                  
                  <button
                    disabled={!selectedProduct.inStock}
                    className={`px-6 py-3 rounded-md font-medium text-white ${
                      selectedProduct.inStock
                        ? 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                        : 'bg-gray-400 cursor-not-allowed'
                    } transition-colors duration-200`}
                  >
                    {selectedProduct.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Catalog</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our curated selection of premium technology products
          </p>
        </div>
        
        <SearchBar 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          loading={isSearching && (searchLoading || pendingSearch)}
        />
        
        {isSearching && searchLoading ? (
          <div className="text-center py-12">
            <LoadingSpinner 
              size="md" 
              message="Searching products..." 
            />
          </div>
        ) : isSearching && pendingSearch ? (
          // Show nothing during debounce period to avoid flashing "No products found"
          null
        ) : displayProducts.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {displayProducts.length} product{displayProducts.length !== 1 ? 's' : ''}
              {searchQuery && (
                <> for "<span className="font-medium">{searchQuery}</span>"</>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">
              {isSearching ? (
                <>
                  No products match your search. Try different keywords or{' '}
                  <button 
                    onClick={handleClearSearch}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    clear your search
                  </button>
                  .
                </>
              ) : (
                <>
                  No products are currently available. Please{' '}
                  <button 
                    onClick={handleRetry}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    try again
                  </button>
                  .
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}