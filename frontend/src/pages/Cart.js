import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Cart({ token, darkMode }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Color scheme
  const colors = {
    bg: darkMode ? '#0f0f0f' : '#fff',
    text: darkMode ? '#fff' : '#000',
    textLight: darkMode ? '#999' : '#999',
    border: darkMode ? '#333' : '#f0f0f0',
    imageBg: darkMode ? '#1a1a1a' : '#f9f9f9',
    errorBg: darkMode ? '#331111' : '#ffebee',
    errorText: darkMode ? '#ff6b6b' : '#d32f2f'
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // API now returns items array directly
      setCart({ items: res.data });
    } catch (err) {
      console.error('Error loading cart:', err);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await axios.post('/api/cart/remove', { productId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
    } catch (err) {
      setError('Failed to remove item');
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await axios.post('/api/cart/update', { productId, quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
    } catch (err) {
      setError('Failed to update quantity');
    }
  };

  if (loading) return <div style={{ padding: '60px 50px', textAlign: 'center', fontFamily: 'Helvetica, Arial, sans-serif', color: colors.text }}>Loading cart...</div>;

  const total = cart?.items?.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0) || 0;

  return (
    <div style={{
      padding: '60px 50px',
      backgroundColor: colors.bg,
      fontFamily: 'Helvetica, Arial, sans-serif',
      transition: 'background-color 0.3s ease'
    }}>
      {/* Page Title */}
      <h1 style={{
        fontSize: '28px',
        fontWeight: '300',
        letterSpacing: '1px',
        color: colors.text,
        margin: '0 0 40px 0',
        textTransform: 'uppercase'
      }}>
        SHOPPING BAG
      </h1>

      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: colors.errorBg,
          color: colors.errorText,
          fontSize: '12px',
          marginBottom: '30px',
          letterSpacing: '0.5px'
        }}>
          {error}
        </div>
      )}

      {!cart || cart.items.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px'
        }}>
          <p style={{
            fontSize: '14px',
            fontWeight: '300',
            color: colors.textLight,
            letterSpacing: '0.5px',
            marginBottom: '30px'
          }}>
            YOUR BAG IS EMPTY
          </p>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '15px 40px',
              backgroundColor: darkMode ? '#fff' : '#000',
              color: darkMode ? '#000' : '#fff',
              border: 'none',
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: '400',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'opacity 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              CONTINUE SHOPPING
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '60px' }}>
          {/* Cart Items */}
          <div style={{ flex: 1.5 }}>
            {cart.items.map((item, idx) => (
              <div key={item.productId} style={{
                display: 'flex',
                gap: '30px',
                paddingBottom: '30px',
                borderBottom: `1px solid ${colors.border}`,
                marginBottom: '30px'
              }}>
                {/* Product Image */}
                <div style={{
                  width: '150px',
                  height: '200px',
                  backgroundColor: colors.imageBg,
                  flexShrink: 0,
                  overflow: 'hidden'
                }}>
                  <img
                    src={item.productDetails?.image || item.image || `/products/${item.productId}.jpg`}
                    alt={item.productDetails?.name || 'Product'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>

                {/* Product Details */}
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '13px',
                    fontWeight: '400',
                    letterSpacing: '0.5px',
                    color: colors.text,
                    margin: '0 0 15px 0',
                    textTransform: 'uppercase'
                  }}>
                    {item.productDetails?.name || item.name || 'Product'}
                  </h3>

                  <p style={{
                    fontSize: '13px',
                    fontWeight: '300',
                    color: colors.text,
                    margin: '0 0 15px 0',
                    letterSpacing: '0.5px'
                  }}>
                    ${item.price || item.productDetails?.price || '0.00'}
                  </p>

                  <div style={{
                    fontSize: '12px',
                    fontWeight: '300',
                    color: colors.textLight,
                    letterSpacing: '0.3px',
                    marginBottom: '20px'
                  }}>
                    {item.color && <div>Color: {item.color}</div>}
                    {item.size && <div>Size: {item.size}</div>}
                  </div>

                  {/* Quantity Control */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '20px'
                  }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '400',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      color: colors.textLight
                    }}>
                      QTY
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                      style={{
                        width: '30px',
                        height: '30px',
                        border: `1px solid ${colors.border}`,
                        background: colors.imageBg,
                        color: colors.text,
                        fontSize: '14px',
                        cursor: 'pointer',
                        fontFamily: 'Helvetica, Arial, sans-serif'
                      }}
                    >
                      -
                    </button>
                    <span style={{
                      width: '40px',
                      textAlign: 'center',
                      fontSize: '13px',
                      color: colors.text
                    }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                      style={{
                        width: '30px',
                        height: '30px',
                        border: `1px solid ${colors.border}`,
                        background: colors.imageBg,
                        color: colors.text,
                        fontSize: '14px',
                        cursor: 'pointer',
                        fontFamily: 'Helvetica, Arial, sans-serif'
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.productId)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '12px',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      fontWeight: '300',
                      color: colors.textLight,
                      cursor: 'pointer',
                      letterSpacing: '0.5px',
                      textDecoration: 'underline'
                    }}
                  >
                    Remove
                  </button>
                </div>

                {/* Subtotal */}
                <div style={{
                  textAlign: 'right',
                  minWidth: '100px'
                }}>
                  <p style={{
                    fontSize: '13px',
                    fontWeight: '400',
                    color: colors.text,
                    margin: '0',
                    letterSpacing: '0.5px'
                  }}>
                    ${(item.price || item.productDetails?.price || 0) * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div style={{
            flex: 1,
            backgroundColor: colors.imageBg,
            padding: '30px',
            height: 'fit-content',
            transition: 'background-color 0.3s ease'
          }}>
            <h3 style={{
              fontSize: '13px',
              fontWeight: '400',
              letterSpacing: '0.5px',
              color: colors.text,
              margin: '0 0 30px 0',
              textTransform: 'uppercase'
            }}>
              ORDER SUMMARY
            </h3>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '13px',
              fontWeight: '300',
              color: colors.textLight,
              letterSpacing: '0.3px',
              marginBottom: '15px',
              paddingBottom: '15px',
              borderBottom: `1px solid ${colors.border}`
            }}>
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '13px',
              fontWeight: '300',
              color: colors.textLight,
              letterSpacing: '0.3px',
              marginBottom: '15px',
              paddingBottom: '15px',
              borderBottom: `1px solid ${colors.border}`
            }}>
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '14px',
              fontWeight: '400',
              color: colors.text,
              letterSpacing: '0.5px',
              marginBottom: '30px'
            }}>
              <span>TOTAL</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Link to="/checkout" style={{ textDecoration: 'none' }}>
              <button style={{
                width: '100%',
                padding: '15px',
                backgroundColor: darkMode ? '#fff' : '#000',
                color: darkMode ? '#000' : '#fff',
                border: 'none',
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: '400',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'opacity 0.3s',
                marginBottom: '15px'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.8'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                PROCEED TO CHECKOUT
              </button>
            </Link>

            <Link to="/" style={{ textDecoration: 'none' }}>
              <button style={{
                width: '100%',
                padding: '15px',
                backgroundColor: colors.bg,
                color: colors.text,
                border: `1px solid ${colors.border}`,
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: '400',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.border = `1px solid ${colors.text}`;
              }}
              onMouseLeave={(e) => {
                e.target.style.border = `1px solid ${colors.border}`;
              }}
              >
                CONTINUE SHOPPING
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
