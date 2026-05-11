import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function GenderCategory({ darkMode }) {
  const { gender } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');

  const [products, setProducts] = useState([]);
  const [perfumeItems, setPerfumeItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl ? categoryFromUrl.toUpperCase() : 'ALL');

  // Color scheme based on dark mode
  const colors = {
    bg: darkMode ? '#0f0f0f' : '#fff',
    text: darkMode ? '#fff' : '#000',
    textLight: darkMode ? '#999' : '#999',
    border: darkMode ? '#333' : '#f0f0f0',
    imageBg: darkMode ? '#1a1a1a' : '#f9f9f9',
    hoverOpacity: 0.9
  };

  useEffect(() => {
    fetchProducts();
  }, [gender]);

  // Update selected category when URL query param changes
  useEffect(() => {
    const category = searchParams.get('category');
    setSelectedCategory(category ? category.toUpperCase() : 'ALL');
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      // Filter by gender
      const filtered = res.data.filter(p => p.gender === gender.toUpperCase());
      setProducts(filtered);

      // If perfumery, also fetch perfume names for sidebar
      if (gender.toUpperCase() === 'PERFUMERY') {
        const perfumes = filtered.map(p => ({ name: p.name, id: p._id }));
        setPerfumeItems(perfumes);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const subCategoryItems = [
    'Top',
    'Bottoms',
    'Bag',
    'Accessories',
    'Shoes'
  ];

  // Always show all categories
  const categories = ['ALL', ...subCategoryItems];

  // Map category variations to handle singular/plural and naming differences
  const categoryMap = {
    'TOP': ['TOP', 'TOPS'],
    'BOTTOMS': ['BOTTOM', 'BOTTOMS'],
    'BAG': ['BAG', 'BAGS'],
    'ACCESSORIES': ['ACCESSORY', 'ACCESSORIES'],
    'SHOES': ['SHOE', 'SHOES']
  };

  // Filter products by selected category with variations support
  const filteredProducts = selectedCategory === 'ALL'
    ? products
    : products.filter(p => {
        if (!p.category) return false;
        const productCat = p.category.toUpperCase();
        const selectedCat = selectedCategory.toUpperCase();

        // Check if the product category matches the selected category or any of its variations
        if (productCat === selectedCat) return true;

        // Check variations from the map
        const variations = categoryMap[selectedCat] || [];
        return variations.includes(productCat);
      });

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
      {/* Left Sidebar */}
      <div style={{
        width: '240px',
        backgroundColor: colors.bg,
        padding: '50px 30px',
        borderRight: `1px solid ${colors.border}`,
        position: 'sticky',
        top: '70px',
        height: 'calc(100vh - 70px)',
        overflowY: 'auto',
        transition: 'background-color 0.3s ease, border-color 0.3s ease'
      }}>
        {/* Main Title */}
        <h2 style={{
          fontSize: '14px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: '400',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          color: colors.text,
          margin: '0 0 40px 0',
          lineHeight: '1.4'
        }}>
          All {gender.toUpperCase()} 
        </h2>

        {/* Categories Section or Perfume Items */}
        <div style={{ paddingTop: '0px' }}>
          <div style={{
            fontSize: '11px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: '400',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            color: colors.textLight,
            marginBottom: '25px'
          }}>
            {gender.toUpperCase() === 'PERFUMERY' ? 'PERFUME COLLECTION' : 'FILTER BY CATEGORY'}
          </div>

          {gender.toUpperCase() === 'PERFUMERY' ? (
            // Show Perfume Names
            perfumeItems.map((perfume) => (
              <div
                key={perfume.id}
                onClick={() => navigate(`/product/${perfume.id}`)}
                style={{
                  fontSize: '12px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: '300',
                  letterSpacing: '0.3px',
                  color: colors.textLight,
                  padding: '12px 0',
                  cursor: 'pointer',
                  borderBottom: `1px solid ${colors.border}`,
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.color = colors.text}
                onMouseLeave={(e) => e.target.style.color = colors.textLight}
              >
                {perfume.name}
              </div>
            ))
          ) : (
            // Show Categories for Men/Women
            categories.map((cat) => (
              <div
                key={cat}
                onClick={() => setSelectedCategory(cat.toUpperCase())}
                style={{
                  fontSize: '12px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: selectedCategory.toUpperCase() === cat.toUpperCase() ? '400' : '300',
                  letterSpacing: '0.3px',
                  color: selectedCategory.toUpperCase() === cat.toUpperCase() ? colors.text : colors.textLight,
                  padding: '12px 0',
                  cursor: 'pointer',
                  borderBottom: `1px solid ${colors.border}`,
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => selectedCategory.toUpperCase() !== cat.toUpperCase() && (e.target.style.color = colors.text)}
                onMouseLeave={(e) => selectedCategory.toUpperCase() !== cat.toUpperCase() && (e.target.style.color = colors.textLight)}
              >
                {cat}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, backgroundColor: colors.bg, transition: 'background-color 0.3s ease' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '30px 30px',
          borderBottom: `1px solid ${colors.border}`,
          transition: 'border-color 0.3s ease'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: '300',
            letterSpacing: '1px',
            color: colors.text,
            margin: '0',
            textTransform: 'uppercase'
          }}>
            {selectedCategory === 'ALL'
              ? gender.toUpperCase()
              : `${gender.toUpperCase()} / ${selectedCategory.toUpperCase()}`
            }
          </h1>
          <div style={{
            fontSize: '11px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            letterSpacing: '0.5px',
            color: colors.text,
            cursor: 'pointer'
          }}>
            FILTER BY +
          </div>
        </div>

        {/* Products Grid - 1000x1400 format (3 columns) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0',
          padding: '0'
        }}>
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
              style={{
                borderRight: `1px solid ${colors.border}`,
                borderBottom: `1px solid ${colors.border}`,
                cursor: 'pointer',
                transition: 'opacity 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = colors.hoverOpacity}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              {/* Image Container - 1000x1400 aspect ratio */}
              <div style={{
                aspectRatio: '1000 / 1400',
                backgroundColor: colors.imageBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                transition: 'background-color 0.3s ease'
              }}>
                <img
                  src={product.media?.featured || `/products/${product._id}.jpg`}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Product Info */}
              <div style={{
                padding: '20px',
                borderRight: `1px solid ${colors.border}`,
                borderBottom: `1px solid ${colors.border}`,
                backgroundColor: colors.bg,
                transition: 'background-color 0.3s ease'
              }}>
                <h3 style={{
                  fontSize: '13px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: '400',
                  letterSpacing: '0.5px',
                  color: colors.text,
                  margin: '0 0 10px 0',
                  textTransform: 'uppercase'
                }}>
                  {product.name}
                </h3>
                <p style={{
                  fontSize: '13px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: '500',
                  color: colors.text,
                  margin: '0',
                  letterSpacing: '0.5px'
                }}>
                  ${product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GenderCategory;
