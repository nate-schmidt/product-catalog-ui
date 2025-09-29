import { useCart } from '../contexts/CartContext';

interface CartProps {
  onCheckout?: () => void;
}

function Cart({ onCheckout }: CartProps) {
  const { state, removeFromCart, updateQuantity, clearCart } = useCart();

  if (state.items.length === 0) {
    return (
      <section className="bg-gray-50 p-6 rounded-lg" role="region" aria-labelledby="cart-heading">
        <h2 id="cart-heading" className="text-xl font-semibold mb-4">Shopping Cart</h2>
        <p className="text-gray-600">Your cart is empty</p>
      </section>
    );
  }

  const calculateTotal = () => {
    return state.items.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', '').replace(',', ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    }
  };

  return (
    <section className="bg-gray-50 p-6 rounded-lg" role="region" aria-labelledby="cart-heading">
      <div className="flex justify-between items-center mb-4">
        <h2 id="cart-heading" className="text-xl font-semibold">Shopping Cart</h2>
        <button
          onClick={clearCart}
          className="text-sm text-red-600 hover:text-red-800 underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          type="button"
          aria-label="Clear all items from cart"
        >
          Clear Cart
        </button>
      </div>

      <ul aria-label="Items in shopping cart" className="space-y-4 mb-4">
        {state.items.map((item) => (
          <li key={item.id} className="flex justify-between items-center bg-white p-4 rounded border">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="text-sm font-medium text-gray-900">{item.price} each</p>
            </div>
            
            <div className="flex items-center gap-3 ml-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  type="button"
                  aria-label={`Decrease quantity of ${item.name}`}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                
                <span 
                  className="w-12 text-center font-medium"
                  aria-label={`Quantity: ${item.quantity}`}
                >
                  {item.quantity}
                </span>
                
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  type="button"
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  +
                </button>
              </div>
              
              <button
                onClick={() => removeFromCart(item.id)}
                className="ml-2 text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                type="button"
                aria-label={`Remove ${item.name} from cart`}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Total:</span>
          <span aria-label={`Total price: $${calculateTotal().toFixed(2)}`}>
            ${calculateTotal().toFixed(2)}
          </span>
        </div>
        
        <button
          onClick={handleCheckout}
          className="w-full mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          type="button"
          aria-label="Proceed to checkout"
        >
          Checkout
        </button>
      </div>
    </section>
  );
}

export default Cart;