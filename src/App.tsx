import "./index.css";
import { useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  priceCents: number;
  stock: number;
  activeFlashSale?: {
    salePriceCents: number;
    startAtMs: number;
    endAtMs: number;
  };
};

function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function useNow(tickMs: number): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), tickMs);
    return () => clearInterval(id);
  }, [tickMs]);
  return now;
}

function Countdown({ endAtMs, nowMs }: { endAtMs: number; nowMs: number }) {
  const remainingMs = Math.max(0, endAtMs - nowMs);
  const s = Math.floor(remainingMs / 1000) % 60;
  const m = Math.floor(remainingMs / (1000 * 60)) % 60;
  const h = Math.floor(remainingMs / (1000 * 60 * 60));
  return (
    <span className="font-mono text-sm text-red-300">
      {h.toString().padStart(2, "0")}:{m.toString().padStart(2, "0")}:{s
        .toString()
        .padStart(2, "0")}
    </span>
  );
}

export function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const now = useNow(1000);

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (!alive) return;
        setProducts(data);
        setError(null);
      } catch (e) {
        if (!alive) return;
        setError((e as Error).message);
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    const id = setInterval(load, 10_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-8 relative z-10">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-3">Flash Sales ⚡</h1>
        <p className="text-lg md:text-2xl text-gray-300">Time-limited deals at steep discounts</p>
      </header>

      {loading && <p className="text-gray-400 text-center">Loading products…</p>}
      {error && <p className="text-red-400 text-center">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => {
          const hasSale = !!p.activeFlashSale && p.activeFlashSale.endAtMs > now;
          const price = hasSale ? p.activeFlashSale!.salePriceCents : p.priceCents;
          return (
            <div key={p.id} className="border border-white/10 rounded-xl p-5 bg-white/5 backdrop-blur">
              <div className="flex items-baseline justify-between mb-2">
                <h2 className="text-xl font-semibold text-white">{p.name}</h2>
                <span className="text-sm text-gray-300">Stock: {p.stock}</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold text-white">{formatMoney(price)}</span>
                {hasSale && (
                  <span className="text-sm line-through text-gray-400">
                    {formatMoney(p.priceCents)}
                  </span>
                )}
              </div>
              {hasSale && (
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2 py-1 rounded bg-red-500/20 text-red-300 text-xs font-semibold">
                    Flash sale
                  </span>
                  <Countdown endAtMs={p.activeFlashSale!.endAtMs} nowMs={now} />
                </div>
              )}

              <button
                className="w-full py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium disabled:opacity-50"
                disabled={p.stock <= 0}
                onClick={async () => {
                  try {
                    const res = await fetch("/api/checkout", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ productId: p.id, quantity: 1 }),
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error || "Checkout failed");
                    alert(`Purchased 1 × ${p.name} for ${formatMoney(data.unitPriceCents)}${data.usedFlashSale ? " (flash sale)" : ""}`);
                    // refresh products
                    const productsRes = await fetch("/api/products");
                    setProducts(await productsRes.json());
                  } catch (e) {
                    alert((e as Error).message);
                  }
                }}
              >
                Buy now
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
