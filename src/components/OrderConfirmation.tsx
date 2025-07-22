import React from 'react';
import { Order } from '../types/cart';

interface OrderConfirmationProps {
  order: Order;
  onContinueShopping: () => void;
}

export function OrderConfirmation({ order, onContinueShopping }: OrderConfirmationProps) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-12 h-12 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      
      <h2 className="text-3xl font-bold text-white mb-4">Order Confirmed!</h2>
      <p className="text-gray-300 mb-6">
        Thank you for your purchase. Your order has been received and is being processed.
      </p>
      
      <div className="bg-gray-800 p-6 rounded-lg mb-6 text-left">
        <h3 className="text-xl font-semibold text-white mb-4">Order Details</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-gray-300">
            <span>Order Number:</span>
            <span className="font-mono">{order.id}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Order Date:</span>
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Total Amount:</span>
            <span className="font-semibold">${order.total.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-4">
          <h4 className="text-lg font-semibold text-white mb-2">Shipping Address</h4>
          <p className="text-gray-300">
            {order.shippingInfo.firstName} {order.shippingInfo.lastName}<br />
            {order.shippingInfo.address}<br />
            {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}<br />
            {order.shippingInfo.country}
          </p>
        </div>
        
        <div className="border-t border-gray-700 pt-4 mt-4">
          <h4 className="text-lg font-semibold text-white mb-2">Items Ordered</h4>
          <div className="space-y-2">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between text-gray-300">
                <span>{item.name} × {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-blue-900 bg-opacity-50 p-4 rounded-lg mb-6">
        <p className="text-blue-300">
          A confirmation email has been sent to {order.shippingInfo.email}
        </p>
      </div>
      
      <button
        onClick={onContinueShopping}
        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        Continue Shopping
      </button>
    </div>
  );
}