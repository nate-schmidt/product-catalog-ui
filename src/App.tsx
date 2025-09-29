import "./index.css";
import React from "react";
import { formatCents } from "./utils/format";
import type { CartItem } from "./types";

type Product = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
};

function useFetch<T>(url: string, deps: React.DependencyList = []) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  React.useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetch(url)
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(`${r.status}`))))
      .then(json => {
        if (!active) return;
        setData(json);
      })
      .catch(err => {
        if (!active) return;
        setError(String(err?.message || err));
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, deps);
  return { data, loading, error } as const;
}

function QuantityInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="inline-flex items-center gap-2">
      <button className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600" onClick={() => onChange(Math.max(0, value - 1))}>
        −
      </button>
      <input
        className="w-16 text-center bg-gray-800 border border-gray-700 rounded px-2 py-1"
        type="number"
        min={0}
        value={value}
        onChange={e => onChange(Math.max(0, Number(e.target.value)))}
      />
      <button className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600" onClick={() => onChange(value + 1)}>
        +
      </button>
    </div>
  );
}

export function App() {
  const { data: productsResp, loading, error } = useFetch<{ products: Product[] }>("/api/products", []);
  const products = productsResp?.products ?? [];

  const [items, setItems] = React.useState<CartItem[]>([]);
  const [coupon, setCoupon] = React.useState<string>("");
  const [applyState, setApplyState] = React.useState<"idle" | "applying" | "applied" | "error">("idle");
  const [summary, setSummary] = React.useState<any>(null);
  const [checkoutMsg, setCheckoutMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    // compute summary as items/coupon change
    const controller = new AbortController();
    const fetchSummary = async () => {
      try {
        const res = await fetch("/api/coupons/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: coupon, items }),
          signal: controller.signal,
        });
        const json = await res.json();
        setSummary(json.summary);
      } catch {}
    };
    fetchSummary();
    return () => controller.abort();
  }, [items, coupon]);

  function onSetQty(productId: string, quantity: number) {
    setItems(prev => {
      const exists = prev.find(i => i.productId === productId);
      if (!exists) return [...prev, { productId, quantity }];
      return prev.map(i => (i.productId === productId ? { ...i, quantity } : i)).filter(i => i.quantity > 0);
    });
  }

  async function applyCoupon() {
    setApplyState("applying");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: coupon, items }),
      });
      const json = await res.json();
      if (json.valid) setApplyState("applied");
      else setApplyState("error");
      setSummary(json.summary);
    } catch (e) {
      setApplyState("error");
    }
  }

  function removeCoupon() {
    setCoupon("");
    setApplyState("idle");
  }

  async function checkout() {
    setCheckoutMsg(null);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, couponCode: coupon || null }),
    });
    const json = await res.json();
    if (json.ok) {
      setCheckoutMsg(`Order ${json.orderId} confirmed!`);
      setItems([]);
      setCoupon("");
      setApplyState("idle");
      setSummary(json.summary);
    } else {
      setCheckoutMsg(json.error || "Checkout failed");
      setSummary(json.summary);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-8 relative z-10">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">Store</h1>

      {loading && <p className="text-gray-400 text-center">Loading products…</p>}
      {error && <p className="text-red-400 text-center">Failed to load: {error}</p>}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Products</h2>
            <div className="space-y-4">
              {products.map(p => {
                const qty = items.find(i => i.productId === p.id)?.quantity ?? 0;
                return (
                  <div key={p.id} className="flex items-center justify-between bg-gray-900/40 rounded border border-gray-800 p-4">
                    <div className="text-left">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-gray-400 text-sm">{p.description}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-white font-semibold">{formatCents(p.priceCents)}</div>
                      </div>
                      <QuantityInput value={qty} onChange={v => onSetQty(p.id, v)} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Cart</h2>
            <div className="space-y-3">
              {(summary?.items ?? []).length === 0 && <p className="text-gray-400">Your cart is empty.</p>}
              {(summary?.items ?? []).map((li: any) => (
                <div key={li.productId} className="flex items-center justify-between border border-gray-800 rounded bg-gray-900/40 p-3">
                  <div>
                    <div className="font-medium">{li.name}</div>
                    <div className="text-xs text-gray-400">Qty {li.quantity} × {formatCents(li.unitPriceCents)}</div>
                  </div>
                  <div className="font-semibold">{formatCents(li.lineTotalCents)}</div>
                </div>
              ))}

              <div className="flex items-center gap-2 mt-4">
                <input
                  className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2"
                  placeholder="Coupon code"
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                />
                <button onClick={applyCoupon} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50" disabled={!coupon || applyState === "applying"}>
                  {applyState === "applying" ? "Applying…" : "Apply"}
                </button>
                {coupon && (
                  <button onClick={removeCoupon} className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-600">Remove</button>
                )}
              </div>

              <div className="border-t border-gray-800 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Subtotal</span>
                  <span>{formatCents(summary?.subtotalCents ?? 0)}</span>
                </div>
                {summary?.coupon && (
                  <div className="flex justify-between text-sm text-green-400">
                    <span>Coupon ({summary.coupon.code})</span>
                    <span>-{formatCents(summary.coupon.discountCents)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatCents(summary?.totalCents ?? 0)}</span>
                </div>
              </div>

              <button
                onClick={checkout}
                disabled={(summary?.totalCents ?? 0) <= 0}
                className="w-full mt-4 px-4 py-3 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50"
              >
                Checkout
              </button>

              {checkoutMsg && <div className="text-center text-sm text-gray-200">{checkoutMsg}</div>}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
