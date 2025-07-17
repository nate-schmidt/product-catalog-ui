from sqlalchemy.orm import Session
from database import engine, SessionLocal
from models import Base, Product, Coupon
from datetime import datetime, timedelta

def init_db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Create a session
    db = SessionLocal()
    
    try:
        # Check if products already exist
        existing_products = db.query(Product).count()
        if existing_products > 0:
            print("Database already initialized with products")
            return
        
        # Create sample products
        products = [
            Product(
                name="Laptop Pro 15",
                description="High-performance laptop with 16GB RAM and 512GB SSD",
                price=1299.99,
                stock=10,
                category="Electronics",
                image_url="https://via.placeholder.com/300x200?text=Laptop+Pro+15"
            ),
            Product(
                name="Wireless Mouse",
                description="Ergonomic wireless mouse with precision tracking",
                price=49.99,
                stock=50,
                category="Electronics",
                image_url="https://via.placeholder.com/300x200?text=Wireless+Mouse"
            ),
            Product(
                name="USB-C Hub",
                description="7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader",
                price=79.99,
                stock=30,
                category="Electronics",
                image_url="https://via.placeholder.com/300x200?text=USB-C+Hub"
            ),
            Product(
                name="Mechanical Keyboard",
                description="RGB mechanical keyboard with blue switches",
                price=149.99,
                stock=20,
                category="Electronics",
                image_url="https://via.placeholder.com/300x200?text=Mechanical+Keyboard"
            ),
            Product(
                name="4K Webcam",
                description="Professional 4K webcam with auto-focus and noise cancellation",
                price=199.99,
                stock=15,
                category="Electronics",
                image_url="https://via.placeholder.com/300x200?text=4K+Webcam"
            ),
            Product(
                name="Desk Lamp",
                description="LED desk lamp with adjustable brightness and color temperature",
                price=39.99,
                stock=40,
                category="Office",
                image_url="https://via.placeholder.com/300x200?text=Desk+Lamp"
            ),
            Product(
                name="Standing Desk",
                description="Electric height-adjustable standing desk",
                price=599.99,
                stock=5,
                category="Office",
                image_url="https://via.placeholder.com/300x200?text=Standing+Desk"
            ),
            Product(
                name="Office Chair",
                description="Ergonomic office chair with lumbar support",
                price=349.99,
                stock=8,
                category="Office",
                image_url="https://via.placeholder.com/300x200?text=Office+Chair"
            )
        ]
        
        # Add products to database
        for product in products:
            db.add(product)
        
        db.commit()
        
        # Create sample coupons
        coupons = [
            Coupon(
                code="WELCOME10",
                description="10% off for new customers",
                discount_type="percentage",
                discount_value=10,
                minimum_purchase=50,
                is_active=True,
                valid_until=datetime.utcnow() + timedelta(days=30)
            ),
            Coupon(
                code="SAVE20",
                description="$20 off on orders over $100",
                discount_type="fixed",
                discount_value=20,
                minimum_purchase=100,
                is_active=True,
                valid_until=datetime.utcnow() + timedelta(days=60)
            ),
            Coupon(
                code="ELECTRONICS15",
                description="15% off on electronics",
                discount_type="percentage",
                discount_value=15,
                minimum_purchase=200,
                is_active=True,
                valid_until=datetime.utcnow() + timedelta(days=45)
            ),
            Coupon(
                code="BLACKFRIDAY",
                description="Black Friday special - 25% off everything",
                discount_type="percentage",
                discount_value=25,
                minimum_purchase=0,
                usage_limit=100,
                is_active=True,
                valid_until=datetime.utcnow() + timedelta(days=7)
            ),
            Coupon(
                code="OFFICE50",
                description="$50 off office furniture",
                discount_type="fixed",
                discount_value=50,
                minimum_purchase=300,
                is_active=True,
                valid_until=datetime.utcnow() + timedelta(days=90)
            ),
            Coupon(
                code="EXPIRED",
                description="This coupon has expired",
                discount_type="percentage",
                discount_value=30,
                minimum_purchase=0,
                is_active=True,
                valid_from=datetime.utcnow() - timedelta(days=60),
                valid_until=datetime.utcnow() - timedelta(days=1)
            )
        ]
        
        # Add coupons to database
        for coupon in coupons:
            db.add(coupon)
        
        db.commit()
        
        # Make ELECTRONICS15 applicable only to electronics
        electronics_coupon = db.query(Coupon).filter(Coupon.code == "ELECTRONICS15").first()
        electronics_products = db.query(Product).filter(Product.category == "Electronics").all()
        electronics_coupon.applicable_products = electronics_products
        
        # Make OFFICE50 applicable only to office products
        office_coupon = db.query(Coupon).filter(Coupon.code == "OFFICE50").first()
        office_products = db.query(Product).filter(Product.category == "Office").all()
        office_coupon.applicable_products = office_products
        
        db.commit()
        
        print("Database initialized successfully!")
        print(f"Added {len(products)} products")
        print(f"Added {len(coupons)} coupons")
        
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()