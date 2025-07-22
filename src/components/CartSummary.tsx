import React from 'react';
import { CartItem } from '../types/cart';

interface CartSummaryProps {
  items: CartItem[];
  subtotal: number;
  onCheckout?: () => void;
}

export function CartSummary({ items, subtotal, onCheckout }: CartSummaryProps) {
  const taxRate = 0.08; // 8% tax
  const shippingCost = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const tax = subtotal * taxRate;
  const total = subtotal + tax + shippingCost;

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-gray-300">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Shipping</span>
          <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
        </div>
        {shippingCost > 0 && (
          <p className="text-sm text-gray-400">
            Add ${(50 - subtotal).toFixed(2)} more for free shipping!
          </p>
        )}
      </div>
      
      <div className="border-t border-gray-700 pt-4 mb-6">
        <div className="flex justify-between text-white font-bold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      
      <button
        onClick={onCheckout}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}