import { useState, useEffect, useRef } from "react";

interface CouponFormProps {
  onApply: (code: string) => void;
  onClear: () => void;
  appliedCode?: string | null;
  error?: string | null;
  isApplied: boolean;
}

export function CouponForm({ onApply, onClear, appliedCode, error, isApplied }: CouponFormProps) {
  const [codeInput, setCodeInput] = useState<string>(appliedCode ?? "");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setCodeInput(appliedCode ?? "");
  }, [appliedCode]);

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <div className="flex gap-2">
        <input
          aria-label="Coupon code"
          className="flex-1 rounded-md border border-gray-600 bg-transparent px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter coupon code"
          value={codeInput}
          onChange={e => setCodeInput(e.target.value)}
          disabled={isApplied}
          ref={inputRef}
        />
        {isApplied ? (
          <button
            className="rounded-md bg-red-600 hover:bg-red-500 px-4 py-2 text-white"
            onClick={onClear}
          >
            Remove
          </button>
        ) : (
          <button
            className="rounded-md bg-blue-600 hover:bg-blue-500 px-4 py-2 text-white"
            onClick={() => onApply(inputRef.current?.value ?? codeInput)}
          >
            Apply
          </button>
        )}
      </div>
      {error ? (
        <p className="mt-2 text-sm text-red-400" role="alert">{error}</p>
      ) : appliedCode ? (
        <p className="mt-2 text-sm text-green-400">Applied code: {appliedCode}</p>
      ) : null}
    </div>
  );
}

export default CouponForm;

