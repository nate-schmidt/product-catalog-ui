import { api } from './api';
import { CheckoutData, Order, ShippingMethod } from '../types/checkout';
import { Cart } from '../types/cart';

// Mock shipping methods
const mockShippingMethods: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: '5-7 business days',
    price: 10.00,
    estimatedDays: '5-7 days',
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: '2-3 business days',
    price: 25.00,
    estimatedDays: '2-3 days',
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    description: 'Next business day',
    price: 45.00,
    estimatedDays: '1 day',
  },
];

export const checkoutService = {
  async getShippingMethods(): Promise<ShippingMethod[]> {
    try {
      // In a real app: return api.get('/shipping/methods');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return mockShippingMethods;
    } catch (error) {
      console.error('Failed to fetch shipping methods:', error);
      throw error;
    }
  },

  async validateAddress(address: any): Promise<{ isValid: boolean; message: string }> {
    try {
      // In a real app: return api.post('/checkout/validate-address', address);
      
      // Simulate API delay and basic validation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const required = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode', 'country'];
      const missing = required.filter(field => !address[field]?.trim());
      
      if (missing.length > 0) {
        return {
          isValid: false,
          message: `Missing required fields: ${missing.join(', ')}`,
        };
      }
      
      // Simple zip code format validation
      const zipRegex = /^\d{5}(-\d{4})?$/;
      if (!zipRegex.test(address.zipCode)) {
        return {
          isValid: false,
          message: 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)',
        };
      }
      
      return {
        isValid: true,
        message: 'Address is valid',
      };
    } catch (error) {
      console.error('Failed to validate address:', error);
      return {
        isValid: false,
        message: 'Error validating address. Please check your information.',
      };
    }
  },

  async processPayment(paymentInfo: any, amount: number): Promise<{ success: boolean; transactionId?: string; message: string }> {
    try {
      // In a real app: return api.post('/payment/process', { paymentInfo, amount });
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock payment validation
      const cardNumber = paymentInfo.cardNumber?.replace(/\s/g, '');
      
      if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
        return {
          success: false,
          message: 'Invalid card number',
        };
      }
      
      if (!paymentInfo.cvv || paymentInfo.cvv.length < 3 || paymentInfo.cvv.length > 4) {
        return {
          success: false,
          message: 'Invalid CVV',
        };
      }
      
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const expYear = parseInt(paymentInfo.expiryYear);
      const expMonth = parseInt(paymentInfo.expiryMonth);
      
      if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        return {
          success: false,
          message: 'Card has expired',
        };
      }
      
      // Simulate successful payment
      return {
        success: true,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: 'Payment processed successfully',
      };
    } catch (error) {
      console.error('Failed to process payment:', error);
      return {
        success: false,
        message: 'Payment processing failed. Please try again.',
      };
    }
  },

  async createOrder(cart: Cart, checkoutData: CheckoutData): Promise<Order> {
    try {
      // In a real app: return api.post('/orders', { cart, checkoutData });
      
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const order: Order = {
        id: orderId,
        items: cart.items,
        shippingAddress: checkoutData.shippingAddress,
        billingAddress: checkoutData.useShippingAsBilling 
          ? checkoutData.shippingAddress 
          : checkoutData.billingAddress || checkoutData.shippingAddress,
        paymentInfo: {
          cardholderName: checkoutData.paymentInfo.cardholderName,
          expiryMonth: checkoutData.paymentInfo.expiryMonth,
          expiryYear: checkoutData.paymentInfo.expiryYear,
          billingAddress: checkoutData.paymentInfo.billingAddress,
        },
        shippingMethod: checkoutData.shippingMethod,
        subtotal: cart.subtotal,
        tax: cart.tax,
        shipping: cart.shipping,
        couponDiscount: cart.couponDiscount,
        total: cart.total,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return order;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  },

  async getOrder(orderId: string): Promise<Order | null> {
    try {
      // In a real app: return api.get(`/orders/${orderId}`);
      
      // This would normally fetch from the database
      // For now, return null since we don't have persistent storage
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return null;
    } catch (error) {
      console.error('Failed to fetch order:', error);
      throw error;
    }
  },
};