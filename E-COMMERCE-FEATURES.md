# E-Commerce System Features

## Overview
A full-featured e-commerce application built with Bun, React, TypeScript, and Tailwind CSS, featuring product management, coupon system, and shopping cart functionality.

## 🛍️ Product Management System

### Features:
- **Dynamic Product Catalog**: Real products with images, descriptions, and pricing
- **Inventory Management**: Track stock levels, prevent overselling
- **Sale Pricing**: Support for regular and sale prices
- **Product Categories**: Filter products by category
- **Product Tags**: Organize products with multiple tags
- **Active/Inactive Status**: Control product visibility

### Sample Products Included:
- MacBook Pro 16" - $2,299.99 (Sale from $2,499.99)
- Sony WH-1000XM5 Headphones - $399.99
- Apple Watch Ultra 2 - $799.99
- Samsung 65" OLED 4K TV - $1,499.99 (Sale from $1,799.99)
- PlayStation 5 - $499.99
- Dyson V15 Detect - $649.99 (Sale from $749.99)
- iPhone 15 Pro Max - $1,199.99
- Bose SoundLink Revolve+ - $279.99 (Sale from $329.99)
- Canon EOS R5 - $3,899.99
- DJI Air 3 Drone - $1,099.99

### Admin Features:
- Create, Read, Update, Delete (CRUD) operations
- Image URL management
- Inventory tracking
- Price and sale price management
- Category and tag management

## 🎫 Coupon Code System

### Features:
- **Two Discount Types**: 
  - Percentage-based (e.g., 20% off)
  - Fixed amount (e.g., $10 off)
- **Usage Limits**: Control how many times a coupon can be used
- **Minimum Order Values**: Require minimum purchase amounts
- **Expiry Dates**: Automatic expiration handling
- **Real-time Validation**: Instant feedback when applying coupons

### Sample Coupons:
- **WELCOME20**: 20% off orders over $50
- **SAVE10**: $10 off orders over $30

### Admin Features:
- Create new coupons with all settings
- View usage statistics
- Activate/deactivate coupons
- Delete expired coupons

## 🛒 Shopping Cart Features

### Customer Features:
- Add products to cart with inventory checking
- Update quantities with stock validation
- View cart total with sale prices
- Remove items from cart
- Apply coupon codes at checkout
- Order completion flow

### Smart Features:
- Low stock warnings (when ≤ 5 items left)
- Out of stock handling
- Sale price calculations
- Inventory limit enforcement

## 🔐 API Endpoints

### Public Endpoints:
- `GET /api/products/shop` - Get all active products
- `POST /api/coupons/validate` - Validate coupon code
- `POST /api/coupons/apply` - Apply coupon to order

### Admin Endpoints (require auth):
#### Products:
- `GET /api/products` - List all products
- `POST /api/products` - Create new product
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

#### Coupons:
- `GET /api/coupons` - List all coupons
- `POST /api/coupons` - Create new coupon
- `PUT /api/coupons/:code` - Update coupon
- `DELETE /api/coupons/:code` - Delete coupon

## 🎨 UI Features

### Design:
- Modern dark theme with Tailwind CSS
- Responsive grid layout
- Product image galleries
- Category filtering
- Loading states
- Error handling
- Image fallbacks

### User Experience:
- Sticky navigation bar
- Cart preview in header
- Real-time price calculations
- Visual feedback for actions
- Sale badges
- Stock indicators

## 🚀 Running the Application

1. **Start the server**:
   ```bash
   bun run dev
   ```

2. **Access the application**:
   - Shop: http://localhost:3000
   - Admin: Click "Admin" in navigation

3. **Test Features**:
   - Browse products by category
   - Add items to cart
   - Apply coupon codes (WELCOME20 or SAVE10)
   - Manage products and coupons in admin panel

## 📝 Notes

- **Authentication**: Currently uses simple Bearer token (`admin-secret`)
- **Storage**: In-memory storage (replace with database for production)
- **Images**: External URLs used for product images
- **Security**: Implement proper authentication for production use

## 🔧 Tech Stack

- **Runtime**: Bun
- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS
- **Server**: Bun.serve() with built-in routing
- **Build**: Bun's built-in bundler