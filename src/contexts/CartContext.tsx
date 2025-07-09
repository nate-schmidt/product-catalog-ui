import {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { Product } from "../types";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addItem(product: Product) {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }

  function removeItem(productId: string) {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const { totalItems, totalPrice } = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.totalItems += item.quantity;
        acc.totalPrice += item.product.price * item.quantity;
        return acc;
      },
      { totalItems: 0, totalPrice: 0 },
    );
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      clearCart,
      totalItems,
      totalPrice,
    }),
    [items, totalItems, totalPrice],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}