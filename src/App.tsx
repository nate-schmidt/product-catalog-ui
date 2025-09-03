import "./index.css";
import ProductCatalog from "./components/ProductCatalog";
import Cart from "./components/Cart";
import { useEffect, useState } from "react";
import type { Product } from "./types/product";

export function App() {
  const [firstProduct, setFirstProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/products");
        const list: Product[] = await res.json();
        setFirstProduct(list[0] ?? null);
      } catch {}
    }
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
      <div className="flex flex-col items-center justify-center gap-8">
        <h1 className="text-5xl font-bold text-white">Furniture Store</h1>
        <p className="text-lg text-gray-300">Discover products and limited-time flash sales.</p>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        <div className="lg:col-span-2">
          <ProductCatalog />
        </div>
        <div>
          <Cart items={firstProduct ? [{ product: firstProduct, quantity: 1 }] : []} />
        </div>
      </div>
    </div>
  );
}

export default App;
