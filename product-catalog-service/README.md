# Product Catalog Service

A FastAPI backend service for an e-commerce product catalog with comprehensive coupon support.

## Features

- **Product Management**: CRUD operations for products with stock tracking
- **Shopping Cart**: Session-based cart management for anonymous users
- **Coupon System**: Advanced coupon functionality with multiple discount types
- **Order Processing**: Complete checkout flow with coupon application

## Coupon Features

### Discount Types
- **Percentage Discounts**: Apply percentage-based discounts (e.g., 10% off)
- **Fixed Amount Discounts**: Apply fixed dollar amount discounts (e.g., $20 off)

### Coupon Restrictions
- **Minimum Purchase Requirements**: Set minimum order amount for coupon eligibility
- **Product-Specific Coupons**: Limit coupons to specific products or categories
- **Usage Limits**: Control how many times a coupon can be used
- **Time-Based Validity**: Set start and end dates for coupon validity

### Validation Rules
- Checks if coupon is active and not expired
- Validates minimum purchase requirements
- Ensures usage limits haven't been exceeded
- Verifies coupon applies to items in cart
- Calculates correct discount based on applicable products

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Initialize the database with sample data:
```bash
python init_db.py
```

4. Run the server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## Sample Coupons

The following coupons are created during initialization:

| Code | Description | Type | Value | Min Purchase | Restrictions |
|------|-------------|------|-------|--------------|--------------|
| WELCOME10 | 10% off for new customers | Percentage | 10% | $50 | All products |
| SAVE20 | $20 off on orders over $100 | Fixed | $20 | $100 | All products |
| ELECTRONICS15 | 15% off on electronics | Percentage | 15% | $200 | Electronics only |
| BLACKFRIDAY | Black Friday special | Percentage | 25% | $0 | All products, 100 uses |
| OFFICE50 | $50 off office furniture | Fixed | $50 | $300 | Office products only |

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Coupons
- `GET /api/coupons` - Get all coupons
- `GET /api/coupons/{id}` - Get coupon by ID
- `GET /api/coupons/code/{code}` - Get coupon by code
- `POST /api/coupons` - Create new coupon
- `PUT /api/coupons/{id}` - Update coupon
- `DELETE /api/coupons/{id}` - Delete coupon
- `POST /api/coupons/validate` - Validate coupon against cart items

### Cart
- `GET /api/cart/{session_id}` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/{item_id}` - Update cart item quantity
- `DELETE /api/cart/{item_id}` - Remove item from cart
- `DELETE /api/cart/clear/{session_id}` - Clear entire cart
- `GET /api/cart/{session_id}/summary` - Get cart summary with optional coupon

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/{id}` - Get order by ID
- `GET /api/orders/session/{session_id}` - Get orders by session

## Example: Applying a Coupon

1. Validate the coupon:
```bash
curl -X POST http://localhost:8000/api/coupons/validate \
  -H "Content-Type: application/json" \
  -d '{
    "code": "WELCOME10",
    "cart_items": [
      {"product_id": 1, "quantity": 1},
      {"product_id": 2, "quantity": 2}
    ]
  }'
```

2. Get cart summary with coupon:
```bash
curl http://localhost:8000/api/cart/{session_id}/summary?coupon_code=WELCOME10
```

3. Create order with coupon:
```bash
curl -X POST http://localhost:8000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "session_123",
    "subtotal": 100.00,
    "discount_amount": 10.00,
    "total": 90.00,
    "coupon_code": "WELCOME10",
    "items": [...]
  }'
```

## Database Schema

The service uses SQLite with SQLAlchemy ORM. Key models include:
- **Product**: Product catalog with pricing and stock
- **Coupon**: Coupon definitions with validation rules
- **CartItem**: Session-based shopping cart items
- **Order**: Completed orders with applied coupons
- **OrderItem**: Individual items within orders

## Development

To extend the coupon functionality:

1. Add new discount types in `schemas.py`
2. Update validation logic in `crud.py`
3. Add new endpoints in `main.py`
4. Update the frontend to support new features