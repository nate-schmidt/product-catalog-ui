import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Order, CartItem, ShippingInfo, PaymentInfo } from '../types/cart';

export function useOrders() {
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', []);

  const createOrder = useCallback(
    (items: CartItem[], shippingInfo: ShippingInfo, paymentInfo: PaymentInfo) => {
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const taxRate = 0.08;
      const tax = subtotal * taxRate;
      const shipping = subtotal > 50 ? 0 : 9.99;
      const total = subtotal + tax + shipping;

      const newOrder: Order = {
        id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase(),
        items,
        shippingInfo,
        paymentInfo: {
          ...paymentInfo,
          cardNumber: `****${paymentInfo.cardNumber.slice(-4)}`, // Mask card number
        },
        subtotal,
        tax,
        shipping,
        total,
        status: 'pending',
        createdAt: new Date(),
      };

      setOrders(prev => [newOrder, ...prev]);
      return newOrder;
    },
    [setOrders]
  );

  const getOrder = useCallback(
    (orderId: string) => {
      return orders.find(order => order.id === orderId);
    },
    [orders]
  );

  return {
    orders,
    createOrder,
    getOrder,
  } as const;
}