# API Documentation

This document describes the API endpoints available in the Product Catalog UI application.

## Base URL
- Development: `http://localhost:3000`
- Production: Depends on deployment configuration

## Endpoints

### Hello API

#### GET /api/hello
Returns a simple greeting message.

**Response**:
```json
{
  "message": "Hello, world!",
  "method": "GET"
}
```

**Status Codes**:
- `200 OK` - Success

#### PUT /api/hello
Returns a greeting message via PUT method.

**Response**:
```json
{
  "message": "Hello, world!",
  "method": "PUT"
}
```

**Status Codes**:
- `200 OK` - Success

#### GET /api/hello/:name
Returns a personalized greeting message.

**Parameters**:
- `name` (string) - The name to include in the greeting (URL parameter)

**Example Request**:
```
GET /api/hello/John
```

**Response**:
```json
{
  "message": "Hello, John!"
}
```

**Status Codes**:
- `200 OK` - Success

## Server Configuration

The API is built using Bun's built-in server with the following features:

### Development Mode
- Hot Module Replacement (HMR) enabled
- Browser console logs echoed to server console
- Automatic file watching and reloading

### Production Mode
- HMR disabled for performance
- Optimized for production serving

### Routing
- API routes are handled by the server
- All non-API routes (`/*`) serve the main HTML file for single-page application behavior
- This enables client-side routing for the React application

## Future API Endpoints

Based on the project's ecommerce nature, future endpoints may include:

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create new product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/:id/products` - Get products by category

### Cart
- `GET /api/cart` - Get current cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove item from cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details