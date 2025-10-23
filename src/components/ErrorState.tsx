interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="w-full flex justify-center items-center min-h-[400px]">
      <div className="text-red-400 text-xl text-center">
        <p className="mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorState;
