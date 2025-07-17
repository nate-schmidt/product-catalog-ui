# Product Catalog with Coupon Support

A full-stack e-commerce product catalog application with comprehensive coupon code functionality.

## Features

- 🛍️ **Product Catalog**: Browse and search products with real-time stock tracking
- 🛒 **Shopping Cart**: Add items, update quantities, and manage your cart
- 🎫 **Coupon System**: Apply discount codes with various types and restrictions
- 💳 **Checkout**: Complete orders with applied discounts
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Coupon Features

### Supported Discount Types
- **Percentage Discounts**: e.g., 10% off entire order
- **Fixed Amount Discounts**: e.g., $20 off orders over $100

### Coupon Restrictions
- Minimum purchase requirements
- Product-specific coupons (apply only to certain categories)
- Usage limits (limit number of times a coupon can be used)
- Time-based validity (start and expiration dates)

### Sample Coupons
- `WELCOME10` - 10% off for new customers (min $50)
- `SAVE20` - $20 off orders over $100
- `ELECTRONICS15` - 15% off electronics only (min $200)
- `BLACKFRIDAY` - 25% off everything (limited to 100 uses)
- `OFFICE50` - $50 off office furniture (min $300)

## Tech Stack

### Frontend
- **Runtime**: Bun
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks
- **API Client**: Native fetch API

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite with SQLAlchemy ORM
- **API**: RESTful JSON API
- **CORS**: Enabled for local development

## Getting Started

### Prerequisites
- [Bun](https://bun.sh) (for frontend)
- Python 3.8+ (for backend)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd product-catalog-service
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Initialize the database:
```bash
python init_db.py
```

5. Start the backend server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd product-catalog-ui
```

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun dev
```

The application will be available at `http://localhost:3000`

## Usage

1. **Browse Products**: View the product catalog on the main page
2. **Add to Cart**: Click "Add to Cart" on any product
3. **View Cart**: Click the cart icon in the header
4. **Apply Coupon**: 
   - View available coupons in the coupon list
   - Click "Copy Code" to copy a coupon code
   - Paste the code in the cart's coupon field
   - Click "Apply" to see the discount
5. **Checkout**: Click "Proceed to Checkout" to complete your order

## API Documentation

When the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

### Key Endpoints

#### Coupon Validation
```bash
POST /api/coupons/validate
{
  "code": "WELCOME10",
  "cart_items": [
    {"product_id": 1, "quantity": 2}
  ]
}
```

#### Cart Summary with Coupon
```bash
GET /api/cart/{session_id}/summary?coupon_code=WELCOME10
```

## Project Structure

```
.
├── product-catalog-ui/          # React frontend
│   ├── src/
│   │   ├── api/                # API client
│   │   ├── components/         # React components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── Cart.tsx
│   │   │   └── CouponList.tsx
│   │   ├── types.ts           # TypeScript types
│   │   └── App.tsx            # Main app component
│   └── package.json
│
└── product-catalog-service/     # FastAPI backend
    ├── models.py               # SQLAlchemy models
    ├── schemas.py              # Pydantic schemas
    ├── crud.py                 # Database operations
    ├── main.py                 # FastAPI application
    └── init_db.py              # Database initialization
```

## Development

### Adding New Coupon Types

1. Update the discount type enum in `schemas.py`
2. Implement validation logic in `crud.py`
3. Update the frontend types in `types.ts`
4. Add UI support in the Cart component

### Testing Coupons

The application includes various test scenarios:
- Valid coupons with different discount types
- Expired coupons (e.g., `EXPIRED`)
- Category-specific coupons
- Minimum purchase requirements
- Usage limit enforcement

---

Built with modern web technologies for a seamless shopping experience with comprehensive coupon support.
