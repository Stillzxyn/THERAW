import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function ProductDetail({ token, darkMode }) {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [expandedSection, setExpandedSection] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [userWishlist, setUserWishlist] = useState([]);
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
    fetchProduct();
    if (token) {
      fetchUserWishlist();
    }
  }, [id, token]);

  const fetchProduct = async () => {
    try {
      console.log('Fetching product with ID:', id);
      console.log('Request URL: /api/products/' + id);
      const res = await axios.get(`/api/products/${id}`);
      console.log('Product fetched successfully:', res.data);
      setProduct(res.data);
      setSelectedImage(res.data.media?.featured || `/products/${res.data._id}.jpg`);
      if (res.data.variants && res.data.variants.length > 0) {
        setSelectedColor(res.data.variants[0].color);
        if (res.data.variants[0].sizes && res.data.variants[0].sizes.length > 0) {
          setSelectedSize(res.data.variants[0].sizes[0]);
        }
      }
      fetchRelatedProducts(res.data.gender, res.data.category);
      checkWishlistStatus(res.data._id);
    } catch (err) {
      console.error('Error fetching product:', err);
      console.error('Error message:', err.message);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserWishlist = async () => {
    try {
      const res = await axios.get('/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('User wishlist fetched:', res.data);
      setUserWishlist(res.data);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  };

  const checkWishlistStatus = (productId) => {
    const isInWish = userWishlist.some(item => item.productId === productId);
    setIsInWishlist(isInWish);
  };

  useEffect(() => {
    if (product && userWishlist.length > 0) {
      checkWishlistStatus(product._id);
    }
  }, [userWishlist, product]);

  const handleWishlistToggle = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      if (isInWishlist) {
        // Remove from wishlist
        await axios.delete(`/api/wishlist/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Item removed from wishlist');
        setIsInWishlist(false);
        setUserWishlist(userWishlist.filter(item => item.productId !== id));
        setSuccess('Removed from saved items');
      } else {
        // Add to wishlist
        await axios.post('/api/wishlist/add',
          { productId: id, productName: product.name, price: product.price },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Item added to wishlist');
        setIsInWishlist(true);
        setUserWishlist([...userWishlist, { productId: id, productName: product.name, price: product.price }]);
        setSuccess('Added to saved items');
      }
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error('Error updating wishlist:', err);
      setError('Failed to update wishlist');
      setTimeout(() => setError(''), 2000);
    }
  };

  const fetchRelatedProducts = async (gender, category) => {
    try {
      const res = await axios.get('/api/products');
      const related = res.data
        .filter(p => p.gender === gender && p.category === category && p._id !== id)
        .slice(0, 4);
      setRelatedProducts(related);
    } catch (err) {
      console.log('Error fetching related products');
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }

    // Validate size is selected (except for perfume)
    if (product.gender !== 'PERFUMERY' && !selectedSize) {
      setError('Please select a size');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      console.log('Adding to cart:', {
        productId: id,
        quantity: parseInt(quantity),
        size: selectedSize,
        color: selectedColor
      });

      const res = await axios.post('/api/cart/add',
        { productId: id, quantity: parseInt(quantity), size: selectedSize, color: selectedColor },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Added to cart successfully:', res.data);
      setSuccess('Added to cart!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error('Error adding to cart:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to add to cart');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) return <div style={{ padding: '60px 50px', textAlign: 'center', fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: colors.bg, color: colors.text, transition: 'background-color 0.3s ease, color 0.3s ease' }}>Loading...</div>;
  if (error) return <div style={{ padding: '60px 50px', textAlign: 'center', fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: colors.bg, color: colors.errorText, transition: 'background-color 0.3s ease' }}>{error}</div>;
  if (!product) return <div style={{ padding: '60px 50px', textAlign: 'center', fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: colors.bg, color: colors.errorText, transition: 'background-color 0.3s ease' }}>Product not found</div>;

  const currentVariant = product.variants?.find(v => v.color === selectedColor);
  const sizes = currentVariant?.sizes || [];

  // Generate breadcrumb
  const breadcrumb = [
    'THE RAW',
    product.gender?.toUpperCase(),
    product.category?.toUpperCase(),
    product.name?.toUpperCase()
  ].filter(Boolean).join(' / ');

  return (
    <div style={{ backgroundColor: colors.bg, fontFamily: 'Helvetica, Arial, sans-serif', transition: 'background-color 0.3s ease' }}>
      {/* Breadcrumb */}
      <div style={{
        padding: '30px 50px',
        fontSize: '11px',
        fontWeight: '300',
        letterSpacing: '0.5px',
        color: colors.text,
        borderBottom: `1px solid ${colors.border}`
      }}>
        {breadcrumb}
      </div>

      {/* Main Product Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr 200px',
        gap: '60px',
        padding: '60px 50px',
        alignItems: 'start'
      }}>
        {/* Left - Images */}
        <div>
          <div style={{
            aspectRatio: '1000 / 1400',
            backgroundColor: colors.imageBg,
            marginBottom: '30px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img
              src={selectedImage}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

        </div>

        {/* Right - Product Info */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Product Name and Price */}
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '400',
              letterSpacing: '1px',
              color: colors.text,
              margin: '0 0 15px 0',
              textTransform: 'uppercase'
            }}>
              {product.name}
            </h1>
            <p style={{
              fontSize: '16px',
              fontWeight: '400',
              letterSpacing: '0.5px',
              color: colors.text,
              margin: '0'
            }}>
              ${product.price}
            </p>
          </div>

          {/* Color Selection */}
          {product.variants && product.variants.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '400',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                color: colors.text,
                marginBottom: '15px'
              }}>
                {selectedColor}
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.variants.map((variant) => (
                  <button
                    key={variant.color}
                    type="button"
                    onClick={() => setSelectedColor(variant.color)}
                    style={{
                      width: '20px',
                      height: '20px',
                      padding: '0',
                      border: selectedColor === variant.color ? '2px solid #000' : '1px solid #ccc',
                      backgroundColor: variant.color === 'BLACK' ? '#000' : variant.color === 'WHITE' ? '#fff' : variant.color?.toLowerCase(),
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    title={variant.color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Always Show Description */}
          <div style={{ marginBottom: '40px', borderTop: `1px solid ${colors.border}`, paddingTop: '40px', borderBottom: `1px solid ${colors.border}`, paddingBottom: '20px' }}>
            <h3 style={{
              fontSize: '11px',
              fontWeight: '400',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              color: colors.text,
              marginBottom: '15px'
            }}>
              DETAILS & DESCRIPTION
            </h3>
            <div style={{
              fontSize: '13px',
              fontWeight: '300',
              lineHeight: '1.8',
              letterSpacing: '0.3px',
              color: colors.textLight
            }}>
              {product.details?.description || product.description || 'Premium quality crafted with attention to detail.'}
            </div>
          </div>

          {/* Materials - Always Show */}
          {product.details?.materials && product.details.materials.length > 0 && (
            <div style={{ marginBottom: '40px', borderTop: `1px solid ${colors.border}`, paddingTop: '20px', borderBottom: `1px solid ${colors.border}`, paddingBottom: '20px' }}>
              <h3 style={{
                fontSize: '11px',
                fontWeight: '400',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                color: colors.text,
                marginBottom: '15px'
              }}>
                MATERIALS
              </h3>
              <div style={{
                fontSize: '13px',
                fontWeight: '300',
                lineHeight: '1.8',
                letterSpacing: '0.3px',
                color: colors.textLight
              }}>
                {product.details.materials.map((material, idx) => (
                  <div key={idx}>{material.type}: {material.value}%</div>
                ))}
              </div>
            </div>
          )}

          {/* Origin - Always Show */}
          {product.details?.origin && (
            <div style={{ marginBottom: '40px', borderBottom: `1px solid ${colors.border}`, paddingBottom: '20px' }}>
              <h3 style={{
                fontSize: '11px',
                fontWeight: '400',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                color: colors.text,
                marginBottom: '15px'
              }}>
                ORIGIN
              </h3>
              <div style={{
                fontSize: '13px',
                fontWeight: '300',
                lineHeight: '1.8',
                letterSpacing: '0.3px',
                color: colors.textLight
              }}>
                {product.details.origin}
              </div>
            </div>
          )}


          {/* Style With Section - Only for non-perfume products */}
          {product.gender !== 'PERFUMERY' && relatedProducts.length > 0 && (
            <div style={{ marginTop: '60px' }}>
              <h3 style={{
                fontSize: '11px',
                fontWeight: '400',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                color: colors.text,
                marginBottom: '20px'
              }}>
                STYLE WITH
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '15px'
              }}>
                {relatedProducts.map((prod) => (
                  <div
                    key={prod._id}
                    onClick={() => navigate(`/product/${prod._id}`)}
                    style={{
                      cursor: 'pointer',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{
                      aspectRatio: '1',
                      backgroundColor: colors.imageBg,
                      marginBottom: '10px',
                      overflow: 'hidden'
                    }}>
                      <img
                        src={prod.media?.featured || `/products/${prod._id}.jpg`}
                        alt={prod.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Size and Add to Cart */}
        <div style={{
          width: '140px'
        }}>
          {/* Size Dropdown */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: '400',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              color: colors.textLight,
              marginBottom: '10px'
            }}>
              SIZE
            </label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${colors.border}`,
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: '300',
                color: colors.text,
                backgroundColor: colors.bg,
                cursor: 'pointer'
              }}
            >
              <option value="">Select Size</option>
              {sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            style={{
              width: '100%',
              padding: '18px 0',
              backgroundColor: darkMode ? '#fff' : '#000',
              color: darkMode ? '#000' : '#fff',
              border: 'none',
              fontSize: '14px',
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
            ADD +
          </button>

          {/* Add to Favourite Button */}
          <button
            onClick={handleWishlistToggle}
            style={{
              width: '100%',
              padding: '15px 0',
              backgroundColor: colors.bg,
              color: isInWishlist ? colors.text : colors.textLight,
              border: `1px solid ${colors.border}`,
              fontSize: '13px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: '300',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = colors.text;
              e.target.style.color = colors.text;
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = colors.border;
              e.target.style.color = isInWishlist ? colors.text : colors.textLight;
            }}
          >
            <span style={{ fontSize: '16px' }}>♡</span>
            {isInWishlist ? 'Saved' : 'Save'}
          </button>

          {/* Messages */}
          {success && (
            <div style={{
              marginTop: '15px',
              padding: '10px',
              backgroundColor: colors.successBg,
              fontSize: '11px',
              color: colors.successText,
              letterSpacing: '0.5px',
              textAlign: 'center'
            }}>
              {success}
            </div>
          )}
          {error && (
            <div style={{
              marginTop: '15px',
              padding: '10px',
              backgroundColor: colors.errorBg,
              fontSize: '11px',
              color: colors.errorText,
              letterSpacing: '0.5px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
