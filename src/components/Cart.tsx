import React from 'react';
import { useCart } from '../cart/CartContext';
import Card from './Card';

interface CartProps {
  onNavigateBack?: () => void;
}

function Cart({ onNavigateBack }: CartProps) {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  const { items, totalItems, totalPrice } = cart;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            {onNavigateBack && (
              <button
                onClick={onNavigateBack}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            )}
            <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
          </div>
          
          <div className="text-center py-12">
            <svg className="w-24 h-24 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6.5-5v5a2 2 0 11-4 0v-5m4 0V8a2 2 0 00-2-2H9a2 2 0 00-2 2v5" />
            </svg>
            <h2 className="text-2xl text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Add some items to get started!</p>
            {onNavigateBack && (
              <button
                onClick={onNavigateBack}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Continue Shopping
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {onNavigateBack && (
              <button
                onClick={onNavigateBack}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            )}
            <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
            <span className="text-gray-400">({totalItems} item{totalItems > 1 ? 's' : ''})</span>
          </div>
          
          <button
            onClick={handleClearCart}
            className="px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.product.id}>
                <Card.Content>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-black mb-2">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-600 mb-2">{item.product.description}</p>
                      <div className="text-sm text-gray-500 space-y-1">
                        {item.product.material && <p>Material: {item.product.material}</p>}
                        {item.product.color && <p>Color: {item.product.color}</p>}
                        {item.product.dimensions && (
                          <p>
                            Dimensions: {item.product.dimensions.width} x {item.product.dimensions.height} x {item.product.dimensions.depth} {item.product.dimensions.unit || 'cm'}
                          </p>
                        )}
                        <p>Added: {item.addedAt.toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3 min-w-0 sm:min-w-[150px]">
                      <p className="text-xl font-bold text-black">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${item.product.price.toLocaleString()} each
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 rounded-full bg-gray-200 text-black hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 flex items-center justify-center transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 text-black hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                          +
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveItem(item.product.id)}
                        className="text-red-600 hover:text-red-700 text-sm transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <Card.Header>
                <h2 className="text-xl font-semibold text-black">Order Summary</h2>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} item{totalItems > 1 ? 's' : ''})</span>
                    <span>${totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${Math.round(totalPrice * 0.1).toLocaleString()}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold text-black">
                    <span>Total</span>
                    <span>${Math.round(totalPrice * 1.1).toLocaleString()}</span>
                  </div>
                </div>
              </Card.Content>
              <Card.Footer>
                <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium">
                  Proceed to Checkout
                </button>
              </Card.Footer>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;