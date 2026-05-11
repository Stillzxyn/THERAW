import React, { useState, useEffect } from 'react';
import axios from 'axios';

function OrderHistory({ token, darkMode }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Sort orders by date/time (newest first)
      const sortedOrders = res.data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setOrders(sortedOrders);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '60px 50px', textAlign: 'center', fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: colors.bg, color: colors.text, transition: 'background-color 0.3s ease, color 0.3s ease' }}>Loading orders...</div>;

  return (
    <div style={{
      padding: '60px 50px',
      backgroundColor: colors.bg,
      fontFamily: 'Helvetica, Arial, sans-serif',
      transition: 'background-color 0.3s ease'
    }}>
      <h1 style={{
        fontSize: '28px',
        fontWeight: '300',
        letterSpacing: '1px',
        color: colors.text,
        margin: '0 0 40px 0',
        textTransform: 'uppercase'
      }}>
        ORDER HISTORY
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

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{
            fontSize: '14px',
            fontWeight: '300',
            color: colors.textLight,
            letterSpacing: '0.5px'
          }}>
            NO ORDERS YET
          </p>
        </div>
      ) : (
        <div>
          {orders.map(order => (
            <div key={order._id} style={{
              padding: '30px',
              marginBottom: '20px',
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.imageBg
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '30px',
                paddingBottom: '20px',
                borderBottom: `1px solid ${colors.border}`
              }}>
                <div>
                  <p style={{
                    fontSize: '11px',
                    fontWeight: '400',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    color: colors.textLight,
                    margin: '0 0 8px 0'
                  }}>
                    ORDER ID
                  </p>
                  <p style={{
                    fontSize: '13px',
                    fontWeight: '300',
                    color: colors.text,
                    margin: '0 0 15px 0',
                    fontFamily: 'monospace'
                  }}>
                    {order._id}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    fontWeight: '300',
                    color: colors.textLight,
                    letterSpacing: '0.3px',
                    margin: '0 0 5px 0'
                  }}>
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p style={{
                    fontSize: '11px',
                    fontWeight: '300',
                    color: colors.textLight,
                    letterSpacing: '0.3px',
                    margin: '0'
                  }}>
                    {new Date(order.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true
                    })}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    fontSize: '11px',
                    fontWeight: '400',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    color: colors.textLight,
                    margin: '0 0 8px 0'
                  }}>
                    TOTAL
                  </p>
                  <p style={{
                    fontSize: '18px',
                    fontWeight: '400',
                    color: colors.text,
                    margin: '0 0 15px 0',
                    letterSpacing: '0.5px'
                  }}>
                    ${order.total?.toFixed(2) || '0.00'}
                  </p>
                  <p style={{
                    fontSize: '11px',
                    fontWeight: '400',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    color: order.status === 'pending' ? '#ff9800' : '#4caf50',
                    margin: '0'
                  }}>
                    {order.status}
                  </p>
                </div>
              </div>

              <div>
                <p style={{
                  fontSize: '11px',
                  fontWeight: '400',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  color: colors.textLight,
                  margin: '0 0 15px 0'
                }}>
                  ITEMS
                </p>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingBottom: '15px',
                    marginBottom: '15px',
                    borderBottom: `1px solid ${colors.border}`
                  }}>
                    <div>
                      <p style={{
                        fontSize: '13px',
                        fontWeight: '400',
                        color: colors.text,
                        margin: '0 0 5px 0',
                        textTransform: 'uppercase'
                      }}>
                        {item.productName}
                      </p>
                      <p style={{
                        fontSize: '12px',
                        fontWeight: '300',
                        color: colors.textLight,
                        letterSpacing: '0.3px',
                        margin: '0'
                      }}>
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{
                        fontSize: '13px',
                        fontWeight: '400',
                        color: colors.text,
                        margin: '0 0 5px 0'
                      }}>
                        ${(item.price || 0).toFixed(2)}
                      </p>
                      <p style={{
                        fontSize: '12px',
                        fontWeight: '400',
                        color: colors.text,
                        letterSpacing: '0.3px',
                        margin: '0'
                      }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
