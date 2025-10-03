import "./index.css";
import { useEffect, useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  manufacturer: string;
  price: number;
  currency: string;
};

type FlashSaleItem = { productId: string; salePrice: number };
type FlashSale = {
  id: string;
  name: string;
  startsAt: string; // ISO
  endsAt: string; // ISO
  items: FlashSaleItem[];
};

type CatalogResponse = {
  serverNow: string;
  products: Product[];
  flashSales: FlashSale[];
  activeSaleIds: string[];
};

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value);
}

function useServerTimeSync() {
  const [offsetMs, setOffsetMs] = useState(0);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const t0 = Date.now();
        const res = await fetch("/api/time");
        const json = await res.json();
        const t1 = Date.now();
        const rtt = t1 - t0;
        const serverNow = new Date(json.now).getTime();
        // approximate offset as serverNow - (clientNow - rtt/2)
        const approxClientAtServer = t0 + rtt / 2;
        const offset = serverNow - approxClientAtServer;
        if (!cancelled) setOffsetMs(offset);
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return () => new Date(Date.now() + offsetMs);
}

function useCountdown(targetIso?: string) {
  const nowFn = useServerTimeSync();
  const [now, setNow] = useState(() => nowFn());
  useEffect(() => {
    const id = setInterval(() => setNow(nowFn()), 1000);
    return () => clearInterval(id);
  }, [nowFn]);
  const target = targetIso ? new Date(targetIso) : undefined;
  const remainingMs = target ? Math.max(0, target.getTime() - now.getTime()) : 0;
  const hours = Math.floor(remainingMs / 3600000);
  const minutes = Math.floor((remainingMs % 3600000) / 60000);
  const seconds = Math.floor((remainingMs % 60000) / 1000);
  return { remainingMs, hours, minutes, seconds };
}

export function App() {
  const [data, setData] = useState<CatalogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/catalog");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: CatalogResponse = await res.json();
        if (!cancelled) setData(json);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load catalog");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeSale = useMemo(() => {
    if (!data) return undefined;
    const map = new Map(data.flashSales.map(s => [s.id, s] as const));
    const firstId = data.activeSaleIds[0];
    return firstId ? map.get(firstId) : undefined;
  }, [data]);

  const countdown = useCountdown(activeSale?.endsAt);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center">
        <p className="text-gray-300">Loading catalog…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center">
        <p className="text-red-300">{error || "Failed to load"}</p>
      </div>
    );
  }

  const salePriceByProduct = new Map(
    activeSale?.items.map(i => [i.productId, i.salePrice]) ?? []
  );

  return (
    <div className="max-w-7xl mx-auto p-8 relative z-10">
      <header className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white">Product Catalog</h1>
        {activeSale ? (
          <div className="mt-4 inline-flex flex-col items-center gap-2 rounded-lg border border-amber-400/40 bg-amber-500/10 px-4 py-3">
            <span className="text-amber-300 font-semibold">Flash Sale: {activeSale.name}</span>
            <div className="font-mono text-2xl text-amber-200 tabular-nums">
              {String(countdown.hours).padStart(2, "0")}:{String(countdown.minutes).padStart(2, "0")}:{String(countdown.seconds).padStart(2, "0")}
            </div>
            <span className="text-xs text-amber-200/80">Ends at {new Date(activeSale.endsAt).toLocaleTimeString()}</span>
          </div>
        ) : (
          <p className="text-gray-300 mt-2">No active flash sale</p>
        )}
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.products.map(p => {
          const sale = salePriceByProduct.get(p.id);
          return (
            <div key={p.id} className="rounded-xl border border-white/10 p-5 text-left bg-white/5 backdrop-blur-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{p.name}</h3>
                  <p className="text-sm text-gray-400">by {p.manufacturer}</p>
                </div>
                {sale != null && (
                  <span className="text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">On sale</span>
                )}
              </div>
              <div className="mt-4 flex items-baseline gap-3">
                {sale != null ? (
                  <>
                    <span className="text-2xl font-bold text-amber-300">{formatMoney(sale, p.currency)}</span>
                    <span className="text-sm line-through text-gray-400">{formatMoney(p.price, p.currency)}</span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-white">{formatMoney(p.price, p.currency)}</span>
                )}
              </div>
              <button className="mt-5 w-full rounded-lg bg-white/10 hover:bg-white/15 transition-colors py-2 text-white font-medium border border-white/20">
                Add to cart
              </button>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default App;
