import React, { useState, useEffect } from 'react';
import { ShippingAddress } from '../types/checkout';
import { validateRequired, validatePhone, validateZipCode } from '../utils/validation';

interface ShippingFormProps {
  initialData?: Partial<ShippingAddress>;
  onDataChange: (data: ShippingAddress) => void;
  onValidationChange: (isValid: boolean) => void;
}

export function ShippingForm({ initialData = {}, onDataChange, onValidationChange }: ShippingFormProps) {
  const [formData, setFormData] = useState<ShippingAddress>({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    address: initialData.address || '',
    city: initialData.city || '',
    state: initialData.state || '',
    zipCode: initialData.zipCode || '',
    country: initialData.country || 'US',
    phone: initialData.phone || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode'];
    requiredFields.forEach(field => {
      const validation = validateRequired(formData[field as keyof ShippingAddress] as string, field);
      if (!validation.isValid) {
        newErrors[field] = validation.message;
      }
    });

    // Validate phone if provided
    if (formData.phone) {
      const phoneValidation = validatePhone(formData.phone);
      if (!phoneValidation.isValid) {
        newErrors.phone = phoneValidation.message;
      }
    }

    // Validate ZIP code format
    if (formData.zipCode) {
      const zipValidation = validateZipCode(formData.zipCode);
      if (!zipValidation.isValid) {
        newErrors.zipCode = zipValidation.message;
      }
    }

    setErrors(newErrors);

    const isValid = Object.keys(newErrors).length === 0;
    onValidationChange(isValid);
    
    if (isValid) {
      onDataChange(formData);
    }
  };

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
              errors.firstName ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
              errors.lastName ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}
        </div>
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Street Address *
        </label>
        <input
          type="text"
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
            errors.address ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* City */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <input
            type="text"
            id="city"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
              errors.city ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
        </div>

        {/* State */}
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
            State *
          </label>
          <select
            id="state"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
              errors.state ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select State</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          {errors.state && <p className="text-red-600 text-xs mt-1">{errors.state}</p>}
        </div>

        {/* ZIP Code */}
        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
            ZIP Code *
          </label>
          <input
            type="text"
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => handleInputChange('zipCode', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
              errors.zipCode ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.zipCode && <p className="text-red-600 text-xs mt-1">{errors.zipCode}</p>}
        </div>
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="(555) 123-4567"
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
            errors.phone ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
      </div>

      {/* Country */}
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
          Country *
        </label>
        <select
          id="country"
          value={formData.country}
          onChange={(e) => handleInputChange('country', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="US">United States</option>
          <option value="CA">Canada</option>
        </select>
      </div>
    </div>
  );
}