import { test, expect, describe, beforeEach, afterEach } from "bun:test";
import { render, act, cleanup } from "@testing-library/react";
import { CartProvider, useCart } from "../CartProvider";
import { Window } from "happy-dom";

// Setup DOM environment for tests
const window = new Window();
const document = window.document;

(global as any).window = window;
(global as any).document = document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

beforeEach(() => {
  cleanup();
  document.body.innerHTML = "";
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
    writable: true,
  });
  Object.defineProperty(global, "localStorage", {
    value: localStorageMock,
    writable: true,
    configurable: true,
  });
  localStorageMock.clear();
});

afterEach(() => {
  localStorageMock.clear();
});

// Test component that uses the cart
function TestComponent() {
  const { state, addItem, removeItem, setQuantity, clearCart, itemCount, subtotal } =
    useCart();

  return (
    <div>
      <div data-testid="item-count">{itemCount}</div>
      <div data-testid="subtotal">{subtotal}</div>
      <div data-testid="items-count">{state.items.length}</div>
      <button
        data-testid="add-item"
        onClick={() => addItem({ id: "1", name: "Test Item", price: 10 })}
      >
        Add
      </button>
      <button
        data-testid="remove-item"
        onClick={() => removeItem("1")}
      >
        Remove
      </button>
      <button
        data-testid="set-qty-5"
        onClick={() => setQuantity("1", 5)}
      >
        Set Qty 5
      </button>
      <button
        data-testid="set-qty-0"
        onClick={() => setQuantity("1", 0)}
      >
        Set Qty 0
      </button>
      <button data-testid="clear-cart" onClick={clearCart}>
        Clear
      </button>
    </div>
  );
}

