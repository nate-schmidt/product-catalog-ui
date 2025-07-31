import React from 'react';
import { validateQuantity } from '../utils/validation';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  disabled = false,
  size = 'md',
  className = ''
}) => {
  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    if (newQuantity <= max && validateQuantity(newQuantity)) {
      onQuantityChange(newQuantity);
    }
  };

  const handleDecrement = () => {
    const newQuantity = quantity - 1;
    if (newQuantity >= min && validateQuantity(newQuantity)) {
      onQuantityChange(newQuantity);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= min && value <= max && validateQuantity(value)) {
      onQuantityChange(value);
    } else if (e.target.value === '') {
      // Allow empty input temporarily
      onQuantityChange(min);
    }
  };

  const sizeClasses = {
    sm: {
      button: 'w-6 h-6 text-sm',
      input: 'w-12 h-6 text-sm px-1'
    },
    md: {
      button: 'w-8 h-8 text-base',
      input: 'w-16 h-8 text-base px-2'
    },
    lg: {
      button: 'w-10 h-10 text-lg',
      input: 'w-20 h-10 text-lg px-3'
    }
  };

  const isDecrementDisabled = disabled || quantity <= min;
  const isIncrementDisabled = disabled || quantity >= max;

  return (
    <div className={`flex items-center space-x-1 ${className}`} data-testid="quantity-selector">
      <button
        onClick={handleDecrement}
        disabled={isDecrementDisabled}
        className={`
          ${sizeClasses[size].button}
          flex items-center justify-center
          border border-gray-300 rounded-md
          ${isDecrementDisabled 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100'
          }
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
        `}
        aria-label="Decrease quantity"
        data-testid="decrement-button"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>

      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={min}
        max={max}
        disabled={disabled}
        className={`
          ${sizeClasses[size].input}
          text-center border border-gray-300 rounded-md
          ${disabled 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-white text-gray-900'
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
        `}
        aria-label={`Quantity: ${quantity}`}
        data-testid="quantity-input"
      />

      <button
        onClick={handleIncrement}
        disabled={isIncrementDisabled}
        className={`
          ${sizeClasses[size].button}
          flex items-center justify-center
          border border-gray-300 rounded-md
          ${isIncrementDisabled 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100'
          }
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
        `}
        aria-label="Increase quantity"
        data-testid="increment-button"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>
  );
};