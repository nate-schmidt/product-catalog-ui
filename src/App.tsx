import "./index.css";
import { useState } from 'react';
import { Checkout } from './components/Checkout';
import { CouponAdmin } from './components/CouponAdmin';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

// Sample products
const products: Product[] = [
  {
    id: '1',
    name: 'Premium Laptop',
    price: 999.99,
    description: 'High-performance laptop for professionals',
    image: '💻'
  },
  {
    id: '2',
    name: 'Wireless Headphones',
    price: 149.99,
    description: 'Noise-cancelling Bluetooth headphones',
    image: '🎧'
  },
  {
    id: '3',
    name: 'Smart Watch',
    price: 299.99,
    description: 'Fitness tracking and notifications',
    image: '⌚'
  },
  {
    id: '4',
    name: 'Portable Charger',
    price: 39.99,
    description: '20000mAh power bank',
    image: '🔋'
  }
];

export function App() {
  const [view, setView] = useState<'shop' | 'checkout' | 'admin'>('shop');
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-white">E-Commerce Store</h1>
              <div className="flex space-x-4">
                <button
                  onClick={() => setView('shop')}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    view === 'shop'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  Shop
                </button>
                <button
                  onClick={() => setView('admin')}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    view === 'admin'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>
            
            <button
              onClick={() => setView('checkout')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <span>🛒</span>
              <span>Cart ({cartItemsCount})</span>
              <span className="font-semibold">${cartTotal.toFixed(2)}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        {view === 'shop' && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Our Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
                  <div className="text-6xl mb-4 text-center">{product.image}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
                  <p className="text-gray-400 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">${product.price}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Coupon Hint */}
            <div className="mt-12 p-6 bg-blue-900/20 rounded-lg border border-blue-700">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">💡 Special Offers Available!</h3>
              <p className="text-gray-300">
                Use coupon code <code className="bg-gray-800 px-2 py-1 rounded">WELCOME20</code> for 20% off orders over $50
                or <code className="bg-gray-800 px-2 py-1 rounded ml-2">SAVE10</code> for $10 off orders over $30!
              </p>
            </div>
          </div>
        )}

        {view === 'checkout' && (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setView('shop')}
              className="mb-6 text-blue-400 hover:text-blue-300"
            >
              ← Back to Shop
            </button>
            
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-xl mb-4">Your cart is empty</p>
                <button
                  onClick={() => setView('shop')}
                  className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <Checkout cartItems={cart} />
            )}
          </div>
        )}

        {view === 'admin' && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h2>
            <CouponAdmin />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
