import "./index.css";
import { useState } from "react";
import { CartProvider } from "./contexts/CartContext";
import Header from "./components/Header";
import ProductCatalog from "./components/ProductCatalog";
import Cart from "./components/Cart";

export function App() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-base">
        <Header onCartClick={() => setCartOpen(true)} />
        <main className="flex-1">
          <ProductCatalog />
        </main>
        <Cart open={cartOpen} onClose={() => setCartOpen(false)} />
      </div>
    </CartProvider>
  );
}

export default App;
