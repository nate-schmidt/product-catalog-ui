import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Types -------------------------------------------------------------

export interface CartItem {
  id: string;
  /**
   * Human-readable item name (optional).
   * This is handy for debugging and small UIs that only need a label.
   */
  name?: string;
  /** Price per unit in the smallest currency unit (e.g. cents) */
  price?: number;
  quantity: number;
}

interface CartState {
  items: Record<string, CartItem>;
}

// Action definitions -----------------------------------------------

/**
 * The cart supports four core actions:
 * 1. add — insert a new item or increment an existing one
 * 2. update — explicitly set an item quantity (<= 0 removes the item)
 * 3. remove — delete the item regardless of quantity
 * 4. clear — empty the entire cart
 */

type CartAction =
  | {
      type: "add";
      payload: { item: Omit<CartItem, "quantity">; quantity?: number };
    }
  | { type: "update"; payload: { id: string; quantity: number } }
  | { type: "remove"; payload: { id: string } }
  | { type: "clear" };

// Reducer -----------------------------------------------------------

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const { item, quantity = 1 } = action.payload;
      const existing = state.items[item.id];
      const newQty = (existing?.quantity ?? 0) + quantity;
      return {
        items: {
          ...state.items,
          [item.id]: { ...existing, ...item, quantity: newQty },
        },
      };
    }

    case "update": {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        // *** BUG FIX ***
        // When quantity is reduced to 0 (or negative), remove the item from the cart
        // instead of keeping it with an invalid quantity.
        const { [id]: _removed, ...rest } = state.items;
        return { items: rest };
      }
      return {
        items: { ...state.items, [id]: { ...state.items[id], quantity } },
      };
    }

    case "remove": {
      const { id } = action.payload;
      const { [id]: _removed, ...rest } = state.items;
      return { items: rest };
    }

    case "clear":
      return { items: {} };

    default:
      return state;
  }
}

// Contexts ----------------------------------------------------------

const CartStateContext = createContext<CartState | undefined>(undefined);
const CartDispatchContext = createContext<React.Dispatch<CartAction> | undefined>(
  undefined,
);

// Provider ----------------------------------------------------------

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: {} });
  return (
    <CartStateContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  );
}

// Hooks -------------------------------------------------------------

export function useCart() {
  const context = useContext(CartStateContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function useCartActions() {
  const dispatch = useContext(CartDispatchContext);
  if (!dispatch) {
    throw new Error("useCartActions must be used within a CartProvider");
  }

  return {
    addItem: (item: Omit<CartItem, "quantity">, quantity: number = 1) =>
      dispatch({ type: "add", payload: { item, quantity } }),

    updateQuantity: (id: string, quantity: number) =>
      dispatch({ type: "update", payload: { id, quantity } }),

    removeItem: (id: string) => dispatch({ type: "remove", payload: { id } }),

    clearCart: () => dispatch({ type: "clear" }),
  } as const;
}

// Selectors ---------------------------------------------------------

export function useCartTotals() {
  const { items } = useCart();
  const values = Object.values(items) as CartItem[];
  const quantity = values.reduce((acc, cur) => acc + cur.quantity, 0);
  const subtotal = values.reduce(
    (acc, cur) => acc + (cur.price ?? 0) * cur.quantity,
    0,
  );
  return { quantity, subtotal };
}