import "./index.css";
import { useState } from "react";
import ProductCatalog from "./components/ProductCatalog";
import Cart from "./components/Cart";
import { CartProvider } from "./cart/CartContext";

type View = "catalog" | "cart";

export function App() {
  const [currentView, setCurrentView] = useState<View>("catalog");

  return (
    <CartProvider>
      <div className="max-w-7xl mx-auto p-8">
        <nav className="mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentView("catalog")}
              className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                currentView === "catalog"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setCurrentView("cart")}
              className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                currentView === "cart"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
            >
              Cart
            </button>
          </div>
        </nav>
        
        <h1 className="text-white text-4xl font-bold mb-4">Hello World! 🎯</h1>
        <p className="text-gray-300 text-lg mb-8">One day I hope to be an ecommerce website.</p>
        
        {currentView === "catalog" ? (
          <ProductCatalog onNavigateToCart={() => setCurrentView("cart")} />
        ) : (
          <Cart />
        )}
      </div>
    </CartProvider>
  );
}

export default App;
