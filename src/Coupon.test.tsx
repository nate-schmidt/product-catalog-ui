import { test, expect, describe, beforeEach } from "bun:test";
import { render, fireEvent, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App";
import { Window } from "happy-dom";

// Setup DOM environment for tests
const window = new Window();
const document = window.document;

(global as any).window = window;
(global as any).document = document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;

// Utility to mock fetch responses
function mockFetchResponse(data: any) {
  return Promise.resolve({
    json: () => Promise.resolve(data),
  } as Response);
}

describe("Coupon functionality", () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = "";
    // Reset fetch mock
    (global as any).fetch = undefined;
  });

  test("applies a valid coupon code and shows discount message", async () => {
    (global as any).fetch = () => mockFetchResponse({ valid: true, discount: 10 });

    const { getByPlaceholderText, getByText, findByRole } = render(<App />);
    const input = getByPlaceholderText("Enter coupon code") as HTMLInputElement;

    await userEvent.type(input, "SAVE10");

    const applyButton = getByText("Apply");
    await userEvent.click(applyButton);

    const alert = await findByRole("alert");
    expect(alert.textContent).toContain("10% off");
  });

  test("shows error for invalid coupon code", async () => {
    (global as any).fetch = () => mockFetchResponse({ valid: false, discount: 0 });

    const { getByPlaceholderText, getByText, findByRole } = render(<App />);
    const input = getByPlaceholderText("Enter coupon code") as HTMLInputElement;

    await userEvent.type(input, "INVALID");

    const applyButton = getByText("Apply");
    await userEvent.click(applyButton);

    const alert = await findByRole("alert");
    expect(alert.textContent).toContain("Invalid coupon code");
  });
});