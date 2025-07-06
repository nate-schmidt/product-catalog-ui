/// <reference types="react" />
import React, { useState } from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
}

const sampleCart: CartItem[] = [
  { id: 1, name: "Sample Product A", price: 29.99 },
  { id: 2, name: "Sample Product B", price: 49.99 },
];

export default function Checkout() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [orderId, setOrderId] = useState<string | null>(null);

  const total = sampleCart.reduce((acc, item) => acc + item.price, 0);

  const handleCheckout = async () => {
    try {
      setStatus("loading");
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: sampleCart }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setOrderId(data.orderId);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-white flex flex-col items-center gap-4">
        <h2 className="text-4xl font-bold">Thank you for your purchase!</h2>
        <p>
          Your order ID: <span className="font-mono">{orderId}</span>
        </p>
        <a href="/" className="underline text-blue-400">
          Back to home
        </a>
      </div>
    );
  }

  return (
    <div className="text-white">
      <h2 className="text-4xl font-bold mb-4">Checkout</h2>

      <ul className="mb-4">
        {sampleCart.map(item => (
          <li key={item.id} className="flex justify-between py-1">
            <span>{item.name}</span>
            <span>${item.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <p className="text-xl font-semibold mb-6">Total: ${total.toFixed(2)}</p>

      <button
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded text-white disabled:opacity-50"
        onClick={handleCheckout}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Processing..." : "Complete Purchase"}
      </button>

      {status === "error" && (
        <p className="text-red-400 mt-4">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}