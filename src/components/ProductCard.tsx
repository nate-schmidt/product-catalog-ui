import { Product } from "../types";
import { useCart } from "../contexts/CartContext";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden flex flex-col transition hover:shadow-md hover:-translate-y-1">
      <img
        src={product.image}
        alt={product.name}
        className="h-48 w-full object-cover"
        loading="lazy"
      />
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-dark mb-2 flex-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 flex-1 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-primary font-bold text-xl">
            ${product.price.toFixed(2)}
          </span>
          <button
            className="ml-2 inline-flex items-center gap-1 rounded-md bg-primary hover:bg-primary-dark px-3 py-1.5 text-sm font-medium text-white transition"
            onClick={() => addItem(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}