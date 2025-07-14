import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Checkout(): React.ReactElement {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({ name: "", email: "" });
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("processing");
    try {
      await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, items }),
      });
      setStatus("success");
      clearCart();
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      console.error(err);
      setStatus("idle");
    }
  };

  if (items.length === 0 && status !== "success") {
    return (
      <div className="max-w-xl mx-auto p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 text-white">
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>
      {status === "success" ? (
        <p className="text-green-400">Thank you for your purchase! Redirecting...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          <section>
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <ul className="space-y-2 mb-4">
              {items.map(item => (
                <li key={item.id} className="flex justify-between">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-4">Customer Info</h3>
            <form onSubmit={handleOrder} className="flex flex-col gap-4">
              <input
                className="p-2 rounded bg-gray-800 text-white"
                type="text"
                required
                placeholder="Name"
                value={customer.name}
                onChange={e => setCustomer({ ...customer, name: e.target.value })}
              />
              <input
                className="p-2 rounded bg-gray-800 text-white"
                type="email"
                required
                placeholder="Email"
                value={customer.email}
                onChange={e => setCustomer({ ...customer, email: e.target.value })}
              />
              <button
                disabled={status === "processing"}
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded disabled:opacity-50"
              >
                {status === "processing" ? "Processing..." : "Place Order"}
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}