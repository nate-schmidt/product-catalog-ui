// src/components/QuantityStepper.tsx
interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 999,
  disabled = false,
  className = '',
}: QuantityStepperProps) {
  const canDecrement = value > min;
  const canIncrement = value < max;
  
  const handleDecrement = () => {
    if (canDecrement) {
      onChange(value - 1);
    }
  };
  
  const handleIncrement = () => {
    if (canIncrement) {
      onChange(value + 1);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || !canDecrement}
        aria-label="Decrease quantity"
        className="w-8 h-8 flex items-center justify-center rounded border border-gray-600 bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        −
      </button>
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        min={min}
        max={max}
        aria-label="Quantity"
        className="w-16 h-8 text-center rounded border border-gray-600 bg-gray-800 text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      />
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || !canIncrement}
        aria-label="Increase quantity"
        className="w-8 h-8 flex items-center justify-center rounded border border-gray-600 bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        +
      </button>
    </div>
  );
}

