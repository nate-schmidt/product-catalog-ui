import { Product, CartItem } from '../types';

export const validateProduct = (product: any): product is Product => {
  if (!product || typeof product !== 'object') {
    return false;
  }

  const requiredFields = ['id', 'name', 'price', 'description', 'image', 'category'];
  const hasRequiredFields = requiredFields.every(field => product[field] !== undefined);

  if (!hasRequiredFields) {
    return false;
  }

  return (
    typeof product.id === 'string' &&
    typeof product.name === 'string' &&
    typeof product.price === 'number' &&
    typeof product.description === 'string' &&
    typeof product.image === 'string' &&
    typeof product.category === 'string' &&
    typeof product.inStock === 'boolean' &&
    product.price >= 0
  );
};

export const validateCartItem = (item: any): item is CartItem => {
  if (!item || typeof item !== 'object') {
    return false;
  }

  return (
    typeof item.id === 'string' &&
    validateProduct(item.product) &&
    typeof item.quantity === 'number' &&
    item.quantity > 0 &&
    Number.isInteger(item.quantity)
  );
};

export const validateQuantity = (quantity: number): boolean => {
  return (
    typeof quantity === 'number' &&
    Number.isInteger(quantity) &&
    quantity > 0 &&
    quantity <= 99
  );
};

export const validatePrice = (price: number): boolean => {
  return (
    typeof price === 'number' &&
    price >= 0 &&
    !isNaN(price) &&
    isFinite(price)
  );
};

export const formatPrice = (price: number): string => {
  if (!validatePrice(price)) {
    return '$0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const sanitizeSearchQuery = (query: string): string => {
  if (typeof query !== 'string') {
    return '';
  }
  return query.trim().toLowerCase().replace(/[^\w\s-]/g, '');
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email);
};