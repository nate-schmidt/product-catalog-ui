import React from 'react';
import { Product } from '../types/product';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, getItemQuantity } = useCart();
  const quantityInCart = getItemQuantity(product.id);

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {!product.inStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
            Out of Stock
          </div>
        )}
        <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-sm font-medium">
          {product.category}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            {product.rating} ({product.reviews} reviews)
          </span>
        </div>
        
        {/* Product Details */}
        <div className="mb-3 space-y-1">
          {product.material && (
            <p className="text-xs text-gray-500">Material: {product.material}</p>
          )}
          {product.color && (
            <p className="text-xs text-gray-500">Color: {product.color}</p>
          )}
          {product.dimensions && (
            <p className="text-xs text-gray-500">
              Dimensions: {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} {product.dimensions.unit}
            </p>
          )}
          <p className="text-xs text-gray-500">Stock: {product.stock} available</p>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || product.stock === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              product.inStock && product.stock > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {!product.inStock || product.stock === 0 
              ? 'Out of Stock' 
              : quantityInCart > 0 
                ? `Add More (${quantityInCart})` 
                : 'Add to Cart'
            }
          </button>
        </div>
      </div>
    </div>
  );
}