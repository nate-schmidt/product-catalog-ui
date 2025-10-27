import React, { useState } from 'react';
import { CartProvider } from './contexts/CartContext';
import { Header } from './components/Header';
import { ProductCatalog } from './components/ProductCatalog';
import { CartSidebar } from './components/CartSidebar';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderConfirmation } from './components/OrderConfirmation';
import "./index.css";

type AppView = 'catalog' | 'checkout' | 'confirmation';

export function App() {
  const [currentView, setCurrentView] = useState<AppView>('catalog');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
  };

  const handleOrderComplete = (orderId: string) => {
    setCompletedOrderId(orderId);
    setCurrentView('confirmation');
  };

  const handleBackToCatalog = () => {
    setCurrentView('catalog');
    setCompletedOrderId(null);
  };

  const handleBackToCart = () => {
    setCurrentView('catalog');
    setIsCartOpen(true);
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <Header 
          onCartClick={handleCartToggle}
          onLogoClick={handleBackToCatalog}
        />

        <main>
          {currentView === 'catalog' && (
            <ProductCatalog />
          )}

          {currentView === 'checkout' && (
            <CheckoutPage
              onOrderComplete={handleOrderComplete}
              onBack={handleBackToCart}
            />
          )}

          {currentView === 'confirmation' && completedOrderId && (
            <OrderConfirmation
              orderId={completedOrderId}
              onContinueShopping={handleBackToCatalog}
            />
          )}
        </main>

        <CartSidebar
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onCheckout={handleCheckout}
        />
      </div>
    </CartProvider>
  );
}

export default App;
