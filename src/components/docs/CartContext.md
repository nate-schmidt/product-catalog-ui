# CartContext Documentation

## Overview

`CartContext` is a React Context that provides global cart state management throughout the application. It handles cart operations, persistence, and synchronization.

## Context API

### Provider Component

```tsx
import { CartProvider } from './CartContext';

function App() {
  return (
    <CartProvider>
      {/* Your app components */}
    </CartProvider>
  );
}
```

### useCart Hook

```tsx
import { useCart } from './CartContext';

function Component() {
  const cart = useCart();
  // Use cart methods and state
}
```

## State Structure

```typescript
interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  lastUpdated: Date;
}

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: {
    size?: string;
    color?: string;
    [key: string]: any;
  };
  maxQuantity?: number;
}
```

## Available Methods

### addToCart
```typescript
addToCart(product: Product, quantity?: number): Promise<void>
```
Adds a product to the cart or increments quantity if already exists.

**Example:**
```tsx
const { addToCart } = useCart();

const handleAddProduct = async (product) => {
  try {
    await addToCart(product, 1);
    toast.success('Added to cart!');
  } catch (error) {
    toast.error('Failed to add to cart');
  }
};
```

### removeFromCart
```typescript
removeFromCart(productId: string): Promise<void>
```
Removes an item completely from the cart.

### updateQuantity
```typescript
updateQuantity(productId: string, quantity: number): Promise<void>
```
Updates the quantity of a specific item.

### clearCart
```typescript
clearCart(): Promise<void>
```
Removes all items from the cart.

### getCartItem
```typescript
getCartItem(productId: string): CartItem | undefined
```
Retrieves a specific item from the cart.

### isInCart
```typescript
isInCart(productId: string): boolean
```
Checks if a product is in the cart.

## Advanced Features

### 1. Persistence
Cart state is automatically persisted to localStorage:

```typescript
const CART_STORAGE_KEY = 'shopping_cart';

// Automatic save on state changes
useEffect(() => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
}, [cartState]);
```

### 2. Server Synchronization
Optional backend sync for logged-in users:

```typescript
interface CartProviderProps {
  syncWithServer?: boolean;
  userId?: string;
  apiEndpoint?: string;
}

<CartProvider 
  syncWithServer={true}
  userId={user.id}
  apiEndpoint="/api/cart"
>
```

### 3. Stock Validation
Real-time stock checking:

```typescript
const validateStock = async (items: CartItem[]): Promise<ValidationResult> => {
  const response = await fetch('/api/cart/validate', {
    method: 'POST',
    body: JSON.stringify({ items })
  });
  return response.json();
};
```

### 4. Price Updates
Automatic price synchronization:

```typescript
useEffect(() => {
  const interval = setInterval(async () => {
    await syncPrices();
  }, 60000); // Every minute

  return () => clearInterval(interval);
}, []);
```

## Event System

The CartContext emits events for external integrations:

```typescript
// Listen to cart events
useEffect(() => {
  const handleCartUpdate = (event: CustomEvent) => {
    analytics.track('cart_updated', event.detail);
  };

  window.addEventListener('cart:updated', handleCartUpdate);
  
  return () => {
    window.removeEventListener('cart:updated', handleCartUpdate);
  };
}, []);
```

### Available Events
- `cart:updated` - Any cart change
- `cart:item:added` - Item added
- `cart:item:removed` - Item removed
- `cart:cleared` - Cart cleared

## Error Handling

```typescript
interface CartError {
  code: string;
  message: string;
  item?: CartItem;
}

// Error codes
const ERROR_CODES = {
  INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK',
  INVALID_QUANTITY: 'INVALID_QUANTITY',
  PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
  NETWORK_ERROR: 'NETWORK_ERROR'
};
```

## Performance Optimizations

### 1. Memoization
```typescript
const cartSummary = useMemo(() => ({
  subtotal: calculateSubtotal(items),
  tax: calculateTax(items),
  total: calculateTotal(items)
}), [items]);
```

### 2. Batch Updates
```typescript
const batchUpdate = useCallback((updates: CartUpdate[]) => {
  dispatch({ type: 'BATCH_UPDATE', payload: updates });
}, []);
```

### 3. Debounced Persistence
```typescript
const debouncedSave = useMemo(
  () => debounce(saveToLocalStorage, 500),
  []
);
```

## Testing Utilities

```typescript
// Test helper for cart context
export const createMockCartProvider = (initialState?: Partial<CartState>) => {
  const mockCart = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    ...initialState
  };

  return ({ children }) => (
    <CartContext.Provider value={mockCart}>
      {children}
    </CartContext.Provider>
  );
};

// Usage in tests
render(
  <Component />,
  { wrapper: createMockCartProvider({ items: mockItems }) }
);
```

## Migration Guide

### From Local State to Context
```typescript
// Before
const [cartItems, setCartItems] = useState([]);

// After
const { items: cartItems, addToCart, removeFromCart } = useCart();
```

### From Redux to Context
```typescript
// Before
const cartItems = useSelector(state => state.cart.items);
const dispatch = useDispatch();
dispatch(addToCart(product));

// After
const { items: cartItems, addToCart } = useCart();
addToCart(product);
```

## Configuration Options

```typescript
interface CartConfig {
  maxItemQuantity: number;
  enablePersistence: boolean;
  syncInterval: number;
  validateOnAdd: boolean;
  currencyCode: string;
  taxRate: number;
}

const defaultConfig: CartConfig = {
  maxItemQuantity: 99,
  enablePersistence: true,
  syncInterval: 60000,
  validateOnAdd: true,
  currencyCode: 'USD',
  taxRate: 0.08
};
```