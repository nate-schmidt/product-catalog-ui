## Product Cards + Cart — Implementation Plan

> Status: draft `v1` (updated `2025-10-07`)

### Goals and scope

- **Display products**: Grid/list of cards showing image, title, price, rating, and badges (e.g., sale/new/out-of-stock).
- **Add to cart**: Add directly from a card; supports quantity and optional variant selection.
- **Cart UX**: View, edit quantities, remove items; show subtotal; persist across reloads.
- **A11y**: Fully keyboard-accessible, screen-reader friendly.
- **Performance**: Lazy images, skeleton loading, memoization; consider virtualization for large lists (≥ `100`).
- **Out of scope (now)**: Checkout, taxes/shipping, multi-currency conversions.

### Proposed UX

- **Product grid**: Responsive (`xs` `1` col, `sm` `2`, `md` `3`, `lg` `4`).
- **Card content**: Image (fixed aspect), brand/name, short description (optional), price, rating, badges.
- **Card actions**: Variant selector (if any), quantity stepper, "Add to cart" button; success toast on add.
- **Cart UI**: Right-side drawer toggled from header; alternate: dedicated `/cart` page. Drawer shows line items and sticky summary.

### Data model (TypeScript)

- **Money**: Store as `priceCents` (integer). Display via formatter.
- **Product**:
  - `id`, `title`, `description?`, `priceCents`, `currency`, `imageUrls: string[]`, `rating?` (`0`–`5`), `badges?`, `inventory`, `variants?`.
- **Variant**: `id`, `name`, `priceCents?` (override), `inventory`.
- **CartItem**: `productId`, `variantId?`, `quantity`, `unitPriceCents`.
- **CartState**: `{ items: CartItem[]; version: 'v1' }`.

```ts
// src/types/catalog.ts
export type ProductId = string;

export interface ProductVariant {
  id: string;
  name: string;
  priceCents?: number;
  inventory: number;
}

export interface Product {
  id: ProductId;
  title: string;
  description?: string;
  priceCents: number;
  currency: 'USD' | 'EUR';
  imageUrls: string[];
  rating?: number; // 0..5
  badges?: Array<'sale' | 'new' | 'limited'>;
  inventory: number;
  variants?: ProductVariant[];
}

export interface CartItem {
  productId: ProductId;
  variantId?: string;
  quantity: number;
  unitPriceCents: number;
}

export interface CartState {
  items: CartItem[];
  version: 'v1';
}
```

### State management

- **Cart context**: React Context + `useReducer` for predictable updates.
- **Derived totals**: Subtotal in cents, item count; future: taxes/shipping.
- **Persistence**: `localStorage` key `pc.cart.v1`, with a tiny schema version. Hydrate on app start; fall back safely on invalid data.

```ts
// src/cart/cartReducer.ts
export type CartAction =
  | { type: 'addItem'; item: { productId: string; variantId?: string; quantity: number; unitPriceCents: number } }
  | { type: 'removeItem'; productId: string; variantId?: string }
  | { type: 'increment'; productId: string; variantId?: string; by?: number }
  | { type: 'setQuantity'; productId: string; variantId?: string; quantity: number }
  | { type: 'clear' };
```

### Components to add

- **Catalog**
  - `src/components/ProductCard.tsx`: Card UI with image, title, price, badges, rating, variant select (if any), qty stepper, add button.
  - `src/components/ProductGrid.tsx`: Responsive grid, empty + loading states.
  - `src/components/Price.tsx`: Money formatter component (`priceCents`, `currency`).
  - `src/components/Rating.tsx`: Star display with `aria-label`.
  - `src/components/QuantityStepper.tsx`: Accessible stepper with min `1`, max bounded by inventory.
- **Cart**
  - `src/cart/CartProvider.tsx`: Context + reducer + persistence effects.
  - `src/cart/CartDrawer.tsx`: Slide-over panel with focus trap; summary sticky at bottom.
  - `src/cart/CartLineItem.tsx`: Line item with image, title, variant, price, qty controls, remove.
  - `src/cart/CartSummary.tsx`: Subtotal and CTA buttons.
  - `src/cart/useCart.ts`: Hook wrapper for context selectors.
