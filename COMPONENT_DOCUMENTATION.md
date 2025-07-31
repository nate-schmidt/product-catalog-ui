# Product Catalog UI - Component Documentation

## Overview
This document provides comprehensive documentation for all React components and integrations in the Product Catalog application.

## Architecture Overview

### Frontend Stack
- **React 18** with TypeScript
- **Bun** as the runtime and package manager
- **Context API** for state management
- **Modern CSS** with responsive design
- **Service layer** for API integration

### Project Structure
```
src/
├── components/          # React components
│   ├── ProductCatalog.tsx
│   └── Cart.tsx
├── contexts/           # React contexts
│   └── CartContext.tsx
├── services/           # API services
│   ├── api.ts
│   └── productService.ts
├── types/              # TypeScript definitions
│   └── product.ts
├── utils/              # Utility functions
│   ├── errorHandler.ts
│   └── formatters.ts
├── config/             # Configuration
│   └── environment.ts
└── App.tsx             # Main application component
```

---

## Core Components

### 1. ProductCatalog Component
**File:** `src/components/ProductCatalog.tsx`

**Purpose:** Main interface for browsing and managing the product catalog.

**Key Features:**
- Product grid/list display
- Search and filtering capabilities
- Sorting options (price, name, category)
- Product detail views
- Add to cart functionality
- Responsive design for mobile and desktop
- Loading states and error handling
- Pagination for large product sets

**Expected Props Interface:**
```typescript
interface ProductCatalogProps {
  initialFilters?: ProductFilters
  displayMode?: 'grid' | 'list'
  itemsPerPage?: number
  onProductSelect?: (product: Product) => void
}
```

**State Management:**
- Integrates with `CartContext` for cart operations
- Local state for UI preferences and filters
- API service integration for product data fetching

**Key Functionalities:**
- Product fetching with error handling
- Real-time search and filtering
- Sort operations with multiple criteria
- Cart integration with quantity selection
- Mobile-responsive layout switching

---

### 2. Cart Component
**File:** `src/components/Cart.tsx`

**Purpose:** Shopping cart interface for managing selected products.

**Key Features:**
- Cart item display with product details
- Quantity management (increase/decrease)
- Item removal with confirmation
- Real-time price calculations
- Checkout preparation and validation
- Empty cart state with call-to-action
- Cart summary with totals and taxes

**Expected Props Interface:**
```typescript
interface CartProps {
  isOpen?: boolean
  onClose?: () => void
  showCheckoutButton?: boolean
  allowQuantityEdit?: boolean
}
```

**Integration Points:**
- Uses `CartContext` for all cart operations
- Integrates with product service for updated pricing
- Connects to checkout flow (future implementation)

**Key Functionalities:**
- Add/remove items with animations
- Bulk quantity updates
- Price calculations with tax handling
- Persistent cart state
- Checkout preparation

---

## Context Providers

### CartContext
**File:** `src/contexts/CartContext.tsx`

**Purpose:** Global state management for shopping cart functionality across the application.

**Context Interface:**
```typescript
interface CartContextValue {
  // Cart State
  items: CartItem[]
  itemCount: number
  subtotal: number
  tax: number
  total: number
  
  // Cart Operations
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  
  // Cart Utilities
  getItemQuantity: (productId: string) => number
  isInCart: (productId: string) => boolean
}
```

**Features:**
- Persistent cart state (localStorage integration)
- Real-time calculations (subtotal, tax, total)
- Cart validation and business rules
- Integration with product service for pricing updates
- Event emission for cart changes

**Usage Example:**
```typescript
import { useCart } from '../contexts/CartContext'

function ProductCard({ product }) {
  const { addToCart, isInCart, getItemQuantity } = useCart()
  
  const handleAddToCart = () => {
    addToCart(product, 1)
  }
  
  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={handleAddToCart}>
        {isInCart(product.id) ? 'Update Cart' : 'Add to Cart'}
      </button>
    </div>
  )
}
```

---

## Service Layer

### 1. API Service
**File:** `src/services/api.ts`

**Purpose:** Core HTTP client for all backend communication.

