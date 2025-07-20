export interface Product {
  id: string;
  name: string;
  manufacturer: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
  inStock: boolean;
  
  // Extended fields (optional)
  sku?: string;
  slug?: string;
  shortDescription?: string;
  compareAtPrice?: number;
  featured?: boolean;
  categories?: Category[];
  images?: ProductImage[];
  specifications?: ProductSpecification[];
  inventory?: Inventory;
}

export interface SearchFilters {
  query: string;
  manufacturer?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

// API-specific types
export interface ProductApiResponse {
  data: ProductApiData[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface ProductApiData {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  price: number;
  compare_at_price?: number;
  cost?: number;
  status: 'active' | 'inactive' | 'draft';
  featured: boolean;
  weight?: number;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
  categories: Category[];
  tags: Tag[];
  images: ProductImage[];
  specifications: ProductSpecification[];
  variants: ProductVariant[];
  inventory: Inventory;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  display_order?: number;
  is_active: boolean;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt_text?: string;
  is_primary: boolean;
  display_order: number;
}

export interface ProductSpecification {
  id: string;
  name: string;
  value: string;
  display_order: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  price: number;
  compare_at_price?: number;
  inventory: Inventory;
}

export interface Inventory {
  product_id: string;
  quantity: number;
  low_stock_threshold: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

// Search and filter types
export interface ProductSearchParams {
  query?: string;
  category?: string;
  manufacturer?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  inStock?: boolean;
  limit?: number;
  offset?: number;
}

export class ApiError extends Error {
  code?: string;
  details?: any;

  constructor(options: { message: string; code?: string; details?: any }) {
    super(options.message);
    this.name = 'ApiError';
    this.code = options.code;
    this.details = options.details;
  }
} 