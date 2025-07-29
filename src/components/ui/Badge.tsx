import React from 'react';

/**
 * Badge component variants for different visual styles
 */
export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';

/**
 * Badge component sizes
 */
export type BadgeSize = 'sm' | 'md' | 'lg';

/**
 * Props interface for the Badge component
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual variant of the badge */
  variant?: BadgeVariant;
  /** Size of the badge */
  size?: BadgeSize;
  /** Whether the badge should have a dot indicator */
  dot?: boolean;
  /** Custom color for the badge (overrides variant) */
  color?: string;
  /** Additional CSS classes */
  className?: string;
  /** Badge content */
  children: React.ReactNode;
}

/**
 * Reusable Badge component for status indicators and labels
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <Badge>New</Badge>
 * 
 * // With different variants
 * <Badge variant="success">In Stock</Badge>
 * <Badge variant="warning">Low Stock</Badge>
 * <Badge variant="error">Out of Stock</Badge>
 * 
 * // With different sizes
 * <Badge size="lg" variant="primary">Featured</Badge>
 * 
 * // With dot indicator
 * <Badge dot variant="success">Active</Badge>
 * 
 * // With custom color
 * <Badge color="purple">Custom</Badge>
 * ```
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  dot = false,
  color,
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-indigo-100 text-indigo-800',
  };

  const dotColors = {
    default: 'bg-gray-400',
    primary: 'bg-blue-400',
    success: 'bg-green-400',
    warning: 'bg-yellow-400',
    error: 'bg-red-400',
    info: 'bg-indigo-400',
  };

  const combinedClasses = [
    baseClasses,
    sizeClasses[size],
    color ? '' : variantClasses[variant],
    className
  ].filter(Boolean).join(' ');

  const customStyle = color ? {
    backgroundColor: `${color}20`, // 20% opacity background
    color: color,
  } : {};

  return (
    <span 
      className={combinedClasses} 
      style={customStyle}
      {...props}
    >
      {dot && (
        <span 
          className={`w-2 h-2 rounded-full mr-1.5 ${color ? '' : dotColors[variant]}`}
          style={color ? { backgroundColor: color } : {}}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;