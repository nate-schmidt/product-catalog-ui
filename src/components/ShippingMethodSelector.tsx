import React, { useState, useEffect } from 'react';
import { ShippingMethod } from '../types/checkout';
import { checkoutService } from '../services/checkoutService';
import { formatCurrency } from '../utils/formatters';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface ShippingMethodSelectorProps {
  onMethodChange: (method: ShippingMethod) => void;
  selectedMethod?: ShippingMethod;
}

export function ShippingMethodSelector({ onMethodChange, selectedMethod }: ShippingMethodSelectorProps) {
  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadShippingMethods();
  }, []);

  const loadShippingMethods = async () => {
    try {
      setLoading(true);
      setError(null);
      const shippingMethods = await checkoutService.getShippingMethods();
      setMethods(shippingMethods);
      
      // Auto-select first method if none selected
      if (!selectedMethod && shippingMethods.length > 0) {
        onMethodChange(shippingMethods[0]);
      }
    } catch (error) {
      setError('Failed to load shipping methods. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading shipping methods..." />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error}
        onRetry={loadShippingMethods}
      />
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Shipping Method</h2>
      
      <div className="space-y-3">
        {methods.map(method => (
          <label
            key={method.id}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedMethod?.id === method.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input
              type="radio"
              name="shippingMethod"
              value={method.id}
              checked={selectedMethod?.id === method.id}
              onChange={() => onMethodChange(method)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {method.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {method.description}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {method.price === 0 ? 'Free' : formatCurrency(method.price)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {method.estimatedDays}
                  </p>
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}