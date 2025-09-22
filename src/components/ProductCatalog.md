### ProductCatalog

**Purpose**: Displays a grid/list of products with search, sorting, filtering, and add-to-cart interactions.

### Props

- **products**: Array<{ id: string | number; name: string; price: number; image?: string; rating?: number; tags?: string[] }>
- **currency**: string — ISO code (e.g., USD).
- **onAddToCart**: (productId: string | number) => void — Add item to cart.
- **onViewProduct**: (productId: string | number) => void — Navigate to details.
- **filters**: { query?: string; tagIds?: (string | number)[] } — Current filter state.
- **onFiltersChange**: (filters) => void — Update filters.
- **sort**: 'relevance' | 'price-asc' | 'price-desc' | 'rating-desc' | 'newest'
- **onSortChange**: (sort) => void — Update sorting option.
- **loading**: boolean — Show skeleton/loading state.
- **emptyState**: React.ReactNode | string — Custom empty state.
- **className**: string — Optional container classes.

### Usage

```tsx
import { ProductCatalog } from './ProductCatalog';

export function Example({ products }) {
  const [filters, setFilters] = React.useState({ query: '' });
  const [sort, setSort] = React.useState('relevance');

  return (
    <ProductCatalog
      products={products}
      currency="USD"
      filters={filters}
      onFiltersChange={setFilters}
      sort={sort}
      onSortChange={setSort}
      onAddToCart={(id) => console.log('add', id)}
      onViewProduct={(id) => console.log('view', id)}
    />
  );
}
```

### Behavior

- Renders grid of product cards with image, name, price, rating.
- Supports client-side filter and sort; server-side can be wired via callbacks.
- Emits `onAddToCart` and `onViewProduct` on button clicks.

### Accessibility

- Images use meaningful `alt` text from product name.
- Buttons have clear labels; support keyboard navigation.
- Maintain focus after filter/sort updates.

### Styling

- Responsive grid; 1-2 columns on small screens, 3-4 on large.
- Price formatting respects `currency`.

### Testing

- Filter and sort combinations update rendered products.
- `onAddToCart` and `onViewProduct` handlers fire with correct IDs.
- Loading and empty states render as expected.

