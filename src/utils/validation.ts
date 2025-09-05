/**
 * Validation utility functions
 */

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  if (!email.trim()) {
    return { isValid: false, message: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  return { isValid: true, message: '' };
}

/**
 * Validate phone number
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone.trim()) {
    return { isValid: false, message: 'Phone number is required' };
  }
  
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 10) {
    return { isValid: false, message: 'Please enter a valid 10-digit phone number' };
  }
  
  return { isValid: true, message: '' };
}

/**
 * Validate ZIP code
 */
export function validateZipCode(zipCode: string): ValidationResult {
  if (!zipCode.trim()) {
    return { isValid: false, message: 'ZIP code is required' };
  }
  
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!zipRegex.test(zipCode)) {
    return { isValid: false, message: 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)' };
  }
  
  return { isValid: true, message: '' };
}

/**
 * Validate credit card number using Luhn algorithm
 */
export function validateCardNumber(cardNumber: string): ValidationResult {
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (!cleaned) {
    return { isValid: false, message: 'Card number is required' };
  }
  
  if (cleaned.length < 13 || cleaned.length > 19) {
    return { isValid: false, message: 'Please enter a valid card number' };
  }
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i));
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  if (sum % 10 !== 0) {
    return { isValid: false, message: 'Please enter a valid card number' };
  }
  
  return { isValid: true, message: '' };
}

/**
 * Validate CVV
 */
export function validateCVV(cvv: string, cardType?: string): ValidationResult {
  if (!cvv.trim()) {
    return { isValid: false, message: 'CVV is required' };
  }
  
  const cleaned = cvv.replace(/\D/g, '');
  const expectedLength = cardType === 'amex' ? 4 : 3;
  
  if (cleaned.length !== expectedLength) {
    return { 
      isValid: false, 
      message: `Please enter a valid ${expectedLength}-digit CVV` 
    };
  }
  
  return { isValid: true, message: '' };
}

/**
 * Validate expiry date
 */
export function validateExpiryDate(month: string, year: string): ValidationResult {
  if (!month || !year) {
    return { isValid: false, message: 'Expiry date is required' };
  }
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  const expMonth = parseInt(month);
  const expYear = parseInt(year);
  
  if (expMonth < 1 || expMonth > 12) {
    return { isValid: false, message: 'Please enter a valid month' };
  }
  
  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    return { isValid: false, message: 'Card has expired' };
  }
  
  return { isValid: true, message: '' };
}

/**
 * Validate required field
 */
export function validateRequired(value: string, fieldName: string): ValidationResult {
  if (!value?.trim()) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  return { isValid: true, message: '' };
}

/**
 * Validate minimum length
 */
export function validateMinLength(value: string, minLength: number, fieldName: string): ValidationResult {
  if (value.length < minLength) {
    return { 
      isValid: false, 
      message: `${fieldName} must be at least ${minLength} characters` 
    };
  }
  
  return { isValid: true, message: '' };
}