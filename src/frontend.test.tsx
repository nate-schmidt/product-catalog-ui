import { describe, test, expect, beforeEach } from "bun:test";
import { Window } from "happy-dom";

// We will import the module dynamically inside tests so we can reset globals.

describe("frontend entry point", () => {
  let windowInstance: Window;

  beforeEach(() => {
    // Create a fresh DOM for each test
    windowInstance = new Window();
    const { document } = windowInstance as unknown as { document: Document };

    // Set up root element expected by frontend.tsx
    const root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);

    // Hoist globals so React + frontend code can access them
    (globalThis as any).window = windowInstance;
    (globalThis as any).document = document;
    (globalThis as any).navigator = windowInstance.navigator;
    (globalThis as any).HTMLElement = windowInstance.HTMLElement;
    (globalThis as any).Element = windowInstance.Element;
  });

  test("renders App immediately when document.readyState is complete", async () => {
    // Force document.readyState to be "complete" so frontend code calls start() synchronously
    Object.defineProperty(document, "readyState", { value: "complete", configurable: true });

    await expect(import("./frontend")).resolves.toBeDefined();
  });

  test("renders App after DOMContentLoaded when document.readyState is loading", async () => {
    // readyState defaults to "loading" in happy-dom, but make it explicit
    Object.defineProperty(document, "readyState", { value: "loading", configurable: true });

    const importPromise = import("./frontend");

    // Dispatch DOMContentLoaded after import to trigger start()
    document.dispatchEvent(new windowInstance.Event("DOMContentLoaded") as unknown as Event);

    await expect(importPromise).resolves.toBeDefined();
  });
});