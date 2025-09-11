import { Product, isFlashSaleActive } from '../data/furnitureData';
import { useCountdown } from '../hooks/useCountdown';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isFlashSale = isFlashSaleActive(product);
  const countdown = useCountdown(product.flashSale?.endTime || new Date());

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatCountdown = () => {
    if (countdown.isExpired) return 'Expired';
    
    const parts = [];
    if (countdown.hours > 0) parts.push(`${countdown.hours}h`);
    if (countdown.minutes > 0) parts.push(`${countdown.minutes}m`);
    parts.push(`${countdown.seconds}s`);
    
    return parts.join(' ');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 relative">
      {/* Flash Sale Badge */}
      {isFlashSale && (
        <div className="absolute top-3 left-3 z-10">
          <div className={`bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold ${
            countdown.hours === 0 && countdown.minutes < 30 ? 'urgent-flash-sale' : 'flash-sale-badge'
          }`}>
            FLASH SALE
          </div>
          {product.flashSale?.discount && (
            <div className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold mt-1">
              {product.flashSale.discount}% OFF
            </div>
          )}
        </div>
      )}

      {/* Out of Stock Badge */}
      {!product.inStock && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            OUT OF STOCK
          </div>
        </div>
      )}

      {/* Product Image */}
      <div className="aspect-video bg-gray-200 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {product.name}
          </h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Flash Sale Info */}
        {isFlashSale && product.flashSale && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-600 font-bold text-lg">
                {formatPrice(product.flashSale.salePrice)}
              </span>
              <span className="text-gray-500 line-through text-sm">
                {formatPrice(product.flashSale.originalPrice)}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className={`text-red-600 font-semibold ${
                countdown.hours === 0 && countdown.minutes < 30 ? 'countdown-urgent' : ''
              }`}>
                Ends in: {formatCountdown()}
              </div>
              {product.flashSale.quantityLeft && (
                <div className={`font-medium ${
                  product.flashSale.quantityLeft <= 3 
                    ? 'text-red-600 font-bold' 
                    : 'text-orange-600'
                }`}>
                  Only {product.flashSale.quantityLeft} left!
                </div>
              )}
            </div>
            
            {/* Progress bar for urgency */}
            {product.flashSale.quantityLeft && product.flashSale.quantityLeft <= 5 && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full animate-pulse"
                    style={{ width: `${Math.max(20, (product.flashSale.quantityLeft / 10) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Regular Price */}
        {!isFlashSale && (
          <div className="mb-4">
            <span className="text-2xl font-bold text-gray-800">
              {formatPrice(product.price)}
            </span>
          </div>
        )}

        {/* Action Button */}
        <button
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
            !product.inStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isFlashSale
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          disabled={!product.inStock}
        >
          {!product.inStock 
            ? 'Out of Stock' 
            : isFlashSale 
            ? 'Buy Now - Flash Sale!' 
            : 'Add to Cart'
          }
        </button>
      </div>
    </div>
  );
}