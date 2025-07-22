import React, { useState } from 'react';
import { ShippingInfo, PaymentInfo, CartItem } from '../types/cart';

interface CheckoutFormProps {
  cartItems: CartItem[];
  onSubmit: (shippingInfo: ShippingInfo, paymentInfo: PaymentInfo) => void;
  onCancel: () => void;
}

export function CheckoutForm({ cartItems, onSubmit, onCancel }: CheckoutFormProps) {
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
  });
  
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(shippingInfo, paymentInfo);
  };

  const updateShipping = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const updatePayment = (field: keyof PaymentInfo, value: string) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Checkout</h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-white"
        >
          Cancel
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className={`flex items-center ${step === 'shipping' ? 'text-blue-500' : 'text-green-500'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'shipping' ? 'bg-blue-500' : 'bg-green-500'} text-white`}>
            {step === 'payment' ? '✓' : '1'}
          </div>
          <span className="ml-2">Shipping</span>
        </div>
        <div className={`w-16 h-1 mx-4 ${step === 'payment' ? 'bg-blue-500' : 'bg-gray-600'}`} />
        <div className={`flex items-center ${step === 'payment' ? 'text-blue-500' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-blue-500' : 'bg-gray-600'} text-white`}>
            2
          </div>
          <span className="ml-2">Payment</span>
        </div>
      </div>

      {step === 'shipping' ? (
        <form onSubmit={handleShippingSubmit} className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Shipping Information</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">First Name</label>
              <input
                type="text"
                required
                value={shippingInfo.firstName}
                onChange={(e) => updateShipping('firstName', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Last Name</label>
              <input
                type="text"
                required
                value={shippingInfo.lastName}
                onChange={(e) => updateShipping('lastName', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm mb-2">Email</label>
            <input
              type="email"
              required
              value={shippingInfo.email}
              onChange={(e) => updateShipping('email', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm mb-2">Phone</label>
            <input
              type="tel"
              required
              value={shippingInfo.phone}
              onChange={(e) => updateShipping('phone', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm mb-2">Address</label>
            <input
              type="text"
              required
              value={shippingInfo.address}
              onChange={(e) => updateShipping('address', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">City</label>
              <input
                type="text"
                required
                value={shippingInfo.city}
                onChange={(e) => updateShipping('city', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">State</label>
              <input
                type="text"
                required
                value={shippingInfo.state}
                onChange={(e) => updateShipping('state', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Zip Code</label>
              <input
                type="text"
                required
                value={shippingInfo.zipCode}
                onChange={(e) => updateShipping('zipCode', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Continue to Payment
          </button>
        </form>
      ) : (
        <form onSubmit={handlePaymentSubmit} className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Payment Information</h3>
          
          <div className="mb-4">
            <label className="block text-gray-300 text-sm mb-2">Card Number</label>
            <input
              type="text"
              required
              placeholder="1234 5678 9012 3456"
              value={paymentInfo.cardNumber}
              onChange={(e) => updatePayment('cardNumber', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm mb-2">Cardholder Name</label>
            <input
              type="text"
              required
              value={paymentInfo.cardHolder}
              onChange={(e) => updatePayment('cardHolder', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Month</label>
              <select
                required
                value={paymentInfo.expiryMonth}
                onChange={(e) => updatePayment('expiryMonth', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">MM</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={String(i + 1).padStart(2, '0')}>
                    {String(i + 1).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Year</label>
              <select
                required
                value={paymentInfo.expiryYear}
                onChange={(e) => updatePayment('expiryYear', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">YYYY</option>
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() + i;
                  return (
                    <option key={year} value={String(year)}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">CVV</label>
              <input
                type="text"
                required
                placeholder="123"
                maxLength={4}
                value={paymentInfo.cvv}
                onChange={(e) => updatePayment('cvv', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep('shipping')}
              className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Place Order
            </button>
          </div>
        </form>
      )}
    </div>
  );
}