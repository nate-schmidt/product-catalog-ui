# Product Catalog UI Components Documentation

## Overview

This document provides comprehensive documentation for all React components in the Product Catalog UI application. The application follows a component-based architecture with React Context for state management.

## Core Components

### App.tsx

**Purpose**: Main application component that serves as the root component and layout container.

**Responsibilities**:
- Provides the main application layout
- Wraps the application with necessary providers (CartProvider)
- Handles routing between different views
- Manages global application state

**Props**: None (root component)

**Usage Example**:
```tsx
import App from './App';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

### CartContext.tsx

**Purpose**: React Context provider that manages shopping cart state globally across the application.

**Exported Items**:
- `CartProvider`: Context provider component
- `useCart`: Custom hook for accessing cart state and actions
- `CartItem`: TypeScript interface for cart item structure

**State Management**:
```typescript
interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}
```

**Available Actions**:
- `addToCart(product: Product)`: Adds a product to cart or increments quantity
- `removeFromCart(productId: string)`: Removes an item from cart
- `updateQuantity(productId: string, quantity: number)`: Updates item quantity
- `clearCart()`: Removes all items from cart

**Usage Example**:
```tsx
import { useCart } from './CartContext';

function MyComponent() {
  const { items, addToCart, removeFromCart, totalPrice } = useCart();
  
  return (
    <div>
      <p>Total: ${totalPrice}</p>
      {/* Component content */}
    </div>
  );
}
```

### ProductCatalog.tsx

**Purpose**: Displays a grid of products fetched from the backend API with filtering and sorting capabilities.

**Props**:
```typescript
interface ProductCatalogProps {
  apiUrl?: string;
  itemsPerPage?: number;
  showFilters?: boolean;
}
```

**Features**:
- Product grid display with responsive layout
- Search functionality by product name
- Category filtering
- Price range filtering
- Sort options (price, name, popularity)
- Pagination support
- Loading and error states

**State Management**:
- Uses local state for filters and pagination
- Fetches product data from backend API
- Integrates with CartContext for add-to-cart functionality

**Usage Example**:
```tsx
<ProductCatalog 
  apiUrl="/api/products"
  itemsPerPage={12}
  showFilters={true}
/>
```

### CartDisplay.tsx

**Purpose**: Displays shopping cart contents with item management capabilities.

**Props**:
```typescript
interface CartDisplayProps {
  isOpen: boolean;
  onClose: () => void;
  showCheckoutButton?: boolean;
}
```

**Features**:
- Cart item list with product images, names, and prices
- Quantity adjustment controls
- Remove item functionality
- Subtotal calculation
- Empty cart state
- Checkout button (optional)

**UI Elements**:
- Slide-out drawer or modal presentation
- Item quantity incrementer/decrementer
- Remove item buttons
- Total price display

**Usage Example**:
```tsx
const [cartOpen, setCartOpen] = useState(false);

<CartDisplay 
  isOpen={cartOpen}
  onClose={() => setCartOpen(false)}
  showCheckoutButton={true}
/>
```

## Component Relationships

```
App
├── CartProvider (Context)
│   ├── ProductCatalog
│   │   └── ProductCard (internal)
│   └── CartDisplay
│       └── CartItem (internal)
└── Navigation (with cart icon)
```

## Styling

All components use Tailwind CSS for styling with the following conventions:
- Responsive design using Tailwind breakpoints
- Dark mode support via CSS classes
- Consistent spacing using Tailwind spacing utilities
- Custom animations for cart interactions

## Testing

Each component has a corresponding test file:
- `App.test.tsx`: Tests main layout and provider setup
- `CartContext.test.tsx`: Tests cart state management logic
- `ProductCatalog.test.tsx`: Tests product display and filtering
- `CartDisplay.test.tsx`: Tests cart UI interactions

## Best Practices

1. **State Management**: Use CartContext for all cart-related state
2. **Error Handling**: All components include error boundaries
3. **Loading States**: Show appropriate loading indicators during API calls
4. **Accessibility**: Components include proper ARIA labels and keyboard navigation
5. **Performance**: Components use React.memo where appropriate for optimization

## API Integration

Components interact with the backend through:
- `/api/products` - GET products with query parameters
- `/api/products/:id` - GET single product details
- Product data follows the ProductResponseDTO structure from the backend

## Future Enhancements

- Product detail modal/page
- Wishlist functionality
- Advanced filtering options
- Product comparison feature
- Recently viewed products