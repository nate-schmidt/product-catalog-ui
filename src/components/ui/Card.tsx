import React from 'react';

/**
 * Card component variants for different visual styles
 */
export type CardVariant = 'default' | 'outlined' | 'elevated' | 'filled';

/**
 * Props interface for the Card component
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual variant of the card */
  variant?: CardVariant;
  /** Whether the card should be interactive (hoverable) */
  interactive?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Card content */
  children: React.ReactNode;
}

/**
 * Props interface for the CardHeader component
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional CSS classes */
  className?: string;
  /** Header content */
  children: React.ReactNode;
}

/**
 * Props interface for the CardBody component
 */
export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional CSS classes */
  className?: string;
  /** Body content */
  children: React.ReactNode;
}

/**
 * Props interface for the CardFooter component
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional CSS classes */
  className?: string;
  /** Footer content */
  children: React.ReactNode;
}

/**
 * Reusable Card component for containing content
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <Card>
 *   <CardHeader>Card Title</CardHeader>
 *   <CardBody>Card content goes here</CardBody>
 *   <CardFooter>Card actions</CardFooter>
 * </Card>
 * 
 * // Interactive card
 * <Card interactive variant="elevated">
 *   <CardBody>Clickable card content</CardBody>
 * </Card>
 * ```
 */
export const Card: React.FC<CardProps> = ({
  variant = 'default',
  interactive = false,
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'rounded-lg overflow-hidden';
  
  const variantClasses = {
    default: 'bg-white border border-gray-200',
    outlined: 'bg-white border-2 border-gray-300',
    elevated: 'bg-white shadow-lg border border-gray-100',
    filled: 'bg-gray-50 border border-gray-200',
  };

  const interactiveClasses = interactive 
    ? 'cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]' 
    : '';

  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    interactiveClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
};

/**
 * Card header component for titles and metadata
 * 
 * @example
 * ```tsx
 * <CardHeader>
 *   <h3 className="text-lg font-semibold">Product Title</h3>
 *   <p className="text-sm text-gray-500">Product category</p>
 * </CardHeader>
 * ```
 */
export const CardHeader: React.FC<CardHeaderProps> = ({
  className = '',
  children,
  ...props
}) => {
  const combinedClasses = ['px-6 py-4 border-b border-gray-200', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
};

/**
 * Card body component for main content
 * 
 * @example
 * ```tsx
 * <CardBody>
 *   <p>Main card content goes here...</p>
 * </CardBody>
 * ```
 */
export const CardBody: React.FC<CardBodyProps> = ({
  className = '',
  children,
  ...props
}) => {
  const combinedClasses = ['px-6 py-4', className].filter(Boolean).join(' ');

  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
};

/**
 * Card footer component for actions and metadata
 * 
 * @example
 * ```tsx
 * <CardFooter>
 *   <Button variant="primary">Add to Cart</Button>
 *   <Button variant="ghost">View Details</Button>
 * </CardFooter>
 * ```
 */
export const CardFooter: React.FC<CardFooterProps> = ({
  className = '',
  children,
  ...props
}) => {
  const combinedClasses = ['px-6 py-4 border-t border-gray-200 bg-gray-50', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;