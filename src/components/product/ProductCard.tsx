import React from 'react';
import { Product } from '../../types/Product';
import { Card, CardBody, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

/**
 * Props interface for the ProductCard component
 */
export interface ProductCardProps {
  /** Product data to display */
  product: Product;
  /** Whether to show the "Add to Cart" button */
  showAddToCart?: boolean;
  /** Whether to show the product rating */
  showRating?: boolean;
  /** Whether to show product badges (e.g., "New", "Sale") */
  showBadges?: boolean;
  /** Callback when product is clicked */
  onProductClick?: (product: Product) => void;
  /** Callback when "Add to Cart" is clicked */
  onAddToCart?: (product: Product) => void;
  /** Callback when product is added to wishlist */
  onWishlist?: (product: Product) => void;
  /** Whether the product is in the user's wishlist */
  isWishlisted?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Utility function to format price in cents to dollars
 */
const formatPrice = (priceInCents: number): string => {
  return `$${(priceInCents / 100).toFixed(2)}`;
};

/**
 * Utility function to render star rating
 */
const renderStars = (rating: number): React.ReactNode => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <span key={i} className="text-yellow-400">★</span>
    );
  }

  if (hasHalfStar) {
    stars.push(
      <span key="half" className="text-yellow-400">☆</span>
    );
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <span key={`empty-${i}`} className="text-gray-300">☆</span>
    );
  }

  return stars;
};

/**
 * ProductCard component for displaying product information in a card layout
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <ProductCard 
 *   product={productData}
 *   onProductClick={(product) => navigate(`/products/${product.slug}`)}
 *   onAddToCart={(product) => addToCart(product)}
 * />
 * 
 * // Minimal card without actions
 * <ProductCard 
 *   product={productData}
 *   showAddToCart={false}
 *   showRating={false}
 * />
 * 
 * // With wishlist functionality
 * <ProductCard 
 *   product={productData}
 *   onWishlist={(product) => toggleWishlist(product)}
 *   isWishlisted={wishlistItems.includes(product.id)}
 * />
 * ```
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showAddToCart = true,
  showRating = true,
  showBadges = true,
  onProductClick,
  onAddToCart,
  onWishlist,
  isWishlisted = false,
  className = '',
}) => {
  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (onWishlist) {
      onWishlist(product);
    }
  };

  const primaryImage = product.images[0] || '/placeholder-image.jpg';

  return (
    <Card 
      interactive={!!onProductClick}
      variant="elevated"
      className={`group cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Badges */}
        {showBadges && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {!product.inStock && (
              <Badge variant="error" size="sm">Out of Stock</Badge>
            )}
            {product.tags.includes('new') && (
              <Badge variant="primary" size="sm">New</Badge>
            )}
            {product.tags.includes('sale') && (
              <Badge variant="warning" size="sm">Sale</Badge>
            )}
          </div>
        )}

        {/* Wishlist Button */}
        {onWishlist && (
          <button
            onClick={handleWishlistClick}
            className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <span className={`text-lg ${isWishlisted ? 'text-red-500' : 'text-gray-400'}`}>
              {isWishlisted ? '♥' : '♡'}
            </span>
          </button>
        )}
      </div>

      <CardBody>
        {/* Product Category */}
        <p className="text-sm text-gray-500 mb-1">{product.category}</p>
        
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        {/* Product Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        {showRating && product.rating > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-gray-500">
              {product.rating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          
          {/* Stock Status */}
          {product.inStock ? (
            <Badge variant="success" size="sm">In Stock</Badge>
          ) : (
            <Badge variant="error" size="sm">Out of Stock</Badge>
          )}
        </div>
      </CardBody>

      {/* Add to Cart Button */}
      {showAddToCart && (
        <CardFooter>
          <Button
            fullWidth
            onClick={handleAddToCart}
            disabled={!product.inStock}
            variant={product.inStock ? 'primary' : 'outline'}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProductCard;