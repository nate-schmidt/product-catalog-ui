import React from 'react';
import { FlashSale, FlashSaleStatus } from '../types/flashSales';
import CountdownTimer from './CountdownTimer';

interface FlashSaleBannerProps {
  flashSale: FlashSale & { status: FlashSaleStatus };
  onShopNow?: () => void;
}

export function FlashSaleBanner({ flashSale, onShopNow }: FlashSaleBannerProps) {
  const { product, discountPercentage, flashPrice, status, title, description } = flashSale;

  // Calculate savings
  const savings = product.originalPrice - flashPrice;
  const soldPercentage = flashSale.maxQuantity 
    ? Math.round((flashSale.soldQuantity / flashSale.maxQuantity) * 100)
    : 0;

  const getBannerStyle = () => {
    if (!status.hasStarted) {
      return 'bg-gradient-to-r from-blue-500 to-purple-600';
    }
    if (status.isActive) {
      return 'bg-gradient-to-r from-red-500 to-pink-600';
    }
    return 'bg-gradient-to-r from-gray-400 to-gray-600';
  };

  const getStatusText = () => {
    if (!status.hasStarted) {
      return 'Coming Soon';
    }
    if (status.isActive) {
      return 'Live Now';
    }
    return 'Ended';
  };

  return (
    <div className={`${getBannerStyle()} text-white rounded-lg p-6 shadow-lg relative overflow-hidden`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Left side - Product info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-white text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                {getStatusText()}
              </span>
              <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                {discountPercentage}% OFF
              </span>
            </div>
            
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">{title}</h2>
            
            {description && (
              <p className="text-lg opacity-90 mb-3">{description}</p>
            )}

            <div className="flex items-center gap-4 mb-3">
              <div className="text-3xl font-bold">${flashPrice.toFixed(2)}</div>
              <div className="text-lg opacity-75 line-through">${product.originalPrice.toFixed(2)}</div>
              <div className="bg-green-400 text-green-900 px-2 py-1 rounded text-sm font-bold">
                Save ${savings.toFixed(2)}
              </div>
            </div>

            {/* Stock indicator */}
            {flashSale.maxQuantity && (
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm opacity-75">
                    {flashSale.soldQuantity} of {flashSale.maxQuantity} sold
                  </span>
                  <span className="text-sm opacity-75">{soldPercentage}%</span>
                </div>
                <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${soldPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right side - Timer and CTA */}
          <div className="flex flex-col items-center lg:items-end gap-4">
            {status.isActive && (
              <div className="text-center lg:text-right">
                <div className="text-sm opacity-75 mb-2">Time Remaining:</div>
                <CountdownTimer 
                  targetTime={flashSale.endTime} 
                  variant="urgent"
                  size="large"
                />
              </div>
            )}

            {!status.hasStarted && (
              <div className="text-center lg:text-right">
                <div className="text-sm opacity-75 mb-2">Starts in:</div>
                <CountdownTimer 
                  targetTime={flashSale.startTime} 
                  variant="default"
                  size="large"
                />
              </div>
            )}

            {status.isActive && onShopNow && (
              <button
                onClick={onShopNow}
                className="bg-white text-red-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg transform hover:scale-105"
              >
                🛒 Shop Now
              </button>
            )}

            {!status.hasStarted && (
              <button
                disabled
                className="bg-white bg-opacity-50 text-white px-8 py-3 rounded-lg font-bold text-lg cursor-not-allowed"
              >
                🔔 Get Notified
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlashSaleBanner;