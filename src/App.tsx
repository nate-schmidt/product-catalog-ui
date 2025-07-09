import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import React from "react";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <h1 className="text-6xl font-bold text-white mb-4">Hello World! 👋</h1>
      <p className="text-2xl text-gray-300 max-w-2xl leading-relaxed">
        One day I hope to be an ecommerce website.
      </p>
    </div>
  );
}

export function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        {/* Cart overlay component */}
        <Cart />
        <div className="max-w-7xl mx-auto p-8 relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
