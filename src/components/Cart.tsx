import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";

export function Cart() {
  const { items, removeFromCart, clearCart, getTotalPrice } = useCart();
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const handleCheckout = () => {
    clearCart();
    setCheckoutComplete(true);
  };

  if (checkoutComplete) {
    return (
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold mb-4">Thank you for your purchase! 🎉</h2>
        <p className="text-gray-600">Your order has been placed successfully.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {items.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 mb-4">
            {items.map(item => (
              <li key={item.product.id} className="py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-gray-500 text-sm">
                    {item.quantity} × ${(item.product.price / 100).toFixed(2)}
                  </p>
                </div>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => removeFromCart(item.product.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-bold">Total</span>
            <span className="text-xl font-bold">
              ${(getTotalPrice() / 100).toFixed(2)}
            </span>
          </div>
          <button
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 w-full"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </>
      )}
    </div>
  );
}