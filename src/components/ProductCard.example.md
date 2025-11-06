# ProductCard Component Usage

## Component Props

```typescript
interface ProductCardProps {
  product: Product;
}
```

## Example Usage

```tsx
import { ProductCard } from './components/ProductCard';

const exampleProduct = {
  id: 1,
  name: "Modern Oak Dining Chair",
  description: "Elegant dining chair crafted from solid oak wood with comfortable cushioning and contemporary design",
  category: "Seating",
  price: 299.99,
  stock: 15,
  dimensions: {
    width: 45,
    height: 95,
    depth: 50,
    unit: "cm"
  },
  material: "Oak Wood",
  color: "Natural Brown",
  imageUrl: "https://example.com/chair.jpg",
  createdAt: "2024-01-15T10:30:00",
  updatedAt: "2024-01-15T10:30:00",
  inStock: true
};

<ProductCard product={exampleProduct} />
```

## Visual Layout

```
┌─────────────────────────────────────────┐
│  [Category]              [In Stock]     │ ← Badges
│                                          │
│           Product Image                  │ ← Image (h-64)
│         or Placeholder                   │
│                                          │
├─────────────────────────────────────────┤
│                                          │
│  Modern Oak Dining Chair                 │ ← Name (bold, large)
│                                          │
│  Elegant dining chair crafted from       │ ← Description
│  solid oak wood with comfortable...     │   (2-line clamp)
│                                          │
│  Color: Natural Brown                    │ ← Details
│  Material: Oak Wood                      │   (conditional)
│  Dimensions: 45 × 95 × 50 cm            │
│                                          │
├─────────────────────────────────────────┤
│  $299.99          [Add to Cart]         │ ← Price & Action
│  15 items available                      │
└─────────────────────────────────────────┘
```

## Card States

### In Stock
- Green "In Stock" badge
- Enabled "Add to Cart" button (blue)
- Full color display

### Out of Stock
- Red "Out of Stock" badge
- Disabled "Unavailable" button (gray)
- Muted appearance

### No Image
- Gray placeholder with image icon
- All other elements display normally

### Missing Optional Fields
- Color, material, dimensions only show if available
- Layout adjusts gracefully

## Styling Classes

- **Card Container**: `bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl`
- **Image Area**: `h-64 bg-gray-700`
- **Content Padding**: `p-6`
- **Hover Effect**: `hover:-translate-y-1 transition-all duration-300`

## Responsive Behavior

The cards themselves are fixed-width within their grid container, but the grid adjusts:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

This is controlled by the parent grid in `App.tsx`:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  <ProductCard product={product1} />
  <ProductCard product={product2} />
  <ProductCard product={product3} />
</div>
```

## Accessibility Features

- Semantic HTML structure
- Proper button states
- Alt text for images
- High contrast colors
- Clear visual indicators for stock status
- Disabled state for unavailable products

## Price Formatting

Prices are automatically formatted using `Intl.NumberFormat`:

```typescript
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};
```

Examples:
- `299.99` → `$299.99`
- `1299` → `$1,299.00`
- `49.5` → `$49.50`

## Dimensions Formatting

Dimensions display as `W × H × D unit`:
- `45 × 95 × 50 cm`
- Only shown if at least one dimension is provided
- Missing values show as `?`

