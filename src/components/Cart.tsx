import { X } from "lucide-react";
import { useCart } from "../contexts/CartContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Cart({ open, onClose }: Props) {
  const { items, totalPrice, removeItem, clearCart } = useCart();

  return (
    <div
      className={`fixed inset-0 z-30 transition-opacity ${open ? "" : "pointer-events-none"}`}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-lg transition-transform flex flex-col ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-dark">Your Cart</h2>
          <button onClick={onClose} aria-label="Close cart">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 && (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          )}
          {items.map(item => (
            <div
              key={item.product.id}
              className="flex items-center gap-4 border-b border-gray-100 pb-4"
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium text-dark">{item.product.name}</h3>
                <p className="text-sm text-gray-500">
                  {item.quantity} × ${item.product.price.toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => removeItem(item.product.id)}
                className="text-sm text-accent hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <footer className="border-t border-gray-200 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-dark">Total:</span>
              <span className="text-lg font-bold text-primary">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <button
              className="w-full inline-flex items-center justify-center rounded-md bg-primary hover:bg-primary-dark px-4 py-2 text-white font-medium transition"
              onClick={clearCart}
            >
              Checkout
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}