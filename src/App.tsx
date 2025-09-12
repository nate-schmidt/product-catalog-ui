import "./index.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatPriceFromCents } from "./data";

export function App() {
  return (
    <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
        <h1 className="text-6xl font-bold text-white mb-4">
          Hello World! 👋
        </h1>
        <p className="text-2xl text-gray-300 max-w-2xl leading-relaxed">
          One day I hope to be an ecommerce website.
        </p>
      </div>

      <FlashSaleSection />
    </div>
  );
}

export default App;

type FlashSaleSummary = {
  sale: {
    id: string;
    name: string;
    startsAt: string;
    endsAt: string;
    discounts: Record<string, number>;
  } | null;
  items: Array<{
    productId: string;
    name: string;
    originalPriceCents: number;
    discountedPriceCents: number;
    discountPercent: number;
  }>;
  serverTime: string;
};

function FlashSaleSection() {
  const [summary, setSummary] = useState(null as FlashSaleSummary | null);
  const [nowMs, setNowMs] = useState(Date.now() as number);
  const serverOffsetMsRef = useRef(0 as number);

  useEffect(() => {
    let isMounted = true;
    const ac = new AbortController();

    const load = async () => {
      try {
        const res = await fetch("/api/flash-sale/summary", { signal: ac.signal });
        const data = (await res.json()) as FlashSaleSummary;
        if (!isMounted) return;
        setSummary(data);
        const serverNow = new Date(data.serverTime).getTime();
        serverOffsetMsRef.current = serverNow - Date.now();
      } catch (e) {
        // ignore network errors for demo
      }
    };

    load();

    const refreshInterval = setInterval(load, 10_000);
    return () => {
      isMounted = false;
      ac.abort();
      clearInterval(refreshInterval);
    };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const endsAt = summary?.sale ? new Date(summary.sale.endsAt).getTime() : null;
  const msRemaining = useMemo(() => {
    if (!endsAt) return 0;
    return Math.max(0, endsAt - (nowMs + serverOffsetMsRef.current));
  }, [endsAt, nowMs]);

  useEffect(() => {
    if (endsAt && msRemaining === 0) {
      // sale ended; refetch once to update UI
      fetch("/api/flash-sale/summary").then(r => r.json()).then((d: FlashSaleSummary) => setSummary(d)).catch(() => {});
    }
  }, [endsAt, msRemaining]);

  if (!summary) {
    return null;
  }

  if (!summary.sale) {
    return (
      <div className="mt-8 text-gray-400">
        <p>No flash sale right now. Check back soon!</p>
      </div>
    );
  }

  return (
    <section className="mt-12 text-left">
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Flash Sale: {summary.sale.name}</h2>
            <p className="text-sm text-gray-300">Ends in {formatDuration(msRemaining)}</p>
          </div>
          <div className="inline-flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-red-600 text-white text-sm font-semibold">Up to 50% OFF</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {summary.items.map((item: any) => (
            <article key={item.productId} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="flex items-baseline justify-between">
                <h3 className="text-white font-medium text-lg">{item.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                  -{item.discountPercent}%
                </span>
              </div>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-xl font-bold text-emerald-300">
                  {formatPriceFromCents(item.discountedPriceCents)}
                </span>
                <span className="text-sm line-through text-gray-400">
                  {formatPriceFromCents(item.originalPriceCents)}
                </span>
              </div>
              <button className="mt-4 w-full rounded-md bg-emerald-500 text-white py-2 text-sm font-semibold hover:bg-emerald-600 transition-colors">
                Add to cart
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);
  const p2 = (n: number) => n.toString().padStart(2, "0");
  if (hours > 0) return `${p2(hours)}:${p2(minutes)}:${p2(seconds)}`;
  return `${p2(minutes)}:${p2(seconds)}`;
}
