import { useMemo } from "react";
import type { Product } from "../types/product";

interface CartProps {
  items: Array<{ product: Product; quantity: number }>;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export default function Cart({ items }: CartProps) {
  const { subtotal, originalSubtotal, savings } = useMemo(() => {
    const orig = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const eff = items.reduce((sum, i) => sum + i.product.effectivePrice * i.quantity, 0);
    return { subtotal: eff, originalSubtotal: orig, savings: Math.max(0, orig - eff) };
  }, [items]);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <h3 className="text-xl text-white font-medium mb-3">Cart</h3>
      {items.length === 0 ? (
        <div className="text-gray-300">Your cart is empty.</div>
      ) : (
        <>
          <ul className="divide-y divide-white/10">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="py-2 flex items-center justify-between">
                <div>
                  <div className="text-white">{product.name}</div>
                  <div className="text-sm text-gray-400">Qty {quantity}</div>
                </div>
                <div className="text-right">
                  <div className="text-white">{formatCurrency(product.effectivePrice * quantity)}</div>
                  {product.effectivePrice < product.price && (
                    <div className="text-sm text-gray-400 line-through">{formatCurrency(product.price * quantity)}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-gray-300">Subtotal</div>
            <div className="text-white font-semibold">{formatCurrency(subtotal)}</div>
          </div>
          {savings > 0 && (
            <div className="mt-1 text-sm text-green-300">You saved {formatCurrency(savings)}!</div>
          )}
        </>
      )}
    </div>
  );
}