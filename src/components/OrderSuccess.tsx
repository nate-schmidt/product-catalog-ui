import React from 'react';

interface OrderSuccessProps {
  orderId: string;
  onContinueShopping: () => void;
}

export function OrderSuccess({ orderId, onContinueShopping }: OrderSuccessProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 text-center">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600">Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Order Number</p>
          <p className="text-lg font-semibold text-gray-900">{orderId}</p>
        </div>

        <div className="space-y-4 text-sm text-gray-600 mb-8">
          <p>📧 A confirmation email has been sent to your email address.</p>
          <p>📦 You'll receive tracking information once your order ships.</p>
          <p>🚚 Estimated delivery: 3-5 business days</p>
        </div>

        <button
          onClick={onContinueShopping}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}