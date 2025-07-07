import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";

function Checkout() {
  const { state, updateQuantity, removeFromCart, getTotalPrice } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
        <h2 className="text-2xl font-semibold">Your cart is empty.</h2>
        <Link to="/" className="text-blue-600 underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    alert("Order placed! (stub)");
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="space-y-4">
        {state.items.map(item => (
          <div key={item.product.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div>
              <h2 className="font-medium text-gray-900">{item.product.name}</h2>
              <p className="text-sm text-gray-600">{item.product.manufacturer}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
              >
                -
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
              >
                +
              </button>
              <button
                onClick={() => removeFromCart(item.product.id)}
                className="text-red-500 hover:text-red-700 ml-4"
              >
                Remove
              </button>
            </div>
            <p className="text-lg font-semibold text-green-600 ml-4">${item.product.price}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8 border-t pt-4">
        <span className="text-xl font-semibold">Total:</span>
        <span className="text-2xl font-bold text-green-600">${getTotalPrice()}</span>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Place Order
      </button>
    </div>
  );
}

export default Checkout;