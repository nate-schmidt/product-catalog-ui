import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Header(): React.ReactElement {
  const { items, total } = useCart();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="bg-gray-900 text-white p-4 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          ShopEZ
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/checkout" className="relative">
            Cart
            <span className="ml-1">({count})</span>
          </Link>
          <span className="font-semibold">${total.toFixed(2)}</span>
        </nav>
      </div>
    </header>
  );
}