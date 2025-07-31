import React from 'react';
import { useFlashSales } from '../contexts/FlashSalesContext';
import CountdownTimer from './CountdownTimer';

const FlashSaleBanner: React.FC = () => {
  const { activeFlashSales, flashSaleProducts } = useFlashSales();

  if (activeFlashSales.length === 0) {
    return null;
  }

  const nextEndingSale = flashSaleProducts
    .filter(product => product.timeRemaining)
    .sort((a, b) => {
      const aTime = a.timeRemaining!.hours * 3600 + a.timeRemaining!.minutes * 60 + a.timeRemaining!.seconds;
      const bTime = b.timeRemaining!.hours * 3600 + b.timeRemaining!.minutes * 60 + b.timeRemaining!.seconds;
      return aTime - bTime;
    })[0];

  return (
    <div className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 text-white py-4 px-6 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Main message */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping animation-delay-200"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping animation-delay-400"></div>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold">
                🔥 Flash Sales Active!
              </h2>
              <p className="text-sm md:text-base opacity-90">
                Limited time offers on {activeFlashSales.length} amazing products
              </p>
            </div>
          </div>

          {/* Countdown for next ending sale */}
          {nextEndingSale && (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm opacity-90">Next sale ending in:</p>
                <p className="text-xs opacity-75">{nextEndingSale.name}</p>
              </div>
              <CountdownTimer 
                timeRemaining={nextEndingSale.timeRemaining} 
                size="large"
                theme="light"
              />
            </div>
          )}

          {/* CTA Button */}
          <button 
            className="bg-white text-red-600 font-bold py-2 px-6 rounded-full hover:bg-yellow-100 transition-colors duration-200 shadow-lg"
            onClick={() => {
              document.getElementById('flash-sales-section')?.scrollIntoView({ 
                behavior: 'smooth' 
              });
            }}
          >
            Shop Now! →
          </button>
        </div>

        {/* Sale stats */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm opacity-75">
          {activeFlashSales.map(sale => (
            <div key={sale.id} className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>
                {sale.title}: {sale.maxQuantity - sale.soldQuantity} left
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlashSaleBanner;