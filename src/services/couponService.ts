import { 
  CouponValidationRequest, 
  CouponValidationResponse, 
  CouponResponseDTO, 
  CouponRequestDTO,
  ApiError 
} from '../types/coupon';
import { CartItem } from '../types/product';
import { apiService } from './api';

class CouponService {
  private readonly baseUrl = '/api/coupons';

  /**
   * Validate a coupon against cart items
   */
  async validateCoupon(code: string, cartItems: CartItem[]): Promise<CouponValidationResponse> {
    const request: CouponValidationRequest = {
      code: code.trim().toUpperCase(),
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        category: item.category
      })),
      currency: 'USD'
    };

    try {
      const response = await apiService.post<CouponValidationResponse>(
        `${this.baseUrl}/validate`,
        request
      );
      return response;
    } catch (error) {
      console.error('Failed to validate coupon:', error);
      throw error;
    }
  }

  /**
   * Get coupon by code
   */
  async getCouponByCode(code: string): Promise<CouponResponseDTO> {
    try {
      const response = await apiService.get<CouponResponseDTO>(
        `${this.baseUrl}/code/${encodeURIComponent(code)}`
      );
      return response;
    } catch (error) {
      console.error('Failed to get coupon by code:', error);
      throw error;
    }
  }

  /**
   * Get all coupons (admin/dev)
   */
  async getAllCoupons(): Promise<CouponResponseDTO[]> {
    try {
      const response = await apiService.get<CouponResponseDTO[]>(this.baseUrl);
      return response;
    } catch (error) {
      console.error('Failed to get all coupons:', error);
      throw error;
    }
  }

  /**
   * Create a new coupon (admin/dev)
   */
  async createCoupon(couponData: CouponRequestDTO): Promise<CouponResponseDTO> {
    try {
      const response = await apiService.post<CouponResponseDTO>(
        this.baseUrl,
        couponData
      );
      return response;
    } catch (error) {
      console.error('Failed to create coupon:', error);
      throw error;
    }
  }

  /**
   * Update an existing coupon (admin/dev)
   */
  async updateCoupon(id: number, couponData: CouponRequestDTO): Promise<CouponResponseDTO> {
    try {
      const response = await apiService.put<CouponResponseDTO>(
        `${this.baseUrl}/${id}`,
        couponData
      );
      return response;
    } catch (error) {
      console.error('Failed to update coupon:', error);
      throw error;
    }
  }

  /**
   * Delete a coupon (admin/dev)
   */
  async deleteCoupon(id: number): Promise<void> {
    try {
      await apiService.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Failed to delete coupon:', error);
      throw error;
    }
  }
}

export const couponService = new CouponService();
