import { useEffect, useState } from "react";

type FlashSaleStickyBannerProps = {
  onShowSale: () => void;
};

const STORAGE_KEY_DISMISS_BANNER = "flashSaleBanner:dismissed";

export default function FlashSaleStickyBanner({ onShowSale }: FlashSaleStickyBannerProps) {
  const [visible, setVisible] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_DISMISS_BANNER) !== "1";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    // Nudge back into view after 20s to be intrusive
    if (!visible) {
      const t = setTimeout(() => setVisible(true), 20000);
      return () => clearTimeout(t);
    }
  }, [visible]);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY_DISMISS_BANNER, "1");
    } catch {}
  };

  if (!visible) return null;

  return (
    <div className="flash-banner">
      <div className="flash-banner-inner">
        <div className="flash-banner-pip blinking" aria-hidden="true" />
        <div className="flash-banner-text neon-text">
          FLASH SALE: <strong>Up to 60% OFF</strong> • Ends Soon
        </div>
        <div className="flash-banner-actions">
          <button className="flash-banner-btn" onClick={onShowSale}>
            Shop Now
          </button>
          <button className="flash-banner-dismiss" aria-label="Hide banner" onClick={dismiss}>
            ×
          </button>
        </div>
      </div>
    </div>
  );
}


