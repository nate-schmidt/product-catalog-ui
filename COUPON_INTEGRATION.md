# Coupon Code Integration Guide

## Frontend Implementation

The cart flow now supports coupon codes with the following features:

### Features
- Apply discount codes to cart
- Support for percentage and fixed amount discounts
- Minimum purchase amount validation
- Visual feedback for applied coupons
- Easy coupon removal

### Available Test Coupons
- **SAVE10** - 10% off entire purchase
- **FLAT20** - $20 off (requires minimum $100 purchase)
- **WELCOME15** - 15% off entire purchase

### Components

1. **CartContext** (`src/CartContext.tsx`)
   - Manages cart state and coupon application
   - Calculates discounts based on coupon type
   - Validates minimum purchase requirements

2. **CartDisplay** (`src/components/CartDisplay.tsx`)
   - Shows cart items with quantity controls
   - Coupon input field with apply/remove buttons
   - Displays subtotal, discount, and final total

3. **ProductCatalog** (`src/components/ProductCatalog.tsx`)
   - Displays products with add to cart functionality

## Backend Integration Points

### 1. Coupon Validation Endpoint
**Endpoint**: `POST /api/coupons/validate/{code}`

**Request Body**:
```json
{
  "code": "SAVE10",
  "cartTotal": 150.00
}
```

**Success Response** (200):
```json
{
  "code": "SAVE10",
  "discountType": "percentage",
  "discountValue": 10,
  "minPurchaseAmount": null,
  "expiryDate": null,
  "isActive": true
}
```

**Error Response** (400):
```json
{
  "error": "Invalid coupon code"
}
```

### 2. Java Backend Implementation

To implement in the Java backend, create:

**Coupon Entity**:
```java
@Entity
public class Coupon {
    @Id
    private String code;
    private String discountType; // "percentage" or "fixed"
    private BigDecimal discountValue;
    private BigDecimal minPurchaseAmount;
    private LocalDateTime expiryDate;
    private boolean isActive;
    // getters/setters
}
```

**Coupon Controller**:
```java
@RestController
@RequestMapping("/api/coupons")
public class CouponController {
    
    @PostMapping("/validate/{code}")
    public ResponseEntity<?> validateCoupon(
            @PathVariable String code,
            @RequestBody CouponValidationRequest request) {
        // Validate coupon logic
    }
}
```

### 3. Integration Steps

1. Remove the mock coupon data from `src/index.tsx`
2. Update the API URL in `CartContext.tsx` to point to your Java backend
3. Ensure CORS is configured in your Spring Boot application
4. Implement the coupon validation logic in your Java service

### 4. Additional Features to Consider

- User-specific coupons
- Usage limits per coupon
- Expiry date validation
- Category-specific discounts
- Combining multiple coupons
- Order history with applied coupons

## Testing

1. Start the dev server: `bun --hot src/index.tsx`
2. Add products to cart
3. Try applying different coupon codes
4. Verify discount calculations
5. Test minimum purchase validation

The frontend is ready to integrate with your Java backend whenever the coupon endpoints are implemented.