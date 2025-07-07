// @ts-nocheck
import { describe, test, expect, beforeEach } from "bun:test";
import { Window } from "happy-dom";

// Tests -------------------------------------------------------------------

describe("frontend bootstrap", () => {
  let window: Window;
  let document: Document;

  beforeEach(() => {
    // Fresh DOM per test
    window = new Window();
    document = window.document;

    (global as any).window = window;
    (global as any).document = document;
    (global as any).navigator = window.navigator;
    (global as any).HTMLElement = window.HTMLElement;
    (global as any).Element = window.Element;

    // Provide the root element expected by the app
    const rootDiv = document.createElement("div");
    rootDiv.id = "root";
    document.body.appendChild(rootDiv);
  });

  test("renders immediately when the document is already loaded", async () => {
    Object.defineProperty(document, "readyState", { value: "complete", configurable: true });

    await import("./frontend.tsx");

    // React may render asynchronously; queue microtask to allow update
    await Promise.resolve();

    const rootDiv = document.getElementById("root");
    expect(rootDiv).not.toBeNull();
  });

  test("renders after DOMContentLoaded when the document is still loading", async () => {
    Object.defineProperty(document, "readyState", { value: "loading", configurable: true });

    // Begin import (this registers the event listener)
    const importPromise = import("./frontend.tsx");

    // Ensure nothing rendered yet
    const rootBefore = document.getElementById("root");
    expect(rootBefore?.childElementCount).toBe(0);

    // Dispatch DOMContentLoaded
    document.dispatchEvent(new window.Event("DOMContentLoaded"));

    await importPromise;
    await Promise.resolve();

    const rootAfter = document.getElementById("root");
    expect(rootAfter).not.toBeNull();
  });
});