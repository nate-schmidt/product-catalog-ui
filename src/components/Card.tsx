import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow flex flex-col ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
