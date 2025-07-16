import "./index.css";
import { useState, useEffect } from 'react';
import { Checkout } from './components/Checkout';
import { CouponAdmin } from './components/CouponAdmin';
import { ProductAdmin } from './components/ProductAdmin';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  image: string;
  inventory: number;
  active: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface CartItem extends Product {
  quantity: number;
}

export function App() {
  const [view, setView] = useState<'shop' | 'checkout' | 'admin'>('shop');
  const [adminView, setAdminView] = useState<'products' | 'coupons'>('products');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products/shop');
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(products.map(p => p.category))];
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (product: Product) => {
    if (product.inventory <= 0) return;
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        // Check if we can add more (inventory limit)
        if (existingItem.quantity >= product.inventory) {
          alert(`Sorry, only ${product.inventory} items available in stock.`);
          return prevCart;
        }
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
      const product = products.find(p => p.id === productId);
      if (product && quantity > product.inventory) {
        alert(`Sorry, only ${product.inventory} items available in stock.`);
        return;
      }
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const cartTotal = cart.reduce((sum, item) => {
    const itemPrice = item.salePrice || item.price;
    return sum + (itemPrice * item.quantity);
  }, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-white">TechStore Pro</h1>
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
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Our Products</h2>
              
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded capitalize transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading products...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-200">
                      <div className="relative">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-64 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                          }}
                        />
                        {product.salePrice && (
                          <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-semibold">
                            Sale
                          </span>
                        )}
                        {product.inventory <= 5 && product.inventory > 0 && (
                          <span className="absolute top-2 left-2 bg-orange-600 text-white px-2 py-1 rounded text-sm">
                            Only {product.inventory} left!
                          </span>
                        )}
                        {product.inventory === 0 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="bg-red-600 text-white px-4 py-2 rounded font-semibold">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            {product.salePrice ? (
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-green-400">${product.salePrice}</span>
                                <span className="text-sm text-gray-500 line-through">${product.price}</span>
                              </div>
                            ) : (
                              <span className="text-2xl font-bold text-white">${product.price}</span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">{product.category}</span>
                        </div>
                        
                        {product.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {product.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <button
                          onClick={() => addToCart(product)}
                          disabled={product.inventory === 0}
                          className={`w-full py-2 rounded font-semibold transition-colors ${
                            product.inventory === 0
                              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {product.inventory === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-xl">No products found in this category.</p>
                  </div>
                )}
              </>
            )}
            
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
            <h2 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h2>
            
            {/* Admin Navigation */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setAdminView('products')}
                className={`px-4 py-2 rounded transition-colors ${
                  adminView === 'products'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Product Management
              </button>
              <button
                onClick={() => setAdminView('coupons')}
                className={`px-4 py-2 rounded transition-colors ${
                  adminView === 'coupons'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Coupon Management
              </button>
            </div>
            
            {adminView === 'products' ? <ProductAdmin /> : <CouponAdmin />}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
