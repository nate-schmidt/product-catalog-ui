import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { ShippingForm } from './ShippingForm';
import { PaymentForm } from './PaymentForm';
import { ShippingMethodSelector } from './ShippingMethodSelector';
import { OrderSummary } from './OrderSummary';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { checkoutService } from '../services/checkoutService';
import { ShippingAddress, PaymentInfo, ShippingMethod, CheckoutData } from '../types/checkout';

interface CheckoutPageProps {
  onOrderComplete: (orderId: string) => void;
  onBack: () => void;
}

export function CheckoutPage({ onOrderComplete, onBack }: CheckoutPageProps) {
  const { cart, clearCart } = useCart();
  
  // Form data state
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod | null>(null);
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);
  
  // Validation state
  const [isShippingValid, setIsShippingValid] = useState(false);
  const [isPaymentValid, setIsPaymentValid] = useState(false);
  
  // UI state
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { number: 1, title: 'Shipping', isValid: isShippingValid },
    { number: 2, title: 'Payment', isValid: isPaymentValid },
    { number: 3, title: 'Review', isValid: true },
  ];

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return isShippingValid && shippingMethod;
      case 2:
        return isPaymentValid;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedToNext() && currentStep < 3) {
      setCurrentStep(prev => prev + 1);
      setError(null);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setError(null);
    } else {
      onBack();
    }
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress || !paymentInfo || !shippingMethod) {
      setError('Please complete all required information.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Validate address
      const addressValidation = await checkoutService.validateAddress(shippingAddress);
      if (!addressValidation.isValid) {
        throw new Error(addressValidation.message);
      }

      // Process payment
      const paymentResult = await checkoutService.processPayment(paymentInfo, cart.total);
      if (!paymentResult.success) {
        throw new Error(paymentResult.message);
      }

      // Create order
      const checkoutData: CheckoutData = {
        shippingAddress,
        billingAddress: useShippingAsBilling ? shippingAddress : paymentInfo.billingAddress,
        paymentInfo,
        useShippingAsBilling,
        shippingMethod,
        couponCode: cart.appliedCoupon,
      };

      const order = await checkoutService.createOrder(cart, checkoutData);
      
      // Clear cart and redirect
      clearCart();
      onOrderComplete(order.id);

    } catch (error) {
      console.error('Checkout error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
        <button
          onClick={onBack}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>
        
        {/* Progress Steps */}
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className={`flex items-center ${
                currentStep >= step.number
                  ? 'text-blue-600'
                  : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.number
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.number}
                </div>
                <span className="ml-2 font-medium">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 ${
                  currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {error && (
        <ErrorMessage 
          message={error}
          className="mb-6"
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {currentStep === 1 && (
            <div className="space-y-8">
              <ShippingForm
                onDataChange={setShippingAddress}
                onValidationChange={setIsShippingValid}
              />
              
              {isShippingValid && (
                <ShippingMethodSelector
                  onMethodChange={setShippingMethod}
                  selectedMethod={shippingMethod || undefined}
                />
              )}
            </div>
          )}

          {currentStep === 2 && shippingAddress && (
            <PaymentForm
              shippingAddress={shippingAddress}
              useShippingAsBilling={useShippingAsBilling}
              onDataChange={setPaymentInfo}
              onValidationChange={setIsPaymentValid}
              onBillingToggle={setUseShippingAsBilling}
            />
          )}

          {currentStep === 3 && shippingAddress && paymentInfo && shippingMethod && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Review Your Order</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h3>
                    <p className="text-sm text-gray-600">
                      {shippingAddress.firstName} {shippingAddress.lastName}<br />
                      {shippingAddress.address}<br />
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping Method</h3>
                    <p className="text-sm text-gray-600">
                      {shippingMethod.name} - {shippingMethod.estimatedDays}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Payment</h3>
                    <p className="text-sm text-gray-600">
                      **** **** **** {paymentInfo.cardNumber.slice(-4)}<br />
                      {paymentInfo.cardholderName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={isProcessing}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {currentStep === 1 ? 'Back to Cart' : 'Back'}
            </button>

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                disabled={!canProceedToNext() || isProcessing}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Processing...</span>
                  </div>
                ) : (
                  'Place Order'
                )}
              </button>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <OrderSummary shippingMethod={shippingMethod || undefined} />
        </div>
      </div>
    </div>
  );
}