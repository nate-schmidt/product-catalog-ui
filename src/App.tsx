import "./index.css";
import { CartProvider, useCart } from "./contexts/CartContext";
import Cart from "./components/Cart";

function AddDemoProductButton() {
  const { addItem } = useCart();
  return (
    <button
      onClick={() =>
        addItem({ id: "demo", name: "Demo Product", price: 19.99 })
      }
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
    >
      Add Demo Product ($19.99)
    </button>
  );
}

export function App() {
  return (
    <CartProvider>
      <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
          <h1 className="text-6xl font-bold text-white mb-4">
            Hello World! 👋
          </h1>
          <p className="text-2xl text-gray-300 max-w-2xl leading-relaxed">
            One day I hope to be an ecommerce website.
          </p>
          <AddDemoProductButton />
        </div>
        <Cart />
      </div>
    </CartProvider>
  );
}

export default App;
