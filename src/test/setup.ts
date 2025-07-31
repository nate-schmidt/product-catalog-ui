import '@testing-library/jest-dom';
import { beforeEach, afterEach } from 'bun:test';
import { cleanup } from '@testing-library/react';

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables
process.env.VITE_API_BASE_URL = 'http://localhost:8080/api';

// Mock fetch for API tests
const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = originalFetch;
});

// Custom test utilities
export const mockFetch = (response: any, ok = true) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok,
      status: ok ? 200 : 400,
      json: () => Promise.resolve(response),
    })
  ) as jest.Mock;
};

export const mockFetchError = (error: string) => {
  global.fetch = jest.fn(() => Promise.reject(new Error(error))) as jest.Mock;
};