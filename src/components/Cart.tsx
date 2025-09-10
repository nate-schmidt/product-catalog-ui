import { useCart } from "../cart/CartContext";
import Card from "./Card";

export default function Cart() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
        <p className="text-gray-300">Add some items to get started!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
        <div className="flex items-center gap-4">
          <div className="text-white text-right">
            <div className="text-sm text-gray-300">Total ({totalItems} items)</div>
            <div className="text-2xl font-bold">${totalPrice.toLocaleString()}</div>
          </div>
          <button
            onClick={clear}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 font-medium"
          >
            Clear Cart
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-black mb-2">{item.name}</h3>
                <p className="text-lg font-bold text-black">${item.price.toLocaleString()}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 bg-gray-200 text-black rounded-full hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center font-bold"
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-semibold text-black">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 bg-gray-200 text-black rounded-full hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
                
                <div className="text-right min-w-[100px]">
                  <div className="text-lg font-bold text-black">
                    ${(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
                
                <button
                  onClick={() => removeItem(item.id)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200 font-medium text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gray-100 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-black">
            Total: ${totalPrice.toLocaleString()}
          </div>
          <button
            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium text-lg"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
