/**
 * Product-related type definitions for the product catalog
 */

export interface Product {
  /** Unique identifier for the product */
  id: string;
  /** Product name/title */
  name: string;
  /** Product description */
  description: string;
  /** Product price in cents to avoid floating point issues */
  price: number;
  /** Product category */
  category: string;
  /** Array of product image URLs */
  images: string[];
  /** Product availability status */
  inStock: boolean;
  /** Product rating (0-5) */
  rating: number;
  /** Number of reviews */
  reviewCount: number;
  /** Product tags for filtering */
  tags: string[];
  /** Product variants (size, color, etc.) */
  variants?: ProductVariant[];
  /** SEO-friendly URL slug */
  slug: string;
}

export interface ProductVariant {
  /** Variant identifier */
  id: string;
  /** Variant name (e.g., "Small", "Red") */
  name: string;
  /** Variant type (e.g., "size", "color") */
  type: string;
  /** Additional price for this variant */
  priceModifier: number;
  /** Availability of this specific variant */
  inStock: boolean;
}

export interface ProductFilter {
  /** Category filter */
  category?: string;
  /** Price range filter */
  priceRange?: {
    min: number;
    max: number;
  };
  /** Rating filter */
  minRating?: number;
  /** Availability filter */
  inStock?: boolean;
  /** Tag filters */
  tags?: string[];
}

export interface ProductSort {
  /** Field to sort by */
  field: 'name' | 'price' | 'rating' | 'createdAt';
  /** Sort direction */
  direction: 'asc' | 'desc';
}