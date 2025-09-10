## Add to Cart plan (localStorage)

### Goal
- Implement client-side cart with persistence via `localStorage` that survives reloads.
- Provide a simple API the UI can call from `ProductCatalog.tsx` to add items.
- Keep styling minimal and consistent with existing components.

### Scope
- No backend; entirely client-side using Bun’s React bundling.
- Add, update quantity, remove, clear cart.
- Persist and hydrate from `localStorage` under a single namespaced key.
- Basic cross-tab sync using the `storage` event (nice-to-have).

### Data model
- **Product (input)**: `{ id: string; name: string; price: number; description?: string }`
- **CartItem**: `{ id: string; name: string; price: number; quantity: number }`
- **Cart**: `{ items: CartItem[]; updatedAt: number }`
- **Storage key**: `pcui:cart:v1`
  - Version suffix allows future migrations if the shape changes.

### Files to add
- `src/cart/cartTypes.ts` – Type definitions for `Product`, `CartItem`, `Cart`.
- `src/cart/cartStorage.ts` – LocalStorage helpers: `readCart`, `writeCart`, `safeParse`, constants.
- `src/cart/CartContext.tsx` – `CartProvider` + `useCart()` hook exposing state and actions.
- (Optional, UI) `src/components/CartBadge.tsx` – shows total item count.

### Public API (from useCart)
- `items: CartItem[]`
- `totalItems: number` – sum of quantities
- `totalPrice: number` – sum of `price * quantity`
- `addItem(product: Product, quantity = 1): void`
- `removeItem(productId: string): void`
- `updateQuantity(productId: string, quantity: number): void` (removes when quantity <= 0)
- `clear(): void`

### LocalStorage strategy
- Read once at provider mount; if invalid or absent, start with `{ items: [], updatedAt: Date.now() }`.
- Persist on any `items` change (debounce not needed for simple UI interactions).
- Wrap access in try/catch to avoid crashes in restricted environments; fall back to in-memory state.
- Listen for `window.addEventListener('storage', ...)` to sync across tabs by replacing state when the key changes.

### Implementation steps
1) Types
   - Create `src/cart/cartTypes.ts` with `Product`, `CartItem`, `Cart`.

2) Storage helpers
   - Create `src/cart/cartStorage.ts`:
     - `const CART_KEY = 'pcui:cart:v1'`
     - `readCart(): Cart` – read/parse/validate; return empty cart on error.
     - `writeCart(cart: Cart): void` – JSON stringify and set.

3) Context + Hook
   - Create `src/cart/CartContext.tsx`:
     - Internal state: `const [items, setItems] = useState<CartItem[]>(readCart().items)`
     - `useEffect` on mount: hydrate from `readCart()` (guard for double-invoke in strict mode).
     - `useEffect` on `items`: write `{ items, updatedAt: Date.now() }` to storage.
     - Actions:
       - `addItem(product, qty=1)`: if exists, increment; else push new item with quantity.
       - `removeItem(id)`: filter out.
       - `updateQuantity(id, qty)`: set qty; if `qty <= 0`, remove.
     - Derived values: `totalItems`, `totalPrice` via `useMemo`.
     - Cross-tab sync: attach `storage` listener to replace `items` when `CART_KEY` changes.
     - Export `CartProvider` and `useCart()`.

4) Wire-up provider
   - Wrap app with `CartProvider` in `src/App.tsx` (or `src/index.tsx`):
     - `<CartProvider><AppContents /></CartProvider>`

5) Integrate with ProductCatalog
   - In `src/components/ProductCatalog.tsx`:
     - Import `useCart()`.
     - Replace `handleAddToCart` to call `addItem({ id, name, price, description })`.
     - If products currently lack `id`, derive a stable `id` (e.g., slug of name) or add a field.

6) Cart badge
   - Create `CartBadge` that reads `totalItems` from `useCart()` and display next to a cart icon or header text.
   - Place in the app header for quick feedback.

### Example snippets
```ts
// src/cart/cartTypes.ts
export type Product = { id: string; name: string; price: number; description?: string };
export type CartItem = { id: string; name: string; price: number; quantity: number };
export type Cart = { items: CartItem[]; updatedAt: number };
```

```ts
// src/components/ProductCatalog.tsx (inside component)
const { addItem } = useCart();
const handleAddToCart = (p: { id: string; name: string; price: number; description?: string }) => {
  addItem(p, 1);
};
```

### Edge cases & decisions
- Duplicates: Adding same product increments quantity.
- Quantities: Minimum is 0 (removes item); no hard maximum enforced.
- Prices: Store numeric price; compute totals on the fly; format at render time.
- Validation: Ignore malformed storage content and reset to empty cart.
- Cross-tab: If another tab updates the cart, current tab replaces state.

### Testing (using Bun)
- Unit: `cartStorage` read/write and `useCart` actions (mock `localStorage`).
- Hook tests via React Testing Library + JSDOM.
- Commands:
  - `bun test`

### Acceptance criteria
- Adding an item updates the badge count immediately.
- Refreshing the page preserves cart items and quantities.
- Adding the same product again increases its quantity.
- Setting quantity to 0 removes the item.
- No runtime errors when `localStorage` is unavailable; cart still works in-memory.

### Rollout
- Implement files and provider wiring.
- Update `ProductCatalog.tsx` to use `useCart`.
- Add optional badge to header.
- Manual test across reloads and in two tabs.


