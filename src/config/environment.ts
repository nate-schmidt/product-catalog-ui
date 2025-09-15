// Environment configuration
export const ENV = {
  API_URL: 'http://localhost:8080/api',
  NODE_ENV: 'development',
  DEBUG: true,
} as const;

// API Configuration
export const API_CONFIG = {
  BASE_URL: ENV.API_URL,
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;
