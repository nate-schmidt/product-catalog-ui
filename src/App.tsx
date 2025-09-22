import "./index.css";
import { useCart, Product } from "./contexts/CartContext";

// Sample products data
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 99.99,
    description: "High-quality wireless headphones with noise cancellation",
    image: "🎧"
  },
  {
    id: "2", 
    name: "Smart Watch",
    price: 249.99,
    description: "Feature-rich smartwatch with health monitoring",
    image: "⌚"
  },
  {
    id: "3",
    name: "Laptop Stand",
    price: 49.99,
    description: "Ergonomic laptop stand for better posture",
    image: "💻"
  },
  {
    id: "4",
    name: "Bluetooth Speaker",
    price: 79.99,
    description: "Portable speaker with excellent sound quality",
    image: "🔊"
  }
];

function ProductCard({ product }: { product: Product }) {
  const { addItem, getItemQuantity, updateQuantity, isItemInCart } = useCart();
  const quantity = getItemQuantity(product.id);
  const inCart = isItemInCart(product.id);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4 text-center">{product.image}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
      <p className="text-gray-600 text-sm mb-4">{product.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-green-600">${product.price}</span>
        <div className="flex items-center gap-2">
          {inCart ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              >
                -
              </button>
              <span className="font-semibold text-gray-800 min-w-[2ch] text-center">{quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => addItem(product)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CartSummary() {
  const { state, clearCart } = useCart();

  if (state.totalItems === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Cart</h2>
        <p className="text-gray-600">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Cart Summary</h2>
      <div className="space-y-2 mb-4">
        {state.items.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <span className="text-gray-700">{item.name} x {item.quantity}</span>
            <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total Items: {state.totalItems}</span>
          <span className="text-2xl font-bold text-green-600">${state.totalPrice.toFixed(2)}</span>
        </div>
        <button
          onClick={clearCart}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}

export function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          Product Catalog
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sampleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
          
          {/* Cart Section */}
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
