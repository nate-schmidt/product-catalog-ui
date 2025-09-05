import React, { useState, useEffect } from 'react';
import { PaymentInfo, ShippingAddress } from '../types/checkout';
import { validateCardNumber, validateCVV, validateExpiryDate, validateRequired } from '../utils/validation';
import { formatCardNumberInput } from '../utils/formatters';

interface PaymentFormProps {
  initialData?: Partial<PaymentInfo>;
  shippingAddress: ShippingAddress;
  useShippingAsBilling: boolean;
  onDataChange: (data: PaymentInfo) => void;
  onValidationChange: (isValid: boolean) => void;
  onBillingToggle: (useShipping: boolean) => void;
}

export function PaymentForm({ 
  initialData = {}, 
  shippingAddress,
  useShippingAsBilling,
  onDataChange, 
  onValidationChange,
  onBillingToggle
}: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentInfo>({
    cardNumber: initialData.cardNumber || '',
    expiryMonth: initialData.expiryMonth || '',
    expiryYear: initialData.expiryYear || '',
    cvv: initialData.cvv || '',
    cardholderName: initialData.cardholderName || '',
    billingAddress: initialData.billingAddress || { ...shippingAddress },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (useShippingAsBilling) {
      setFormData(prev => ({
        ...prev,
        billingAddress: { ...shippingAddress }
      }));
    }
  }, [shippingAddress, useShippingAsBilling]);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate card number
    const cardValidation = validateCardNumber(formData.cardNumber);
    if (!cardValidation.isValid) {
      newErrors.cardNumber = cardValidation.message;
    }

    // Validate CVV
    const cvvValidation = validateCVV(formData.cvv);
    if (!cvvValidation.isValid) {
      newErrors.cvv = cvvValidation.message;
    }

    // Validate expiry date
    const expiryValidation = validateExpiryDate(formData.expiryMonth, formData.expiryYear);
    if (!expiryValidation.isValid) {
      newErrors.expiry = expiryValidation.message;
    }

    // Validate cardholder name
    const nameValidation = validateRequired(formData.cardholderName, 'Cardholder name');
    if (!nameValidation.isValid) {
      newErrors.cardholderName = nameValidation.message;
    }

    // Validate billing address if not using shipping address
    if (!useShippingAsBilling) {
      const requiredFields = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode'];
      requiredFields.forEach(field => {
        const value = formData.billingAddress[field as keyof ShippingAddress] as string;
        const validation = validateRequired(value, `Billing ${field}`);
        if (!validation.isValid) {
          newErrors[`billing_${field}`] = validation.message;
        }
      });
    }

    setErrors(newErrors);

    const isValid = Object.keys(newErrors).length === 0;
    onValidationChange(isValid);
    
    if (isValid) {
      onDataChange(formData);
    }
  };

  const handleInputChange = (field: keyof PaymentInfo, value: string) => {
    if (field === 'cardNumber') {
      // Format card number with spaces
      value = formatCardNumberInput(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBillingAddressChange = (field: keyof ShippingAddress, value: string) => {
    setFormData(prev => ({
      ...prev,
      billingAddress: { ...prev.billingAddress, [field]: value }
    }));
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
  const months = [
    '01', '02', '03', '04', '05', '06',
    '07', '08', '09', '10', '11', '12'
  ];

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Payment Information</h2>

      {/* Card Number */}
      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Card Number *
        </label>
        <input
          type="text"
          id="cardNumber"
          value={formData.cardNumber}
          onChange={(e) => handleInputChange('cardNumber', e.target.value)}
          placeholder="1234 5678 9012 3456"
          maxLength={19} // 16 digits + 3 spaces
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
            errors.cardNumber ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.cardNumber && <p className="text-red-600 text-xs mt-1">{errors.cardNumber}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Expiry Month */}
        <div>
          <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Month *
          </label>
          <select
            id="expiryMonth"
            value={formData.expiryMonth}
            onChange={(e) => handleInputChange('expiryMonth', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
              errors.expiry ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Month</option>
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        {/* Expiry Year */}
        <div>
          <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Year *
          </label>
          <select
            id="expiryYear"
            value={formData.expiryYear}
            onChange={(e) => handleInputChange('expiryYear', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
              errors.expiry ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Year</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          {errors.expiry && <p className="text-red-600 text-xs mt-1">{errors.expiry}</p>}
        </div>

        {/* CVV */}
        <div>
          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
            CVV *
          </label>
          <input
            type="text"
            id="cvv"
            value={formData.cvv}
            onChange={(e) => handleInputChange('cvv', e.target.value)}
            placeholder="123"
            maxLength={4}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
              errors.cvv ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.cvv && <p className="text-red-600 text-xs mt-1">{errors.cvv}</p>}
        </div>
      </div>

      {/* Cardholder Name */}
      <div>
        <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">
          Cardholder Name *
        </label>
        <input
          type="text"
          id="cardholderName"
          value={formData.cardholderName}
          onChange={(e) => handleInputChange('cardholderName', e.target.value)}
          placeholder="John Doe"
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
            errors.cardholderName ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.cardholderName && <p className="text-red-600 text-xs mt-1">{errors.cardholderName}</p>}
      </div>

      {/* Billing Address Toggle */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={useShippingAsBilling}
            onChange={(e) => onBillingToggle(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">
            Use shipping address as billing address
          </span>
        </label>
      </div>

      {/* Billing Address Form */}
      {!useShippingAsBilling && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-md font-semibold text-gray-900 mb-4">Billing Address</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                value={formData.billingAddress.firstName}
                onChange={(e) => handleBillingAddressChange('firstName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  errors.billing_firstName ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.billing_firstName && <p className="text-red-600 text-xs mt-1">{errors.billing_firstName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.billingAddress.lastName}
                onChange={(e) => handleBillingAddressChange('lastName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  errors.billing_lastName ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.billing_lastName && <p className="text-red-600 text-xs mt-1">{errors.billing_lastName}</p>}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              value={formData.billingAddress.address}
              onChange={(e) => handleBillingAddressChange('address', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                errors.billing_address ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.billing_address && <p className="text-red-600 text-xs mt-1">{errors.billing_address}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                value={formData.billingAddress.city}
                onChange={(e) => handleBillingAddressChange('city', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  errors.billing_city ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.billing_city && <p className="text-red-600 text-xs mt-1">{errors.billing_city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <select
                value={formData.billingAddress.state}
                onChange={(e) => handleBillingAddressChange('state', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  errors.billing_state ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.billing_state && <p className="text-red-600 text-xs mt-1">{errors.billing_state}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code *
              </label>
              <input
                type="text"
                value={formData.billingAddress.zipCode}
                onChange={(e) => handleBillingAddressChange('zipCode', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  errors.billing_zipCode ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.billing_zipCode && <p className="text-red-600 text-xs mt-1">{errors.billing_zipCode}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}