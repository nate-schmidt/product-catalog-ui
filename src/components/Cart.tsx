import { useState } from "react";
import { useCart } from "../contexts/CartContext";

export default function Cart() {
  const {
    items,
    subtotal,
    total,
    discountRate,
    couponCode,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const [input, setInput] = useState("");

  const handleApply = () => {
    if (!input.trim()) return;
    const success = applyCoupon(input);
    if (!success) {
      alert("Invalid coupon code 🤔");
    } else {
      setInput("");
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto mt-10 text-left">
      <h2 className="text-2xl font-semibold mb-4 text-white">Cart</h2>

      {items.length === 0 ? (
        <p className="text-gray-400">Your cart is empty.</p>
      ) : (
        <ul className="space-y-2 mb-4">
          {items.map(item => (
            <li key={item.id} className="flex justify-between text-gray-200">
              <span>
                {item.name} <span className="text-sm text-gray-400">x{item.quantity}</span>
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="border-t border-gray-700 pt-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {discountRate > 0 && (
          <div className="flex justify-between text-green-400">
            <span>
              Discount ({(discountRate * 100).toFixed(0)}%
              {couponCode ? ` - ${couponCode}` : ""})
            </span>
            <span>- ${(subtotal * discountRate).toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between font-bold text-white">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 flex">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Coupon code"
          className="flex-1 rounded-l-md px-3 py-2 text-black focus:outline-none"
        />
        {discountRate > 0 ? (
          <button
            onClick={removeCoupon}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-r-md text-white"
          >
            Remove
          </button>
        ) : (
          <button
            onClick={handleApply}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-r-md text-white"
          >
            Apply
          </button>
        )}
      </div>
    </div>
  );
}