**Features:**
- Base HTTP client with configurable endpoints
- Request/response interceptors for common logic
- Error handling and retry mechanisms
- Authentication token management
- Type-safe request/response handling
- Request caching for performance

**Expected Interface:**
```typescript
class ApiService {
  // Core HTTP methods
  get<T>(endpoint: string, config?: RequestConfig): Promise<T>
  post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T>
  put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T>
  delete<T>(endpoint: string, config?: RequestConfig): Promise<T>
  
  // Utility methods
  setAuthToken(token: string): void
  clearAuthToken(): void
  setBaseURL(url: string): void
}
```

### 2. Product Service
**File:** `src/services/productService.ts`

**Purpose:** Product-specific API operations and business logic.

**Features:**
- Complete product CRUD operations
- Advanced search and filtering
- Category and tag management
- Image upload and management
- Product availability checking
- Price history and discounts

**Expected Interface:**
```typescript
class ProductService {
  // Product retrieval
  getProducts(filters?: ProductFilters): Promise<Product[]>
  getProduct(id: string): Promise<Product>
  getProductsByCategory(category: string): Promise<Product[]>
  
  // Product search
  searchProducts(query: string): Promise<Product[]>
  getProductSuggestions(query: string): Promise<string[]>
  
  // Product management (admin)
  createProduct(product: ProductRequest): Promise<Product>
  updateProduct(id: string, updates: Partial<ProductRequest>): Promise<Product>
  deleteProduct(id: string): Promise<void>
  
  // Utility operations
  checkAvailability(productId: string): Promise<boolean>
  getRelatedProducts(productId: string): Promise<Product[]>
}
```

---

## Type Definitions

### Core Product Types
**File:** `src/types/product.ts`

```typescript
// Main product interface
interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  subcategory?: string
  tags: string[]
  imageUrl?: string
  images: string[]
  inStock: boolean
  stockQuantity: number
  dimensions?: ProductDimensions
  weight?: number
  material?: string
  brand?: string
  rating?: number
  reviewCount?: number
  createdAt: Date
  updatedAt: Date
}

// Product dimensions
interface ProductDimensions {
  length: number
  width: number
  height: number
  unit: 'cm' | 'in'
}

// Cart item with quantity
interface CartItem {
  product: Product
  quantity: number
  addedAt: Date
  notes?: string
}

// Product filtering options
interface ProductFilters {
  category?: string
  subcategory?: string
  tags?: string[]
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  searchQuery?: string
  brand?: string
  rating?: number
  sortBy?: 'name' | 'price' | 'rating' | 'newest'
  sortOrder?: 'asc' | 'desc'
}

// Product creation/update request
interface ProductRequest {
  name: string
  description: string
  price: number
  category: string
  subcategory?: string
  tags?: string[]
  imageUrl?: string
  stockQuantity: number
  dimensions?: ProductDimensions
  weight?: number
  material?: string
  brand?: string
}
```

---

## Utility Functions

### Error Handler
**File:** `src/utils/errorHandler.ts`

**Purpose:** Centralized error handling and user feedback system.

**Features:**
- API error classification and handling
- User-friendly error message generation
- Error logging and reporting
- Retry mechanisms for network errors
- Toast notification integration

**Expected Interface:**
```typescript
class ErrorHandler {
  static handleApiError(error: ApiError): UserFriendlyError
  static logError(error: Error, context?: string): void
  static showErrorToast(message: string): void
  static createRetryHandler(operation: () => Promise<any>, maxRetries: number): Promise<any>
}
```

### Formatters
**File:** `src/utils/formatters.ts`

**Purpose:** Data formatting utilities for consistent display.

**Features:**
- Currency and price formatting
- Date and time formatting
- Number formatting with localization
- Dimension and measurement formatting
- Text truncation and sanitization

**Expected Interface:**
```typescript
// Price and currency formatting
function formatPrice(amount: number, currency: string = 'USD'): string
function formatDiscount(originalPrice: number, currentPrice: number): string

// Date formatting
function formatDate(date: Date, format: 'short' | 'medium' | 'long'): string
function formatRelativeTime(date: Date): string

// Product data formatting
function formatDimensions(dimensions: ProductDimensions): string
function formatWeight(weight: number, unit: string): string
function truncateDescription(text: string, maxLength: number): string
```

