import { useEffect, useState } from "react";
import { Product } from "../types";

function formatDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export function ProductCard({ product }: { product: Product }) {
  const saleActive =
    product.salePrice !== undefined &&
    product.saleEndsAt !== undefined &&
    Date.now() < product.saleEndsAt;

  const [remaining, setRemaining] = useState(
    saleActive ? product.saleEndsAt! - Date.now() : 0
  );

  useEffect(() => {
    if (!saleActive) return;
    const id = setInterval(() => {
      setRemaining(product.saleEndsAt! - Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, [product.saleEndsAt, saleActive]);

  return (
    <div className="bg-white text-gray-900 rounded-lg shadow-lg overflow-hidden flex flex-col">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        {saleActive ? (
          <div className="mb-2">
            <span className="text-red-600 font-bold text-xl mr-2">
              ${product.salePrice!.toFixed(2)}
            </span>
            <span className="line-through text-gray-500">
              ${product.price.toFixed(2)}
            </span>
            <div className="text-sm text-red-500 mt-1">
              Flash Sale ends in {formatDuration(remaining)}
            </div>
          </div>
        ) : (
          <div className="mb-2 text-xl font-bold">
            ${product.price.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
}