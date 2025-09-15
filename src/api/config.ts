import { API_CONFIG as ENV_CONFIG } from '../config/environment';

// API Configuration
export const API_CONFIG = {
  BASE_URL: ENV_CONFIG.BASE_URL,
  TIMEOUT: ENV_CONFIG.TIMEOUT,
  RETRY_ATTEMPTS: ENV_CONFIG.RETRY_ATTEMPTS,
  RETRY_DELAY: ENV_CONFIG.RETRY_DELAY,
};

export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  ORDERS: '/orders',
  CHECKOUT: '/orders/checkout',
} as const;

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const;
