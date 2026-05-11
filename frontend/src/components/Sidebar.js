import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Sidebar({ showSidebar, sidebarGender, setShowSidebar, darkMode }) {
  const [perfumeItems, setPerfumeItems] = useState([]);

  // Color scheme based on dark mode
  const colors = {
    bg: darkMode ? 'rgba(15, 15, 15, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    text: darkMode ? '#fff' : '#000',
    textLight: darkMode ? '#999' : '#999',
    textHover: darkMode ? '#ccc' : '#999',
    border: darkMode ? '#333' : '#e5e5e5',
    overlay: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)'
  };

  const subCategoryItems = [
    'Top',
    'Bottoms',
    'Bag',
    'Accessories',
    'Shoes'
  ];

  // Fetch perfume products when sidebar opens for perfumery
  useEffect(() => {
    if (showSidebar && sidebarGender === 'PERFUMERY') {
      fetchPerfumes();
    }
  }, [showSidebar, sidebarGender]);

  const fetchPerfumes = async () => {
    try {
      const res = await axios.get('/api/products');
      const perfumes = res.data
        .filter(p => p.gender === 'PERFUMERY')
        .map(p => ({ name: p.name, id: p._id }));
      setPerfumeItems(perfumes);
    } catch (error) {
      console.error('Error fetching perfumes:', error);
    }
  };

  return (
    <>
      {/* Sliding Sidebar Overlay */}
      {showSidebar && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: colors.overlay,
            zIndex: 100,
            animation: 'fadeIn 0.3s ease'
          }}
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '320px',
          height: '100vh',
          backgroundColor: colors.bg,
          zIndex: 101,
          padding: '50px 40px',
          boxSizing: 'border-box',
          overflowY: 'auto',
          transform: showSidebar ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.4s ease, background-color 0.3s ease',
          fontFamily: 'Helvetica, Arial, sans-serif'
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setShowSidebar(false)}
          style={{
            position: 'absolute',
            top: '30px',
            right: '30px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            color: colors.text,
            cursor: 'pointer',
            padding: '0'
          }}
        >
          ×
        </button>

        {/* Sidebar Title - Just Gender Name */}
        <h2
          style={{
            fontSize: '16px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: '400',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            color: colors.text,
            margin: '0 0 35px 0',
            lineHeight: '1.4'
          }}
        >
          {sidebarGender}
        </h2>

        {/* View All Button */}
        <Link
          to={`/${sidebarGender.toLowerCase()}`}
          onClick={() => setShowSidebar(false)}
          style={{
            fontSize: '13px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: '300',
            letterSpacing: '0.3px',
            color: colors.text,
            padding: '16px 0',
            cursor: 'pointer',
            borderBottom: `1px solid ${colors.border}`,
            marginBottom: '30px',
            transition: 'color 0.3s',
            display: 'block',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => e.target.style.color = colors.textHover}
          onMouseLeave={(e) => e.target.style.color = colors.text}
        >
          View All
        </Link>

        {/* Subcategories or Perfume Items */}
        <div style={{ marginBottom: '40px' }}>
          {sidebarGender === 'PERFUMERY' ? (
            // Show Perfume Names
            perfumeItems.map((perfume) => (
              <Link
                key={perfume.id}
                to={`/product/${perfume.id}`}
                onClick={() => setShowSidebar(false)}
                style={{
                  fontSize: '13px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: '300',
                  letterSpacing: '0.3px',
                  color: colors.text,
                  padding: '16px 0',
                  cursor: 'pointer',
                  borderBottom: `1px solid ${colors.border}`,
                  transition: 'color 0.3s',
                  display: 'block',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => e.target.style.color = colors.textHover}
                onMouseLeave={(e) => e.target.style.color = colors.text}
              >
                {perfume.name}
              </Link>
            ))
          ) : (
            // Show Categories for Men/Women
            subCategoryItems.map((item) => (
              <Link
                key={item}
                to={`/${sidebarGender.toLowerCase()}?category=${item.toLowerCase()}`}
                onClick={() => setShowSidebar(false)}
                style={{
                  fontSize: '13px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: '300',
                  letterSpacing: '0.3px',
                  color: colors.text,
                  padding: '16px 0',
                  cursor: 'pointer',
                  borderBottom: `1px solid ${colors.border}`,
                  transition: 'color 0.3s',
                  display: 'block',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => e.target.style.color = colors.textHover}
                onMouseLeave={(e) => e.target.style.color = colors.text}
              >
                {item}
              </Link>
            ))
          )}
        </div>

        {/* Description at bottom */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '40px',
            borderTop: `1px solid ${colors.border}`,
            fontSize: '11px',
            fontWeight: '300',
            letterSpacing: '0.3px',
            color: colors.textLight,
            lineHeight: '1.6'
          }}
        >
          Discover our latest premium {sidebarGender.toLowerCase()} collection crafted from the finest materials.
        </div>
      </div>
    </>
  );
}

export default Sidebar;
