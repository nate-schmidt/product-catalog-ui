/**
 * Utility functions for formatting data
 */

/**
 * Format price from backend BigDecimal to display string
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

/**
 * Format dimensions for display
 */
export const formatDimensions = (dimensions?: {
  width: number;
  height: number;
  depth: number;
  unit: string;
}): string => {
  if (!dimensions || !dimensions.width || !dimensions.height || !dimensions.depth) {
    return 'Dimensions not specified';
  }
  
  const { width, height, depth, unit } = dimensions;
  return `${width} × ${height} × ${depth} ${unit}`;
};

/**
 * Format stock display
 */
export const formatStock = (stock: number): string => {
  if (stock === 0) return 'Out of stock';
  if (stock <= 5) return `Only ${stock} left!`;
  if (stock <= 10) return `${stock} in stock`;
  return 'In stock';
};

/**
 * Get stock status color
 */
export const getStockStatusColor = (stock: number): string => {
  if (stock === 0) return '#dc3545'; // red
  if (stock <= 5) return '#fd7e14'; // orange  
  if (stock <= 10) return '#ffc107'; // yellow
  return '#28a745'; // green
};

/**
 * Transform backend ProductResponseDTO to frontend Product model
 */
export const transformProduct = (dto: any): any => {
  return {
    ...dto,
    price: Number(dto.price), // Convert BigDecimal to number
  };
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Capitalize first letter of each word
 */
export const capitalize = (str: string): string => {
  return str.replace(/\b\w/g, l => l.toUpperCase());
};