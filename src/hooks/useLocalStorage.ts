import { useState, useEffect } from "react";

/**
 * Persist a value in localStorage while keeping it in sync with React state.
 *
 * @param key          localStorage key
 * @param initialValue initial value to use if nothing stored yet
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Failed to read localStorage key \"${key}\"`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Failed to write localStorage key \"${key}\"`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}