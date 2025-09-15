// API exports
export { productService, ProductService } from './productService';
export { orderService, OrderService } from './orderService';
export { httpClient, HttpClient } from './httpClient';
export { API_CONFIG, API_ENDPOINTS, HTTP_METHODS } from './config';

// Re-export types for convenience
export type {
  ProductResponseDTO,
  CheckoutRequestDTO,
  CheckoutResponseDTO,
  ProductFilters,
  ApiError,
  PaginatedResponse,
  ProductDimensions,
} from '../types/api';
