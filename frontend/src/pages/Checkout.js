import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Checkout({ token, darkMode }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [saveAddress, setSaveAddress] = useState(false);
  const [addressLabel, setAddressLabel] = useState('other');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: ''
  });

  const navigate = useNavigate();

  const colors = {
    bg: darkMode ? '#0f0f0f' : '#fff',
    text: darkMode ? '#fff' : '#000',
    textLight: darkMode ? '#999' : '#999',
    border: darkMode ? '#333' : '#f0f0f0',
    imageBg: darkMode ? '#1a1a1a' : '#f9f9f9',
    errorBg: darkMode ? '#331111' : '#ffebee',
    errorText: darkMode ? '#ff6b6b' : '#d32f2f',
    successBg: darkMode ? '#1a3a1a' : '#f0f0f0',
    successText: darkMode ? '#66bb6a' : '#000'
  };

  useEffect(() => {
    fetchCart();
    fetchSavedAddresses();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart({ items: res.data });
    } catch (err) {
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedAddresses = async () => {
    try {
      const res = await axios.get('/api/addresses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedAddresses(res.data);
    } catch (err) {
      console.log('No saved addresses found');
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddressId(address._id);
    setFormData({
      fullName: address.fullName,
      email: address.email,
      phone: address.phone,
      address: address.address,
      city: address.city,
      province: address.province,
      postalCode: address.postalCode
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleValidatePromo = async () => {
    if (!promoCode.trim()) {
      setError('Please enter a promo code');
      return;
    }

    const subtotal = cart?.items.reduce((sum, item) => sum + (item.price || item.productDetails?.price || 0) * item.quantity, 0) || 0;

    setPromoLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/promo/validate', {
        code: promoCode,
        orderTotal: subtotal
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.valid) {
        console.log('✓ Promo validated:', res.data);
        setPromoDiscount(res.data);
        setSuccess(`✓ Promo code applied! Saving $${res.data.discountAmount.toFixed(2)}`);
      }
    } catch (err) {
      console.error('❌ Promo validation error:', err.response?.data?.message);
      setError(err.response?.data?.message || 'Invalid promo code');
      setPromoDiscount(null);
    } finally {
      setPromoLoading(false);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsCheckingOut(true);
    setError('');
    try {
      // Calculate total from cart items
      const calculatedTotal = cart?.items.reduce((sum, item) => sum + (item.price || item.productDetails?.price || 0) * item.quantity, 0) || 0;

      console.log('🔍 Pre-validation Checkout Debug:');
      console.log('Cart items:', cart?.items);
      console.log('Calculated Total:', calculatedTotal);
      console.log('Promo Discount State:', promoDiscount);

      // Validate total is a valid number (ALLOW 0 if promo code applied)
      if (isNaN(calculatedTotal) || (calculatedTotal === 0 && !promoDiscount)) {
        setError('Invalid cart total. Please check your items.');
        setIsCheckingOut(false);
        return;
      }

      // Save address if user wants to
      if (saveAddress && !selectedAddressId) {
        await axios.post('/api/addresses', {
          ...formData,
          label: addressLabel
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      // Apply promo discount if applicable
      const finalTotal = promoDiscount ? calculatedTotal - promoDiscount.discountAmount : calculatedTotal;

      console.log('🔍 Checkout Debug:');
      console.log('Calculated Total:', calculatedTotal);
      console.log('Promo Discount State:', promoDiscount);
      console.log('Discount Amount:', promoDiscount?.discountAmount || 0);
      console.log('Final Total:', finalTotal);
      console.log('Promo Code:', promoDiscount?.code || null);

      // Create request payload separately to verify
      const requestPayload = {
        ...formData,
        total: finalTotal,
        promoCode: promoDiscount ? promoDiscount.code : null
      };

      console.log('📤 EXACT AXIOS PAYLOAD:');
      console.log(JSON.stringify(requestPayload, null, 2));
      console.log('Total field value:', requestPayload.total);
      console.log('Type of total:', typeof requestPayload.total);

      const res = await axios.post('/api/orders/checkout', requestPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Order placed successfully!');
      setTimeout(() => {
        navigate('/orders');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
      setIsCheckingOut(false);
    }
  };

  if (loading) return <div style={{ padding: '60px 50px', textAlign: 'center', fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: colors.bg, color: colors.text, transition: 'background-color 0.3s ease, color 0.3s ease' }}>Loading...</div>;

  const total = cart?.items.reduce((sum, item) => sum + (item.price || item.productDetails?.price || 0) * item.quantity, 0) || 0;

  const inputStyle = {
    width: '100%',
    padding: '12px 10px',
    border: `1px solid ${colors.border}`,
    fontSize: '13px',
    fontFamily: 'Helvetica, Arial, sans-serif',
    color: colors.text,
    backgroundColor: darkMode ? '#1a1a1a' : '#fff',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    fontWeight: '400',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    color: colors.textLight,
    marginBottom: '8px'
  };

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
        CHECKOUT
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

      {success && (
        <div style={{
          padding: '12px',
          backgroundColor: colors.successBg,
          color: colors.successText,
          fontSize: '12px',
          marginBottom: '30px',
          letterSpacing: '0.5px'
        }}>
          {success}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '60px' }}>
        {/* Shipping Form */}
        <form onSubmit={handleCheckout}>
          {/* Saved Addresses Section */}
          {savedAddresses.length > 0 && (
            <div style={{ marginBottom: '40px', paddingBottom: '30px', borderBottom: `1px solid ${colors.border}` }}>
              <h3 style={{
                fontSize: '13px',
                fontWeight: '400',
                letterSpacing: '0.5px',
                color: colors.text,
                margin: '0 0 20px 0',
                textTransform: 'uppercase'
              }}>
                SAVED ADDRESSES
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {savedAddresses.map(addr => (
                  <div
                    key={addr._id}
                    onClick={() => handleSelectAddress(addr)}
                    style={{
                      padding: '15px',
                      border: `2px solid ${selectedAddressId === addr._id ? colors.text : colors.border}`,
                      backgroundColor: selectedAddressId === addr._id ? colors.imageBg : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: colors.text, textTransform: 'uppercase' }}>
                        {addr.fullName}
                      </span>
                      <span style={{ fontSize: '11px', color: colors.textLight, textTransform: 'uppercase' }}>
                        {addr.label}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: colors.textLight, lineHeight: '1.5' }}>
                      {addr.address}, {addr.city}, {addr.province} {addr.postalCode}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h3 style={{
            fontSize: '13px',
            fontWeight: '400',
            letterSpacing: '0.5px',
            color: colors.text,
            margin: '0 0 30px 0',
            textTransform: 'uppercase'
          }}>
            SHIPPING ADDRESS
          </h3>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Phone *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="3"
              style={{
                ...inputStyle,
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>City *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={labelStyle}>Province *</label>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Postal Code *</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Promo Code (Optional)</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter promo code"
                style={{
                  ...inputStyle,
                  flex: 1
                }}
              />
              <button
                type="button"
                onClick={handleValidatePromo}
                disabled={promoLoading}
                style={{
                  padding: '12px 20px',
                  backgroundColor: darkMode ? '#fff' : '#000',
                  color: darkMode ? '#000' : '#fff',
                  border: 'none',
                  fontSize: '11px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: '400',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  cursor: promoLoading ? 'not-allowed' : 'pointer',
                  opacity: promoLoading ? 0.6 : 1,
                  transition: 'opacity 0.3s'
                }}
              >
                {promoLoading ? 'Checking...' : 'Apply'}
              </button>
            </div>
            {promoDiscount && (
              <div style={{
                marginTop: '10px',
                fontSize: '12px',
                color: '#66bb6a',
                letterSpacing: '0.5px'
              }}>
                ✓ {promoDiscount.description || promoDiscount.code}
              </div>
            )}
          </div>

          {/* Save Address Checkbox */}
          <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: `1px solid ${colors.border}` }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '12px',
              fontWeight: '400',
              letterSpacing: '0.5px',
              color: colors.text,
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={saveAddress}
                onChange={(e) => setSaveAddress(e.target.checked)}
                style={{ marginRight: '10px', cursor: 'pointer' }}
              />
              Save this address for future orders
            </label>

            {saveAddress && (
              <div style={{ marginTop: '12px' }}>
                <label style={labelStyle}>Address Label</label>
                <select
                  value={addressLabel}
                  onChange={(e) => setAddressLabel(e.target.value)}
                  style={{
                    ...inputStyle,
                    cursor: 'pointer'
                  }}
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isCheckingOut}
            style={{
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
              cursor: isCheckingOut ? 'not-allowed' : 'pointer',
              opacity: isCheckingOut ? 0.6 : 1,
              transition: 'opacity 0.3s'
            }}
            onMouseEnter={(e) => !isCheckingOut && (e.target.style.opacity = '0.8')}
            onMouseLeave={(e) => !isCheckingOut && (e.target.style.opacity = '1')}
          >
            {isCheckingOut ? 'PROCESSING ORDER...' : 'COMPLETE ORDER'}
          </button>
        </form>

        {/* Order Summary */}
        <div>
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
            backgroundColor: colors.imageBg,
            padding: '20px',
            marginBottom: '30px'
          }}>
            {cart?.items.map(item => (
              <div key={item.productId} style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                fontWeight: '300',
                color: colors.textLight,
                letterSpacing: '0.3px',
                paddingBottom: '15px',
                marginBottom: '15px',
                borderBottom: `1px solid ${colors.border}`
              }}>
                <div>
                  <div style={{ color: colors.text, marginBottom: '5px' }}>
                    {item.productDetails?.name || 'Product'}
                  </div>
                  <div>Qty: {item.quantity}</div>
                </div>
                <div style={{ textAlign: 'right', color: colors.text }}>
                  ${((item.price || item.productDetails?.price || 0) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '13px',
            fontWeight: '300',
            color: colors.textLight,
            letterSpacing: '0.3px',
            paddingBottom: '15px',
            marginBottom: '15px',
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
            paddingBottom: '15px',
            marginBottom: '15px',
            borderBottom: `1px solid ${colors.border}`
          }}>
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>

          {promoDiscount && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '13px',
              fontWeight: '300',
              color: '#66bb6a',
              letterSpacing: '0.3px',
              paddingBottom: '15px',
              marginBottom: '15px',
              borderBottom: `1px solid ${colors.border}`
            }}>
              <span>Discount ({promoDiscount.code})</span>
              <span>-${promoDiscount.discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '14px',
            fontWeight: '400',
            color: colors.text,
            letterSpacing: '0.5px'
          }}>
            <span>TOTAL</span>
            <span>${(promoDiscount ? total - promoDiscount.discountAmount : total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Checkout Overlay */}
      {isCheckingOut && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: colors.bg,
            padding: '60px',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}>
            {/* Spinner */}
            <div style={{
              width: '50px',
              height: '50px',
              border: `3px solid ${darkMode ? '#333' : '#f0f0f0'}`,
              borderTop: `3px solid ${darkMode ? '#fff' : '#000'}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 30px'
            }} />

            <h2 style={{
              fontSize: '18px',
              fontWeight: '400',
              letterSpacing: '1px',
              color: colors.text,
              margin: '0 0 10px 0',
              textTransform: 'uppercase'
            }}>
              PROCESSING ORDER
            </h2>

            <p style={{
              fontSize: '13px',
              fontWeight: '300',
              color: colors.textLight,
              letterSpacing: '0.5px',
              margin: '0'
            }}>
              Please wait while we process your order...
            </p>

            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
