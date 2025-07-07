import React from "react";
import { useCartItemCount } from "../contexts/CartContext";

// Using React.memo ensures the component only rerenders when its props (none)
// change; the count is derived from internal selector hook which depends on
// cart state. Thanks to split context + memoised selector the re-render cost
// is minimal.

export const CartIcon: React.FC = React.memo(() => {
  const count = useCartItemCount();

  return (
    <button
      className="relative text-white hover:opacity-80 transition-opacity"
      aria-label="Cart"
    >
      {/* Simple SVG cart icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386a.75.75 0 01.737.608l.383 1.914M6 13.5h12.75a.75.75 0 00.736-.608l1.714-8.572A.75.75 0 0019.464 3H4.77m1.23 10.5l1.5 7.5m9-7.5l-1.5 7.5M6 13.5h12M6 13.5L4.5 6
          "
        />
      </svg>

      {/* Badge */}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
          {count}
        </span>
      )}
    </button>
  );
});

CartIcon.displayName = "CartIcon";