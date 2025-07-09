import "./index.css";
import { useCart, Product } from "./hooks/useCart";

const products: Product[] = [
  { id: 1, name: "T-Shirt", price: 19.99 },
  { id: 2, name: "Cap", price: 9.99 },
  { id: 3, name: "Hoodie", price: 39.99 },
];

export function App() {
  const { cart, addToCart, totalItems } = useCart();

  return (
    <div className="max-w-5xl mx-auto p-8 text-center">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">Product Catalog</h1>
        <div className="text-white text-lg">🛒 Cart ({totalItems})</div>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {products.map(product => (
          <div
            key={product.id}
            className="border border-gray-700 rounded-lg p-6 flex flex-col items-center gap-4 bg-gray-800"
          >
            <h2 className="text-xl font-semibold text-white">{product.name}</h2>
            <p className="text-gray-300">${product.price.toFixed(2)}</p>
            <button
              onClick={() => addToCart(product)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <section className="mt-12 text-left">
          <h2 className="text-2xl text-white font-bold mb-4">Cart Items</h2>
          <ul className="space-y-2">
            {cart.map(item => (
              <li
                key={item.id}
                className="flex justify-between bg-gray-800 p-4 rounded"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default App;
