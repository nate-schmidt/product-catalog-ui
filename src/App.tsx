import "./index.css";
import { CartProvider } from './context/CartContext';
import { ProductCatalog } from './components/ProductCatalog';
import { Cart } from './components/Cart';

export function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <Cart />
        <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
          <div className="flex flex-col items-center justify-center mb-12 gap-4">
            <h1 className="text-6xl font-bold text-white mb-4">
              Pirate's Treasure Emporium
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
              Ahoy! Welcome to our treasure trove where ye can find the finest pirate goods and add them to yer cart!
            </p>
          </div>
          <ProductCatalog />
        </div>
      </div>
    </CartProvider>
  );
}

export default App;
