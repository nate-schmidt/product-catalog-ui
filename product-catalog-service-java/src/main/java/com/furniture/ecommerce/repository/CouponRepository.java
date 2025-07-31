package com.furniture.ecommerce.repository;

import com.furniture.ecommerce.model.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    
    Optional<Coupon> findByCodeIgnoreCase(String code);
    
    @Query("SELECT c FROM Coupon c WHERE c.code = :code AND c.isActive = true")
    Optional<Coupon> findActiveByCode(@Param("code") String code);
    
    @Query("SELECT c FROM Coupon c WHERE c.isActive = true AND c.validFrom <= :now AND c.validUntil >= :now")
    List<Coupon> findActiveAndValidCoupons(@Param("now") LocalDateTime now);
    
    @Query("SELECT c FROM Coupon c WHERE c.isActive = true AND c.validFrom <= :now AND c.validUntil >= :now AND (c.usageLimit IS NULL OR c.usedCount < c.usageLimit)")
    List<Coupon> findAvailableCoupons(@Param("now") LocalDateTime now);
    
    boolean existsByCodeIgnoreCase(String code);
}