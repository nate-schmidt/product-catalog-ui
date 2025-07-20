import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, CartState } from '../types/product';

interface CartContextType {
  cart: CartState;
  addToCart: (product: Product, quantity: number, variants?: { [key: string]: string }) => void;
  removeFromCart: (productId: string, variants?: { [key: string]: string }) => void;
  updateQuantity: (productId: string, quantity: number, variants?: { [key: string]: string }) => void;
  clearCart: () => void;
  isInCart: (productId: string, variants?: { [key: string]: string }) => boolean;
  getCartItem: (productId: string, variants?: { [key: string]: string }) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'shopping_cart';
const CART_EXPIRY_DAYS = 30;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartState>({
    items: [],
    total: 0,
    itemCount: 0,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          // Check if cart is expired (30 days)
          const expiryDate = new Date(parsedCart.lastUpdated);
          expiryDate.setDate(expiryDate.getDate() + CART_EXPIRY_DAYS);
          
          if (new Date() < expiryDate) {
            setCart(parsedCart.cart);
          } else {
            localStorage.removeItem(CART_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.items.length > 0) {
      const cartData = {
        cart,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [cart]);

  // Helper function to generate a unique key for cart items with variants
  const getItemKey = (productId: string, variants?: { [key: string]: string }): string => {
    if (!variants || Object.keys(variants).length === 0) {
      return productId;
    }
    const variantString = Object.entries(variants)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}:${value}`)
      .join(',');
    return `${productId}-${variantString}`;
  };

  // Calculate cart totals
  const calculateTotals = (items: CartItem[]): { total: number; itemCount: number } => {
    const total = items.reduce((sum, item) => {
      let itemPrice = item.product.price;
      
      // Apply variant price modifiers if any
      if (item.selectedVariants && item.product.variants) {
        Object.entries(item.selectedVariants).forEach(([variantType, variantValue]) => {
          const variant = item.product.variants?.[variantType]?.find(v => v.value === variantValue);
          if (variant?.priceModifier) {
            itemPrice += variant.priceModifier;
          }
        });
      }
      
      return sum + (itemPrice * item.quantity);
    }, 0);

    const itemCount = items.reduce((count, item) => count + item.quantity, 0);

    return { total, itemCount };
  };

  // Add to cart with visual feedback
  const addToCart = useCallback((product: Product, quantity: number, variants?: { [key: string]: string }) => {
    // Validate stock
    if (product.stock < quantity) {
      // You might want to show a toast notification here
      console.error('Insufficient stock');
      return;
    }

    // Maximum quantity validation (e.g., max 10 per item)
    const MAX_QUANTITY = 10;
    const existingItem = cart.items.find(item => 
      item.product.id === product.id && 
      JSON.stringify(item.selectedVariants || {}) === JSON.stringify(variants || {})
    );

    if (existingItem && existingItem.quantity + quantity > MAX_QUANTITY) {
      console.error(`Maximum quantity of ${MAX_QUANTITY} exceeded`);
      return;
    }

    setCart(prevCart => {
      const newItems = [...prevCart.items];
      const itemIndex = newItems.findIndex(item => 
        item.product.id === product.id && 
        JSON.stringify(item.selectedVariants || {}) === JSON.stringify(variants || {})
      );

      if (itemIndex >= 0) {
        // Update existing item
        newItems[itemIndex] = {
          ...newItems[itemIndex],
          quantity: Math.min(newItems[itemIndex].quantity + quantity, MAX_QUANTITY),
        };
      } else {
        // Add new item
        newItems.push({
          product,
          quantity,
          selectedVariants: variants,
          addedAt: new Date(),
        });
      }

      const { total, itemCount } = calculateTotals(newItems);
      return {
        items: newItems,
        total,
        itemCount,
      };
    });

    // Visual feedback - you might want to trigger a toast notification here
    console.log(`Added ${quantity} ${product.name} to cart`);
  }, [cart.items]);

  // Remove from cart
  const removeFromCart = useCallback((productId: string, variants?: { [key: string]: string }) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => 
        !(item.product.id === productId && 
          JSON.stringify(item.selectedVariants || {}) === JSON.stringify(variants || {}))
      );

      const { total, itemCount } = calculateTotals(newItems);
      return {
        items: newItems,
        total,
        itemCount,
      };
    });
  }, []);

  // Update quantity
  const updateQuantity = useCallback((productId: string, quantity: number, variants?: { [key: string]: string }) => {
    if (quantity <= 0) {
      removeFromCart(productId, variants);
      return;
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item => {
        if (item.product.id === productId && 
            JSON.stringify(item.selectedVariants || {}) === JSON.stringify(variants || {})) {
          // Validate against stock and max quantity
          const MAX_QUANTITY = 10;
          const validQuantity = Math.min(quantity, item.product.stock, MAX_QUANTITY);
          return { ...item, quantity: validQuantity };
        }
        return item;
      });

      const { total, itemCount } = calculateTotals(newItems);
      return {
        items: newItems,
        total,
        itemCount,
      };
    });
  }, [removeFromCart]);

  // Clear cart
  const clearCart = useCallback(() => {
    setCart({
      items: [],
      total: 0,
      itemCount: 0,
    });
  }, []);

  // Check if product is in cart
  const isInCart = useCallback((productId: string, variants?: { [key: string]: string }): boolean => {
    return cart.items.some(item => 
      item.product.id === productId && 
      JSON.stringify(item.selectedVariants || {}) === JSON.stringify(variants || {})
    );
  }, [cart.items]);

  // Get specific cart item
  const getCartItem = useCallback((productId: string, variants?: { [key: string]: string }): CartItem | undefined => {
    return cart.items.find(item => 
      item.product.id === productId && 
      JSON.stringify(item.selectedVariants || {}) === JSON.stringify(variants || {})
    );
  }, [cart.items]);

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};