import { FlashSale, FlashSaleStatus } from '../types/flashSales';

/**
 * Calculate the current status of a flash sale
 */
export function calculateFlashSaleStatus(flashSale: FlashSale): FlashSaleStatus {
  const now = new Date().getTime();
  const startTime = new Date(flashSale.startTime).getTime();
  const endTime = new Date(flashSale.endTime).getTime();
  
  const hasStarted = now >= startTime;
  const hasEnded = now >= endTime;
  const isActive = hasStarted && !hasEnded && flashSale.isActive;
  
  let timeRemaining = 0;
  let percentageComplete = 0;
  
  if (hasStarted && !hasEnded) {
    timeRemaining = endTime - now;
    const totalDuration = endTime - startTime;
    const elapsed = now - startTime;
    percentageComplete = Math.min(100, (elapsed / totalDuration) * 100);
  } else if (!hasStarted) {
    timeRemaining = startTime - now;
  }
  
  return {
    isActive,
    timeRemaining: Math.max(0, timeRemaining),
    hasStarted,
    hasEnded,
    percentageComplete: Math.max(0, Math.min(100, percentageComplete))
  };
}

/**
 * Validate if a flash sale can be created or updated
 */
export function validateFlashSale(flashSale: Partial<FlashSale>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!flashSale.productId) {
    errors.push('Product ID is required');
  }

  if (!flashSale.discountPercentage || flashSale.discountPercentage <= 0 || flashSale.discountPercentage > 100) {
    errors.push('Discount percentage must be between 1 and 100');
  }

  if (!flashSale.startTime) {
    errors.push('Start time is required');
  }

  if (!flashSale.endTime) {
    errors.push('End time is required');
  }

  if (!flashSale.title || flashSale.title.trim().length === 0) {
    errors.push('Title is required');
  }

  // Date validations
  if (flashSale.startTime && flashSale.endTime) {
    const startTime = new Date(flashSale.startTime).getTime();
    const endTime = new Date(flashSale.endTime).getTime();
    const now = new Date().getTime();

    if (startTime >= endTime) {
      errors.push('End time must be after start time');
    }

    if (endTime <= now) {
      errors.push('End time must be in the future');
    }

    // Flash sales should be relatively short (max 24 hours)
    const maxDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    if (endTime - startTime > maxDuration) {
      errors.push('Flash sales cannot exceed 24 hours in duration');
    }

    // Minimum duration (at least 15 minutes)
    const minDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
    if (endTime - startTime < minDuration) {
      errors.push('Flash sales must be at least 15 minutes long');
    }
  }

  // Quantity validations
  if (flashSale.maxQuantity !== undefined) {
    if (flashSale.maxQuantity <= 0) {
      errors.push('Maximum quantity must be greater than 0');
    }

    if (flashSale.soldQuantity !== undefined && flashSale.soldQuantity > flashSale.maxQuantity) {
      errors.push('Sold quantity cannot exceed maximum quantity');
    }
  }

  if (flashSale.soldQuantity !== undefined && flashSale.soldQuantity < 0) {
    errors.push('Sold quantity cannot be negative');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Check if a flash sale is available for purchase
 */
export function isFlashSaleAvailable(flashSale: FlashSale): { available: boolean; reason?: string } {
  const status = calculateFlashSaleStatus(flashSale);

  if (!status.isActive) {
    if (!status.hasStarted) {
      return { available: false, reason: 'Flash sale has not started yet' };
    }
    if (status.hasEnded) {
      return { available: false, reason: 'Flash sale has ended' };
    }
    return { available: false, reason: 'Flash sale is not active' };
  }

  if (flashSale.maxQuantity && flashSale.soldQuantity >= flashSale.maxQuantity) {
    return { available: false, reason: 'Flash sale is sold out' };
  }

  if (!flashSale.product.inStock || flashSale.product.stockCount <= 0) {
    return { available: false, reason: 'Product is out of stock' };
  }

  return { available: true };
}

/**
 * Calculate flash sale price based on original price and discount
 */
export function calculateFlashPrice(originalPrice: number, discountPercentage: number): number {
  if (discountPercentage < 0 || discountPercentage > 100) {
    throw new Error('Discount percentage must be between 0 and 100');
  }
  
  const discountAmount = (originalPrice * discountPercentage) / 100;
  return Math.round((originalPrice - discountAmount) * 100) / 100; // Round to 2 decimal places
}

/**
 * Get urgency level based on time remaining
 */
export function getUrgencyLevel(timeRemaining: number): 'low' | 'medium' | 'high' | 'critical' {
  const hours = timeRemaining / (1000 * 60 * 60);
  
  if (hours <= 0.25) { // 15 minutes or less
    return 'critical';
  } else if (hours <= 1) { // 1 hour or less
    return 'high';
  } else if (hours <= 6) { // 6 hours or less
    return 'medium';
  } else {
    return 'low';
  }
}

/**
 * Format time remaining in a human-readable way
 */
export function formatTimeRemaining(timeRemaining: number): string {
  if (timeRemaining <= 0) {
    return 'Expired';
  }

  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Check if two flash sales have overlapping time periods for the same product
 */
export function hasTimeOverlap(sale1: FlashSale, sale2: FlashSale): boolean {
  if (sale1.productId !== sale2.productId) {
    return false;
  }

  const start1 = new Date(sale1.startTime).getTime();
  const end1 = new Date(sale1.endTime).getTime();
  const start2 = new Date(sale2.startTime).getTime();
  const end2 = new Date(sale2.endTime).getTime();

  return (start1 < end2) && (start2 < end1);
}

/**
 * Sort flash sales by priority (active first, then upcoming, then ended)
 */
export function sortFlashSalesByPriority(flashSales: (FlashSale & { status: FlashSaleStatus })[]): (FlashSale & { status: FlashSaleStatus })[] {
  return [...flashSales].sort((a, b) => {
    // Active sales first
    if (a.status.isActive && !b.status.isActive) return -1;
    if (!a.status.isActive && b.status.isActive) return 1;

    // Among active sales, sort by time remaining (least time first)
    if (a.status.isActive && b.status.isActive) {
      return a.status.timeRemaining - b.status.timeRemaining;
    }

    // Among non-active sales, upcoming before ended
    if (!a.status.hasStarted && b.status.hasEnded) return -1;
    if (a.status.hasEnded && !b.status.hasStarted) return 1;

    // Among upcoming sales, sort by start time (earliest first)
    if (!a.status.hasStarted && !b.status.hasStarted) {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    }

    // Among ended sales, sort by end time (most recent first)
    if (a.status.hasEnded && b.status.hasEnded) {
      return new Date(b.endTime).getTime() - new Date(a.endTime).getTime();
    }

    return 0;
  });
}