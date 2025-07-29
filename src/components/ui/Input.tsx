import React from 'react';

/**
 * Input component sizes
 */
export type InputSize = 'sm' | 'md' | 'lg';

/**
 * Input component variants
 */
export type InputVariant = 'default' | 'filled' | 'outlined';

/**
 * Props interface for the Input component
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Input size */
  size?: InputSize;
  /** Input variant */
  variant?: InputVariant;
  /** Label text for the input */
  label?: string;
  /** Helper text displayed below the input */
  helperText?: string;
  /** Error message to display */
  error?: string;
  /** Whether the input is in an error state */
  hasError?: boolean;
  /** Icon to display at the start of the input */
  startIcon?: React.ReactNode;
  /** Icon to display at the end of the input */
  endIcon?: React.ReactNode;
  /** Additional CSS classes for the input wrapper */
  wrapperClassName?: string;
  /** Additional CSS classes for the input element */
  className?: string;
}

/**
 * Reusable Input component with various states and styles
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <Input placeholder="Enter your name" />
 * 
 * // With label and helper text
 * <Input 
 *   label="Email Address"
 *   placeholder="Enter your email"
 *   helperText="We'll never share your email"
 * />
 * 
 * // With error state
 * <Input 
 *   label="Password"
 *   type="password"
 *   error="Password must be at least 8 characters"
 *   hasError
 * />
 * 
 * // With icons
 * <Input 
 *   placeholder="Search products..."
 *   startIcon={<SearchIcon />}
 *   endIcon={<FilterIcon />}
 * />
 * ```
 */
export const Input: React.FC<InputProps> = ({
  size = 'md',
  variant = 'default',
  label,
  helperText,
  error,
  hasError = false,
  startIcon,
  endIcon,
  wrapperClassName = '',
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const isError = hasError || !!error;

  const baseInputClasses = 'w-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantClasses = {
    default: 'border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500',
    filled: 'border border-transparent rounded-lg bg-gray-100 focus:ring-blue-500 focus:bg-white focus:border-blue-500',
    outlined: 'border-2 border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500',
  };

  const errorClasses = isError 
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
    : '';

  const iconPadding = {
    start: startIcon ? 'pl-10' : '',
    end: endIcon ? 'pr-10' : '',
  };

  const inputClasses = [
    baseInputClasses,
    sizeClasses[size],
    variantClasses[variant],
    errorClasses,
    iconPadding.start,
    iconPadding.end,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={`relative ${wrapperClassName}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-sm">{startIcon}</span>
          </div>
        )}
        
        <input
          id={inputId}
          className={inputClasses}
          {...props}
        />
        
        {endIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-sm">{endIcon}</span>
          </div>
        )}
      </div>
      
      {(helperText || error) && (
        <p className={`mt-1 text-sm ${isError ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;