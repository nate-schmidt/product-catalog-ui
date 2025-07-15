import "./index.css";
import { useState } from "react";
import { CartProvider } from "./CartContext";
import { ProductCatalog } from "./components/ProductCatalog";
import { CartDisplay } from "./components/CartDisplay";

export function App() {
  const [showCart, setShowCart] = useState(false);

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Furniture Store</h1>
              <button
                onClick={() => setShowCart(!showCart)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                {showCart ? 'View Products' : 'View Cart'}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {showCart ? <CartDisplay /> : <ProductCatalog />}
          
          {/* Display available coupon codes for testing */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Available Coupon Codes (for testing):</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>SAVE10</strong> - 10% off (min. $50)</li>
              <li>• <strong>WELCOME20</strong> - 20% off (min. $100)</li>
              <li>• <strong>FLAT50</strong> - $50 off (min. $200)</li>
              <li>• <strong>FREESHIP</strong> - $15 off</li>
              <li>• <strong>SUMMER25</strong> - 25% off (min. $150)</li>
            </ul>
          </div>
        </main>
      </div>
    </CartProvider>
  );
}

export default App;
