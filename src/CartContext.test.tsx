import { test, expect, beforeEach } from "bun:test";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart, useCartActions } from "./CartContext";
import React from "react";

// Helper to render hooks within CartProvider context
function setup() {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );
  return renderHook(
    () => {
      return {
        cart: useCart(),
        actions: useCartActions(),
      } as const;
    },
    { wrapper },
  );
}

test("item is removed when quantity is updated to zero", () => {
  const { result } = setup();

  act(() => {
    result.current.actions.addItem({ id: "sku-1", name: "Test" }, 2);
  });
  expect(Object.keys(result.current.cart.items)).toHaveLength(1);

  act(() => {
    result.current.actions.updateQuantity("sku-1", 0);
  });

  expect(Object.keys(result.current.cart.items)).toHaveLength(0);
});