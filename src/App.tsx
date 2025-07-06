import "./index.css";
import { useState } from "react";

export function App() {
  const [coupon, setCoupon] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function applyCoupon() {
    // Trim and ensure uppercase
    const code = coupon.trim();
    if (!code) {
      setMessage("Please enter a coupon code.");
      return;
    }

    try {
      const res = await fetch(`/api/coupon/${encodeURIComponent(code)}`);
      const data: { valid: boolean; discount: number } = await res.json();
      if (data.valid) {
        if (data.discount > 0) {
          setMessage(`Coupon applied! You get ${data.discount}% off.`);
        } else {
          setMessage("Coupon applied! Free shipping activated.");
        }
      } else {
        setMessage("Invalid coupon code. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again later.");
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
        <h1 className="text-6xl font-bold text-white mb-4">
          Hello World! 👋
        </h1>
        <p className="text-2xl text-gray-300 max-w-2xl leading-relaxed">
          One day I hope to be an ecommerce website.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
          <input
            type="text"
            placeholder="Enter coupon code"
            value={coupon}
            onChange={e => setCoupon(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-600 bg-transparent text-white focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={applyCoupon}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Apply
          </button>
        </div>

        {message && (
          <p
            role="alert"
            className="text-lg mt-4"
            data-testid="coupon-message"
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
