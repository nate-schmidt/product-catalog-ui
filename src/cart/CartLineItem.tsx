// src/cart/CartLineItem.tsx
import { useState, useEffect } from 'react';
import type { CartItem, Product } from '../types/catalog';
import { Price } from '../components/Price';
import { QuantityStepper } from '../components/QuantityStepper';

interface CartLineItemProps {
  item: CartItem;
  product: Product;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export function CartLineItem({ item, product, onUpdateQuantity, onRemove }: CartLineItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  
  // Sync with prop changes
  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);
  
  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    onUpdateQuantity(newQuantity);
  };
  
  const variant = item.variantId 
    ? product.variants?.find(v => v.id === item.variantId)
    : undefined;
  
  const maxInventory = variant?.inventory ?? product.inventory;
  const lineTotalCents = item.unitPriceCents * item.quantity;
  
  return (
    <div className="flex gap-4 py-4 border-b border-gray-700 last:border-b-0">
      {/* Image */}
      <div className="w-20 h-20 flex-shrink-0 bg-gray-900 rounded overflow-hidden">
        <img
          src={product.imageUrls[0]}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Details */}
      <div className="flex-grow min-w-0">
        <h4 className="text-sm font-semibold text-white truncate">
          {product.title}
        </h4>
        
        {variant && (
          <p className="text-xs text-gray-400 mt-1">
            {variant.name}
          </p>
        )}
        
        <div className="flex items-center gap-4 mt-2">
          <Price priceCents={item.unitPriceCents} currency={product.currency} className="text-sm text-gray-300" />
          <span className="text-gray-500">×</span>
          <QuantityStepper
            value={quantity}
            onChange={handleQuantityChange}
            min={1}
            max={maxInventory}
            className="scale-90 origin-left"
          />
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-red-400 hover:text-red-300 focus:outline-none focus:underline"
          >
            Remove
          </button>
          
          <Price priceCents={lineTotalCents} currency={product.currency} className="text-sm font-semibold text-white" />
        </div>
      </div>
    </div>
  );
}

