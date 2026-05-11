import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Navbar({ user, onLogout, onGenderClick, token, darkMode, setDarkMode }) {
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (token) {
      fetchCartCount();
    } else {
      // Reset cart count when user logs out
      setCartCount(0);
    }
  }, [token]);

  const fetchCartCount = async () => {
    try {
      const res = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartCount(res.data.length || 0);
    } catch (err) {
      console.error('Error fetching cart count:', err);
      setCartCount(0);
    }
  };

  const linkStyle = {
    fontSize: '11px',
    fontWeight: '300',
    fontFamily: 'Helvetica, Arial, sans-serif',
    color: darkMode ? '#fff' : '#000',
    textDecoration: 'none',
    letterSpacing: '0px',
    margin: '0 12px'
  };

  const buttonStyle = {
    ...linkStyle,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0'
  };

  const handleGenderClick = (gender) => {
    // Always just open the sidebar - it handles all navigation
    if (onGenderClick) {
      onGenderClick(gender);
    }
  };

  return (
    <>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'clamp(8px, 3vw, 12px) clamp(20px, 5vw, 50px)',
        backgroundColor: darkMode ? '#0f0f0f' : '#fff',
        borderBottom: `1px solid ${darkMode ? '#333' : '#f0f0f0'}`,
        fontFamily: 'Helvetica, Arial, sans-serif',
        transition: 'background-color 0.3s ease',
        position: 'relative'
      }}>
        {/* Left Menu - Desktop Only */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-start',
          gap: 'clamp(12px, 3vw, 30px)',
          flex: 1,
          paddingRight: '40px',
          alignItems: 'center'
        }}>
          <button onClick={() => handleGenderClick('WOMEN')} style={buttonStyle}>WOMEN</button>
          <button onClick={() => handleGenderClick('MEN')} style={buttonStyle}>MEN</button>
          <button onClick={() => handleGenderClick('PERFUMERY')} style={buttonStyle}>PERFUMERY</button>
          <Link to="/ai-finder" style={linkStyle} className="desktop-only">STYLE DISCOVERY</Link>
          <Link to="/story" style={linkStyle} className="desktop-only">STORY</Link>
        </div>

        {/* Center - Logo (Centered) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={darkMode ? '/TheRawWhiteLogo.svg' : '/TheRawLogo.svg'}
              alt="Clothing Shop"
              style={{
                height: 'clamp(25px, 4vw, 35px)',
                width: 'auto'
              }}
            />
          </Link>
        </div>

        {/* Right Menu - Desktop */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 'clamp(12px, 3vw, 30px)',
          flex: 1,
          paddingLeft: '40px'
        }}>
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0',
              height: '24px',
              width: '24px'
            }}
          >
            <img
              src={darkMode ? '/LightModeIcon.svg' : '/DarkModeIcon.svg'}
              alt={darkMode ? 'Light Mode' : 'Dark Mode'}
              style={{ height: '24px', width: '24px' }}
            />
          </button>

          <Link to="/wishlist" style={{ ...linkStyle, display: 'none' }} className="desktop-only">SAVED</Link>
          <Link to="/cart" style={{
            ...linkStyle,
            position: 'relative',
            display: 'inline-block'
          }}>
            BAG
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-14px',
                backgroundColor: darkMode ? '#fff' : '#000',
                color: darkMode ? '#000' : '#fff',
                width: '15px',
                height: '15px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: '600'
              }}>
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <>
              <Link to="/profile" style={{ ...linkStyle, display: 'none' }} className="desktop-only">ACCOUNT</Link>
              <Link to="/orders" style={{ ...linkStyle, display: 'none' }} className="desktop-only">ORDERS</Link>
              <button onClick={onLogout} style={{ ...linkStyle, display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '0' }} className="desktop-only">LOGOUT</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ ...linkStyle, display: 'none' }} className="desktop-only">LOGIN</Link>
            </>
          )}

          {/* Hamburger Menu - Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'none',
              flexDirection: 'column',
              gap: '5px'
            }}
            className="mobile-menu-btn"
          >
            <div style={{ width: '20px', height: '2px', backgroundColor: darkMode ? '#fff' : '#000' }}></div>
            <div style={{ width: '20px', height: '2px', backgroundColor: darkMode ? '#fff' : '#000' }}></div>
            <div style={{ width: '20px', height: '2px', backgroundColor: darkMode ? '#fff' : '#000' }}></div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: darkMode ? '#1a1a1a' : '#f9f9f9',
          borderBottom: `1px solid ${darkMode ? '#333' : '#f0f0f0'}`,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          <button onClick={() => { handleGenderClick('WOMEN'); setMobileMenuOpen(false); }} style={{ ...buttonStyle, justifyContent: 'flex-start' }}>WOMEN</button>
          <button onClick={() => { handleGenderClick('MEN'); setMobileMenuOpen(false); }} style={{ ...buttonStyle, justifyContent: 'flex-start' }}>MEN</button>
          <button onClick={() => { handleGenderClick('PERFUMERY'); setMobileMenuOpen(false); }} style={{ ...buttonStyle, justifyContent: 'flex-start' }}>PERFUMERY</button>
          <hr style={{ border: 'none', borderTop: `1px solid ${darkMode ? '#333' : '#f0f0f0'}`, margin: '10px 0' }} />
          <Link to="/ai-finder" style={{ ...linkStyle, marginLeft: 0 }} onClick={() => setMobileMenuOpen(false)}>AI FINDER</Link>
          <Link to="/story" style={{ ...linkStyle, marginLeft: 0 }} onClick={() => setMobileMenuOpen(false)}>STORY</Link>
          <Link to="/wishlist" style={{ ...linkStyle, marginLeft: 0 }} onClick={() => setMobileMenuOpen(false)}>SAVED</Link>
          {user ? (
            <>
              <Link to="/profile" style={{ ...linkStyle, marginLeft: 0 }} onClick={() => setMobileMenuOpen(false)}>ACCOUNT</Link>
              <Link to="/orders" style={{ ...linkStyle, marginLeft: 0 }} onClick={() => setMobileMenuOpen(false)}>ORDERS</Link>
              <button onClick={() => { onLogout(); setMobileMenuOpen(false); }} style={{ ...linkStyle, background: 'none', border: 'none', cursor: 'pointer', padding: '0', marginLeft: 0 }}>LOGOUT</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ ...linkStyle, marginLeft: 0 }} onClick={() => setMobileMenuOpen(false)}>LOGIN</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 480px) {
          .desktop-only {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
        @media (min-width: 481px) {
          .mobile-menu-btn {
            display: none !important;
          }
          .desktop-only {
            display: inline-block !important;
          }
        }
      `}</style>
    </>
  );
}

export default Navbar;
