import Card from "./Card";
import { Product } from "../types/Product";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold text-white mb-2">
        {product.name}
      </h2>
      <p className="text-sm text-gray-500 mb-2">{product.category}</p>
      <p className="text-gray-400 mb-4 flex-grow">
        {product.description || "No description available"}
      </p>
      {product.material && (
        <p className="text-sm text-gray-500 mb-1">Material: {product.material}</p>
      )}
      {product.color && (
        <p className="text-sm text-gray-500 mb-1">Color: {product.color}</p>
      )}
      <div className="mt-auto">
        <div className="text-2xl font-bold text-white mb-1">
          {formatPrice(product.price)}
        </div>
        {product.stock > 0 ? (
          <>
            <p className="text-sm text-gray-500 mb-3">
              {product.stock} in stock
            </p>
            <button
              onClick={() => onAddToCart(product)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors w-full"
            >
              Add to Cart
            </button>
          </>
        ) : (
          <p className="text-red-400 mb-3">Out of stock</p>
        )}
      </div>
    </Card>
  );
}

export default ProductCard;
