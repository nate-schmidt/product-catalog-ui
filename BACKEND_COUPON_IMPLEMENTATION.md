# Backend Coupon Implementation Guide

This guide provides the necessary code for implementing coupon functionality in your Java Spring Boot backend.

## 1. Create Coupon Entity

Create `src/main/java/com/furniture/ecommerce/model/Coupon.java`:

```java
package com.furniture.ecommerce.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String code;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DiscountType discountType;
    
    @Column(nullable = false)
    private Double discountValue;
    
    private Double minPurchaseAmount;
    
    private LocalDateTime expiryDate;
    
    @Column(nullable = false)
    private boolean isActive = true;
    
    private int usageLimit;
    
    private int usageCount = 0;
    
    // Getters and setters
    public enum DiscountType {
        PERCENTAGE, FIXED
    }
    
    // Add all getters and setters here
}
```

## 2. Create Coupon Repository

Create `src/main/java/com/furniture/ecommerce/repository/CouponRepository.java`:

```java
package com.furniture.ecommerce.repository;

import com.furniture.ecommerce.model.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    Optional<Coupon> findByCodeIgnoreCase(String code);
}
```

## 3. Create DTOs

Create `src/main/java/com/furniture/ecommerce/dto/CouponValidationRequestDTO.java`:

```java
package com.furniture.ecommerce.dto;

public class CouponValidationRequestDTO {
    private String code;
    private Double cartTotal;
    
    // Getters and setters
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public Double getCartTotal() { return cartTotal; }
    public void setCartTotal(Double cartTotal) { this.cartTotal = cartTotal; }
}
```

Create `src/main/java/com/furniture/ecommerce/dto/CouponResponseDTO.java`:

```java
package com.furniture.ecommerce.dto;

public class CouponResponseDTO {
    private String code;
    private String discountType;
    private Double discountValue;
    private Double minPurchaseAmount;
    private String expiryDate;
    private boolean isActive;
    
    // Add all getters and setters
}
```

## 4. Create Coupon Service

Create `src/main/java/com/furniture/ecommerce/service/CouponService.java`:

```java
package com.furniture.ecommerce.service;

import com.furniture.ecommerce.dto.CouponResponseDTO;
import com.furniture.ecommerce.dto.CouponValidationRequestDTO;

public interface CouponService {
    CouponResponseDTO validateCoupon(CouponValidationRequestDTO request);
}
```

Create `src/main/java/com/furniture/ecommerce/service/CouponServiceImpl.java`:

```java
package com.furniture.ecommerce.service;

import com.furniture.ecommerce.dto.CouponResponseDTO;
import com.furniture.ecommerce.dto.CouponValidationRequestDTO;
import com.furniture.ecommerce.model.Coupon;
import com.furniture.ecommerce.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class CouponServiceImpl implements CouponService {
    
    @Autowired
    private CouponRepository couponRepository;
    
    @Override
    public CouponResponseDTO validateCoupon(CouponValidationRequestDTO request) {
        Coupon coupon = couponRepository.findByCodeIgnoreCase(request.getCode())
            .orElseThrow(() -> new RuntimeException("Invalid coupon code"));
        
        // Validate coupon is active
        if (!coupon.isActive()) {
            throw new RuntimeException("This coupon is no longer active");
        }
        
        // Check expiry date
        if (coupon.getExpiryDate() != null && coupon.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("This coupon has expired");
        }
        
        // Check usage limit
        if (coupon.getUsageLimit() > 0 && coupon.getUsageCount() >= coupon.getUsageLimit()) {
            throw new RuntimeException("This coupon has reached its usage limit");
        }
        
        // Check minimum purchase amount
        if (coupon.getMinPurchaseAmount() != null && request.getCartTotal() < coupon.getMinPurchaseAmount()) {
            throw new RuntimeException(String.format("Minimum purchase amount of $%.2f required", 
                coupon.getMinPurchaseAmount()));
        }
        
        // Convert to DTO
        CouponResponseDTO response = new CouponResponseDTO();
        response.setCode(coupon.getCode());
        response.setDiscountType(coupon.getDiscountType().toString().toLowerCase());
        response.setDiscountValue(coupon.getDiscountValue());
        response.setMinPurchaseAmount(coupon.getMinPurchaseAmount());
        response.setExpiryDate(coupon.getExpiryDate() != null ? coupon.getExpiryDate().toString() : null);
        response.setActive(coupon.isActive());
        
        return response;
    }
}
```

