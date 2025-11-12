import { useCart } from "../cart/CartProvider";
import { Product } from "../services/api";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors flex flex-col">
      <h2 className="text-2xl font-semibold text-white mb-3">{product.name}</h2>
      <p className="text-xl font-bold text-white mb-4">${product.price.toFixed(2)}</p>
      <p className="text-gray-300 mb-6 flex-grow">{product.description}</p>
      <button
        onClick={handleAddToCart}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors mt-auto"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;

