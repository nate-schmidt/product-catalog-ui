import React, { createContext, useContext, useReducer, useEffect, useMemo } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "add"; item: Omit<CartItem, "quantity"> }
  | { type: "remove"; id: string }
  | { type: "setQty"; id: string; quantity: number }
  | { type: "clear" };

const STORAGE_KEY = "cart:v1";

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "add": {
      const existingItem = state.items.find((item) => item.id === action.item.id);
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === action.item.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        items: [...state.items, { ...action.item, quantity: 1 }],
      };
    }
    case "remove": {
      return {
        items: state.items.filter((item) => item.id !== action.id),
      };
    }
    case "setQty": {
      if (action.quantity <= 0) {
        return {
          items: state.items.filter((item) => item.id !== action.id),
        };
      }
      return {
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, quantity: action.quantity } : item
        ),
      };
    }
    case "clear": {
      return { items: [] };
    }
    default:
      return state;
  }
};

const initState = (): CartState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.items)) {
        return parsed;
      }
    }
  } catch {
    // Ignore parse errors
  }
  return { items: [] };
};

type CartContextValue = {
  state: CartState;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, initState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors
    }
  }, [state]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    dispatch({ type: "add", item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "remove", id });
  };

  const setQuantity = (id: string, quantity: number) => {
    dispatch({ type: "setQty", id, quantity });
  };

  const clearCart = () => {
    dispatch({ type: "clear" });
  };

  const itemCount = useMemo(() => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [state.items]);

  const subtotal = useMemo(() => {
    return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [state.items]);

  const value: CartContextValue = {
    state,
    addItem,
    removeItem,
    setQuantity,
    clearCart,
    itemCount,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}



