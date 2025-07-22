import React, { useState } from 'react';
import "./index.css";
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { ProductCatalog } from './components/ProductCatalog';
import { Cart } from './components/Cart';
import { sampleProducts } from './data/products';

export function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <Header onCartClick={handleCartClick} />
        
        <main>
          <ProductCatalog products={sampleProducts} />
        </main>

        <Cart isOpen={isCartOpen} onClose={handleCloseCart} />

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-300">
              © 2024 ShopHub. Built with React, Bun, and Tailwind CSS.
            </p>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}

export default App;
