from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum

class DiscountType(str, Enum):
    percentage = "percentage"
    fixed = "fixed"

# Product schemas
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float = Field(gt=0)
    stock: int = Field(ge=0, default=0)
    image_url: Optional[str] = None
    category: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    name: Optional[str] = None
    price: Optional[float] = Field(gt=0, default=None)
    stock: Optional[int] = Field(ge=0, default=None)

class Product(ProductBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Coupon schemas
class CouponBase(BaseModel):
    code: str = Field(min_length=3, max_length=50)
    description: str
    discount_type: DiscountType
    discount_value: float = Field(gt=0)
    minimum_purchase: float = Field(ge=0, default=0)
    usage_limit: Optional[int] = Field(ge=1, default=None)
    is_active: bool = True
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    applicable_product_ids: List[int] = []  # Empty means applicable to all

    @validator('discount_value')
    def validate_discount_value(cls, v, values):
        if 'discount_type' in values:
            if values['discount_type'] == DiscountType.percentage and v > 100:
                raise ValueError('Percentage discount cannot exceed 100%')
        return v

class CouponCreate(CouponBase):
    pass

class CouponUpdate(BaseModel):
    description: Optional[str] = None
    discount_type: Optional[DiscountType] = None
    discount_value: Optional[float] = Field(gt=0, default=None)
    minimum_purchase: Optional[float] = Field(ge=0, default=None)
    usage_limit: Optional[int] = Field(ge=1, default=None)
    is_active: Optional[bool] = None
    valid_until: Optional[datetime] = None
    applicable_product_ids: Optional[List[int]] = None

class Coupon(CouponBase):
    id: int
    times_used: int
    created_at: datetime
    applicable_products: List[Product] = []

    class Config:
        from_attributes = True

# Cart schemas
class CartItemBase(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)

class CartItemCreate(CartItemBase):
    session_id: str

class CartItem(CartItemBase):
    id: int
    session_id: str
    product: Product
    created_at: datetime

    class Config:
        from_attributes = True

class CartUpdate(BaseModel):
    quantity: int = Field(gt=0)

# Coupon validation schemas
class CouponValidationRequest(BaseModel):
    code: str
    cart_items: List[CartItemBase]

class CouponValidationResponse(BaseModel):
    valid: bool
    message: str
    discount_amount: float = 0
    discount_type: Optional[DiscountType] = None
    discount_value: Optional[float] = None

# Order schemas
class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    price: float

class OrderItem(OrderItemBase):
    id: int
    product: Product

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    session_id: str
    subtotal: float
    discount_amount: float = 0
    total: float
    coupon_code: Optional[str] = None

class OrderCreate(OrderBase):
    items: List[OrderItemBase]

class Order(OrderBase):
    id: int
    created_at: datetime
    items: List[OrderItem] = []

    class Config:
        from_attributes = True

# Cart summary for checkout
class CartSummary(BaseModel):
    items: List[CartItem]
    subtotal: float
    discount_amount: float = 0
    total: float
    applied_coupon: Optional[Coupon] = None