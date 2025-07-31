# Product Catalog Integration Plan

## Overview
This document outlines the plan to integrate the **product-catalog-ui** (React frontend) with the **product-catalog-service-java** (Spring Boot backend) to create a fully functional e-commerce furniture catalog application.

## Current State Analysis

### Frontend (product-catalog-ui)
- **Framework**: React 19 with Bun runtime
- **Styling**: Tailwind CSS
- **State Management**: React Context (CartContext)
- **Current Data**: 3 hardcoded products
- **Product Model**: `{ id, name, description, price: string, manufacturer }`
- **Features**: Basic product display, cart functionality

### Backend (product-catalog-service-java)
- **Framework**: Spring Boot 3.2.0 with Java 17
- **Database**: H2 in-memory with 20+ sample products
- **Product Model**: `{ id, name, description, category, price: BigDecimal, stock, width, height, depth, material, color, imageUrl, createdAt, updatedAt }`
- **API**: 16 REST endpoints including CRUD, search, filtering, inventory management
- **Base URL**: `http://localhost:8080/api`
- **CORS**: Already configured for frontend integration

## Integration Challenges

1. **Product Model Mismatch**: Frontend uses `manufacturer` and `price: string`, backend uses `category`, `material`, `color` and `price: BigDecimal`
2. **Data Source**: Replace hardcoded data with API calls
3. **HTTP Client**: Need to implement API communication
4. **Error Handling**: Implement proper error states and loading indicators
5. **Enhanced Features**: Add search, filtering, categories, stock management
6. **UI Enhancement**: Display richer product information

## Phase 1: Foundation Setup (2-3 hours)

### 1.1 Update Product Models and Types
- [ ] Update `Product` interface in `CartContext.tsx` to match backend model
- [ ] Create TypeScript interfaces for API responses
- [ ] Add utility functions for price formatting and data transformation

**Files to modify:**
```
src/contexts/CartContext.tsx
src/types/product.ts (new)
src/utils/formatters.ts (new)
```

