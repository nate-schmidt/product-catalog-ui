import React from 'react';
import { Cart } from '../../types/Cart';
import { Card, CardHeader, CardBody, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

/**
 * Props interface for the CartSummary component
 */
export interface CartSummaryProps {
  /** Cart data to display */
  cart: Cart;
  /** Whether to show detailed breakdown */
  showDetailedBreakdown?: boolean;
  /** Whether to show the checkout button */
  showCheckoutButton?: boolean;
  /** Whether the checkout button should be loading */
  checkoutLoading?: boolean;
  /** Custom discount amount in cents */
  discountAmount?: number;
  /** Discount description */
  discountDescription?: string;
  /** Callback when checkout is clicked */
  onCheckout?: () => void;
  /** Callback when continue shopping is clicked */
  onContinueShopping?: () => void;
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
 * CartSummary component for displaying cart totals and checkout options
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <CartSummary 
 *   cart={cartData}
 *   onCheckout={() => proceedToCheckout()}
 * />
 * 
 * // With discount
 * <CartSummary 
 *   cart={cartData}
 *   discountAmount={1000} // $10.00 off
 *   discountDescription="10% off your order"
 *   onCheckout={() => proceedToCheckout()}
 * />
 * 
 * // Order review mode
 * <CartSummary 
 *   cart={cartData}
 *   showCheckoutButton={false}
 *   showDetailedBreakdown={true}
 * />
 * 
 * // Loading state
 * <CartSummary 
 *   cart={cartData}
 *   checkoutLoading={true}
 *   onCheckout={() => proceedToCheckout()}
 * />
 * ```
 */
export const CartSummary: React.FC<CartSummaryProps> = ({
  cart,
  showDetailedBreakdown = true,
  showCheckoutButton = true,
  checkoutLoading = false,
  discountAmount = 0,
  discountDescription,
  onCheckout,
  onContinueShopping,
  className = '',
}) => {
  const finalTotal = cart.total - discountAmount;
  const hasItems = cart.items.length > 0;

  return (
    <Card variant="elevated" className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Order Summary
          </h3>
          <Badge variant="primary" size="sm">
            {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'}
          </Badge>
        </div>
      </CardHeader>

      <CardBody>
        {hasItems ? (
          <div className="space-y-3">
            {/* Subtotal */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">{formatPrice(cart.subtotal)}</span>
            </div>

            {/* Detailed Breakdown */}
            {showDetailedBreakdown && (
              <>
                {/* Shipping */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {cart.shipping === 0 ? 'Free' : formatPrice(cart.shipping)}
                  </span>
                </div>

                {/* Tax */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">{formatPrice(cart.tax)}</span>
                </div>

                {/* Discount */}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">
                      {discountDescription || 'Discount'}
                    </span>
                    <span className="text-green-600">
                      -{formatPrice(discountAmount)}
                    </span>
                  </div>
                )}
              </>
            )}

            {/* Divider */}
            <hr className="border-gray-200" />

            {/* Total */}
            <div className="flex justify-between text-lg font-semibold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">{formatPrice(finalTotal)}</span>
            </div>

            {/* Free Shipping Threshold */}
            {cart.shipping > 0 && cart.subtotal < 5000 && ( // Assuming free shipping at $50
              <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                Add {formatPrice(5000 - cart.subtotal)} more for free shipping!
              </div>
            )}

            {/* Cart Last Updated */}
            <div className="text-xs text-gray-400 text-center">
              Last updated: {cart.updatedAt.toLocaleString()}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">🛒</div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Your cart is empty
            </h4>
            <p className="text-gray-500 mb-4">
              Add some products to get started
            </p>
          </div>
        )}
      </CardBody>

      {/* Action Buttons */}
      {hasItems && (
        <CardFooter>
          <div className="space-y-3 w-full">
            {showCheckoutButton && (
              <Button
                fullWidth
                variant="primary"
                size="lg"
                onClick={onCheckout}
                loading={checkoutLoading}
                disabled={!hasItems}
              >
                {checkoutLoading ? 'Processing...' : `Checkout (${formatPrice(finalTotal)})`}
              </Button>
            )}
            
            {onContinueShopping && (
              <Button
                fullWidth
                variant="outline"
                onClick={onContinueShopping}
                disabled={checkoutLoading}
              >
                Continue Shopping
              </Button>
            )}
          </div>
        </CardFooter>
      )}

      {/* Empty Cart Actions */}
      {!hasItems && onContinueShopping && (
        <CardFooter>
          <Button
            fullWidth
            variant="primary"
            onClick={onContinueShopping}
          >
            Start Shopping
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CartSummary;