## 5. Create Coupon Controller

Create `src/main/java/com/furniture/ecommerce/controller/CouponController.java`:

```java
package com.furniture.ecommerce.controller;

import com.furniture.ecommerce.dto.CouponResponseDTO;
import com.furniture.ecommerce.dto.CouponValidationRequestDTO;
import com.furniture.ecommerce.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coupons")
@CrossOrigin(origins = "*")
public class CouponController {
    
    @Autowired
    private CouponService couponService;
    
    @PostMapping("/validate")
    public ResponseEntity<?> validateCoupon(@RequestBody CouponValidationRequestDTO request) {
        try {
            CouponResponseDTO response = couponService.validateCoupon(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    // Inner class for error response
    static class ErrorResponse {
        private String message;
        
        public ErrorResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() {
            return message;
        }
    }
}
```

## 6. Update DataInitializer

Add coupon initialization to `src/main/java/com/furniture/ecommerce/config/DataInitializer.java`:

```java
// Add to imports
import com.furniture.ecommerce.model.Coupon;
import com.furniture.ecommerce.repository.CouponRepository;

// Add to class
@Autowired
private CouponRepository couponRepository;

// Add to run method
private void initializeCoupons() {
    if (couponRepository.count() == 0) {
        Coupon coupon1 = new Coupon();
        coupon1.setCode("SAVE10");
        coupon1.setDiscountType(Coupon.DiscountType.PERCENTAGE);
        coupon1.setDiscountValue(10.0);
        coupon1.setMinPurchaseAmount(50.0);
        coupon1.setActive(true);
        couponRepository.save(coupon1);
        
        Coupon coupon2 = new Coupon();
        coupon2.setCode("WELCOME20");
        coupon2.setDiscountType(Coupon.DiscountType.PERCENTAGE);
        coupon2.setDiscountValue(20.0);
        coupon2.setMinPurchaseAmount(100.0);
        coupon2.setActive(true);
        couponRepository.save(coupon2);
        
        Coupon coupon3 = new Coupon();
        coupon3.setCode("FLAT50");
        coupon3.setDiscountType(Coupon.DiscountType.FIXED);
        coupon3.setDiscountValue(50.0);
        coupon3.setMinPurchaseAmount(200.0);
        coupon3.setActive(true);
        couponRepository.save(coupon3);
        
        Coupon coupon4 = new Coupon();
        coupon4.setCode("FREESHIP");
        coupon4.setDiscountType(Coupon.DiscountType.FIXED);
        coupon4.setDiscountValue(15.0);
        coupon4.setActive(true);
        couponRepository.save(coupon4);
        
        Coupon coupon5 = new Coupon();
        coupon5.setCode("SUMMER25");
        coupon5.setDiscountType(Coupon.DiscountType.PERCENTAGE);
        coupon5.setDiscountValue(25.0);
        coupon5.setMinPurchaseAmount(150.0);
        coupon5.setActive(true);
        couponRepository.save(coupon5);
    }
}
```

## 7. Update application.properties

Ensure your `application.properties` includes:

```properties
# Enable H2 console for testing
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JPA properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

## Frontend Integration

The frontend is already set up to call the backend API. Once you implement the backend:

1. Update `src/CartContext.tsx` to use the real API endpoint instead of the mock:

Replace:
```javascript
const { validateCoupon } = await import('./services/mockCouponApi');
const validatedCoupon = await validateCoupon(code, getCartTotal());
```

With:
```javascript
const response = await fetch(`http://localhost:8080/api/coupons/validate`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ code, cartTotal: getCartTotal() }),
});

if (!response.ok) {
  const error = await response.json();
  throw new Error(error.message || 'Invalid coupon code');
}

const validatedCoupon = await response.json();
```

## Testing

1. Start the Spring Boot backend: `./gradlew bootRun`
2. Start the frontend: `bun run dev`
3. Test with the following coupon codes:
   - SAVE10 - 10% off (min. $50)
   - WELCOME20 - 20% off (min. $100)
   - FLAT50 - $50 off (min. $200)
   - FREESHIP - $15 off
   - SUMMER25 - 25% off (min. $150)