### 1.2 Add HTTP Client Infrastructure
- [ ] Install HTTP client library (considering Bun's built-in `fetch`)
- [ ] Create API service layer
- [ ] Add environment configuration for API base URL
- [ ] Implement error handling utilities

**Files to create:**
```
src/services/api.ts
src/services/productService.ts
src/config/environment.ts
src/utils/errorHandler.ts
```

### 1.3 Start Backend Service
- [ ] Ensure Java backend is running on `localhost:8080`
- [ ] Verify CORS configuration allows frontend origin
- [ ] Test API endpoints manually

**Commands:**
```bash
cd product-catalog-service-java
./gradlew bootRun
```

## Phase 2: Basic Integration (3-4 hours)

### 2.1 Replace Hardcoded Data with API Calls
- [ ] Update `ProductCatalog.tsx` to fetch products from API
- [ ] Implement loading states
- [ ] Add error handling and retry mechanisms
- [ ] Update UI to display new product fields (category, material, stock)

### 2.2 Enhanced Product Display
- [ ] Add product categories section
- [ ] Display product dimensions and material
- [ ] Show stock availability
- [ ] Add product images (placeholder or from imageUrl)
- [ ] Implement price formatting for BigDecimal values

### 2.3 Update Cart Functionality
- [ ] Ensure cart works with new product model
- [ ] Add stock validation before adding to cart
- [ ] Update cart display to show category/material instead of manufacturer

**Files to modify:**
```
src/components/ProductCatalog.tsx
src/components/Cart.tsx
src/contexts/CartContext.tsx
```

## Phase 3: Advanced Features (4-5 hours)

### 3.1 Search and Filtering
- [ ] Add search bar for product name search
- [ ] Implement category filter dropdown
- [ ] Add price range slider/inputs
- [ ] Add material and color filters
- [ ] Add stock availability filter (in-stock only)

### 3.2 Enhanced UI Components
- [ ] Create reusable ProductCard component
- [ ] Add SearchFilters component
- [ ] Implement responsive grid layout
- [ ] Add loading skeletons
- [ ] Create error boundary components

### 3.3 Additional Features
- [ ] Add product detail view/modal
- [ ] Implement sorting (price, name, category)
- [ ] Add pagination for large product lists
- [ ] Show low stock warnings

**New components to create:**
```
src/components/ProductCard.tsx
src/components/SearchFilters.tsx
src/components/ProductDetailModal.tsx
src/components/LoadingSkeleton.tsx
src/components/ErrorBoundary.tsx
```

## Phase 4: Polish and Optimization (2-3 hours)

### 4.1 Performance Optimization
- [ ] Implement debounced search
- [ ] Add request caching/memoization
- [ ] Optimize re-renders with React.memo
- [ ] Add image lazy loading

### 4.2 UX Improvements
- [ ] Add smooth transitions and animations
- [ ] Implement toast notifications for cart actions
- [ ] Add keyboard navigation support
- [ ] Improve mobile responsiveness

### 4.3 Error Handling and Edge Cases
- [ ] Handle network failures gracefully
- [ ] Add offline state detection
- [ ] Implement proper error boundaries
- [ ] Add empty states for no products found

## Technical Implementation Details

### API Service Structure
```typescript
// src/services/api.ts
export class ApiService {
  private baseURL = 'http://localhost:8080/api';
  
  async get<T>(endpoint: string): Promise<T> { }
  async post<T>(endpoint: string, data: any): Promise<T> { }
  // ... other HTTP methods
}

// src/services/productService.ts
export class ProductService {
  async getAllProducts(): Promise<Product[]> { }
  async searchProducts(filters: SearchFilters): Promise<Product[]> { }
  async getProductById(id: number): Promise<Product> { }
  async getProductFilters(): Promise<ProductFilters> { }
}
```

### Updated Product Interface
```typescript
// src/types/product.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number; // Converted from BigDecimal
  stock: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  };
  material?: string;
  color?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  inStock: boolean;
}

export interface SearchFilters {
  category?: string;
  material?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}
```

### State Management Updates
```typescript
// Enhanced CartContext with API integration
export interface CartContextType {
  // Existing cart methods
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  
  // New product management
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  error: string | null;
  
  // Search and filtering
  searchTerm: string;
  filters: SearchFilters;
  setSearchTerm: (term: string) => void;
  setFilters: (filters: SearchFilters) => void;
  
  // API actions
  loadProducts: () => Promise<void>;
  searchProducts: (filters: SearchFilters) => Promise<void>;
}
```

## Environment Setup

### Frontend Environment Variables
```bash
# .env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_ENV=development
```

### Development Workflow
1. **Start Backend**: `cd product-catalog-service-java && ./gradlew bootRun`
2. **Start Frontend**: `cd product-catalog-ui && bun run dev`
3. **Access Application**: `http://localhost:3000` (or configured port)

## Testing Strategy

### Unit Tests
- [ ] API service methods
- [ ] Product filtering logic
- [ ] Cart operations with new model
- [ ] Price formatting utilities

### Integration Tests
- [ ] Frontend-backend communication
- [ ] Error handling scenarios
- [ ] Search and filtering workflows

### E2E Tests
- [ ] Complete user journeys
- [ ] Cart to checkout flow
- [ ] Search and filter combinations

## Deployment Considerations

### Production Configuration
- [ ] Update CORS configuration for production domains
- [ ] Configure production API endpoints
- [ ] Implement proper error logging
- [ ] Add monitoring and analytics

### Build Process
- [ ] Optimize bundle size
- [ ] Configure proper caching headers
- [ ] Implement CI/CD pipeline
- [ ] Add health checks

## Timeline Summary

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| Phase 1: Foundation | 2-3 hours | API infrastructure, updated models |
| Phase 2: Basic Integration | 3-4 hours | Working API integration, enhanced UI |
| Phase 3: Advanced Features | 4-5 hours | Search, filtering, rich components |
| Phase 4: Polish | 2-3 hours | Performance, UX, error handling |
| **Total** | **11-15 hours** | **Fully integrated application** |

## Success Criteria

✅ **Functional Requirements**
- Products loaded from backend API
- Cart functionality works with real data
- Search and filtering operational
- Responsive UI across devices

✅ **Technical Requirements**
- Type-safe API communication
- Proper error handling
- Loading states implemented
- Performance optimized

✅ **User Experience**
- Intuitive navigation
- Fast load times
- Clear feedback on actions
- Graceful error recovery

## Next Steps

1. **Start with Phase 1** - Set up the foundation
2. **Test incrementally** - Verify each phase before proceeding
3. **Iterate based on feedback** - Adjust features based on testing
4. **Document as you go** - Update this plan with learnings

This integration will transform the basic React frontend into a fully functional e-commerce product catalog powered by the robust Spring Boot backend, providing users with a rich shopping experience complete with search, filtering, and cart management capabilities.