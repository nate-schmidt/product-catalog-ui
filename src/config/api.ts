const getApiBaseUrl = (): string => {
  // In development, default to localhost:8000
  // In production, this would be set via build-time replacement
  return 'http://localhost:8000/api';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 10000,
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

export const ENDPOINTS = {
  PRODUCTS: '/products',
  PRODUCT_SEARCH: '/products/search',
  PRODUCT_DETAIL: '/products',
  CATEGORIES: '/categories',
} as const; 