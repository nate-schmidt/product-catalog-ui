import { useState } from "react";
import "./index.css";
import { CartProvider } from "./cart/CartContext";
import ProductCatalog from "./components/ProductCatalog";
import Cart from "./components/Cart";

type View = 'catalog' | 'cart';

export function App() {
  const [currentView, setCurrentView] = useState<View>('catalog');

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto p-8">
          {currentView === 'catalog' && (
            <ProductCatalog onNavigateToCart={() => setCurrentView('cart')} />
          )}
          {currentView === 'cart' && (
            <Cart onNavigateBack={() => setCurrentView('catalog')} />
          )}
        </div>
      </div>
    </CartProvider>
  );
}

export default App;
