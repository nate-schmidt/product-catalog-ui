// src/components/ProductCard.tsx
import { useState, memo } from 'react';
import type { Product } from '../types/catalog';
import { Price } from './Price';
import { Rating } from './Rating';
import { QuantityStepper } from './QuantityStepper';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string, variantId: string | undefined, quantity: number, unitPriceCents: number) => void;
}

const badgeStyles = {
  sale: 'bg-red-600 text-white',
  new: 'bg-blue-600 text-white',
  limited: 'bg-purple-600 text-white',
};

export const ProductCard = memo(function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    product.variants?.[0]?.id
  );
  
  const isOutOfStock = product.inventory === 0;
  const hasVariants = product.variants && product.variants.length > 0;
  
  // Calculate the effective price based on selected variant
  const effectivePrice = selectedVariant
    ? product.variants?.find(v => v.id === selectedVariant)?.priceCents ?? product.priceCents
    : product.priceCents;
  
  // Calculate max quantity available
  const maxQuantity = selectedVariant
    ? product.variants?.find(v => v.id === selectedVariant)?.inventory ?? product.inventory
    : product.inventory;
  
  const handleAddToCart = () => {
    if (!isOutOfStock) {
      onAddToCart(product.id, selectedVariant, quantity, effectivePrice);
      setQuantity(1); // Reset quantity after adding
    }
  };
  
  return (
    <article className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:border-gray-600 transition-colors flex flex-col">
      {/* Image Section */}
      <div className="relative aspect-square bg-gray-900">
        <img
          src={product.imageUrls[0]}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        
        {/* Badges */}
        {product.badges && product.badges.length > 0 && (
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {product.badges.map(badge => (
              <span
                key={badge}
                className={`px-2 py-1 rounded text-xs font-semibold uppercase ${badgeStyles[badge]}`}
              >
                {badge}
              </span>
            ))}
          </div>
        )}
        
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white text-lg font-bold">Out of Stock</span>
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {product.title}
        </h3>
        
        {product.description && (
          <p className="text-sm text-gray-400 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        
        {/* Rating */}
        {product.rating !== undefined && (
          <div className="mb-3">
            <Rating rating={product.rating} />
          </div>
        )}
        
        {/* Price */}
        <div className="mb-4">
          <Price priceCents={effectivePrice} currency={product.currency} className="text-2xl text-white" />
        </div>
        
        {/* Variants Selector */}
        {hasVariants && (
          <div className="mb-4">
            <label htmlFor={`variant-${product.id}`} className="block text-sm text-gray-400 mb-2">
              Select Option:
            </label>
            <select
              id={`variant-${product.id}`}
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value)}
              disabled={isOutOfStock}
              className="w-full px-3 py-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {product.variants?.map(variant => (
                <option key={variant.id} value={variant.id}>
                  {variant.name} {variant.inventory === 0 ? '(Out of Stock)' : ''}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* Quantity and Add to Cart */}
        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Quantity:</span>
            <QuantityStepper
              value={quantity}
              onChange={setQuantity}
              min={1}
              max={maxQuantity}
              disabled={isOutOfStock}
            />
          </div>
          
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-disabled={isOutOfStock}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  );
});

