import React from 'react';
import { useCart } from '../contexts/CartContext';
import { formatPrice, formatStock, getStockStatusColor, formatDimensions } from '../utils/formatters';

function ProductCatalog() {
  const { 
    addToCart, 
    cartItems, 
    getTotalItems, 
    getTotalPrice,
    filteredProducts, 
    loading, 
    error,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    availableFilters,
    clearFilters,
    refreshProducts
  } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  const getProductQuantityInCart = (productId: number) => {
    const cartItem = cartItems.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  if (loading && filteredProducts.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        fontSize: '1.2rem'
      }}>
        Loading products...
      </div>
    );
  }

  return (
    <div>
      {/* Header with search and cart info */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <h1 style={{ margin: 0, color: '#333' }}>Product Catalog</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            backgroundColor: '#007bff', 
            color: 'white', 
            padding: '0.5rem 1rem', 
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            Cart: {getTotalItems()} items ({formatPrice(getTotalPrice())})
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '1.5rem', padding: '0 1rem' }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            border: '2px solid #ddd',
            borderRadius: '8px',
            outline: 'none',
            transition: 'border-color 0.2s ease'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#007bff';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#ddd';
          }}
        />
      </div>

      {/* Filter Controls */}
      {availableFilters && (
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem', 
          padding: '0 1rem',
          flexWrap: 'wrap'
        }}>
          {/* Category Filter */}
          <select
            value={filters.category || ''}
            onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
            style={{
              padding: '0.5rem',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '0.9rem'
            }}
          >
            <option value="">All Categories</option>
            {availableFilters.categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Material Filter */}
          <select
            value={filters.material || ''}
            onChange={(e) => setFilters({ ...filters, material: e.target.value || undefined })}
            style={{
              padding: '0.5rem',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '0.9rem'
            }}
          >
            <option value="">All Materials</option>
            {availableFilters.materials.map(material => (
              <option key={material} value={material}>{material}</option>
            ))}
          </select>

          {/* In Stock Filter */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={filters.inStock || false}
              onChange={(e) => setFilters({ ...filters, inStock: e.target.checked || undefined })}
            />
            <span style={{ fontSize: '0.9rem' }}>In Stock Only</span>
          </label>

          {/* Clear Filters */}
          {(searchTerm || Object.keys(filters).length > 0) && (
            <button
              onClick={clearFilters}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '1rem',
          borderRadius: '6px',
          margin: '0 1rem 1.5rem 1rem',
          border: '1px solid #f5c6cb'
        }}>
          {error}
          <button
            onClick={refreshProducts}
            style={{
              marginLeft: '1rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: '#721c24',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Products Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        padding: '1rem'
      }}>
        {filteredProducts.length === 0 && !loading ? (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '3rem',
            color: '#666',
            fontSize: '1.1rem'
          }}>
            No products found. Try adjusting your search or filters.
          </div>
        ) : (
          filteredProducts.map(product => {
            const quantityInCart = getProductQuantityInCart(product.id);
            const stockColor = getStockStatusColor(product.stock);
            
            return (
              <div key={product.id} style={{
                border: '1px solid #ddd',
                borderRadius: '12px',
                padding: '1.5rem',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer',
                opacity: product.inStock ? 1 : 0.7
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}>
                
                {/* Product Image Placeholder */}
                <div style={{
                  width: '100%',
                  height: '200px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  color: '#6c757d'
                }}>
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = 'No Image Available';
                      }}
                    />
                  ) : (
                    'No Image Available'
                  )}
                </div>

                {/* Product Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ 
                    margin: 0, 
                    color: '#333',
                    fontSize: '1.3rem',
                    flex: 1
                  }}>
                    {product.name}
                  </h3>
                  <span style={{
                    backgroundColor: '#e9ecef',
                    color: '#495057',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    marginLeft: '0.5rem'
                  }}>
                    {product.category}
                  </span>
                </div>
                
                <p style={{ 
                  color: '#666', 
                  margin: '0 0 1rem 0',
                  lineHeight: '1.5',
                  fontSize: '0.9rem'
                }}>
                  {product.description}
                </p>
                
                {/* Product Details */}
                <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#666' }}>
                  {product.material && (
                    <div style={{ marginBottom: '0.25rem' }}>
                      <strong>Material:</strong> {product.material}
                    </div>
                  )}
                  {product.color && (
                    <div style={{ marginBottom: '0.25rem' }}>
                      <strong>Color:</strong> {product.color}
                    </div>
                  )}
                  {product.dimensions && (
                    <div style={{ marginBottom: '0.25rem' }}>
                      <strong>Dimensions:</strong> {formatDimensions(product.dimensions)}
                    </div>
                  )}
                </div>

                {/* Stock Status */}
                <div style={{
                  color: stockColor,
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  marginBottom: '1rem'
                }}>
                  {formatStock(product.stock)}
                </div>
                
                {/* Price and Actions */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '1rem'
                }}>
                  <span style={{ 
                    fontSize: '1.4rem', 
                    fontWeight: 'bold', 
                    color: '#007bff'
                  }}>
                    {formatPrice(product.price)}
                  </span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {quantityInCart > 0 && (
                      <span style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        {quantityInCart} in cart
                      </span>
                    )}
                    
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      style={{
                        backgroundColor: product.inStock ? '#007bff' : '#6c757d',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.25rem',
                        borderRadius: '6px',
                        cursor: product.inStock ? 'pointer' : 'not-allowed',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (product.inStock) {
                          e.currentTarget.style.backgroundColor = '#0056b3';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (product.inStock) {
                          e.currentTarget.style.backgroundColor = '#007bff';
                        }
                      }}
                    >
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Loading indicator for search */}
      {loading && filteredProducts.length > 0 && (
        <div style={{
          textAlign: 'center',
          padding: '1rem',
          color: '#666'
        }}>
          Searching...
        </div>
      )}
    </div>
  );
}

export default ProductCatalog;