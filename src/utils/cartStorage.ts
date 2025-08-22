import { Cart, CartItem, Product } from '../types/cart';

const CART_STORAGE_KEY = 'shopping-cart';

export const getCartFromStorage = (): Cart => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      return {
        items: parsedCart.items || [],
        total: calculateCartTotal(parsedCart.items || [])
      };
    }
  } catch (error) {
    console.error('Error reading cart from storage:', error);
  }
  
  return { items: [], total: 0 };
};

export const saveCartToStorage = (cart: Cart): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

export const addItemToCart = (product: Product, quantity: number = 1): Cart => {
  const currentCart = getCartFromStorage();
  const existingItemIndex = currentCart.items.findIndex(
    item => item.product.id === product.id
  );

  let updatedItems: CartItem[];
  
  if (existingItemIndex >= 0) {
    // Update quantity of existing item
    updatedItems = currentCart.items.map((item, index) => 
      index === existingItemIndex 
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  } else {
    // Add new item
    updatedItems = [...currentCart.items, { product, quantity }];
  }

  const updatedCart: Cart = {
    items: updatedItems,
    total: calculateCartTotal(updatedItems)
  };

  saveCartToStorage(updatedCart);
  return updatedCart;
};

export const removeItemFromCart = (productId: string): Cart => {
  const currentCart = getCartFromStorage();
  const updatedItems = currentCart.items.filter(
    item => item.product.id !== productId
  );

  const updatedCart: Cart = {
    items: updatedItems,
    total: calculateCartTotal(updatedItems)
  };

  saveCartToStorage(updatedCart);
  return updatedCart;
};

export const updateItemQuantity = (productId: string, quantity: number): Cart => {
  const currentCart = getCartFromStorage();
  
  if (quantity <= 0) {
    return removeItemFromCart(productId);
  }

  const updatedItems = currentCart.items.map(item =>
    item.product.id === productId
      ? { ...item, quantity }
      : item
  );

  const updatedCart: Cart = {
    items: updatedItems,
    total: calculateCartTotal(updatedItems)
  };

  saveCartToStorage(updatedCart);
  return updatedCart;
};

export const clearCart = (): Cart => {
  const emptyCart: Cart = { items: [], total: 0 };
  saveCartToStorage(emptyCart);
  return emptyCart;
};

const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};