describe("CartProvider", () => {
  test("initializes with empty cart when localStorage is empty", () => {
    const { container } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(container.querySelector('[data-testid="item-count"]')?.textContent).toBe("0");
    expect(container.querySelector('[data-testid="subtotal"]')?.textContent).toBe("0");
    expect(container.querySelector('[data-testid="items-count"]')?.textContent).toBe("0");
  });

  test("initializes from localStorage", () => {
    const savedState = {
      items: [
        { id: "1", name: "Item 1", price: 10, quantity: 2 },
        { id: "2", name: "Item 2", price: 20, quantity: 1 },
      ],
    };
    localStorageMock.setItem("cart:v1", JSON.stringify(savedState));

    const { container } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(container.querySelector('[data-testid="item-count"]')?.textContent).toBe("3");
    expect(container.querySelector('[data-testid="subtotal"]')?.textContent).toBe("40");
    expect(container.querySelector('[data-testid="items-count"]')?.textContent).toBe("2");
  });

  test("handles malformed localStorage gracefully", () => {
    localStorageMock.setItem("cart:v1", "invalid json");

    const { container } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(container.querySelector('[data-testid="item-count"]')?.textContent).toBe("0");
    expect(container.querySelector('[data-testid="subtotal"]')?.textContent).toBe("0");
  });

  test("adds item to cart", () => {
    const { container } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      const btn = container.querySelector('[data-testid="add-item"]') as HTMLButtonElement;
      btn.click();
    });

    expect(container.querySelector('[data-testid="item-count"]')?.textContent).toBe("1");
    expect(container.querySelector('[data-testid="subtotal"]')?.textContent).toBe("10");
    expect(container.querySelector('[data-testid="items-count"]')?.textContent).toBe("1");
  });

  test("increments quantity when adding existing item", () => {
    const { container } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      const btn = container.querySelector('[data-testid="add-item"]') as HTMLButtonElement;
      btn.click();
      btn.click();
    });

    expect(container.querySelector('[data-testid="item-count"]')?.textContent).toBe("2");
    expect(container.querySelector('[data-testid="subtotal"]')?.textContent).toBe("20");
    expect(container.querySelector('[data-testid="items-count"]')?.textContent).toBe("1");
  });

  test("removes item from cart", () => {
    const { container } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      const addBtn = container.querySelector('[data-testid="add-item"]') as HTMLButtonElement;
      const removeBtn = container.querySelector('[data-testid="remove-item"]') as HTMLButtonElement;
      addBtn.click();
      removeBtn.click();
    });

    expect(container.querySelector('[data-testid="item-count"]')?.textContent).toBe("0");
    expect(container.querySelector('[data-testid="subtotal"]')?.textContent).toBe("0");
    expect(container.querySelector('[data-testid="items-count"]')?.textContent).toBe("0");
  });

  test("sets quantity correctly", () => {
    const { container } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      const addBtn = container.querySelector('[data-testid="add-item"]') as HTMLButtonElement;
      const setQtyBtn = container.querySelector('[data-testid="set-qty-5"]') as HTMLButtonElement;
      addBtn.click();
      setQtyBtn.click();
    });

    expect(container.querySelector('[data-testid="item-count"]')?.textContent).toBe("5");
    expect(container.querySelector('[data-testid="subtotal"]')?.textContent).toBe("50");
    expect(container.querySelector('[data-testid="items-count"]')?.textContent).toBe("1");
  });

  test("removes item when quantity is set to 0", () => {
    const { container } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      const addBtn = container.querySelector('[data-testid="add-item"]') as HTMLButtonElement;
      addBtn.click();
    });

    expect(container.querySelector('[data-testid="item-count"]')?.textContent).toBe("1");
    expect(container.querySelector('[data-testid="items-count"]')?.textContent).toBe("1");

    act(() => {
      const setQtyZeroBtn = container.querySelector('[data-testid="set-qty-0"]') as HTMLButtonElement;
      setQtyZeroBtn.click();
    });

    expect(container.querySelector('[data-testid="item-count"]')?.textContent).toBe("0");
    expect(container.querySelector('[data-testid="subtotal"]')?.textContent).toBe("0");
    expect(container.querySelector('[data-testid="items-count"]')?.textContent).toBe("0");
  });

  test("clears cart", () => {
    const { container } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      const addBtn = container.querySelector('[data-testid="add-item"]') as HTMLButtonElement;
      const clearBtn = container.querySelector('[data-testid="clear-cart"]') as HTMLButtonElement;
      addBtn.click();
      addBtn.click();
      clearBtn.click();
    });

    expect(container.querySelector('[data-testid="item-count"]')?.textContent).toBe("0");
    expect(container.querySelector('[data-testid="subtotal"]')?.textContent).toBe("0");
    expect(container.querySelector('[data-testid="items-count"]')?.textContent).toBe("0");
  });

  test("persists state to localStorage on changes", () => {
    const { container } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      const addBtn = container.querySelector('[data-testid="add-item"]') as HTMLButtonElement;
      addBtn.click();
    });

    const saved = localStorageMock.getItem("cart:v1");
    expect(saved).toBeTruthy();
    if (saved) {
      const parsed = JSON.parse(saved);
      expect(parsed.items).toHaveLength(1);
      expect(parsed.items[0].quantity).toBe(1);
    }
  });

  test("calculates itemCount correctly with multiple items", () => {
    const savedState = {
      items: [
        { id: "1", name: "Item 1", price: 10, quantity: 3 },
        { id: "2", name: "Item 2", price: 20, quantity: 2 },
      ],
    };
    localStorageMock.setItem("cart:v1", JSON.stringify(savedState));

    const { container } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(container.querySelector('[data-testid="item-count"]')?.textContent).toBe("5");
  });

  test("calculates subtotal correctly with multiple items", () => {
    const savedState = {
      items: [
        { id: "1", name: "Item 1", price: 10, quantity: 3 },
        { id: "2", name: "Item 2", price: 20, quantity: 2 },
      ],
    };
    localStorageMock.setItem("cart:v1", JSON.stringify(savedState));

    const { container } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(container.querySelector('[data-testid="subtotal"]')?.textContent).toBe("70");
  });
});

