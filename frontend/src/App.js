import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import GenderCategory from './pages/GenderCategory';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import Wishlist from './pages/Wishlist';
import ImageAnalyzer from './pages/ImageAnalyzer';
import Story from './pages/Story';
import './App.css';

// Inner component that uses useLocation (must be inside Router)
function AppContent({ user, token, handleLogin, onLogout, onGenderClick, showSidebar, sidebarGender, setShowSidebar, darkMode, setDarkMode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar user={user} token={token} onLogout={onLogout} onGenderClick={onGenderClick} darkMode={darkMode} setDarkMode={setDarkMode} />
      <Sidebar showSidebar={showSidebar} sidebarGender={sidebarGender} setShowSidebar={setShowSidebar} darkMode={darkMode} />
      <div className="container" style={{ backgroundColor: darkMode ? '#0f0f0f' : '#fff', color: darkMode ? '#fff' : '#000', transition: 'background-color 0.3s ease, color 0.3s ease', flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home showSidebar={showSidebar} sidebarGender={sidebarGender} setShowSidebar={setShowSidebar} setSidebarGender={() => {}} darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/:gender" element={<GenderCategory darkMode={darkMode} />} />
          <Route path="/story" element={<Story darkMode={darkMode} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} darkMode={darkMode} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} darkMode={darkMode} />} />
          <Route path="/product/:id" element={<ProductDetail token={token} darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/ai-finder" element={<ImageAnalyzer darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/cart" element={token ? <Cart token={token} darkMode={darkMode} setDarkMode={setDarkMode} /> : <Navigate to="/login" />} />
          <Route path="/wishlist" element={token ? <Wishlist token={token} darkMode={darkMode} setDarkMode={setDarkMode} /> : <Navigate to="/login" />} />
          <Route path="/checkout" element={token ? <Checkout token={token} darkMode={darkMode} setDarkMode={setDarkMode} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={token ? <Profile token={token} user={user} darkMode={darkMode} setDarkMode={setDarkMode} /> : <Navigate to="/login" />} />
          <Route path="/orders" element={token ? <OrderHistory token={token} darkMode={darkMode} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
      <Footer darkMode={darkMode} />
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarGender, setSidebarGender] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (token) {
      // Verify token
      axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data))
      .catch(err => {
        localStorage.removeItem('token');
        setToken(null);
      });
    }
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setUser(null);
  };

  const handleGenderClick = (gender) => {
    setSidebarGender(gender);
    setShowSidebar(true);
  };

  return (
    <Router>
      <AppContent
        user={user}
        token={token}
        handleLogin={handleLogin}
        onLogout={handleLogout}
        onGenderClick={handleGenderClick}
        showSidebar={showSidebar}
        sidebarGender={sidebarGender}
        setShowSidebar={setShowSidebar}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    </Router>
  );
}

export default App;
