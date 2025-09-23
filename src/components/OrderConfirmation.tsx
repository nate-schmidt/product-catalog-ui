import React from 'react';
import { formatDate } from '../utils/formatters';

interface OrderConfirmationProps {
  orderId: string;
  onContinueShopping: () => void;
}

export function OrderConfirmation({ orderId, onContinueShopping }: OrderConfirmationProps) {
  const orderDate = new Date();
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 text-center">
      {/* Success Icon */}
      <div className="mb-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      {/* Success Message */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Order Confirmed!
      </h1>
      
      <p className="text-lg text-gray-600 mb-8">
        Thank you for your purchase. Your order has been received and is being processed.
      </p>

      {/* Order Details */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Order Number:</span>
            <span className="font-medium text-gray-900">{orderId}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Order Date:</span>
            <span className="font-medium text-gray-900">{formatDate(orderDate)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="font-medium text-green-600">Processing</span>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="text-left bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">What happens next?</h3>
        
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="font-medium mr-2">1.</span>
            <span>We'll send you an email confirmation with your order details</span>
          </li>
          <li className="flex items-start">
            <span className="font-medium mr-2">2.</span>
            <span>Your order will be processed and prepared for shipping</span>
          </li>
          <li className="flex items-start">
            <span className="font-medium mr-2">3.</span>
            <span>You'll receive a shipping notification with tracking information</span>
          </li>
          <li className="flex items-start">
            <span className="font-medium mr-2">4.</span>
            <span>Your order will be delivered to your specified address</span>
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <button
          onClick={onContinueShopping}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </button>
        
        <p className="text-sm text-gray-500">
          Questions about your order? Contact us at{' '}
          <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-800">
            support@example.com
          </a>
        </p>
      </div>
    </div>
  );
}