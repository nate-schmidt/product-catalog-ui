from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import datetime
from typing import Optional, List
import models, schemas

# Product CRUD
def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).offset(skip).limit(limit).all()

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product: schemas.ProductUpdate):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product:
        update_data = product.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_product, field, value)
        db.commit()
        db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
    return db_product

# Coupon CRUD
def get_coupon(db: Session, coupon_id: int):
    return db.query(models.Coupon).filter(models.Coupon.id == coupon_id).first()

def get_coupon_by_code(db: Session, code: str):
    return db.query(models.Coupon).filter(models.Coupon.code == code).first()

def get_coupons(db: Session, skip: int = 0, limit: int = 100, active_only: bool = True):
    query = db.query(models.Coupon)
    if active_only:
        query = query.filter(models.Coupon.is_active == True)
    return query.offset(skip).limit(limit).all()

def create_coupon(db: Session, coupon: schemas.CouponCreate):
    # Extract product IDs before creating the coupon
    product_ids = coupon.applicable_product_ids
    coupon_dict = coupon.dict(exclude={'applicable_product_ids'})
    
    db_coupon = models.Coupon(**coupon_dict)
    
    # Add applicable products if specified
    if product_ids:
        products = db.query(models.Product).filter(models.Product.id.in_(product_ids)).all()
        db_coupon.applicable_products = products
    
    db.add(db_coupon)
    db.commit()
    db.refresh(db_coupon)
    return db_coupon

def update_coupon(db: Session, coupon_id: int, coupon: schemas.CouponUpdate):
    db_coupon = db.query(models.Coupon).filter(models.Coupon.id == coupon_id).first()
    if db_coupon:
        update_data = coupon.dict(exclude_unset=True)
        
        # Handle applicable products separately
        if 'applicable_product_ids' in update_data:
            product_ids = update_data.pop('applicable_product_ids')
            if product_ids is not None:
                products = db.query(models.Product).filter(models.Product.id.in_(product_ids)).all()
                db_coupon.applicable_products = products
        
        for field, value in update_data.items():
            setattr(db_coupon, field, value)
        
        db.commit()
        db.refresh(db_coupon)
    return db_coupon

def delete_coupon(db: Session, coupon_id: int):
    db_coupon = db.query(models.Coupon).filter(models.Coupon.id == coupon_id).first()
    if db_coupon:
        db.delete(db_coupon)
        db.commit()
    return db_coupon

def validate_coupon(db: Session, code: str, cart_items: List[schemas.CartItemBase]) -> schemas.CouponValidationResponse:
    """Validate a coupon code against cart items"""
    coupon = get_coupon_by_code(db, code)
    
    if not coupon:
        return schemas.CouponValidationResponse(
            valid=False,
            message="Invalid coupon code"
        )
    
    # Check if coupon is active
    if not coupon.is_active:
        return schemas.CouponValidationResponse(
            valid=False,
            message="This coupon is no longer active"
        )
    
    # Check validity dates
    now = datetime.utcnow()
    if coupon.valid_from and now < coupon.valid_from:
        return schemas.CouponValidationResponse(
            valid=False,
            message="This coupon is not yet valid"
        )
    
    if coupon.valid_until and now > coupon.valid_until:
        return schemas.CouponValidationResponse(
            valid=False,
            message="This coupon has expired"
        )
    
    # Check usage limit
    if coupon.usage_limit and coupon.times_used >= coupon.usage_limit:
        return schemas.CouponValidationResponse(
            valid=False,
            message="This coupon has reached its usage limit"
        )
    
    # Calculate cart total and check minimum purchase
    cart_total = 0
    applicable_total = 0
    
    for item in cart_items:
        product = get_product(db, item.product_id)
        if product:
            item_total = product.price * item.quantity
            cart_total += item_total
            
            # Check if coupon applies to this product
            if not coupon.applicable_products or product in coupon.applicable_products:
                applicable_total += item_total
    
    if cart_total < coupon.minimum_purchase:
        return schemas.CouponValidationResponse(
            valid=False,
            message=f"Minimum purchase of ${coupon.minimum_purchase:.2f} required"
        )
    
    if applicable_total == 0:
        return schemas.CouponValidationResponse(
            valid=False,
            message="This coupon doesn't apply to any items in your cart"
        )
    
    # Calculate discount
    if coupon.discount_type == schemas.DiscountType.percentage:
        discount_amount = applicable_total * (coupon.discount_value / 100)
    else:  # fixed discount
        discount_amount = min(coupon.discount_value, applicable_total)
    
    return schemas.CouponValidationResponse(
        valid=True,
        message="Coupon applied successfully",
        discount_amount=round(discount_amount, 2),
        discount_type=coupon.discount_type,
        discount_value=coupon.discount_value
    )

