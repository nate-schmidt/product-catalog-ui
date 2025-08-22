# API Documentation

## Overview

The Product Catalog UI includes a Bun-powered backend server that provides API endpoints for the frontend application. Currently, it includes basic demonstration endpoints with plans for full ecommerce functionality.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: TBD

## Current Endpoints

### Health Check / Demo Endpoints

#### GET /api/hello

Returns a simple greeting message.

**Response:**
```json
{
  "message": "Hello, world!",
  "method": "GET"
}
```

**Example:**
```bash
curl http://localhost:3000/api/hello
```

#### PUT /api/hello

Returns a greeting message via PUT method (demo endpoint).

**Response:**
```json
{
  "message": "Hello, world!",
  "method": "PUT"
}
```

**Example:**
```bash
curl -X PUT http://localhost:3000/api/hello
```

#### GET /api/hello/:name

Returns a personalized greeting.

**Parameters:**
- `name` (string, required): The name to include in the greeting

**Response:**
```json
{
  "message": "Hello, {name}!"
}
```

**Example:**
```bash
curl http://localhost:3000/api/hello/Captain
# Returns: {"message": "Hello, Captain!"}
```

## Planned API Endpoints

### Products

#### GET /api/products

Retrieve all products with optional filtering and pagination.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)
- `category` (string, optional): Filter by category
- `search` (string, optional): Search term for product name/description
- `minPrice` (number, optional): Minimum price filter
- `maxPrice` (number, optional): Maximum price filter

#### GET /api/products/:id

Retrieve a specific product by ID.

#### POST /api/products

Create a new product (admin only).

#### PUT /api/products/:id

Update a product (admin only).

#### DELETE /api/products/:id

Delete a product (admin only).

### Categories

#### GET /api/categories

Retrieve all product categories.

#### POST /api/categories

Create a new category (admin only).

### Cart

#### GET /api/cart

Retrieve current user's cart.

#### POST /api/cart/items

Add item to cart.

#### PUT /api/cart/items/:id

Update cart item quantity.

#### DELETE /api/cart/items/:id

Remove item from cart.

## Data Models

### Product

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  category: string;
  tags: string[];
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Category

```typescript
interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  imageUrl?: string;
}
```

### CartItem

```typescript
interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  addedAt: string;
}
```

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Optional additional details
  }
}
```

### Common Error Codes

- `PRODUCT_NOT_FOUND` (404): Product with specified ID not found
- `INVALID_PARAMETERS` (400): Invalid or missing required parameters
- `UNAUTHORIZED` (401): Authentication required
- `FORBIDDEN` (403): Insufficient permissions
- `INTERNAL_ERROR` (500): Server error

## Authentication

Authentication system is planned but not yet implemented. Future endpoints will use:

- JWT tokens for session management
- Role-based access control (admin, customer)
- OAuth integration for social login

## Rate Limiting

Rate limiting will be implemented to prevent abuse:

- 100 requests per minute for authenticated users
- 20 requests per minute for anonymous users
- Higher limits for admin users

## Development

### Adding New Endpoints

1. Add route definition in `src/index.tsx`
2. Implement handler function
3. Add TypeScript types for request/response
4. Update this documentation
5. Add tests

### Testing API Endpoints

```bash
# Start development server
bun dev

# In another terminal, test endpoints
curl http://localhost:3000/api/hello
curl http://localhost:3000/api/hello/TestUser
```

## Notes

- All endpoints return JSON responses
- CORS is configured for development
- Hot reloading is enabled for API changes during development
- The server automatically restarts when files change