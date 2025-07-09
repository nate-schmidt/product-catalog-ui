import { ShoppingCart } from "lucide-react";
import { useCart } from "../contexts/CartContext";

interface Props {
  onCartClick: () => void;
}

export default function Header({ onCartClick }: Props) {
  const { totalItems } = useCart();
  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Product Catalog</h1>
        <button
          className="relative inline-flex items-center justify-center p-2 rounded-md text-dark hover:bg-gray-100 transition"
          onClick={onCartClick}
          aria-label="Open cart"
        >
          <ShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full px-1.5 py-0.5">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}