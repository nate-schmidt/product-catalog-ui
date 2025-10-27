import React from 'react';
import { FlashSale, FlashSaleStatus } from '../types/flashSales';
import CountdownTimer from './CountdownTimer';

interface FlashSaleCardProps {
  flashSale: FlashSale & { status: FlashSaleStatus };
  onAddToCart?: () => void;
  onViewDetails?: () => void;
}

export function FlashSaleCard({ flashSale, onAddToCart, onViewDetails }: FlashSaleCardProps) {
  const { product, discountPercentage, flashPrice, status } = flashSale;
  const savings = product.originalPrice - flashPrice;

  const getCardBorder = () => {
    if (status.isActive) {
      return 'border-red-500 border-2 shadow-red-100';
    }
    if (!status.hasStarted) {
      return 'border-blue-500 border-2 shadow-blue-100';
    }
    return 'border-gray-300 border';
  };

  const getStatusBadge = () => {
    if (!status.hasStarted) {
      return (
        <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-bold">
          Coming Soon
        </div>
      );
    }
    if (status.isActive) {
      return (
        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold animate-pulse">
          🔥 LIVE
        </div>
      );
    }
    return (
      <div className="absolute top-3 left-3 bg-gray-500 text-white px-2 py-1 rounded-md text-xs font-bold">
        Ended
      </div>
    );
  };

  const getDiscountBadge = () => (
    <div className="absolute top-3 right-3 bg-yellow-400 text-black px-2 py-1 rounded-md text-xs font-bold">
      -{discountPercentage}%
    </div>
  );

  return (
    <div className={`bg-white rounded-lg ${getCardBorder()} shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative group`}>
      {getStatusBadge()}
      {getDiscountBadge()}

      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

        {/* Pricing */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-red-600">${flashPrice.toFixed(2)}</span>
          <span className="text-lg text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
        </div>

        <div className="text-sm text-green-600 font-semibold mb-3">
          💰 You save ${savings.toFixed(2)}
        </div>

        {/* Stock Progress */}
        {flashSale.maxQuantity && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500">
                {flashSale.soldQuantity}/{flashSale.maxQuantity} sold
              </span>
              <span className="text-xs text-gray-500">
                {Math.round((flashSale.soldQuantity / flashSale.maxQuantity) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(flashSale.soldQuantity / flashSale.maxQuantity) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Timer */}
        {(status.isActive || !status.hasStarted) && (
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1">
              {status.isActive ? 'Ends in:' : 'Starts in:'}
            </div>
            <CountdownTimer 
              targetTime={status.isActive ? flashSale.endTime : flashSale.startTime}
              variant={status.isActive ? 'urgent' : 'default'}
              size="small"
              showLabels={false}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {status.isActive && onAddToCart && (
            <button
              onClick={onAddToCart}
              className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-red-600 transition-colors"
            >
              Add to Cart
            </button>
          )}

          {!status.isActive && (
            <button
              disabled
              className="flex-1 bg-gray-300 text-gray-500 py-2 px-4 rounded-md font-semibold cursor-not-allowed"
            >
              {!status.hasStarted ? 'Coming Soon' : 'Sale Ended'}
            </button>
          )}

          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FlashSaleCard;