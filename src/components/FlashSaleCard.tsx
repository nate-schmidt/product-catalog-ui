import { useState, useEffect } from "react";

interface FlashSaleProduct {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  flashPrice: number;
  discountPercent: number;
  endTime: Date;
}

interface FlashSaleCardProps {
  product: FlashSaleProduct;
  currentTime: Date;
  onAddToCart: (product: FlashSaleProduct) => void;
}

function FlashSaleCard({
  product,
  currentTime,
  onAddToCart,
}: FlashSaleCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getTimeRemaining = () => {
    const diff = product.endTime.getTime() - currentTime.getTime();
    if (diff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, expired: true };
    }
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { hours, minutes, seconds, expired: false };
  };

  const timeRemaining = getTimeRemaining();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatTime = (num: number) => {
    return num.toString().padStart(2, "0");
  };

  return (
    <div
      className="relative bg-gradient-to-br from-red-500 via-yellow-400 to-orange-500 rounded-lg shadow-2xl overflow-hidden border-4 border-yellow-300 transform transition-all duration-300 hover:scale-105 hover:rotate-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animation: isHovered ? "pulse 0.5s infinite" : "none",
        boxShadow: "0 0 30px rgba(255, 0, 0, 0.6), inset 0 0 20px rgba(255, 255, 0, 0.3)",
      }}
    >
      {/* Blinking discount badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-red-600 text-white font-black text-3xl px-4 py-2 rounded-full border-4 border-yellow-300 animate-bounce shadow-lg transform rotate-12">
          {product.discountPercent}% OFF!!!
        </div>
      </div>

      {/* Urgency indicator */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-yellow-400 text-red-800 font-black text-xl px-3 py-1 rounded-full border-2 border-red-600 animate-pulse">
          ⚡ URGENT ⚡
        </div>
      </div>

      <div className="p-6 pt-20">
        {/* Product name with multiple effects */}
        <h3 className="text-2xl font-black text-white mb-3 drop-shadow-[0_0_5px_rgba(0,0,0,0.8)] transform hover:scale-110 transition-transform">
          {product.name.toUpperCase()}
        </h3>

        {/* Description */}
        <p className="text-white font-bold mb-4 text-lg drop-shadow-[0_0_3px_rgba(0,0,0,0.8)]">
          {product.description}
        </p>

        {/* Countdown timer - very prominent */}
        <div className="bg-black bg-opacity-70 rounded-lg p-4 mb-4 border-2 border-yellow-300">
          <div className="text-yellow-300 font-bold text-sm mb-2 text-center">
            TIME REMAINING:
          </div>
          <div className="flex justify-center items-center gap-2">
            <div className="bg-red-600 text-white font-black text-2xl px-3 py-2 rounded border-2 border-yellow-300 animate-pulse">
              {formatTime(timeRemaining.hours)}
            </div>
            <span className="text-yellow-300 font-black text-2xl">:</span>
            <div className="bg-red-600 text-white font-black text-2xl px-3 py-2 rounded border-2 border-yellow-300 animate-pulse">
              {formatTime(timeRemaining.minutes)}
            </div>
            <span className="text-yellow-300 font-black text-2xl">:</span>
            <div className="bg-red-600 text-white font-black text-2xl px-3 py-2 rounded border-2 border-yellow-300 animate-pulse">
              {formatTime(timeRemaining.seconds)}
            </div>
          </div>
        </div>

        {/* Price comparison */}
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <span className="text-white line-through text-xl font-bold opacity-70">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="text-yellow-300 text-4xl font-black drop-shadow-[0_0_10px_rgba(255,255,0,0.8)]">
              {formatPrice(product.flashPrice)}
            </span>
          </div>
          <div className="text-yellow-200 font-bold text-sm mt-1">
            YOU SAVE {formatPrice(product.originalPrice - product.flashPrice)}!!!
          </div>
        </div>

        {/* CTA button - very attention-grabbing */}
        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-black text-xl py-4 rounded-lg border-4 border-yellow-300 shadow-lg transform hover:scale-105 transition-all duration-200 animate-pulse"
          style={{
            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            boxShadow: "0 0 20px rgba(0,255,0,0.6), inset 0 0 10px rgba(255,255,255,0.3)",
          }}
        >
          🛒 BUY NOW!!! 🛒
        </button>

        {/* Scarcity indicator */}
        <div className="mt-3 text-center">
          <span className="text-red-200 font-black text-sm animate-pulse">
            ⚠️ ONLY {Math.floor(Math.random() * 5) + 1} LEFT AT THIS PRICE!!! ⚠️
          </span>
        </div>
      </div>

      {/* Animated border effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-yellow-300 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-300 animate-pulse"></div>
        <div className="absolute top-0 left-0 h-full w-1 bg-yellow-300 animate-pulse"></div>
        <div className="absolute top-0 right-0 h-full w-1 bg-yellow-300 animate-pulse"></div>
      </div>
    </div>
  );
}

export default FlashSaleCard;

