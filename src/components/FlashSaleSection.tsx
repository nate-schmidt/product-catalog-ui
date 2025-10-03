import { useState, useEffect } from 'react';
import { FlashSale } from '../types/product';
import { CountdownTimer } from './CountdownTimer';
import { ProductCard } from './ProductCard';

interface FlashSaleSectionProps {
  flashSale: FlashSale;
}

export function FlashSaleSection({ flashSale }: FlashSaleSectionProps) {
  const [isActive, setIsActive] = useState(flashSale.isActive);

  useEffect(() => {
    const now = new Date();
    const active = now >= flashSale.startTime && now <= flashSale.endTime;
    setIsActive(active);
  }, [flashSale]);

  const handleExpire = () => {
    setIsActive(false);
  };

  if (!isActive) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-12 border border-gray-700">
          <div className="text-6xl mb-4">😴</div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Flash Sale Ended
          </h2>
          <p className="text-gray-400">
            Stay tuned for our next amazing deals!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      {/* Header Section */}
      <div className="mb-8 sm:mb-12">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-block animate-pulse">
            <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 mb-2">
              {flashSale.title}
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-300 mb-6">
            Unbelievable deals that won't last long! Grab them before they're gone! 🔥
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 border-2 border-red-500/30 shadow-2xl">
          <div className="text-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center justify-center gap-2">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Sale Ends In
            </h2>
          </div>
          <CountdownTimer endTime={flashSale.endTime} onExpire={handleExpire} />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {flashSale.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 text-center bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl p-8 border border-orange-500/20">
        <h3 className="text-2xl font-bold text-white mb-3">
          Don't Miss Out! 🎯
        </h3>
        <p className="text-gray-300 mb-4">
          These deals are only available during the flash sale period.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="bg-gray-800 rounded-lg px-6 py-3 border border-gray-700">
            <div className="text-orange-400 font-bold text-2xl">
              {flashSale.products.length}
            </div>
            <div className="text-gray-400 text-sm">Products</div>
          </div>
          <div className="bg-gray-800 rounded-lg px-6 py-3 border border-gray-700">
            <div className="text-orange-400 font-bold text-2xl">
              Up to 50%
            </div>
            <div className="text-gray-400 text-sm">Discount</div>
          </div>
          <div className="bg-gray-800 rounded-lg px-6 py-3 border border-gray-700">
            <div className="text-orange-400 font-bold text-2xl">
              Limited
            </div>
            <div className="text-gray-400 text-sm">Stock</div>
          </div>
        </div>
      </div>
    </div>
  );
}
