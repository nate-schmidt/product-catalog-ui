import React, { useState } from "react";
import "./index.css";
import { CartProvider, useCart } from "./contexts/CartContext";
import { ProductList } from "./components/ProductList";
import { Cart } from "./components/Cart";

function Header() {
  const { items } = useCart();
  const itemsCount = items.reduce((sum, i) => sum + i.quantity, 0);
  return (
    <header className="bg-gray-900 text-white py-4 shadow-md">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Store</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Cart: {itemsCount}</span>
        </div>
      </div>
    </header>
  );
}

function Main() {
  const [showCart, setShowCart] = useState(false);
  const { items } = useCart();
  const itemsCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <main className="max-w-7xl mx-auto p-6">
      <div className="flex justify-end mb-4">
        <button
          className="relative bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowCart(prev => !prev)}
        >
          {showCart ? "Hide Cart" : "View Cart"}
          {itemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {itemsCount}
            </span>
          )}
        </button>
      </div>

      {showCart ? <Cart /> : <ProductList />}
    </main>
  );
}

export function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <Main />
      </div>
    </CartProvider>
  );
}

export default App;
