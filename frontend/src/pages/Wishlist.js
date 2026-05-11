import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Wishlist({ token, darkMode }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    if (!token) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [token, navigate]);

  const fetchWishlist = async () => {
    try {
      console.log('Fetching wishlist');
      const res = await axios.get('/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Wishlist data received:', res.data);
      console.log('First item:', res.data[0]);
      setWishlistItems(res.data);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await axios.delete(`/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlistItems(wishlistItems.filter(item => item.productId !== productId));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      setError('Failed to remove item');
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) return <div style={{ padding: '60px 50px', textAlign: 'center', fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: colors.bg, color: colors.text, transition: 'background-color 0.3s ease, color 0.3s ease' }}>Loading wishlist...</div>;

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
        SAVED ITEMS
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

      {wishlistItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{
            fontSize: '14px',
            fontWeight: '300',
            color: colors.textLight,
            letterSpacing: '0.5px',
            marginBottom: '20px'
          }}>
            NO SAVED ITEMS YET
          </p>
          <button
            onClick={() => navigate('/women')}
            style={{
              padding: '12px 30px',
              backgroundColor: darkMode ? '#fff' : '#000',
              color: darkMode ? '#000' : '#fff',
              border: 'none',
              fontSize: '11px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: '300',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'opacity 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Start Saving
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0'
        }}>
          {wishlistItems.map((item) => (
            <div key={item.productId} style={{
              borderRight: `1px solid ${colors.border}`,
              borderBottom: `1px solid ${colors.border}`,
              padding: '20px'
            }}>
              <div style={{
                backgroundColor: colors.imageBg,
                marginBottom: '15px',
                aspectRatio: '1000 / 1400',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                overflow: 'hidden'
              }}
              onClick={() => handleViewProduct(item.productId)}
              >
                {item.productDetails?.image ? (
                  <img
                    src={item.productDetails.image}
                    alt={item.productName}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    fontSize: '12px',
                    color: colors.textLight,
                    textAlign: 'center'
                  }}>
                    No Image
                  </div>
                )}
              </div>

              <h3 style={{
                fontSize: '13px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: '400',
                letterSpacing: '0.5px',
                color: colors.text,
                margin: '0 0 10px 0',
                textTransform: 'uppercase',
                cursor: 'pointer'
              }}
              onClick={() => handleViewProduct(item.productId)}
              >
                {item.productName}
              </h3>

              <p style={{
                fontSize: '13px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: '400',
                color: colors.text,
                margin: '0 0 15px 0',
                letterSpacing: '0.5px'
              }}>
                ${item.price || item.productDetails?.price || '0.00'}
              </p>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleViewProduct(item.productId)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: darkMode ? '#fff' : '#000',
                    color: darkMode ? '#000' : '#fff',
                    border: 'none',
                    fontSize: '11px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: '300',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'opacity 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  View
                </button>

                <button
                  onClick={() => handleRemoveFromWishlist(item.productId)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: colors.bg,
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                    fontSize: '11px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: '300',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = colors.text;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = colors.border;
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
