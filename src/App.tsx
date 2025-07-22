import "./index.css";
import React, { useState } from 'react';
import { CartProvider, useCartContext } from './contexts/CartContext';
import { ProductCatalog } from './components/ProductCatalog';
import { CartIcon } from './components/CartIcon';
import { CartItem } from './components/CartItem';
import { CartSummary } from './components/CartSummary';
import { CheckoutForm } from './components/CheckoutForm';
import { OrderConfirmation } from './components/OrderConfirmation';
import { useOrders } from './hooks/useOrders';
import { Product, Order } from './types/cart';

// Sample products - in a real app, these would come from an API
const products: Product[] = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 79.99,
    description: "Premium quality wireless headphones with noise cancellation",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    category: "Electronics",
    rating: 4.5
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 249.99,
    description: "Track your fitness and stay connected",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    category: "Electronics",
    rating: 4.3
  },
  {
    id: 3,
    name: "Premium Coffee Maker",
    price: 159.99,
    description: "Brew perfect coffee every morning",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop",
    category: "Appliances",
    rating: 4.6
  },
  {
    id: 4,
    name: "Yoga Mat",
    price: 29.99,
    description: "Non-slip exercise mat for yoga and workouts",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop",
    category: "Fitness",
    rating: 4.4
  },
  {
    id: 5,
    name: "Backpack",
    price: 49.99,
    description: "Durable and stylish backpack for everyday use",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
    category: "Accessories",
    rating: 4.2
  },
  {
    id: 6,
    name: "Desk Lamp",
    price: 39.99,
    description: "LED desk lamp with adjustable brightness",
    image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=500&h=500&fit=crop",
    category: "Home Office",
    rating: 4.7
  }
];

function AppContent() {
  const [view, setView] = useState<'catalog' | 'cart' | 'checkout' | 'confirmation'>('catalog');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCartContext();
  const { createOrder } = useOrders();

  const handleCheckout = () => {
    setView('checkout');
  };

  const handleOrderSubmit = (shippingInfo: any, paymentInfo: any) => {
    const order = createOrder(cart, shippingInfo, paymentInfo);
    setCurrentOrder(order);
    clearCart();
    setView('confirmation');
  };

  const handleContinueShopping = () => {
    setView('catalog');
    setCurrentOrder(null);
  };

  const handleCancelCheckout = () => {
    setView('cart');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 
            className="text-2xl font-bold text-white cursor-pointer"
            onClick={() => setView('catalog')}
          >
            E-Commerce Store
          </h1>
          <div className="flex items-center gap-4">
            {view !== 'checkout' && view !== 'confirmation' && (
              <div 
                onClick={() => setView(view === 'cart' ? 'catalog' : 'cart')}
                className="cursor-pointer"
              >
                <CartIcon itemCount={totalItems} />
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {view === 'catalog' && (
          <>
            <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
            <ProductCatalog products={products} onAddToCart={addToCart} />
          </>
        )}

        {view === 'cart' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-8">Shopping Cart</h2>
              {cart.length === 0 ? (
                <div className="bg-gray-800 p-8 rounded-lg text-center">
                  <p className="text-gray-400 mb-4">Your cart is empty</p>
                  <button
                    onClick={() => setView('catalog')}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>
              )}
            </div>
            <div>
              <CartSummary
                items={cart}
                subtotal={totalPrice}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        )}

        {view === 'checkout' && (
          <CheckoutForm
            cartItems={cart}
            onSubmit={handleOrderSubmit}
            onCancel={handleCancelCheckout}
          />
        )}

        {view === 'confirmation' && currentOrder && (
          <OrderConfirmation
            order={currentOrder}
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
