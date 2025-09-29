import { OrderData } from '../types/Product';

interface OrderConfirmationProps {
  orderData: OrderData;
  orderNumber: string;
  onContinueShopping: () => void;
}

function OrderConfirmation({ orderData, orderNumber, onContinueShopping }: OrderConfirmationProps) {
  const orderDate = new Date().toLocaleString('en-US', { 
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-lg text-gray-600">
          Thank you for your purchase. Your order has been successfully placed.
        </p>
      </div>

      {/* Order Details */}
      <div className="bg-white border rounded-lg overflow-hidden mb-8">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Order #{orderNumber}</h2>
              <p className="text-sm text-gray-600">Placed on {orderDate} PST</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">${orderData.orderSummary.total.toFixed(2)}</p>
              <p className="text-sm text-gray-600">{orderData.items.length} item{orderData.items.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Items Ordered</h3>
          <div className="space-y-4">
            {orderData.items.map((item) => (
              <div key={item.id} className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-medium">
                    ${(parseFloat(item.price.replace('$', '').replace(',', '')) * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">{item.price} each</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${orderData.orderSummary.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax:</span>
              <span>${orderData.orderSummary.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total:</span>
              <span>${orderData.orderSummary.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Shipping Address</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>{orderData.shipping.firstName} {orderData.shipping.lastName}</p>
            <p>{orderData.shipping.address}</p>
            <p>{orderData.shipping.city}, {orderData.shipping.state} {orderData.shipping.zipCode}</p>
            <p>{orderData.shipping.country}</p>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Email: {orderData.shipping.email}</p>
            <p>Phone: {orderData.shipping.phone}</p>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-white border rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
        <div className="text-sm text-gray-600">
          <p>Card ending in {orderData.payment.cardNumber.slice(-4)}</p>
          <p>Cardholder: {orderData.payment.cardholderName}</p>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• You'll receive an order confirmation email shortly</li>
          <li>• We'll send you shipping updates as your order is processed</li>
          <li>• Estimated delivery: 3-5 business days</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="text-center">
        <button
          onClick={onContinueShopping}
          className="px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default OrderConfirmation;