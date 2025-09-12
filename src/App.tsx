import { useState } from 'react';
import "./index.css";
import { CartProvider, useCart } from './contexts/CartContext';
import ProductCatalog from './components/ProductCatalog';
import Cart from './components/Cart';
import CheckoutForm from './components/CheckoutForm';
import OrderConfirmation from './components/OrderConfirmation';
import { OrderData } from './types/Product';

type AppView = 'catalog' | 'checkout' | 'confirmation';

function AppContent() {
  const [currentView, setCurrentView] = useState<AppView>('catalog');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const { clearCart } = useCart();

  const generateOrderNumber = () => {
    return 'ORD-' + Date.now().toString(36).toUpperCase();
  };

  const handleCheckout = () => {
    setCurrentView('checkout');
  };

  const handleOrderComplete = (data: OrderData) => {
    setOrderData(data);
    setOrderNumber(generateOrderNumber());
    clearCart(); // Clear the cart after successful order
    setCurrentView('confirmation');
  };

  const handleContinueShopping = () => {
    setCurrentView('catalog');
    setOrderData(null);
    setOrderNumber('');
  };

  const handleBackToCart = () => {
    setCurrentView('catalog');
  };

  return (
    <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Furniture Store</h1>
              </div>
              
              {currentView === 'catalog' && (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Welcome to our store!</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {currentView === 'catalog' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ProductCatalog />
              </div>
              <div className="lg:col-span-1">
                <Cart onCheckout={handleCheckout} />
              </div>
            </div>
          )}

          {currentView === 'checkout' && (
            <CheckoutForm 
              onOrderComplete={handleOrderComplete}
              onBack={handleBackToCart}
            />
          )}

          {currentView === 'confirmation' && orderData && (
            <OrderConfirmation 
              orderData={orderData}
              orderNumber={orderNumber}
              onContinueShopping={handleContinueShopping}
            />
          )}
        </main>
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
