import { useState, useEffect } from 'react';
import "./index.css";
import { CartProvider } from './cart/CartProvider';
import { useCart } from './cart/useCart';
import { CartDrawer } from './cart/CartDrawer';
import { ProductGrid } from './components/ProductGrid';
import { Toast } from './components/Toast';
import { ProductService } from './services/ProductService';
import type { Product } from './types/catalog';

function AppContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  const { addItem, itemCount } = useCart();
  
  // Load products
  useEffect(() => {
    ProductService.listProducts()
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load products:', error);
        setLoading(false);
        setToast({ message: 'Failed to load products', type: 'error' });
      });
  }, []);
  
  const handleAddToCart = (
    productId: string,
    variantId: string | undefined,
    quantity: number,
    unitPriceCents: number
  ) => {
    addItem(productId, variantId, quantity, unitPriceCents);
    
    const product = products.find(p => p.id === productId);
    const productName = product?.title ?? 'Product';
    
    setToast({
      message: `Added ${quantity}× ${productName} to cart`,
      type: 'success',
    });
  };
  
  return (
    <div className="min-h-screen bg-[#242424] text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gray-900 border-b border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              <h1 className="text-xl font-bold">Product Catalog</h1>
            </div>
            
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Open cart with ${itemCount} items`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center font-mono">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Shop Our Collection</h2>
          <p className="text-gray-400">
            Discover amazing products at great prices
          </p>
        </div>
        
        <ProductGrid
          products={products}
          loading={loading}
          onAddToCart={handleAddToCart}
        />
      </main>
      
      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        products={products}
      />
      
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
