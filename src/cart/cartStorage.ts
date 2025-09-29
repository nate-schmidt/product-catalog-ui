import { Cart, CartItem } from './cartTypes';

const CART_STORAGE_KEY = 'ecommerce_cart';

export const cartStorage = {
  save: (cart: Cart): void => {
    try {
      // Convert dates to ISO strings for storage
      const serializedCart = {
        ...cart,
        items: cart.items.map(item => ({
          ...item,
          addedAt: item.addedAt.toISOString()
        }))
      };
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(serializedCart));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  },

  load: (): Cart => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (!stored) {
        return { items: [], totalItems: 0, totalPrice: 0 };
      }

      const parsed = JSON.parse(stored);
      
      // Convert ISO strings back to Date objects
      const cart: Cart = {
        ...parsed,
        items: parsed.items.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }))
      };

      return cart;
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      return { items: [], totalItems: 0, totalPrice: 0 };
    }
  },

  clear: (): void => {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear cart from localStorage:', error);
    }
  },

  calculateTotals: (items: CartItem[]): { totalItems: number; totalPrice: number } => {
    return items.reduce(
      (totals, item) => ({
        totalItems: totals.totalItems + item.quantity,
        totalPrice: totals.totalPrice + (item.product.price * item.quantity)
      }),
      { totalItems: 0, totalPrice: 0 }
    );
  }
};