---

## Configuration

### Environment Configuration
**File:** `src/config/environment.ts`

**Purpose:** Environment-specific configuration management.

**Configuration Options:**
```typescript
interface EnvironmentConfig {
  API_BASE_URL: string
  API_TIMEOUT: number
  ENABLE_CACHING: boolean
  CACHE_DURATION: number
  ENABLE_ANALYTICS: boolean
  ENABLE_ERROR_REPORTING: boolean
  MAX_CART_ITEMS: number
  DEFAULT_CURRENCY: string
  SUPPORTED_CURRENCIES: string[]
  IMAGE_CDN_URL?: string
  FEATURE_FLAGS: {
    enableProductReviews: boolean
    enableWishlist: boolean
    enableComparison: boolean
    enableLiveChat: boolean
  }
}
```

---

## Integration Patterns

### 1. Component Integration
```typescript
// Main App integration
import React from 'react'
import { CartProvider } from './contexts/CartContext'
import { ProductCatalog } from './components/ProductCatalog'
import { Cart } from './components/Cart'

function App() {
  return (
    <CartProvider>
      <div className="app">
        <header>
          <Cart />
        </header>
        <main>
          <ProductCatalog />
        </main>
      </div>
    </CartProvider>
  )
}
```

### 2. Service Integration
```typescript
// Service initialization and usage
import { apiService } from './services/api'
import { productService } from './services/productService'

// Configure API service
apiService.setBaseURL(process.env.API_BASE_URL)
apiService.setAuthToken(userToken)

// Use product service in components
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const products = await productService.getProducts(filters)
      setProducts(products)
    } catch (error) {
      ErrorHandler.handleApiError(error)
    }
  }
  
  fetchProducts()
}, [filters])
```

---

## Performance Optimization

### Component Optimization
- **React.memo** for preventing unnecessary re-renders
- **useMemo** for expensive calculations (cart totals, filtering)
- **useCallback** for event handlers and API calls
- **Lazy loading** for images and non-critical components
- **Virtual scrolling** for large product lists

### Bundle Optimization
- Code splitting with dynamic imports
- Tree shaking for unused code elimination
- Asset optimization and compression
- Service worker for caching strategies

---

## Testing Strategy

### Component Testing
```typescript
// Example test structure
describe('ProductCatalog', () => {
  test('renders product list correctly', () => {
    // Test implementation
  })
  
  test('handles search filtering', () => {
    // Test implementation
  })
  
  test('integrates with cart context', () => {
    // Test implementation
  })
})
```

### Integration Testing
- API service integration tests
- Context provider testing
- End-to-end user workflows
- Performance and accessibility testing

---

## Accessibility Features

### ARIA Implementation
- Proper semantic HTML structure
- ARIA labels for interactive elements
- Screen reader optimization
- Keyboard navigation support

### Responsive Design
- Mobile-first CSS approach
- Touch-friendly interface elements
- Flexible layouts for all screen sizes
- Progressive enhancement

---

## Browser Support
- **Modern browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile browsers:** iOS Safari, Chrome Mobile, Samsung Internet
- **Progressive enhancement** for older browsers
- **Polyfills** for missing features

---

## Development Guidelines

### Code Standards
1. Use TypeScript for all new code
2. Follow React best practices and hooks patterns
3. Implement proper error boundaries
4. Add comprehensive prop types and interfaces
5. Include unit tests for all components
6. Follow naming conventions for files and components

### Performance Guidelines
1. Minimize bundle size with code splitting
2. Optimize images and assets
3. Implement proper caching strategies
4. Use React DevTools for performance monitoring
5. Monitor and optimize Core Web Vitals

### Security Considerations
1. Sanitize user input and API responses
2. Implement proper CORS configuration
3. Use HTTPS for all API communications
4. Validate data at component boundaries
5. Implement proper authentication token handling

---

This documentation provides a comprehensive overview of the Product Catalog UI components and their integrations. For specific implementation details, refer to the individual component files and their inline documentation.