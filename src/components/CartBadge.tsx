import { useCart } from "../cart/CartContext";

interface CartBadgeProps {
  onClick?: () => void;
}

export default function CartBadge({ onClick }: CartBadgeProps) {
  const { totalItems, totalPrice } = useCart();

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity duration-200"
    >
      <div className="relative">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
          />
        </svg>
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </div>
      <div className="text-sm">
        <div className="font-medium">{totalItems} items</div>
        <div className="text-gray-300">${totalPrice.toLocaleString()}</div>
      </div>
    </button>
  );
}
