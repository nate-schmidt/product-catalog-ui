# ProductCatalog Component

## Overview

The `ProductCatalog` component displays a grid of products with filtering, sorting, and pagination capabilities. It's the main component for browsing products in the application.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `products` | `Product[]` | - | Array of products to display |
| `loading` | `boolean` | `false` | Loading state indicator |
| `onAddToCart` | `(product: Product) => void` | - | Handler for adding products to cart |
| `filters` | `FilterOptions` | `{}` | Active filter options |
| `onFilterChange` | `(filters: FilterOptions) => void` | - | Handler for filter updates |
| `sortBy` | `SortOption` | `'name'` | Current sort option |
| `onSortChange` | `(sort: SortOption) => void` | - | Handler for sort changes |

## Type Definitions

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
}

interface FilterOptions {
  categories?: string[];
  priceRange?: [number, number];
  inStockOnly?: boolean;
  rating?: number;
}

type SortOption = 'name' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
```

## Usage

```tsx
import { ProductCatalog } from './components/ProductCatalog';

function ShopPage() {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortBy, setSortBy] = useState<SortOption>('name');

  const handleAddToCart = (product: Product) => {
    // Add product to cart logic
  };

  return (
    <ProductCatalog
      products={products}
      loading={isLoading}
      onAddToCart={handleAddToCart}
      filters={filters}
      onFilterChange={setFilters}
      sortBy={sortBy}
      onSortChange={setSortBy}
    />
  );
}
```

## Features

### Product Display
- Grid layout (responsive columns)
- Product cards with image, name, price
- Quick add to cart button
- Stock status indicator
- Rating display

### Filtering
- Category filter (multi-select)
- Price range slider
- In-stock only toggle
- Minimum rating filter

### Sorting
- Sort by name (A-Z)
- Sort by price (low to high, high to low)
- Sort by rating
- Sort by newest arrivals

### Additional Features
- Pagination or infinite scroll
- Product count display
- No results message
- Loading skeletons
- Error states

## Component Structure

```
ProductCatalog
├── Filters Section
│   ├── Category Filter
│   ├── Price Range Filter
│   ├── Stock Filter
│   └── Rating Filter
├── Controls Bar
│   ├── Results Count
│   ├── Sort Dropdown
│   └── View Toggle (Grid/List)
├── Products Grid
│   └── Product Cards
└── Pagination/Load More
```

## Product Card Features

Each product card includes:
- Product image with lazy loading
- Hover effect showing quick view
- Product name and price
- Rating stars and review count
- Add to cart button
- Out of stock overlay when applicable

## Responsive Design

- Mobile: 1-2 columns
- Tablet: 3 columns
- Desktop: 4-5 columns
- Collapsible filters on mobile

## Performance Considerations

- Image lazy loading
- Virtual scrolling for large catalogs
- Debounced filter updates
- Optimistic UI updates