import React from 'react';
import { CartItem as CartItemType } from '../../types/Cart';
import { Card, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

/**
 * Props interface for the CartItem component
 */
export interface CartItemProps {
  /** Cart item data to display */
  item: CartItemType;
  /** Whether to show the product image */
  showImage?: boolean;
  /** Whether to show variant information */
  showVariant?: boolean;
  /** Whether to show quantity controls */
  showQuantityControls?: boolean;
  /** Whether to show remove button */
  showRemoveButton?: boolean;
  /** Callback when quantity is updated */
  onUpdateQuantity?: (itemId: string, newQuantity: number) => void;
  /** Callback when item is removed */
  onRemoveItem?: (itemId: string) => void;
  /** Callback when item is clicked */
  onItemClick?: (item: CartItemType) => void;
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
 * Utility function to calculate total price for an item
 */
const calculateItemTotal = (item: CartItemType): number => {
  const basePrice = item.product.price;
  const variantPrice = item.variant?.priceModifier || 0;
  return (basePrice + variantPrice) * item.quantity;
};

/**
 * CartItem component for displaying individual items in the shopping cart
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <CartItem 
 *   item={cartItemData}
 *   onUpdateQuantity={(id, qty) => updateCartItem(id, qty)}
 *   onRemoveItem={(id) => removeFromCart(id)}
 * />
 * 
 * // Compact view without controls
 * <CartItem 
 *   item={cartItemData}
 *   showQuantityControls={false}
 *   showRemoveButton={false}
 * />
 * 
 * // Order summary view
 * <CartItem 
 *   item={cartItemData}
 *   showImage={false}
 *   showQuantityControls={false}
 *   showRemoveButton={false}
 * />
 * ```
 */
export const CartItem: React.FC<CartItemProps> = ({
  item,
  showImage = true,
  showVariant = true,
  showQuantityControls = true,
  showRemoveButton = true,
  onUpdateQuantity,
  onRemoveItem,
  onItemClick,
  className = '',
}) => {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && onUpdateQuantity) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    if (onRemoveItem) {
      onRemoveItem(item.id);
    }
  };

  const handleItemClick = () => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const itemTotal = calculateItemTotal(item);
  const unitPrice = item.product.price + (item.variant?.priceModifier || 0);
  const primaryImage = item.product.images[0] || '/placeholder-image.jpg';

  return (
    <Card 
      variant="outlined" 
      className={`${className}`}
    >
      <CardBody>
        <div className="flex gap-4">
          {/* Product Image */}
          {showImage && (
            <div 
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${onItemClick ? 'cursor-pointer' : ''}`}
              onClick={handleItemClick}
            >
              <img
                src={primaryImage}
                alt={item.product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                loading="lazy"
              />
            </div>
          )}

          {/* Item Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                {/* Product Name */}
                <h3 
                  className={`font-semibold text-gray-900 mb-1 ${onItemClick ? 'cursor-pointer hover:text-blue-600' : ''}`}
                  onClick={handleItemClick}
                >
                  {item.product.name}
                </h3>

                {/* Product Category */}
                <p className="text-sm text-gray-500 mb-2">{item.product.category}</p>

                {/* Variant Information */}
                {showVariant && item.variant && (
                  <div className="mb-2">
                    <Badge variant="default" size="sm">
                      {item.variant.name}
                      {item.variant.priceModifier !== 0 && 
                        ` (${item.variant.priceModifier > 0 ? '+' : ''}${formatPrice(item.variant.priceModifier)})`
                      }
                    </Badge>
                  </div>
                )}

                {/* Availability Status */}
                {!item.product.inStock && (
                  <Badge variant="error" size="sm" className="mb-2">
                    Out of Stock
                  </Badge>
                )}
              </div>

              {/* Remove Button */}
              {showRemoveButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                  aria-label="Remove item from cart"
                >
                  ✕
                </Button>
              )}
            </div>

            {/* Quantity Controls and Price */}
            <div className="flex items-center justify-between mt-4">
              {/* Quantity Controls */}
              {showQuantityControls ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Qty:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="px-2 py-1 rounded-r-none border-r"
                    >
                      -
                    </Button>
                    <span className="px-3 py-1 text-sm font-medium min-w-[3rem] text-center">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(item.quantity + 1)}
                      className="px-2 py-1 rounded-l-none border-l"
                    >
                      +
                    </Button>
                  </div>
                </div>
              ) : (
                <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
              )}

              {/* Price Information */}
              <div className="text-right">
                {item.quantity > 1 && (
                  <p className="text-sm text-gray-500">
                    {formatPrice(unitPrice)} each
                  </p>
                )}
                <p className="font-semibold text-gray-900">
                  {formatPrice(itemTotal)}
                </p>
              </div>
            </div>

            {/* Added Date */}
            <div className="mt-2 text-xs text-gray-400">
              Added {item.addedAt.toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default CartItem;