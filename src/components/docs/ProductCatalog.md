# ProductCatalog Component

## Overview

The `ProductCatalog` component is the main product display component that renders a grid of products with advanced filtering, sorting, and pagination capabilities.

## Component API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiUrl` | `string` | `/api/products` | Backend API endpoint for fetching products |
| `itemsPerPage` | `number` | `12` | Number of products to display per page |
| `showFilters` | `boolean` | `true` | Toggle visibility of filter panel |
| `initialCategory` | `string` | `undefined` | Pre-selected category filter |
| `gridCols` | `object` | `{ sm: 1, md: 2, lg: 3, xl: 4 }` | Responsive grid column configuration |

### Example Usage

```tsx
import { ProductCatalog } from './components/ProductCatalog';

function HomePage() {
  return (
    <div className="container mx-auto">
      <h1>Our Products</h1>
      <ProductCatalog 
        apiUrl="/api/products"
        itemsPerPage={16}
        showFilters={true}
        initialCategory="furniture"
      />
    </div>
  );
}
```

## Features

### 1. Product Display
- Responsive grid layout
- Product cards with image, name, price, and description
- Add to cart button integration
- Loading skeleton states

### 2. Filtering Options
- **Search**: Real-time search by product name
- **Category**: Filter by product categories
- **Price Range**: Min/max price slider
- **Availability**: Show only in-stock items
- **Material**: Filter by product materials

### 3. Sorting
- Price (Low to High)
- Price (High to Low)
- Name (A-Z)
- Name (Z-A)
- Newest First
- Best Selling

### 4. Pagination
- Page number navigation
- Items per page selector
- Total results counter
- Previous/Next buttons

## State Management

The component manages the following internal state:

```typescript
interface CatalogState {
  products: Product[];
  loading: boolean;
  error: string | null;
  filters: FilterState;
  sorting: SortOption;
  pagination: PaginationState;
}
```

## API Integration

### Request Format
```
GET /api/products?page=1&limit=12&category=furniture&minPrice=0&maxPrice=1000&sort=price_asc
```

### Response Format
```typescript
interface ProductsResponse {
  products: Product[];
  totalCount: number;
  page: number;
  totalPages: number;
}
```

## Styling

The component uses Tailwind CSS classes with the following structure:

```tsx
<div className="product-catalog">
  <aside className="filters-panel">
    {/* Filter components */}
  </aside>
  <main className="products-section">
    <div className="sort-bar">
      {/* Sorting controls */}
    </div>
    <div className="products-grid">
      {/* Product cards */}
    </div>
    <div className="pagination">
      {/* Pagination controls */}
    </div>
  </main>
</div>
```

## Performance Considerations

1. **Debounced Search**: Search input is debounced by 300ms
2. **Lazy Loading**: Images use lazy loading for better performance
3. **Memoization**: Product cards are memoized to prevent unnecessary re-renders
4. **Virtual Scrolling**: Optional for large catalogs (>100 items)

## Accessibility

- Keyboard navigation support
- ARIA labels for filters and controls
- Screen reader announcements for results
- Focus management during filtering

## Testing

```typescript
describe('ProductCatalog', () => {
  it('renders products grid');
  it('filters products by category');
  it('searches products by name');
  it('sorts products correctly');
  it('handles pagination');
  it('shows loading state');
  it('handles API errors gracefully');
});
```

## Common Patterns

### Custom Filter Implementation
```tsx
<ProductCatalog>
  <CustomFilter 
    name="brand"
    options={['Brand A', 'Brand B']}
    onChange={handleBrandFilter}
  />
</ProductCatalog>
```

### Integration with Analytics
```tsx
<ProductCatalog 
  onProductClick={(product) => trackEvent('product_view', product)}
  onAddToCart={(product) => trackEvent('add_to_cart', product)}
/>
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Products not loading | Check API endpoint and CORS settings |
| Filters not working | Verify query parameter formatting |
| Slow performance | Enable pagination, reduce items per page |
| Images not showing | Check image URLs and CDN configuration |