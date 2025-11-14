import { useState, useEffect } from "react";
import { Deal } from "../types/deal";
import { mockDeals } from "../data/mockDeals";

export function DealFeed() {
  const [activeDeals, setActiveDeals] = useState<Deal[]>([]);

  useEffect(() => {
    const updateActiveDeals = () => {
      const now = new Date();
      const active = mockDeals.filter((deal) => {
        const startTime = new Date(deal.displayStartTime);
        const endTime = new Date(deal.displayEndTime);
        return now >= startTime && now <= endTime;
      });
      setActiveDeals(active);
    };

    // Update immediately
    updateActiveDeals();

    // Update every minute to catch deals that become active/inactive
    const interval = setInterval(updateActiveDeals, 60000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const calculateDiscount = (originalPrice: number, currentPrice: number) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const formatTimeRemaining = (endTime: string) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    }
    return `${minutes}m left`;
  };

  if (activeDeals.length === 0) {
    return (
      <div className="mb-12">
        <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700">
          <svg
            className="w-16 h-16 text-gray-600 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            No Active Deals
          </h3>
          <p className="text-gray-500">
            Check back soon for new deals!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-2">
          🔥 Hot Deals
        </h2>
        <p className="text-gray-400">
          Limited time offers - don't miss out!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeDeals.map((deal) => (
          <div
            key={deal.id}
            className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-orange-600/50"
          >
            {/* Header with discount badge */}
            <div className="relative bg-gradient-to-r from-orange-600 to-red-600 p-4">
              {deal.originalPrice && (
                <div className="absolute top-2 right-2">
                  <span className="px-3 py-1 bg-white text-orange-600 text-sm font-bold rounded-full shadow-lg">
                    {calculateDiscount(deal.originalPrice, deal.price)}% OFF
                  </span>
                </div>
              )}
              <div className="text-white">
                <p className="text-sm font-semibold opacity-90">
                  {formatTimeRemaining(deal.displayEndTime)}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-3 line-clamp-1">
                {deal.name}
              </h3>

              <p className="text-gray-300 text-sm mb-4 line-clamp-3 min-h-[4.5rem]">
                {deal.description}
              </p>

              {/* Price Section */}
              <div className="pt-4 border-t border-gray-700">
                <div className="flex items-baseline gap-3 mb-2">
                  <p className="text-3xl font-bold text-white">
                    {formatPrice(deal.price)}
                  </p>
                  {deal.originalPrice && (
                    <p className="text-lg text-gray-500 line-through">
                      {formatPrice(deal.originalPrice)}
                    </p>
                  )}
                </div>
                {deal.originalPrice && (
                  <p className="text-sm text-green-400 font-semibold">
                    Save {formatPrice(deal.originalPrice - deal.price)}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
                Claim Deal
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

