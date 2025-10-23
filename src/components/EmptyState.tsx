interface EmptyStateProps {
  message?: string;
}

function EmptyState({ message = "No products available" }: EmptyStateProps) {
  return (
    <div className="w-full flex justify-center items-center min-h-[400px]">
      <div className="text-gray-400 text-xl">{message}</div>
    </div>
  );
}

export default EmptyState;
