interface FlashSaleBadgeProps {
  discount: number;
  className?: string;
}

export function FlashSaleBadge({ discount, className = '' }: FlashSaleBadgeProps) {
  return (
    <div
      className={`absolute top-3 left-3 z-10 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white px-3 py-1.5 rounded-lg shadow-lg transform -rotate-2 ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <svg
          className="w-4 h-4 animate-pulse"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" />
        </svg>
        <span className="font-bold text-sm">
          {discount}% OFF
        </span>
      </div>
    </div>
  );
}
