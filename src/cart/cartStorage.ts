import { Cart } from './cartTypes';

export const CART_KEY = 'pcui:cart:v1';

export const readCart = (): Cart => {
  try {
    const stored = localStorage.getItem(CART_KEY);
    if (!stored) {
      return { items: [], updatedAt: Date.now() };
    }
    
    const parsed = JSON.parse(stored);
    
    // Validate the structure
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      Array.isArray(parsed.items) &&
      typeof parsed.updatedAt === 'number'
    ) {
      return parsed as Cart;
    }
    
    // If structure is invalid, return empty cart
    return { items: [], updatedAt: Date.now() };
  } catch (error) {
    console.warn('Failed to read cart from localStorage:', error);
    return { items: [], updatedAt: Date.now() };
  }
};

export const writeCart = (cart: Cart): void => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.warn('Failed to write cart to localStorage:', error);
  }
};

export const safeParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
};
