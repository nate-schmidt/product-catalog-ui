import { useEffect, useMemo, useState } from "react";
import { fetchProducts } from "../services/productService";
import type { Product } from "../types/product";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function getRemainingMs(endsAtIso?: string | null) {
  if (!endsAtIso) return 0;
  const target = new Date(endsAtIso).getTime();
  return Math.max(0, target - Date.now());
}

function formatRemaining(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let mounted = true;
    fetchProducts()
      .then(list => {
        if (mounted) setProducts(list);
      })
      .catch(err => setError(err.message || String(err)));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const i = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(i);
  }, []);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!products) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-gray-300">Loading products…</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h2 className="text-3xl font-semibold text-white mb-6">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => {
          const isOnSale = !!p.flashSale?.active;
          const remainingMs = getRemainingMs(isOnSale ? p.flashSale?.endsAt : null);
          return (
            <div key={p.id} className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-lg font-medium text-white">{p.name}</div>
                  {p.description && (
                    <div className="text-sm text-gray-300 mt-1">{p.description}</div>
                  )}
                </div>
                {isOnSale && (
                  <span className="ml-3 inline-flex items-center rounded-full bg-red-500/20 px-3 py-1 text-sm font-medium text-red-300">
                    Flash Sale
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-end gap-3">
                {isOnSale ? (
                  <>
                    <div className="text-2xl font-bold text-white">{formatCurrency(p.effectivePrice)}</div>
                    <div className="text-sm line-through text-gray-400">{formatCurrency(p.price)}</div>
                  </>
                ) : (
                  <div className="text-2xl font-bold text-white">{formatCurrency(p.price)}</div>
                )}
              </div>

              {isOnSale && (
                <div className="mt-2 text-sm text-red-300">
                  Ends in {formatRemaining(remainingMs)}
                </div>
              )}

              <div className="mt-4">
                <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500">
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}