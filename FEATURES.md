# Product Catalog Features Guide

## Quick Feature Reference

### 🛍️ Product Browsing

**Product Cards Display:**
- Product image (lazy-loaded)
- Title and description
- Price in monospace font
- Star rating (0-5, with half-stars)
- Status badges (Sale, New, Limited)
- Inventory status
- Variant selector (if applicable)
- Quantity stepper
- "Add to Cart" button

**Grid Layout:**
- Mobile (xs): 1 column
- Small (sm): 2 columns  
- Medium (md): 3 columns
- Large (lg): 4 columns

**Special States:**
- Out of stock: Grayed overlay + disabled button
- Sale badge: Red background
- New badge: Blue background
- Limited badge: Purple background

### 🛒 Shopping Cart

**Cart Drawer (Right Slide-over):**
- Opens via header cart button
- Shows item count badge (e.g., "3")
- Lists all cart items with:
  - Product thumbnail
  - Title and variant
  - Unit price × quantity
  - Line total
  - Inline quantity editor
  - Remove button
- Sticky footer with:
  - Subtotal (monospace)
  - "Proceed to Checkout" button
  - Tax/shipping note

**Cart Operations:**
```typescript
// Add item
addItem(productId, variantId?, quantity, unitPriceCents)

// Update quantity
setQuantity(productId, variantId?, newQuantity)

// Remove item
removeItem(productId, variantId?)

// Clear cart
clearCart()
```

**Persistence:**
- Saves to `localStorage` key: `pc.cart.v1`
- Auto-saves on every change
- Restores on page reload
- Handles version mismatches gracefully

### 🎨 UI Components

#### Price Component
```tsx
<Price priceCents={2999} currency="USD" />
// Renders: $29.99 (monospace font)
```

#### Rating Component
```tsx
<Rating rating={4.5} />
// Renders: ★★★★☆ 4.5
// Uses filled, half-filled, and empty stars
```

#### Quantity Stepper
```tsx
<QuantityStepper
  value={2}
  onChange={setQuantity}
  min={1}
  max={10}
/>
// Renders: [−] [2] [+]
// Buttons disabled at limits
```

#### Toast Notifications
```tsx
<Toast
  message="Added to cart"
  type="success"  // or "error" | "info"
  onClose={handleClose}
  duration={3000}
/>
// Auto-dismisses after 3 seconds
// Slide-up animation from bottom-right
```

### ⌨️ Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Navigate forward through interactive elements |
| `Shift+Tab` | Navigate backward |
| `Enter` / `Space` | Activate buttons |
| `Esc` | Close cart drawer |
| Arrow keys | Navigate within quantity steppers |

**Focus Management:**
- Visible focus rings (blue, 2px)
- Focus trap when cart drawer is open
- Focus moves to close button when drawer opens
- Tab cycles within drawer only (when open)

### 📱 Responsive Behavior

**Mobile (<640px):**
- Single column product grid
- Full-width cart drawer
- Touch-friendly button sizes (min 44×44px)
- Stacked product card layout

**Tablet (640px-1024px):**
- 2-3 column product grid
- Slightly narrower cart drawer
- Optimized image sizes

**Desktop (>1024px):**
- 4 column product grid
- Fixed max-width (7xl = 1280px)
- Hover states on cards and buttons
- Larger cart drawer (max-w-md)

### 🎭 Loading States

**Products Loading:**
- 8 skeleton cards shown
- Pulsing gray animation
- Maintains grid layout

**Empty States:**
- Empty cart: Shopping bag icon + "Your cart is empty" message
- No products: Box icon + "No products found" message

### 🔢 Data Formatting

**Money (Integer Cents):**
```typescript
// Store: 2999 cents
// Display: $29.99

formatMoney(2999, 'USD')  // "$29.99"
formatMoney(10050, 'EUR') // "€100.50"
```

**Inventory:**
- Shown on hover (future enhancement)
- Enforced in quantity stepper max value
- Zero inventory = disabled add button

### 🎯 Cart Logic

