import React from 'react';
import { useCart } from '../contexts/CartContext';
import { formatPrice, formatDimensions } from '../utils/formatters';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        margin: '1rem 0'
      }}>
        <h2 style={{ color: '#666', margin: '0 0 1rem 0' }}>Your Cart is Empty</h2>
        <p style={{ color: '#888' }}>Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      margin: '1rem 0',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '1.5rem',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>
          Shopping Cart ({getTotalItems()} items)
        </h2>
        <button
          onClick={clearCart}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Clear Cart
        </button>
      </div>

      <div style={{ padding: '1.5rem' }}>
        {cartItems.map(item => (
          <div key={item.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: '1rem',
            borderBottom: '1px solid #eee',
            marginBottom: '1rem'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <h4 style={{ margin: 0, color: '#333', flex: 1 }}>{item.name}</h4>
                <span style={{
                  backgroundColor: '#e9ecef',
                  color: '#495057',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.7rem',
                  fontWeight: 'bold'
                }}>
                  {item.category}
                </span>
              </div>
              
              <p style={{ margin: '0 0 0.75rem 0', color: '#666', fontSize: '0.9rem', lineHeight: '1.4' }}>
                {item.description}
              </p>
              
              <div style={{ fontSize: '0.8rem', color: '#888' }}>
                {item.material && (
                  <div style={{ marginBottom: '0.25rem' }}>
                    <strong>Material:</strong> {item.material}
                  </div>
                )}
                {item.color && (
                  <div style={{ marginBottom: '0.25rem' }}>
                    <strong>Color:</strong> {item.color}
                  </div>
                )}
                {item.dimensions && (
                  <div>
                    <strong>Size:</strong> {formatDimensions(item.dimensions)}
                  </div>
                )}
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginLeft: '1rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: 'bold', 
                  color: '#007bff',
                  marginBottom: '0.5rem'
                }}>
                  {formatPrice(item.price)}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  each
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#f8f9fa',
                padding: '0.5rem',
                borderRadius: '6px'
              }}>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  style={{
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    width: '30px',
                    height: '30px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  -
                </button>
                <span style={{
                  minWidth: '30px',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    width: '30px',
                    height: '30px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <div style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.25rem' }}>
                Total Items: {getTotalItems()}
              </div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#333'
              }}>
                Total: {formatPrice(getTotalPrice())}
              </div>
            </div>
            <button
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#218838';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#28a745';
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;