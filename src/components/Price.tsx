// src/components/Price.tsx
import { formatMoney } from '../utils/money';

interface PriceProps {
  priceCents: number;
  currency?: 'USD' | 'EUR';
  className?: string;
}

export function Price({ priceCents, currency = 'USD', className = '' }: PriceProps) {
  return (
    <span className={`font-mono font-semibold ${className}`}>
      {formatMoney(priceCents, currency)}
    </span>
  );
}

