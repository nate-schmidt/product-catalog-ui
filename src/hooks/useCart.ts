import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export interface Product {
  id: number | string;
  name: string;
  price: number;
  image?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export function useCart() {
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);

  const addToCart = useCallback(
    (product: Product) => {
      setCart(prev => {
        const existing = prev.find(item => item.id === product.id);
        if (existing) {
          return prev.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    },
    [setCart]
  );

  const removeFromCart = useCallback(
    (productId: Product["id"]) => {
      setCart(prev => prev.filter(item => item.id !== productId));
    },
    [setCart]
  );

  const clearCart = useCallback(() => setCart([]), [setCart]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
  } as const;
}