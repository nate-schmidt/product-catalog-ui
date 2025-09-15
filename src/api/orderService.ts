import { httpClient } from './httpClient';
import { API_ENDPOINTS } from './config';
import { CheckoutRequestDTO, CheckoutResponseDTO } from '../types/api';

export class OrderService {
  private baseEndpoint = API_ENDPOINTS.ORDERS;

  // Process checkout
  async processCheckout(checkoutData: CheckoutRequestDTO): Promise<CheckoutResponseDTO> {
    return await httpClient.post<CheckoutResponseDTO>(`${this.baseEndpoint}/checkout`, checkoutData);
  }

  // Get order by ID (if this endpoint exists in the backend)
  async getOrderById(orderId: string): Promise<CheckoutResponseDTO> {
    return await httpClient.get<CheckoutResponseDTO>(`${this.baseEndpoint}/${orderId}`);
  }

  // Get order history (if this endpoint exists in the backend)
  async getOrderHistory(): Promise<CheckoutResponseDTO[]> {
    return await httpClient.get<CheckoutResponseDTO[]>(this.baseEndpoint);
  }
}

// Default order service instance
export const orderService = new OrderService();
