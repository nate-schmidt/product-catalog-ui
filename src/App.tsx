import React, { useState } from 'react';
import "./index.css";
import { CartProvider, useCart } from './CartContext';
import { ProductCatalog } from './components/ProductCatalog';
import { CartDisplay } from './components/CartDisplay';

const CartIcon: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <button 
      onClick={onClick}
      className="fixed top-8 right-8 bg-white text-blue-500 p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
};

const AppContent: React.FC = () => {
  const [showCart, setShowCart] = useState(false);
  
  return (
    <>
      <CartIcon onClick={() => setShowCart(!showCart)} />
      
      <div className="max-w-7xl mx-auto p-8 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Furniture Store
          </h1>
          <p className="text-xl text-gray-300">
            Beautiful furniture with amazing discounts!
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={`${showCart ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <ProductCatalog />
          </div>
          
          {showCart && (
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <CartDisplay />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
