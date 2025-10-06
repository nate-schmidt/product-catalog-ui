import { useState } from 'react';
import "./index.css";
import { CartItem, Product } from './types';
import { products } from './data/products';
import { ProductGrid } from './components/ProductGrid';
import { Checkout } from './components/Checkout';

export function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, setView] = useState<'products' | 'checkout'>('products');

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🛍️</div>
            <h1 className="text-2xl font-bold text-white">My Shop</h1>
          </div>
          
          <nav className="flex items-center gap-6">
            <button
              onClick={() => setView('products')}
              className={`text-lg font-semibold transition-colors ${
                view === 'products'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setView('checkout')}
              className="relative"
            >
              <div className="text-3xl hover:scale-110 transition-transform">
                🛒
              </div>
              {totalItems > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center font-mono">
                  {totalItems}
                </div>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        {view === 'products' ? (
          <ProductGrid products={products} onAddToCart={addToCart} />
        ) : (
          <Checkout
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
          />
        )}
      </main>

      {/* Footer with Coupon Codes Info (only on products page) */}
      {view === 'products' && (
        <footer className="mt-16 py-8 border-t border-white/20">
          <div className="max-w-7xl mx-auto px-8 text-center">
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-3">
                💎 Special Offers
              </h3>
              <p className="text-gray-300 mb-4">
                Use these coupon codes at checkout for amazing discounts!
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="font-mono font-bold text-green-400">WELCOME10</div>
                  <div className="text-xs text-gray-400">10% off any order</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="font-mono font-bold text-green-400">SAVE20</div>
                  <div className="text-xs text-gray-400">20% off $100+</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="font-mono font-bold text-green-400">FLASH50</div>
                  <div className="text-xs text-gray-400">$50 off any order</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="font-mono font-bold text-green-400">VIP30</div>
                  <div className="text-xs text-gray-400">30% off $200+</div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
