import React, { useState } from 'react';
import { Product } from '../types/product';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isInCart, getCartItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);

  // Initialize default variants
  React.useEffect(() => {
    if (product.variants) {
      const defaultVariants: { [key: string]: string } = {};
      Object.entries(product.variants).forEach(([type, options]) => {
        if (options.length > 0) {
          defaultVariants[type] = options[0].value;
        }
      });
      setSelectedVariants(defaultVariants);
    }
  }, [product]);

  const handleVariantChange = (type: string, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  const calculatePrice = () => {
    let price = product.price;
    if (product.variants && selectedVariants) {
      Object.entries(selectedVariants).forEach(([type, value]) => {
        const variant = product.variants?.[type]?.find(v => v.value === value);
        if (variant?.priceModifier) {
          price += variant.priceModifier;
        }
      });
    }
    return price;
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined);
    
    // Show visual feedback
    setShowAddedFeedback(true);
    setTimeout(() => setShowAddedFeedback(false), 2000);
    
    // Reset quantity
    setQuantity(1);
  };

  const cartItem = getCartItem(product.id, Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined);
  const inCart = !!cartItem;
  const currentQuantityInCart = cartItem?.quantity || 0;
  const isOutOfStock = product.stock === 0;
  const wouldExceedStock = currentQuantityInCart + quantity > product.stock;
  const wouldExceedMax = currentQuantityInCart + quantity > 10;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <div className="relative h-64 bg-gray-200">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {product.stock < 10 && product.stock > 0 && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-sm">
            Only {product.stock} left!
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-xl font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        
        {/* Variants */}
        {product.variants && (
          <div className="mb-4 space-y-2">
            {Object.entries(product.variants).map(([type, options]) => (
              <div key={type}>
                <label className="text-sm font-medium text-gray-700 capitalize">{type}:</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleVariantChange(type, option.value)}
                      className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                        selectedVariants[type] === option.value
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {option.value}
                      {option.priceModifier && option.priceModifier > 0 && (
                        <span className="ml-1 text-xs">+${option.priceModifier}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="text-2xl font-bold text-gray-900 mb-3">
          ${calculatePrice().toFixed(2)}
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center mb-4">
          <label className="text-sm font-medium text-gray-700 mr-2">Quantity:</label>
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
              disabled={quantity <= 1}
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
              className="w-12 text-center border-x border-gray-300 py-1"
              min="1"
              max="10"
            />
            <button
              onClick={() => setQuantity(Math.min(10, quantity + 1))}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
              disabled={quantity >= 10}
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || wouldExceedStock || wouldExceedMax}
          className={`w-full py-2 px-4 rounded-md font-medium transition-all duration-200 ${
            isOutOfStock || wouldExceedStock || wouldExceedMax
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : showAddedFeedback
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isOutOfStock
            ? 'Out of Stock'
            : wouldExceedStock
            ? 'Insufficient Stock'
            : wouldExceedMax
            ? 'Maximum Quantity Reached'
            : showAddedFeedback
            ? '✓ Added to Cart!'
            : inCart
            ? `Add More (${currentQuantityInCart} in cart)`
            : 'Add to Cart'}
        </button>

        {/* Stock Info */}
        {!isOutOfStock && product.stock < 50 && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            {product.stock} items available
          </p>
        )}
      </div>
    </div>
  );
};