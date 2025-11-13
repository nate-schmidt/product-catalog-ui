import "./index.css";
import ProductCatalog from "./components/ProductCatalog";
import Cart from "./components/Cart";
import { CartProvider, useCart } from "./providers/CartProvider";
import { useState } from "react";
import FlashSale from "./components/FlashSale";
import FlashSaleStickyBanner from "./components/FlashSaleStickyBanner";

function Header() {
  const { totalItems } = useCart();

  return (
    <header className="w-full mb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Product Catalog</h1>
        <div className="text-white">
          <span className="text-lg">Cart ({totalItems})</span>
        </div>
      </div>
    </header>
  );
}

function AppContent() {
  const [saleOpen, setSaleOpen] = useState<boolean>(true);
  return (
    <>
      <FlashSaleStickyBanner onShowSale={() => setSaleOpen(true)} />
      <div className="max-w-7xl mx-auto p-8 relative z-10">
        <Header />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProductCatalog />
          </div>
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              <Cart />
            </div>
          </div>
        </div>
      </div>
      <FlashSale isOpen={saleOpen} onClose={() => setSaleOpen(false)} onOpenChange={setSaleOpen} />
    </>
  );
}

export function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
