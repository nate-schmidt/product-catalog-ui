import { useEffect, useMemo, useState } from "react";
import { useCart } from "../providers/CartProvider";
import { type Product } from "../state/products";
import { productApi } from "../services/api";

type FlashSaleProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
};

const FLASH_DISCOUNT_PERCENT = 60; // loud!
const SALE_DURATION_MS = 3 * 60 * 1000; // 3 minutes
const STORAGE_KEY_DISMISS = "flashSale:lastDismiss";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function formatTime(msLeft: number): string {
  const totalSeconds = Math.max(0, Math.floor(msLeft / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function FlashSale({ isOpen, onClose, onOpenChange }: FlashSaleProps) {
  const { addItem } = useCart();
  const [saleEndsAt, setSaleEndsAt] = useState<number>(() => Date.now() + SALE_DURATION_MS);
  const [now, setNow] = useState<number>(Date.now());
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch products when modal opens
  useEffect(() => {
    if (!isOpen) return;
    
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await productApi.getAllProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Failed to fetch products for flash sale:", err);
        // Fallback to empty array - flash sale will show no products
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (now >= saleEndsAt) {
      // Auto-extend once to be extra intrusive
      setSaleEndsAt(Date.now() + 60 * 1000);
    }
  }, [now, isOpen, saleEndsAt]);

  const msLeft = Math.max(0, saleEndsAt - now);

  const discountedProducts = useMemo(() => {
    const factor = (100 - FLASH_DISCOUNT_PERCENT) / 100;
    return products.map((p) => ({
      ...p,
      originalPrice: p.price,
      salePrice: Math.max(1, Math.round(p.price * factor)),
    }));
  }, [products]);

  const handleAdd = (id: string) => {
    const product = discountedProducts.find((p) => p.id === id);
    if (!product) return;
    addItem({ id: product.id, name: `${product.name} (Flash)`, price: product.salePrice });
  };

  const handleClose = () => {
    try {
      localStorage.setItem(STORAGE_KEY_DISMISS, String(Date.now()));
    } catch {}
    onClose();
    onOpenChange?.(false);
  };

  if (!isOpen) return null;

  return (
    <div className="flash-sale-overlay" role="dialog" aria-modal="true" aria-label="Flash Sale">
      <div className="flash-sale-backdrop" onClick={handleClose} />

      <div className="flash-sale-modal">
        <button
          aria-label="Close flash sale"
          className="flash-sale-close"
          onClick={handleClose}
        >
          ×
        </button>

        <div className="flash-sale-header">
          <span className="flash-sale-burst blinking">HOT!</span>
          <h2 className="flash-sale-title neon-text">
            FLASH SALE <span className="rainbow-text">Mega</span> Deals
          </h2>
          <span className="flash-sale-burst shake">WOW!</span>
        </div>

        <div className="flash-sale-countdown">
          <div className="countdown-chip">
            Ends in <strong className="countdown-time">{formatTime(msLeft)}</strong>
          </div>
          <div className="discount-chip">
            Up to <strong>{FLASH_DISCOUNT_PERCENT}% OFF</strong>
          </div>
        </div>

        <div className="flash-sale-grid">
          {loading ? (
            <div className="flash-sale-card">
              <div className="flash-sale-card-body">
                <div className="flash-sale-card-title">Loading flash sale products...</div>
              </div>
            </div>
          ) : discountedProducts.length === 0 ? (
            <div className="flash-sale-card">
              <div className="flash-sale-card-body">
                <div className="flash-sale-card-title">No products available for flash sale</div>
              </div>
            </div>
          ) : (
            discountedProducts.map((p) => (
            <div key={p.id} className="flash-sale-card">
              <div className="flash-sale-ribbon">LIMITED</div>
              <div className="flash-sale-card-body">
                <div className="flash-sale-card-title">{p.name}</div>
                <div className="flash-sale-prices">
                  <span className="price-original">{formatCurrency(p.originalPrice)}</span>
                  <span className="price-sale">{formatCurrency(p.salePrice)}</span>
                </div>
                <button className="flash-sale-cta bounce" onClick={() => handleAdd(p.id)}>
                  BUY NOW
                </button>
              </div>
            </div>
            ))
          )}
        </div>

        <div className="flash-sale-footer">
          <div className="marquee">
            <div className="marquee-track">
              <span>Only today • Mega discounts • Limited quantities • Act fast • </span>
              <span>Only today • Mega discounts • Limited quantities • Act fast • </span>
              <span>Only today • Mega discounts • Limited quantities • Act fast • </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


