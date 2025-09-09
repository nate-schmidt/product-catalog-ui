# 🛒 ShopMart - E-commerce with Coupon System

## Available Coupon Codes

Test the coupon functionality with these codes:

### Active Coupons

| Code | Type | Discount | Min Order | Max Discount | Description |
|------|------|----------|-----------|--------------|-------------|
| `WELCOME10` | Percentage | 10% | $50 | - | 10% off your first order |
| `SAVE25` | Fixed | $25 | $200 | - | $25 off orders over $200 |
| `FREESHIP` | Fixed | $15 | $100 | - | Free shipping (save $15) |
| `BIGDEAL` | Percentage | 20% | - | $100 | 20% off everything (max $100 discount) |

### Expired/Invalid Coupons

| Code | Status | Description |
|------|--------|-------------|
| `EXPIRED` | Expired | 15% off (expired on Dec 31, 2024) |
| `INVALID123` | Invalid | This code doesn't exist |

## Features Implemented

### 🛍️ Product Catalog
- 6 sample products across different categories
- Product images, descriptions, and pricing
- Stock management
- Add to cart functionality

### 🛒 Shopping Cart
- Add/remove items
- Update quantities
- Real-time price calculations
- Coupon code application
- Discount calculations

### 🎟️ Coupon System
- **Percentage-based coupons** (e.g., 10% off)
- **Fixed-amount coupons** (e.g., $25 off)
- **Minimum order requirements** (e.g., must spend $50+)
- **Maximum discount limits** (e.g., 20% off capped at $100)
- **Usage limits and tracking**
- **Expiry date validation**
- **Real-time validation with error messages**

### 💳 Checkout Process
- Customer information form
- Address collection
- Payment method selection (Card/PayPal)
- Order summary with applied discounts
- Form validation
- Order confirmation

### 📋 Order Management
- Order ID generation
- Order status tracking
- Success confirmation page

## How to Test Coupon Functionality

1. **Add products to cart** - Add a few items to reach different price thresholds
2. **Go to cart** - Click the cart icon in the header
3. **Apply coupon codes** - Try the codes listed above:
   - `WELCOME10` - Works on orders $50+
   - `SAVE25` - Works on orders $200+
   - `FREESHIP` - Works on orders $100+
   - `BIGDEAL` - Works on any order, max $100 discount
   - `EXPIRED` - Will show error message
4. **See discount applied** - Watch the total update with the discount
5. **Proceed to checkout** - Complete the purchase flow

## Technical Implementation

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Context API** for cart state management
- **Form validation** and error handling

### Backend
- **Bun.serve()** for API endpoints
- **In-memory storage** for demo purposes
- **RESTful API** design
- **Coupon validation** logic

### API Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/coupons/validate` - Validate coupon code
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details

## Running the Application

```bash
# Install dependencies
bun install

# Start development server
bun --hot src/index.tsx

# Build for production
bun run build
```

The application will be available at `http://localhost:3000`