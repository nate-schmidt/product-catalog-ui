import { useState } from "react";
import "./index.css";
import ProductCatalog from "./components/ProductCatalog";
import Cart from "./components/Cart";
import CartToggle from "./components/CartToggle";
import { CartProvider } from "./cart/CartProvider";

export function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartProvider>
      <div className="max-w-7xl mx-auto p-8 relative z-10">
        <header className="flex justify-between items-center mb-8">
          <div></div>
          <CartToggle onClick={() => setIsCartOpen(true)} />
        </header>
        <ProductCatalog />
        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </CartProvider>
  );
}

export default App;
