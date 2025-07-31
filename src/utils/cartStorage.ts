import { Cart, CartItem } from '../types';
import { validateCartItem } from './validation';

const CART_STORAGE_KEY = 'ecommerce_cart';

export const saveCartToStorage = (cart: Cart): void => {
  try {
    const cartData = {
      items: cart.items,
      timestamp: Date.now(),
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
  } catch (error) {
    console.warn('Failed to save cart to localStorage:', error);
  }
};

export const loadCartFromStorage = (): Cart => {
  try {
    const storedData = localStorage.getItem(CART_STORAGE_KEY);
    if (!storedData) {
      return createEmptyCart();
    }

    const parsedData = JSON.parse(storedData);
    
    // Check if cart data is stale (older than 7 days)
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    if (parsedData.timestamp && Date.now() - parsedData.timestamp > maxAge) {
      clearCartFromStorage();
      return createEmptyCart();
    }

    const items = parsedData.items || [];
    const validItems = items.filter(validateCartItem);

    return calculateCartTotals(validItems);
  } catch (error) {
    console.warn('Failed to load cart from localStorage:', error);
    return createEmptyCart();
  }
};

export const clearCartFromStorage = (): void => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear cart from localStorage:', error);
  }
};

export const createEmptyCart = (): Cart => ({
  items: [],
  total: 0,
  itemCount: 0,
});

export const calculateCartTotals = (items: CartItem[]): Cart => {
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    total,
    itemCount,
  };
};

export const addItemToCart = (cart: Cart, productId: string, product: any, quantity: number = 1): Cart => {
  const existingItemIndex = cart.items.findIndex(item => item.product.id === productId);
  
  if (existingItemIndex >= 0) {
    const updatedItems = [...cart.items];
    updatedItems[existingItemIndex] = {
      ...updatedItems[existingItemIndex],
      quantity: updatedItems[existingItemIndex].quantity + quantity,
    };
    return calculateCartTotals(updatedItems);
  } else {
    const newItem: CartItem = {
      id: `${productId}-${Date.now()}`,
      product,
      quantity,
    };
    return calculateCartTotals([...cart.items, newItem]);
  }
};

export const removeItemFromCart = (cart: Cart, productId: string): Cart => {
  const updatedItems = cart.items.filter(item => item.product.id !== productId);
  return calculateCartTotals(updatedItems);
};

export const updateItemQuantity = (cart: Cart, productId: string, quantity: number): Cart => {
  if (quantity <= 0) {
    return removeItemFromCart(cart, productId);
  }

  const updatedItems = cart.items.map(item =>
    item.product.id === productId
      ? { ...item, quantity }
      : item
  );
  return calculateCartTotals(updatedItems);
};