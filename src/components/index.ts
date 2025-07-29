/**
 * Components Index
 * 
 * This file provides a central export point for all component categories.
 * You can import components from specific categories or from this main index.
 * 
 * @example
 * ```tsx
 * // Import from specific categories (recommended for better tree-shaking)
 * import { Button, Card } from '@/components/ui';
 * import { ProductCard } from '@/components/product';
 * import { Header } from '@/components/layout';
 * import { CartItem } from '@/components/cart';
 * 
 * // Or import everything from main index
 * import { Button, ProductCard, Header, CartItem } from '@/components';
 * ```
 */

// UI Components
export * from './ui';

// Product Components  
export * from './product';

// Layout Components
export * from './layout';

// Cart Components
export * from './cart';