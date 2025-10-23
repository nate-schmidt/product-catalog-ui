import { ReactNode } from "react";

interface ProductGridProps {
  children: ReactNode;
}

function ProductGrid({ children }: ProductGridProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </div>
  );
}

export default ProductGrid;
