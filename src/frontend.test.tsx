import { describe, test, expect, beforeEach, afterEach, mock } from "bun:test";
import { createRoot } from "react-dom/client";

// The module under test will call createRoot(document.getElementById('root')!)
// and then render(<App />). We mock createRoot to observe usage without a real DOM.
const renderMock = mock(() => {});

// Stub implementation of createRoot used by the module
mock.module("react-dom/client", () => ({ createRoot: mock(() => ({ render: renderMock })) }));

// Use a minimal DOM shim via happy-dom-like globals
declare const global: any;

describe("frontend bootstrap", () => {
  beforeEach(() => {
    renderMock.mockReset();
    // Reset createRoot call counts between tests to avoid cross-test leakage
    (createRoot as any).mockReset?.();
    // Minimal document implementation sufficient for index.tsx
    const listeners: Record<string, Function[]> = {};
    const rootEl = { id: "root" } as any;
    global.document = {
      readyState: "complete",
      getElementById: (id: string) => (id === "root" ? rootEl : null),
      addEventListener: (type: string, cb: Function) => {
        listeners[type] ||= [];
        listeners[type].push(cb);
      },
      _dispatch: (type: string) => listeners[type]?.forEach(cb => cb()),
    };
  });

  afterEach(() => {
    // Cleanup globals to avoid cross-test pollution
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete (global as any).document;
  });

  test("mounts App on #root when document is ready", async () => {
    // Import after setting up mocks so the bootstrap code uses our stubs
    await import("./frontend");
    expect(createRoot).toHaveBeenCalledTimes(1);
    expect(renderMock).toHaveBeenCalledTimes(1);
  });

  test("defers mount until DOMContentLoaded when loading", async () => {
    const listeners: Record<string, Function[]> = {};
    const rootEl = { id: "root" } as any;
    (global as any).document = {
      readyState: "loading",
      getElementById: (id: string) => (id === "root" ? rootEl : null),
      addEventListener: (type: string, cb: Function) => {
        listeners[type] ||= [];
        listeners[type].push(cb);
      },
      _dispatch: (type: string) => listeners[type]?.forEach(cb => cb()),
    };

    await import("./frontend");
    // Not mounted yet
    expect(createRoot).toHaveBeenCalledTimes(0);
    expect(renderMock).toHaveBeenCalledTimes(0);

    // Fire DOMContentLoaded
    (global as any).document._dispatch("DOMContentLoaded");
    expect(createRoot).toHaveBeenCalledTimes(1);
    expect(renderMock).toHaveBeenCalledTimes(1);
  });
});