def apply_coupon_to_order(db: Session, coupon_code: str):
    """Increment the usage count when a coupon is used in an order"""
    coupon = get_coupon_by_code(db, coupon_code)
    if coupon:
        coupon.times_used += 1
        db.commit()

# Cart CRUD
def get_cart_items(db: Session, session_id: str):
    return db.query(models.CartItem).filter(models.CartItem.session_id == session_id).all()

def add_to_cart(db: Session, cart_item: schemas.CartItemCreate):
    # Check if item already in cart
    existing_item = db.query(models.CartItem).filter(
        models.CartItem.session_id == cart_item.session_id,
        models.CartItem.product_id == cart_item.product_id
    ).first()
    
    if existing_item:
        existing_item.quantity += cart_item.quantity
        db.commit()
        db.refresh(existing_item)
        return existing_item
    else:
        db_cart_item = models.CartItem(**cart_item.dict())
        db.add(db_cart_item)
        db.commit()
        db.refresh(db_cart_item)
        return db_cart_item

def update_cart_item(db: Session, cart_item_id: int, quantity: int):
    db_cart_item = db.query(models.CartItem).filter(models.CartItem.id == cart_item_id).first()
    if db_cart_item:
        db_cart_item.quantity = quantity
        db.commit()
        db.refresh(db_cart_item)
    return db_cart_item

def remove_from_cart(db: Session, cart_item_id: int):
    db_cart_item = db.query(models.CartItem).filter(models.CartItem.id == cart_item_id).first()
    if db_cart_item:
        db.delete(db_cart_item)
        db.commit()
    return db_cart_item

def clear_cart(db: Session, session_id: str):
    db.query(models.CartItem).filter(models.CartItem.session_id == session_id).delete()
    db.commit()

def get_cart_summary(db: Session, session_id: str, coupon_code: Optional[str] = None) -> schemas.CartSummary:
    """Get cart summary with optional coupon applied"""
    cart_items = get_cart_items(db, session_id)
    
    subtotal = sum(item.product.price * item.quantity for item in cart_items)
    discount_amount = 0
    applied_coupon = None
    
    if coupon_code:
        cart_items_base = [
            schemas.CartItemBase(product_id=item.product_id, quantity=item.quantity) 
            for item in cart_items
        ]
        validation = validate_coupon(db, coupon_code, cart_items_base)
        
        if validation.valid:
            discount_amount = validation.discount_amount
            applied_coupon = get_coupon_by_code(db, coupon_code)
    
    total = subtotal - discount_amount
    
    return schemas.CartSummary(
        items=cart_items,
        subtotal=round(subtotal, 2),
        discount_amount=round(discount_amount, 2),
        total=round(total, 2),
        applied_coupon=applied_coupon
    )

# Order CRUD
def create_order(db: Session, order: schemas.OrderCreate):
    # Create order
    order_dict = order.dict(exclude={'items'})
    db_order = models.Order(**order_dict)
    db.add(db_order)
    db.flush()  # Flush to get the order ID
    
    # Create order items
    for item in order.items:
        db_order_item = models.OrderItem(
            order_id=db_order.id,
            **item.dict()
        )
        db.add(db_order_item)
    
    # Update coupon usage if applicable
    if order.coupon_code:
        apply_coupon_to_order(db, order.coupon_code)
    
    # Clear the cart
    clear_cart(db, order.session_id)
    
    db.commit()
    db.refresh(db_order)
    return db_order

def get_order(db: Session, order_id: int):
    return db.query(models.Order).filter(models.Order.id == order_id).first()

def get_orders(db: Session, session_id: str, skip: int = 0, limit: int = 100):
    return db.query(models.Order).filter(
        models.Order.session_id == session_id
    ).offset(skip).limit(limit).all()