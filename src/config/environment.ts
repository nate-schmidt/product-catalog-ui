/**
 * Environment configuration
 */

export const ENV = {
  API_BASE_URL: 'http://localhost:8080/api',
  NODE_ENV: 'development',
  IS_DEVELOPMENT: true,
  IS_PRODUCTION: false,
} as const;

export default ENV;