import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login({ onLogin, darkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      onLogin(res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const colors = {
    bg: darkMode ? '#0f0f0f' : '#fff',
    text: darkMode ? '#fff' : '#000',
    textLight: darkMode ? '#999' : '#999',
    border: darkMode ? '#333' : '#f0f0f0',
    errorBg: darkMode ? '#331111' : '#ffebee',
    errorText: darkMode ? '#ff6b6b' : '#d32f2f'
  };

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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 70px)',
      backgroundColor: colors.bg,
      fontFamily: 'Helvetica, Arial, sans-serif',
      padding: '40px 20px',
      transition: 'background-color 0.3s ease'
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '300',
          letterSpacing: '1px',
          color: colors.text,
          margin: '0 0 40px 0',
          textTransform: 'uppercase'
        }}>
          LOGIN
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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
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
              cursor: 'pointer',
              transition: 'opacity 0.3s',
              marginBottom: '20px'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            LOGIN
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          fontSize: '13px',
          fontWeight: '300',
          color: colors.textLight,
          letterSpacing: '0.3px'
        }}>
          Don't have an account?{' '}
          <Link to="/register" style={{
            color: colors.text,
            textDecoration: 'none',
            borderBottom: `1px solid ${colors.text}`
          }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
