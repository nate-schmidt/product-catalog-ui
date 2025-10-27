import "./index.css";
import { useState } from "react";
import { ProductCatalog } from "./components/ProductCatalog";
import { ShoppingCart } from "./components/ShoppingCart";
import { CouponManager } from "./components/CouponManager";
import { CouponProvider } from "./context/CouponContext";
import { CartProvider, useCart } from "./context/CartContext";

function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-white">
              Product Store
            </h1>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductCatalog />
      </main>
      
      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <CouponManager />
    </div>
  );
}

export function App() {
  return (
    <CouponProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </CouponProvider>
  );
}

export default App;
