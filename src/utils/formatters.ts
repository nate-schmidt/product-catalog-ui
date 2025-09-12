/**
 * Format currency with proper symbol and decimal places
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Format timestamp to Pacific Time as per user preference
 */
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Format dimensions for display
 */
export function formatDimensions(dimensions?: { width: number; height: number; depth: number; unit: string }): string {
  if (!dimensions) return '';
  return `${dimensions.width} × ${dimensions.height} × ${dimensions.depth} ${dimensions.unit}`;
}

/**
 * Format weight for display
 */
export function formatWeight(weight?: { value: number; unit: string }): string {
  if (!weight) return '';
  return `${weight.value} ${weight.unit}`;
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Check if product is in stock
 */
export function isInStock(stockQuantity: number): boolean {
  return stockQuantity > 0;
}

/**
 * Get stock status text
 */
export function getStockStatus(stockQuantity: number): string {
  if (stockQuantity <= 0) return 'Out of stock';
  if (stockQuantity <= 5) return 'Low stock';
  return 'In stock';
}