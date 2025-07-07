import {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  Dispatch,
  useMemo,
} from "react";
import { produce, Draft } from "immer";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CartItem {
  id: string;
  name: string;
  price: number; // single-unit price
  quantity: number;
}

export interface CartState {
  // Store items in a flat map for O(1) reads / writes and minimal diff cost
  items: Record<string, CartItem>;
}

// Actions that can be performed on the cart
export type CartAction =
  | { type: "addItem"; item: CartItem }
  | { type: "removeItem"; id: string }
  | { type: "updateQuantity"; id: string; quantity: number }
  | { type: "clearCart" };

// ---------------------------------------------------------------------------
// Reducer (Immer powered)
// ---------------------------------------------------------------------------

const initialState: CartState = {
  items: {},
};

const cartReducer = (state: CartState, action: CartAction): CartState =>
  produce(state, (draft: Draft<CartState>) => {
    switch (action.type) {
      case "addItem": {
        const existing = draft.items[action.item.id];
        if (existing) {
          existing.quantity += action.item.quantity;
        } else {
          draft.items[action.item.id] = { ...action.item };
        }
        break;
      }
      case "removeItem": {
        delete draft.items[action.id];
        break;
      }
      case "updateQuantity": {
        const item = draft.items[action.id];
        if (item) {
          item.quantity = action.quantity;
          if (item.quantity <= 0) {
            delete draft.items[action.id];
          }
        }
        break;
      }
      case "clearCart": {
        draft.items = {};
        break;
      }
      default:
        // Exhaustive check so TypeScript warns on missing cases
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _never: never = action;
        break;
    }
  });

// ---------------------------------------------------------------------------
// Split contexts: state & dispatch
// ---------------------------------------------------------------------------

const CartStateContext = createContext<CartState | undefined>(undefined);
const CartDispatchContext = createContext<Dispatch<CartAction> | undefined>(
  undefined,
);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartStateContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  );
};

// ---------------------------------------------------------------------------
// Hooks – safer API for consumers
// ---------------------------------------------------------------------------

export function useCartState() {
  const context = useContext(CartStateContext);
  if (context === undefined) {
    throw new Error("useCartState must be used within a CartProvider");
  }
  return context;
}

export function useCartDispatch() {
  const context = useContext(CartDispatchContext);
  if (context === undefined) {
    throw new Error("useCartDispatch must be used within a CartProvider");
  }
  return context;
}

export function useCart() {
  return [useCartState(), useCartDispatch()] as const;
}

// ---------------------------------------------------------------------------
// Memoised selectors
// ---------------------------------------------------------------------------

export function useCartItemCount() {
  const { items } = useCartState();
  return useMemo(() => {
    return Object.values(items).reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);
}

export function useCartTotalPrice() {
  const { items } = useCartState();
  return useMemo(() => {
    return Object.values(items).reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
  }, [items]);
}