- **Utilities**
  - `src/utils/money.ts`: `formatMoney(priceCents, currency)`; avoid floating point.
  - `src/services/ProductService.ts`: `listProducts(): Promise<Product[]>` (mock now, API later).
  - `src/data/products.json`: Dev/mock dataset.

### API integration strategy

- **Phase `1`** (mock): Read from `src/data/products.json` via `ProductService` to decouple view from data source.
- **Phase `2`** (real): Swap service to fetch `GET /products` (or GraphQL). Keep model stable; add image optimization (`srcset`, `sizes`).
- **Resilience**: Handle fetch errors with retry/backoff and user-facing error states.

### Accessibility (WCAG-minded)

- **Semantics**: Buttons are `<button>`, not `<div>`; labels on inputs; `alt` text for images.
- **Keyboard**: All controls reachable via Tab; visible focus ring; Esc closes drawer.
- **ARIA**: Live region for toast (add success), `aria-busy` during async, `aria-disabled` for out-of-stock.
- **Color/contrast**: Meet minimum ratio; do not use color alone to convey state.

### Performance

- **Images**: `loading="lazy"`, properly sized thumbnails, `srcset` for DPR.
- **Lists**: Consider virtualization when products ≥ `100`.
- **Rendering**: `React.memo` hot paths; stable keys; avoid prop churn.
- **Code-splitting**: Lazy-load `CartDrawer` to reduce initial bundle.

### Styling

- **Approach**: Use existing CSS (`src/index.css`) plus small component-scoped styles (CSS Modules) to avoid global leakage.
- **Responsive**: CSS Grid for catalog; container max-width; fluid gutters.

### Testing

- **Unit**: Reducer logic (add/increment/remove/setQuantity/clear); `formatMoney` edge cases.
- **Component**: `ProductCard` (add flow), `CartDrawer` interactions using React Testing Library.
- **A11y**: Smoke with `jest-axe` on key components (optional).

### Analytics (optional)

- **Events**: `view_item_list`, `view_item`, `add_to_cart` with `productId`, `variantId?`, `quantity`, `valueCents`.

### Acceptance criteria

- **Card shows accurate info**: Image, title, price, rating, badges reflect data.
- **Add to cart from card**: Clicking add with default/selected options adds `quantity` `1` by default, or selected quantity.
- **Quantity merge**: Adding same `productId` + `variantId` increments quantity instead of duplicating lines.
- **Inventory rules**: Cannot exceed `inventory`; out-of-stock disables add.
- **Cart drawer**: Opens from header; shows items with correct totals; update quantity and remove work.
- **Persistence**: Cart restores after reload via `localStorage` and matches previous state.
- **A11y**: Keyboard-only flow works; screen reader announces add/remove; focus is trapped within drawer.
- **Perf**: Initial catalog paint under `~200ms` on modern hardware; images lazy-load; no jank on scroll.

### Milestones and deliverables

- **`M1` — Types + mock data**: Add `catalog.ts`, `products.json`, `ProductService` returning mocks.
- **`M2` — Product UI**: `ProductCard`, `ProductGrid`, loading/skeleton, empty state.
- **`M3` — Cart state**: `CartProvider`, reducer, `useCart`, money utils, subtotal derivation.
- **`M4` — Cart UI + persistence**: `CartDrawer`, line items, summary, `localStorage` hydration.
- **`M5` — A11y + perf**: Keyboard/focus polish, lazy images, memoization.
- **`M6` — Tests + docs**: Reducer/component tests, a11y smoke tests, README snippet.

### File structure (proposed additions)

```
src/
  cart/
    CartProvider.tsx
    CartDrawer.tsx
    CartLineItem.tsx
    CartSummary.tsx
    useCart.ts
    cartReducer.ts
  components/
    ProductCard.tsx
    ProductGrid.tsx
    Price.tsx
    Rating.tsx
    QuantityStepper.tsx
  data/
    products.json
  services/
    ProductService.ts
  types/
    catalog.ts
  utils/
    money.ts
```

### Dev and run notes

- **Commands**: Use Bun for scripts and dev server.
  - Dev: `bun dev`
  - Test: `bun test`

### Open questions

- Do products have variants (size/color) or only single SKUs?
- Single currency or multi-currency? If multi, which ones?
- Any design system constraints (fonts, spacing, color tokens)?
- Drawer vs dedicated cart page preference?
- Any inventory edge rules (backorder, preorder)?


