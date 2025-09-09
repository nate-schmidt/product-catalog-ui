import React, { useState } from "react";
import "./index.css";
import { CartProvider } from "./CartContext";
import { Header } from "./components/Header";
import { ProductCatalog } from "./components/ProductCatalog";
import { ShoppingCart } from "./components/ShoppingCart";
import { Checkout } from "./components/Checkout";
import { OrderSuccess } from "./components/OrderSuccess";

type ViewType = 'products' | 'cart' | 'checkout' | 'success';

export function App() {
  const [currentView, setCurrentView] = useState<ViewType>('products');
  const [orderId, setOrderId] = useState<string>('');

  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
  };

  const handleCheckout = () => {
    setCurrentView('checkout');
  };

  const handleOrderComplete = (newOrderId: string) => {
    setOrderId(newOrderId);
    setCurrentView('success');
  };

  const handleContinueShopping = () => {
    setCurrentView('products');
  };

  const handleBackToCart = () => {
    setCurrentView('cart');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'products':
        return <ProductCatalog />;
      case 'cart':
        return <ShoppingCart onCheckout={handleCheckout} />;
      case 'checkout':
        return <Checkout onOrderComplete={handleOrderComplete} onBack={handleBackToCart} />;
      case 'success':
        return <OrderSuccess orderId={orderId} onContinueShopping={handleContinueShopping} />;
      default:
        return <ProductCatalog />;
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <Header currentView={currentView} onNavigate={handleNavigate} />
        <main className="pb-8">
          {renderCurrentView()}
        </main>
      </div>
    </CartProvider>
  );
}

export default App;
