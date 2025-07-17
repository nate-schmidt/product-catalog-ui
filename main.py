from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import models, schemas, crud
from database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Product Catalog API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Product Catalog API with Coupon Support"}

# Product endpoints
@app.post("/api/products", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db=db, product=product)

@app.get("/api/products", response_model=List[schemas.Product])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    products = crud.get_products(db, skip=skip, limit=limit)
    return products

@app.get("/api/products/{product_id}", response_model=schemas.Product)
def read_product(product_id: int, db: Session = Depends(get_db)):
    db_product = crud.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@app.put("/api/products/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, product: schemas.ProductUpdate, db: Session = Depends(get_db)):
    db_product = crud.update_product(db, product_id=product_id, product=product)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@app.delete("/api/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = crud.delete_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

# Coupon endpoints
@app.post("/api/coupons", response_model=schemas.Coupon)
def create_coupon(coupon: schemas.CouponCreate, db: Session = Depends(get_db)):
    # Check if coupon code already exists
    existing_coupon = crud.get_coupon_by_code(db, code=coupon.code)
    if existing_coupon:
        raise HTTPException(status_code=400, detail="Coupon code already exists")
    return crud.create_coupon(db=db, coupon=coupon)

@app.get("/api/coupons", response_model=List[schemas.Coupon])
def read_coupons(
    skip: int = 0, 
    limit: int = 100, 
    active_only: bool = Query(True, description="Filter for active coupons only"),
    db: Session = Depends(get_db)
):
    coupons = crud.get_coupons(db, skip=skip, limit=limit, active_only=active_only)
    return coupons

@app.get("/api/coupons/{coupon_id}", response_model=schemas.Coupon)
def read_coupon(coupon_id: int, db: Session = Depends(get_db)):
    db_coupon = crud.get_coupon(db, coupon_id=coupon_id)
    if db_coupon is None:
        raise HTTPException(status_code=404, detail="Coupon not found")
    return db_coupon

@app.get("/api/coupons/code/{code}", response_model=schemas.Coupon)
def read_coupon_by_code(code: str, db: Session = Depends(get_db)):
    db_coupon = crud.get_coupon_by_code(db, code=code)
    if db_coupon is None:
        raise HTTPException(status_code=404, detail="Coupon not found")
    return db_coupon

@app.put("/api/coupons/{coupon_id}", response_model=schemas.Coupon)
def update_coupon(coupon_id: int, coupon: schemas.CouponUpdate, db: Session = Depends(get_db)):
    db_coupon = crud.update_coupon(db, coupon_id=coupon_id, coupon=coupon)
    if db_coupon is None:
        raise HTTPException(status_code=404, detail="Coupon not found")
    return db_coupon

@app.delete("/api/coupons/{coupon_id}")
def delete_coupon(coupon_id: int, db: Session = Depends(get_db)):
    db_coupon = crud.delete_coupon(db, coupon_id=coupon_id)
    if db_coupon is None:
        raise HTTPException(status_code=404, detail="Coupon not found")
    return {"message": "Coupon deleted successfully"}

@app.post("/api/coupons/validate", response_model=schemas.CouponValidationResponse)
def validate_coupon(validation: schemas.CouponValidationRequest, db: Session = Depends(get_db)):
    """Validate a coupon code against cart items"""
    return crud.validate_coupon(db, code=validation.code, cart_items=validation.cart_items)

# Cart endpoints
@app.get("/api/cart/{session_id}", response_model=List[schemas.CartItem])
def read_cart(session_id: str, db: Session = Depends(get_db)):
    return crud.get_cart_items(db, session_id=session_id)

@app.post("/api/cart", response_model=schemas.CartItem)
def add_to_cart(cart_item: schemas.CartItemCreate, db: Session = Depends(get_db)):
    # Verify product exists
    product = crud.get_product(db, product_id=cart_item.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check stock
    if product.stock < cart_item.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")
    
    return crud.add_to_cart(db=db, cart_item=cart_item)

@app.put("/api/cart/{cart_item_id}", response_model=schemas.CartItem)
def update_cart_item(cart_item_id: int, update: schemas.CartUpdate, db: Session = Depends(get_db)):
    db_cart_item = crud.update_cart_item(db, cart_item_id=cart_item_id, quantity=update.quantity)
    if db_cart_item is None:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    # Check stock
    if db_cart_item.product.stock < update.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")
    
    return db_cart_item

@app.delete("/api/cart/{cart_item_id}")
def remove_from_cart(cart_item_id: int, db: Session = Depends(get_db)):
    db_cart_item = crud.remove_from_cart(db, cart_item_id=cart_item_id)
    if db_cart_item is None:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"message": "Item removed from cart"}

@app.delete("/api/cart/clear/{session_id}")
def clear_cart(session_id: str, db: Session = Depends(get_db)):
    crud.clear_cart(db, session_id=session_id)
    return {"message": "Cart cleared"}

@app.get("/api/cart/{session_id}/summary", response_model=schemas.CartSummary)
def get_cart_summary(session_id: str, coupon_code: Optional[str] = None, db: Session = Depends(get_db)):
    """Get cart summary with optional coupon applied"""
    return crud.get_cart_summary(db, session_id=session_id, coupon_code=coupon_code)

# Order endpoints
@app.post("/api/orders", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    # Validate coupon if provided
    if order.coupon_code:
        cart_items = [
            schemas.CartItemBase(product_id=item.product_id, quantity=item.quantity)
            for item in order.items
        ]
        validation = crud.validate_coupon(db, code=order.coupon_code, cart_items=cart_items)
        if not validation.valid:
            raise HTTPException(status_code=400, detail=validation.message)
    
    # Check stock for all items
    for item in order.items:
        product = crud.get_product(db, product_id=item.product_id)
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        if product.stock < item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")
    
    # Create the order
    db_order = crud.create_order(db=db, order=order)
    
    # Update product stock
    for item in order.items:
        product = crud.get_product(db, product_id=item.product_id)
        product.stock -= item.quantity
        db.commit()
    
    return db_order

@app.get("/api/orders/{order_id}", response_model=schemas.Order)
def read_order(order_id: int, db: Session = Depends(get_db)):
    db_order = crud.get_order(db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order

@app.get("/api/orders/session/{session_id}", response_model=List[schemas.Order])
def read_orders_by_session(session_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_orders(db, session_id=session_id, skip=skip, limit=limit)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)