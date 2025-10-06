interface CardProps {
  id: string;
  title: string;
  price: number;
  description: string;
  imageUrl?: string;
  onAddToCart?: (id: string) => void;
}

export function Card({ id, title, price, description, imageUrl, onAddToCart }: CardProps) {
  const handleAddToCart = () => {
    onAddToCart?.(id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300" data-testid={`product-card-${id}`}>
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-48 object-cover"
          data-testid="product-image"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2" data-testid="product-title">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-3" data-testid="product-description">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-green-600" data-testid="product-price">
            ${price.toFixed(2)}
          </span>
          {onAddToCart && (
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
              data-testid="add-to-cart-button"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
