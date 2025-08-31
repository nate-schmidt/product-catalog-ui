// Register happy-dom globals
import { GlobalRegistrator } from '@happy-dom/global-registrator';
GlobalRegistrator.register();

// Polyfill requestAnimationFrame on global and window if missing
if (!globalThis.requestAnimationFrame) {
  // @ts-ignore - loosely typed for test env
  globalThis.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 0) as unknown as number;
}
if (!globalThis.cancelAnimationFrame) {
  // @ts-ignore
  globalThis.cancelAnimationFrame = (id: number) => clearTimeout(id as unknown as number);
}

if (typeof window !== 'undefined') {
  const w = window as any;
  if (!w.requestAnimationFrame) {
    w.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 0) as unknown as number;
  }
  if (!w.cancelAnimationFrame) {
    w.cancelAnimationFrame = (id: number) => clearTimeout(id as unknown as number);
  }
}

