import React from 'react';
import { useCart } from '../contexts/CartContext';
import { ShippingMethod } from '../types/checkout';
import { formatCurrency } from '../utils/formatters';

interface OrderSummaryProps {
  shippingMethod?: ShippingMethod;
  className?: string;
}

export function OrderSummary({ shippingMethod, className = '' }: OrderSummaryProps) {
  const { cart } = useCart();

  // Calculate total with selected shipping method
  const shippingCost = shippingMethod?.price || cart.shipping;
  const finalTotal = cart.subtotal - (cart.couponDiscount || 0) + cart.tax + shippingCost;

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
      
      {/* Cart Items */}
      <div className="space-y-3 mb-4">
        {cart.items.map(item => (
          <div key={item.product.id} className="flex justify-between text-sm">
            <div className="flex-1">
              <p className="text-gray-900 font-medium">{item.product.name}</p>
              <p className="text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="text-gray-900 font-medium">
              {formatCurrency(item.product.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* Order Totals */}
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal:</span>
          <span>{formatCurrency(cart.subtotal)}</span>
        </div>
        
        {cart.couponDiscount && cart.couponDiscount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount ({cart.appliedCoupon}):</span>
            <span>-{formatCurrency(cart.couponDiscount)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span>Shipping{shippingMethod ? ` (${shippingMethod.name})` : ''}:</span>
          <span>
            {shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Tax:</span>
          <span>{formatCurrency(cart.tax)}</span>
        </div>
        
        <div className="flex justify-between text-lg font-semibold border-t border-gray-300 pt-2">
          <span>Total:</span>
          <span>{formatCurrency(finalTotal)}</span>
        </div>
      </div>
      
      {/* Item Count */}
      <div className="mt-4 text-sm text-gray-500">
        {cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in your order
      </div>
    </div>
  );
}