**Quantity Merging:**
```typescript
// Cart has: Product A (qty: 2)
// User adds: Product A (qty: 3)
// Result: Product A (qty: 5) ✅ No duplicate lines
```

**Variant Handling:**
```typescript
// Different variants = separate line items:
// Product A (Black) - qty: 2
// Product A (Silver) - qty: 1
// ✅ Treated as different items
```

**Inventory Validation:**
```typescript
// Product has 10 in stock
// User tries to add 15 → Stepper max = 10
// User in cart with qty 10, tries to add more → Disabled
```

### 🎨 Color Palette

**Background:**
- Page: `#242424`
- Cards: `#1f2937` (gray-800)
- Header: `#111827` (gray-900)

**Accents:**
- Primary: Blue-600 (`#2563eb`)
- Success: Green-600 (`#16a34a`)
- Error: Red-600 (`#dc2626`)
- Warning: Yellow-400 (`#facc15`)

**Text:**
- Primary: White (`rgba(255,255,255,0.87)`)
- Secondary: Gray-300/400
- Monospace: All numbers

### 📊 Cart State Schema

```typescript
// localStorage: "pc.cart.v1"
{
  "version": "v1",
  "items": [
    {
      "productId": "prod-001",
      "variantId": "var-black",
      "quantity": 2,
      "unitPriceCents": 29999
    }
  ]
}
```

**Calculated Values (Not Stored):**
- `subtotalCents`: Sum of (unitPrice × quantity) for all items
- `itemCount`: Sum of all quantities

### 🚦 Status Indicators

**Product Badges:**
- 🔴 Sale: Red background, indicates discount
- 🔵 New: Blue background, recently added
- 🟣 Limited: Purple background, limited quantity/time

**Cart Badge:**
- Red circle on cart icon
- Shows total item count
- "9+" if count > 9

**Stock Status:**
- In stock: Default state
- Low stock: (Not implemented yet)
- Out of stock: Grayed card + disabled button

### ⚡ Performance

**Optimizations Applied:**
- React.memo on ProductCard, CartDrawer
- useCallback on all cart actions
- Lazy image loading (native)
- Skeleton loaders (perceived performance)
- Integer-only arithmetic (faster than float)

**Bundle Size:**
- React 19 + React DOM: ~150KB gzipped
- Tailwind CSS (purged): ~10KB
- Application code: ~30KB
- Total: ~190KB (initial load)

### 🧪 Testing Coverage

**Unit Tests:**
- ✅ Cart reducer (all actions)
- ✅ Money formatting (edge cases)
- ✅ Cart totals calculation
- ⏳ Component tests (blocked by Bun/React 19 issue)

**Suggested Manual Tests:**
1. Add product → Check toast + badge
2. Add same product twice → Verify quantity merge
3. Add different variants → Verify separate lines
4. Update quantity in cart → Verify subtotal
5. Remove item → Verify removal
6. Reload page → Verify persistence
7. Keyboard nav → Tab through everything
8. Press Esc in drawer → Verify close
9. Try out-of-stock → Verify disabled state
10. Exceed inventory → Verify max limit

---

## Common Workflows

### Add Product to Cart
1. Browse products in grid
2. Select variant (if applicable)
3. Adjust quantity (default: 1)
4. Click "Add to Cart"
5. See success toast
6. Cart badge increments

### View and Edit Cart
1. Click cart icon in header
2. Drawer slides in from right
3. Review items and subtotal
4. Update quantities with steppers
5. Remove unwanted items
6. Click "Proceed to Checkout" (alerts for now)
7. Press Esc or click backdrop to close

### Product Variants
1. Find product with "Select Option" dropdown
2. Choose variant (e.g., Black, Silver)
3. Price updates if variant has custom price
4. Inventory max adjusts to variant stock
5. Add to cart with selected variant
6. Cart shows variant name under title

---

**Need Help?** Check [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for technical details or [PRODUCT_CARDS_PLAN.md](./PRODUCT_CARDS_PLAN.md) for the original design spec.

