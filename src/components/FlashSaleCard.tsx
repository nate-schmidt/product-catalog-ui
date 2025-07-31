import React from 'react';
import { FlashSaleProduct } from '../types';
import CountdownTimer from './CountdownTimer';

interface FlashSaleCardProps {
  product: FlashSaleProduct;
  onAddToCart?: (product: FlashSaleProduct) => void;
}

const FlashSaleCard: React.FC<FlashSaleCardProps> = ({ product, onAddToCart }) => {
  const { flashSale } = product;
  const stockPercentage = ((flashSale.maxQuantity - flashSale.soldQuantity) / flashSale.maxQuantity) * 100;
  const isLowStock = stockPercentage <= 20;
  const isVeryLowStock = stockPercentage <= 10;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const getStockColor = () => {
    if (isVeryLowStock) return 'bg-red-500';
    if (isLowStock) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStockText = () => {
    if (isVeryLowStock) return 'Almost Gone!';
    if (isLowStock) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative group">
      {/* Flash Sale Badge */}
      <div className="absolute top-3 left-3 z-10">
        <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
          </svg>
          <span>{flashSale.discountPercentage}% OFF</span>
        </div>
      </div>

      {/* Special Badge */}
      {flashSale.badge && (
        <div className="absolute top-3 right-3 z-10">
          <div className={`
            px-2 py-1 rounded-full text-xs font-bold
            ${flashSale.badge === 'HOT' ? 'bg-orange-500 text-white' : ''}
            ${flashSale.badge === 'TRENDING' ? 'bg-purple-500 text-white' : ''}
            ${flashSale.badge === 'NEW' ? 'bg-blue-500 text-white' : ''}
          `}>
            {flashSale.badge}
          </div>
        </div>
      )}

      {/* Product Image */}
      <div className="relative overflow-hidden bg-gray-100 h-64">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://via.placeholder.com/300x300/e2e8f0/64748b?text=${encodeURIComponent(product.name)}`;
          }}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-4 space-x-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-red-600">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-lg text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <div className="text-sm text-green-600 font-medium">
            You save ${((product.originalPrice || product.price) - product.price).toFixed(2)}!
          </div>
        </div>

        {/* Stock Info */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {getStockText()}
            </span>
            <span className="text-sm text-gray-600">
              {flashSale.maxQuantity - flashSale.soldQuantity} left
            </span>
          </div>
          
          {/* Stock progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`${getStockColor()} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${stockPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="mb-4">
          <div className="text-sm text-gray-700 mb-2 font-medium">Sale ends in:</div>
          <CountdownTimer 
            timeRemaining={product.timeRemaining} 
            size="medium"
            theme="urgent"
          />
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={flashSale.soldQuantity >= flashSale.maxQuantity}
          className={`
            w-full py-3 px-4 rounded-lg font-bold transition-all duration-200
            ${flashSale.soldQuantity >= flashSale.maxQuantity
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-lg hover:shadow-xl'
            }
          `}
        >
          {flashSale.soldQuantity >= flashSale.maxQuantity ? 'Sold Out' : 'Add to Cart'}
        </button>

        {/* Flash Sale Title */}
        <div className="mt-3 text-center">
          <span className="text-xs text-gray-500 italic">
            {flashSale.title}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FlashSaleCard;