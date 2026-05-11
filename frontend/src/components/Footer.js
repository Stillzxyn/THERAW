import React from 'react';
import { Link } from 'react-router-dom';

function Footer({ darkMode }) {
  const colors = {
    bg: darkMode ? '#0f0f0f' : '#fff',
    text: darkMode ? '#fff' : '#000',
    textLight: darkMode ? '#999' : '#666',
    border: darkMode ? '#222' : '#f0f0f0'
  };

  return (
    <footer style={{
      backgroundColor: colors.bg,
      borderTop: `1px solid ${colors.border}`,
      padding: '60px 50px',
      fontFamily: 'Helvetica, Arial, sans-serif',
      width: '100%',
      marginTop: 'auto'
    }}>
      {/* Logo */}
      <div style={{
        marginBottom: '60px',
        paddingBottom: '40px',
        borderBottom: `1px solid ${colors.border}`
      }}>
        <img
          src="/TheRawLogo.png"
          alt="RAW Logo"
          style={{
            height: '50px',
            width: 'auto',
            objectFit: 'contain',
            filter: darkMode ? 'brightness(1.2) invert(1)' : 'brightness(1)'
          }}
        />
      </div>

      {/* Footer Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '60px',
        marginBottom: '60px'
      }}>
        {/* Column 1: About */}
        <div>
          <h3 style={{
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: colors.text,
            margin: '0 0 25px 0'
          }}>
            ABOUT
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: '0',
            margin: '0'
          }}>
            <li style={{ marginBottom: '15px' }}>
              <Link to="/story" style={{
                fontSize: '12px',
                fontWeight: '400',
                color: colors.text,
                textDecoration: 'none',
                letterSpacing: '0.3px',
                transition: 'opacity 0.3s',
                cursor: 'pointer'
              }}
                onMouseEnter={(e) => e.target.style.opacity = '0.6'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                ABOUT RAW
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Customer Service */}
        <div>
          <h3 style={{
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: colors.text,
            margin: '0 0 25px 0'
          }}>
            CUSTOMER SERVICE
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: '0',
            margin: '0'
          }}>
            {['CONTACT US', 'DELIVERY INFORMATION', 'PAYMENTS', 'RETURN & REFUNDS', 'SIZE GUIDE', 'FAQ'].map((item, idx) => (
              <li key={idx} style={{
                marginBottom: '15px',
                fontSize: '12px',
                fontWeight: '400',
                color: colors.textLight,
                letterSpacing: '0.3px'
              }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Legal */}
        <div>
          <h3 style={{
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: colors.text,
            margin: '0 0 25px 0'
          }}>
            LEGAL
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: '0',
            margin: '0'
          }}>
            {['PRIVACY POLICY', 'TERM & CONDITIONS', 'COOKIE SETTINGS'].map((item, idx) => (
              <li key={idx} style={{
                marginBottom: '15px',
                fontSize: '12px',
                fontWeight: '400',
                color: colors.textLight,
                letterSpacing: '0.3px'
              }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Follow Us */}
        <div>
          <h3 style={{
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: colors.text,
            margin: '0 0 25px 0'
          }}>
            FOLLOW US
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: '0',
            margin: '0'
          }}>
            {['INSTAGRAM', 'FACEBOOK', 'TIKTOK'].map((item, idx) => (
              <li key={idx} style={{
                marginBottom: '15px',
                fontSize: '12px',
                fontWeight: '400',
                color: colors.textLight,
                letterSpacing: '0.3px'
              }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div style={{
        borderTop: `1px solid ${colors.border}`,
        paddingTop: '40px',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '11px',
          fontWeight: '400',
          color: colors.textLight,
          letterSpacing: '0.5px',
          margin: '0'
        }}>
          © 2026 RAW. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
