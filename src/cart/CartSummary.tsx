// src/cart/CartSummary.tsx
import { Price } from '../components/Price';

interface CartSummaryProps {
  subtotalCents: number;
  currency?: 'USD' | 'EUR';
  onCheckout?: () => void;
}

export function CartSummary({ subtotalCents, currency = 'USD', onCheckout }: CartSummaryProps) {
  return (
    <div className="border-t border-gray-700 p-4 bg-gray-800">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg text-gray-300">Subtotal:</span>
        <Price priceCents={subtotalCents} currency={currency} className="text-2xl text-white" />
      </div>
      
      {onCheckout && (
        <button
          type="button"
          onClick={onCheckout}
          className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Proceed to Checkout
        </button>
      )}
      
      <p className="text-xs text-gray-500 text-center mt-3">
        Taxes and shipping calculated at checkout
      </p>
    </div>
  );
}

