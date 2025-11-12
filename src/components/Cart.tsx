import { useCart } from "../cart/CartProvider";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

function Cart({ isOpen, onClose }: CartProps) {
  const { state, removeItem, setQuantity, clearCart, subtotal } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-800 border-l border-gray-700 z-50 flex flex-col shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close cart"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {state.items.length === 0 ? (
            <p className="text-gray-400 text-center mt-8">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-700 rounded-lg p-4 border border-gray-600"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg">
                        {item.name}
                      </h3>
                      <p className="text-gray-300">${item.price}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors ml-4"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setQuantity(item.id, Math.max(0, item.quantity - 1))
                        }
                        className="bg-gray-600 hover:bg-gray-500 text-white w-8 h-8 rounded flex items-center justify-center transition-colors"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) => {
                          const qty = parseInt(e.target.value, 10) || 0;
                          setQuantity(item.id, qty);
                        }}
                        className="w-16 bg-gray-600 text-white text-center rounded px-2 py-1 border border-gray-500 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                        className="bg-gray-600 hover:bg-gray-500 text-white w-8 h-8 rounded flex items-center justify-center transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-white font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {state.items.length > 0 && (
          <div className="border-t border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-semibold text-white">Subtotal</span>
              <span className="text-xl font-bold text-white">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <button
              onClick={clearCart}
              className="w-full bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors mb-2"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;



