// src/utils/money.ts

/**
 * Format price in cents to a human-readable currency string.
 * Avoids floating point arithmetic by working with integers.
 */
export function formatMoney(priceCents: number, currency: 'USD' | 'EUR' = 'USD'): string {
  const dollars = Math.floor(priceCents / 100);
  const cents = Math.abs(priceCents % 100);
  
  const currencySymbol = currency === 'USD' ? '$' : '€';
  const formattedCents = cents.toString().padStart(2, '0');
  
  return `${currencySymbol}${dollars}.${formattedCents}`;
}

