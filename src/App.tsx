import "./index.css";
import { useEffect, useMemo, useState } from "react";
import CouponForm from "./components/CouponForm";
import {
	clearPersistedCouponCode,
	formatCurrency,
	getCouponByCode,
	loadPersistedCouponCode,
	persistCouponCode,
	validateCoupon,
} from "./lib/coupons";

export function App() {
	// Demo subtotal; in a real app, derive from cart items
	const [subtotal, setSubtotal] = useState<number>(59.99);

	const [appliedCode, setAppliedCode] = useState<string | null>(null);
	const appliedCoupon = useMemo(() => (appliedCode ? getCouponByCode(appliedCode) : undefined), [appliedCode]);

	const discountAmount = useMemo(() => {
		if (!appliedCoupon) return 0;
		const result = validateCoupon(appliedCoupon.code, subtotal);
		return result.valid ? result.discountAmount ?? 0 : 0;
	}, [appliedCoupon, subtotal]);

	const total = useMemo(() => Math.max(0, Math.round((subtotal - discountAmount + Number.EPSILON) * 100) / 100), [subtotal, discountAmount]);

	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const persisted = loadPersistedCouponCode();
		if (persisted) {
			const res = validateCoupon(persisted, subtotal);
			if (res.valid) {
				setAppliedCode(res.coupon!.code);
			} else {
				clearPersistedCouponCode();
			}
		}
	}, [subtotal]);

	function handleApply(codeInput: string) {
		const res = validateCoupon(codeInput, subtotal);
		if (!res.valid) {
			setError(res.error ?? "Invalid coupon");
			return;
		}
		setAppliedCode(res.coupon!.code);
		persistCouponCode(res.coupon!.code);
		setError(null);
	}

	function handleClear() {
		setAppliedCode(null);
		clearPersistedCouponCode();
		setError(null);
	}

	return (
    	<div className="max-w-7xl mx-auto p-8 text-center relative z-10">
      	<div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
        	<h1 className="text-6xl font-bold text-white mb-4">
          	Hello World! 👋
        	</h1>
        	<p className="text-2xl text-gray-300 max-w-2xl leading-relaxed">
          	One day I hope to be an ecommerce website.
        	</p>

        	<div className="w-full max-w-md mx-auto mt-4 text-left">
        		<h2 className="text-xl font-semibold text-white mb-3">Order Summary</h2>
        		<div className="rounded-lg border border-gray-700 p-4 bg-black/20">
        			<div className="flex items-center justify-between text-gray-300">
        				<span>Subtotal</span>
        				<span aria-label="subtotal-amount">{formatCurrency(subtotal)}</span>
        			</div>
        			{appliedCoupon ? (
        				<div className="flex items-center justify-between text-green-400 mt-2">
        					<span>Discount ({appliedCoupon.code})</span>
        					<span aria-label="discount-amount">- {formatCurrency(discountAmount)}</span>
        				</div>
        			) : null}
        			<div className="flex items-center justify-between text-white mt-3 border-t border-gray-700 pt-3">
        				<span className="font-semibold">Total</span>
        				<span aria-label="total-amount" className="font-semibold">{formatCurrency(total)}</span>
        			</div>
        		</div>

        		<CouponForm
        			onApply={handleApply}
        			onClear={handleClear}
        			appliedCode={appliedCode ?? undefined}
        			error={error}
        			isApplied={!!appliedCoupon}
        		/>

        		<div className="sr-only">
        			{/* Control to simulate subtotal changes in tests if needed */}
        			<input aria-label="test-subtotal" value={subtotal} onChange={e => setSubtotal(Number(e.target.value))} />
        		</div>
        	</div>
      	</div>
    	</div>
  	);
}

export default App;
