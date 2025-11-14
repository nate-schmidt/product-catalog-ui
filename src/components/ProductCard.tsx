import { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDimensions = (dimensions: Product["dimensions"]) => {
    if (!dimensions || (!dimensions.width && !dimensions.height && !dimensions.depth)) {
      return null;
    }
    return `${dimensions.width || "?"} × ${dimensions.height || "?"} × ${dimensions.depth || "?"} ${dimensions.unit}`;
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-700">
      {/* Image Section */}
      <div className="relative h-64 bg-gray-700 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <svg
              className="w-20 h-20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        
        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          {product.inStock ? (
            <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full shadow-lg">
              In Stock
            </span>
          ) : (
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full shadow-lg">
              Out of Stock
            </span>
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full shadow-lg">
            {product.category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
          {product.name}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>

        {/* Product Details */}
        <div className="space-y-2 mb-4">
          {product.color && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Color:</span>
              <span className="text-gray-300">{product.color}</span>
            </div>
          )}
          
          {product.material && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Material:</span>
              <span className="text-gray-300">{product.material}</span>
            </div>
          )}
          
          {formatDimensions(product.dimensions) && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Dimensions:</span>
              <span className="text-gray-300">{formatDimensions(product.dimensions)}</span>
            </div>
          )}
        </div>

        {/* Price and Stock Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div>
            <p className="text-3xl font-bold text-white">
              {formatPrice(product.price)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {product.stock} {product.stock === 1 ? "item" : "items"} available
            </p>
          </div>
          
          <button
            disabled={!product.inStock}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              product.inStock
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            {product.inStock ? "Add to Cart" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
}

