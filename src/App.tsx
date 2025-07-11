/** @jsxImportSource react */
import "./index.css";
import { useMemo, useState } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
};

const sampleItems: CartItem[] = [
  { id: 1, name: "T-Shirt", price: 25, qty: 1 },
  { id: 2, name: "Jeans", price: 50, qty: 1 },
];

export function App() {
  const [items] = useState<CartItem[]>(sampleItems);
  const subtotal = useMemo(
    () => items.reduce((s: number, item: CartItem) => s + item.price * item.qty, 0),
    [items],
  );

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState<string | null>(null);

  const total = subtotal - discount;

  async function applyCoupon() {
    if (!couponCode.trim()) return;

    try {
      const res = await fetch("/api/apply-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), subtotal }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        alert(error || "Invalid coupon");
        return;
      }

      const { discount: d, coupon } = await res.json();
      setDiscount(d);
      setCouponApplied(coupon.code);
    } catch (err) {
      console.error(err);
      alert("Failed to apply coupon");
    }
  }

  return (
    <div className="max-w-xl mx-auto p-8 text-center relative z-10">
      <h1 className="text-4xl font-bold mb-6 text-white">Your Cart</h1>

      <table className="w-full text-left text-gray-300 mb-4">
        <thead>
          <tr>
            <th className="pb-2">Item</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-t border-gray-700">
              <td className="py-2">{item.name}</td>
              <td>${(item.price * item.qty).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right text-gray-300 mb-2">
        Subtotal: ${subtotal.toFixed(2)}
      </div>
      {discount > 0 && (
        <div className="text-right text-green-400 mb-2">
          Discount ({couponApplied}): -${discount.toFixed(2)}
        </div>
      )}
      <div className="text-right font-bold text-white text-lg mb-6">
        Total: ${total.toFixed(2)}
      </div>

      <div className="flex gap-2 justify-center">
        <input
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none"
          placeholder="Coupon code"
          value={couponCode}
          onChange={e => setCouponCode(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
          onClick={applyCoupon}
        >
          Apply
        </button>
      </div>
    </div>
  );
}

export default App;
