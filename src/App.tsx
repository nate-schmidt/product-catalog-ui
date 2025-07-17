import React, { useState, useEffect } from 'react';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { CouponList } from './components/CouponList';
import { productAPI, cartAPI, couponAPI, orderAPI, getSessionId } from './api/client';
import type { Product, CartSummary, Coupon } from './types';
import "./index.css";

export function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const sessionId = getSessionId();

  // Load initial data
  useEffect(() => {
    loadProducts();
    loadCart();
    loadCoupons();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productAPI.getAll();
      setProducts(data);
    } catch (error) {
      showNotification('Failed to load products', 'error');
    }
  };

  const loadCart = async (couponCode?: string | null) => {
    try {
      const summary = await cartAPI.getSummary(sessionId, couponCode || appliedCouponCode || undefined);
      setCartSummary(summary);
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const loadCoupons = async () => {
    try {
      const data = await couponAPI.getAll();
      setCoupons(data);
    } catch (error) {
      console.error('Failed to load coupons:', error);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddToCart = async (productId: number) => {
    setIsLoading(true);
    try {
      await cartAPI.addItem(productId, 1);
      await loadCart();
      showNotification('Added to cart!', 'success');
    } catch (error) {
      showNotification('Failed to add to cart', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (cartItemId: number, quantity: number) => {
    setIsLoading(true);
    try {
      await cartAPI.updateItem(cartItemId, quantity);
      await loadCart();
    } catch (error) {
      showNotification('Failed to update quantity', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    setIsLoading(true);
    try {
      await cartAPI.removeItem(cartItemId);
      await loadCart();
      showNotification('Item removed from cart', 'success');
    } catch (error) {
      showNotification('Failed to remove item', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyCoupon = async (code: string) => {
    setAppliedCouponCode(code);
    await loadCart(code);
  };

  const handleRemoveCoupon = async () => {
    setAppliedCouponCode(null);
    await loadCart(null);
  };

  const handleCheckout = async () => {
    if (!cartSummary || cartSummary.items.length === 0) return;

    setIsLoading(true);
    try {
      const order = await orderAPI.create({
        session_id: sessionId,
        subtotal: cartSummary.subtotal,
        discount_amount: cartSummary.discount_amount,
        total: cartSummary.total,
        coupon_code: appliedCouponCode || undefined,
        items: cartSummary.items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product.price,
        })),
      });

      showNotification(`Order #${order.id} placed successfully!`, 'success');
      setAppliedCouponCode(null);
      await loadCart();
      await loadProducts(); // Reload to update stock
    } catch (error) {
      showNotification('Failed to place order', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    showNotification(`Coupon code ${code} copied to clipboard!`, 'success');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartSummary && cartSummary.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartSummary.items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-20 right-4 z-20 px-4 py-2 rounded-md shadow-lg ${
          notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {/* Coupons List */}
            <CouponList
              coupons={coupons}
              onCopyCode={handleCopyCode}
            />
          </div>

          {/* Sidebar - Cart */}
          <div className={`lg:block ${showCart ? 'block' : 'hidden'}`}>
            <div className="sticky top-24">
              <Cart
                cartSummary={cartSummary}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={handleRemoveCoupon}
                onCheckout={handleCheckout}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
