import React from 'react';
import { Product } from '../../types/Product';
import { ProductCard } from './ProductCard';

/**
 * Grid layout options for the ProductGrid
 */
export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Props interface for the ProductGrid component
 */
export interface ProductGridProps {
  /** Array of products to display */
  products: Product[];
  /** Number of columns for desktop (responsive breakpoints applied automatically) */
  columns?: GridColumns;
  /** Whether to show loading skeleton */
  loading?: boolean;
  /** Number of skeleton items to show when loading */
  skeletonCount?: number;
  /** Whether to show the "Add to Cart" button on product cards */
  showAddToCart?: boolean;
  /** Whether to show product ratings on cards */
  showRating?: boolean;
  /** Whether to show product badges on cards */
  showBadges?: boolean;
  /** Callback when a product is clicked */
  onProductClick?: (product: Product) => void;
  /** Callback when "Add to Cart" is clicked */
  onAddToCart?: (product: Product) => void;
  /** Callback when product is added to wishlist */
  onWishlist?: (product: Product) => void;
  /** Array of product IDs that are in the wishlist */
  wishlistIds?: string[];
  /** Custom empty state component */
  emptyState?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Loading skeleton component for product cards
 */
const ProductCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-300" />
    <div className="p-4">
      <div className="h-4 bg-gray-300 rounded mb-2" />
      <div className="h-6 bg-gray-300 rounded mb-2" />
      <div className="h-4 bg-gray-300 rounded mb-3 w-3/4" />
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-300 rounded w-20" />
        <div className="h-5 bg-gray-300 rounded w-16" />
      </div>
    </div>
    <div className="p-4 border-t">
      <div className="h-9 bg-gray-300 rounded" />
    </div>
  </div>
);

/**
 * Default empty state component
 */
const DefaultEmptyState: React.FC = () => (
  <div className="col-span-full text-center py-12">
    <div className="text-gray-400 text-6xl mb-4">📦</div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
    <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
  </div>
);

/**
 * ProductGrid component for displaying products in a responsive grid layout
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <ProductGrid 
 *   products={products}
 *   onProductClick={(product) => navigate(`/products/${product.slug}`)}
 *   onAddToCart={(product) => addToCart(product)}
 * />
 * 
 * // Custom grid with loading state
 * <ProductGrid 
 *   products={products}
 *   columns={3}
 *   loading={isLoading}
 *   skeletonCount={6}
 * />
 * 
 * // With wishlist functionality
 * <ProductGrid 
 *   products={products}
 *   onWishlist={(product) => toggleWishlist(product)}
 *   wishlistIds={wishlistProductIds}
 * />
 * 
 * // Compact grid without add to cart
 * <ProductGrid 
 *   products={products}
 *   columns={4}
 *   showAddToCart={false}
 *   showRating={false}
 * />
 * ```
 */
export const ProductGrid: React.FC<ProductGridProps> = ({
  products = [],
  columns = 4,
  loading = false,
  skeletonCount = 8,
  showAddToCart = true,
  showRating = true,
  showBadges = true,
  onProductClick,
  onAddToCart,
  onWishlist,
  wishlistIds = [],
  emptyState,
  className = '',
}) => {
  // Generate responsive grid classes based on columns
  const getGridClasses = (cols: GridColumns): string => {
    const gridClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
      5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
      6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6',
    };
    return gridClasses[cols];
  };

  const gridClasses = `grid ${getGridClasses(columns)} gap-6 ${className}`;

  // Show loading skeletons
  if (loading) {
    return (
      <div className={gridClasses}>
        {Array.from({ length: skeletonCount }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Show empty state if no products
  if (products.length === 0) {
    return (
      <div className={gridClasses}>
        {emptyState || <DefaultEmptyState />}
      </div>
    );
  }

  // Render products
  return (
    <div className={gridClasses}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showAddToCart={showAddToCart}
          showRating={showRating}
          showBadges={showBadges}
          onProductClick={onProductClick}
          onAddToCart={onAddToCart}
          onWishlist={onWishlist}
          isWishlisted={wishlistIds.includes(product.id)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;