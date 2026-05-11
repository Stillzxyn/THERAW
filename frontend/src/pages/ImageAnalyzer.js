import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ImageAnalyzer() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const navigate = useNavigate();
  const uploadSectionRef = React.useRef(null);

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result);
      };
      reader.readAsDataURL(file);
      setError('');
      setResults(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      compressImage(selectedImage, async (compressedBase64) => {
        const response = await axios.post('/api/ai/analyze-image', {
          image: compressedBase64,
          imageType: 'image/jpeg'
        });

        const productsResponse = await axios.get('/api/products');
        const allProducts = productsResponse.data;

        const keywords = response.data.keywords || [];
        const matchingProducts = allProducts.filter(product => {
          const productName = product.name.toLowerCase();
          const productCategory = (product.category || '').toLowerCase();

          return keywords.some(keyword => {
            const kw = keyword.toLowerCase();
            return productName.includes(kw) || productCategory.includes(kw);
          });
        });

        setResults({
          analysis: response.data.analysis,
          keywords: keywords,
          fabric: response.data.fabric,
          item: response.data.item,
          products: matchingProducts.slice(0, 4)
        });

        setLoading(false);
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze image');
      console.error('Error:', err);
      setLoading(false);
    }
  };

  const compressImage = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const maxDim = 2048;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85).split(',')[1];
        callback(compressedBase64);
      };
    };
  };

  const handleClear = () => {
    setSelectedImage(null);
    setPreview(null);
    setResults(null);
    setError('');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff', fontFamily: 'Helvetica, Arial, sans-serif' }}>
      {/* Section 1 - Hero */}
      <div style={{
        backgroundImage: `url(/AIBackground.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '200vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          position: 'absolute',
          top: '50px',
          left: '120px',
          color: '#fff',
          fontSize: '250px',
          fontWeight: '300',
          letterSpacing: '-25px',
          textTransform: 'uppercase'
        }}>
          DISCOVER
        </div>
        <div style={{
          position: 'absolute',
          top: '265px',
          left: '200px',
          color: '#fff',
          fontSize: '250px',
          fontWeight: '300',
          letterSpacing: '-25px',
          textTransform: 'uppercase',
          textAlign: 'right',
          lineHeight: '0.9'
        }}>
          YOUR STYLE.
        </div>
        {/* Text below eyes */}
        <div style={{
          position: 'absolute',
          bottom: '600px',
          left: '29%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '5px'
        }}>
          <div style={{
            color: '#fff',
            fontSize: '24px',
            fontWeight: '300',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            POWER
          </div>
          <div style={{
            color: '#fff',
            fontSize: '24px',
            fontWeight: '300',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            by
          </div>
          <div style={{
            color: '#fff',
            fontSize: '24px',
            fontWeight: '300',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            AI
          </div>
          <div style={{
            color: '#fff',
            fontSize: '12px',
            fontWeight: '300',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '40px'
          }}>
            (Visionary AI)
          </div>
          <button
            onClick={scrollToUpload}
            style={{
              padding: '18px 50px',
              backgroundColor: 'transparent',
              color: '#fff',
              border: '2px solid #fff',
              fontSize: '14px',
              fontWeight: '500',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: 'Helvetica, Arial, sans-serif',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#fff';
              e.target.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#fff';
            }}
          >
            GET STARTED
          </button>
        </div>
      </div>

      {/* Section 2 - Upload & Analysis */}
      <div style={{
        borderTop: '2px solid #000',
        borderBottom: '2px solid #000',
        padding: '60px 50px'
      }}>
        {/* Power by AI Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          marginBottom: '60px'
        }}>
          <img
            src="/CEE.svg"
            alt="CEE"
            style={{
              height: '40px',
              width: 'auto'
            }}
          />
          <span style={{
            fontSize: '16px',
            fontWeight: '300',
            letterSpacing: '1px'
          }}>
            Power by AI.
          </span>
        </div>

        {/* Main Content Grid */}
        <div
          ref={uploadSectionRef}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '60px'
          }}
        >
          {/* Left - Upload */}
          <div>
            <div style={{
              backgroundColor: '#2a2a2a',
              padding: '80px 40px',
              textAlign: 'center',
              cursor: 'pointer',
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '30px',
              position: 'relative'
            }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) {
                  const event = { target: { files: [file] } };
                  handleImageSelect(event);
                }
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
                id="image-input"
              />

              <label htmlFor="image-input" style={{
                cursor: 'pointer',
                display: 'block',
                color: '#fff',
                width: '100%'
              }}>
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '300px',
                      objectFit: 'contain'
                    }}
                  />
                ) : (
                  <div style={{ fontSize: '14px', color: '#999' }}>your pics</div>
                )}
              </label>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {selectedImage ? (
                <>
                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    style={{
                      padding: '18px 30px',
                      backgroundColor: '#000',
                      color: '#fff',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontFamily: 'Helvetica, Arial, sans-serif'
                    }}
                  >
                    {loading ? 'Analyzing...' : 'Upload'}
                  </button>

                  <button
                    onClick={handleClear}
                    style={{
                      padding: '18px 30px',
                      backgroundColor: '#000',
                      color: '#fff',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      fontFamily: 'Helvetica, Arial, sans-serif'
                    }}
                  >
                    Confirm
                  </button>
                </>
              ) : (
                <label
                  htmlFor="image-input"
                  style={{
                    padding: '18px 30px',
                    backgroundColor: '#000',
                    color: '#fff',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    display: 'block'
                  }}
                >
                  Upload
                </label>
              )}
            </div>
          </div>

          {/* Right - Analysis */}
          <div>
            <p style={{
              fontSize: '14px',
              color: '#333',
              lineHeight: '1.8',
              margin: '0'
            }}>
              {results ? (
                <>
                  <strong>Comments/analysis</strong>
                  <br />
                  {results.analysis}
                  {results.keywords && results.keywords.length > 0 && (
                    <>
                      <br /><br />
                      {results.keywords.join(', ')}
                    </>
                  )}
                </>
              ) : (
                'Comments/analysis\n\ncomments/analysis\n\ncomments/analysis'
              )}
            </p>

            {results && (results.item || results.fabric) && (
              <div style={{ marginTop: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {results.item && (
                  <span style={{
                    backgroundColor: '#000',
                    color: '#fff',
                    padding: '6px 12px',
                    fontSize: '10px',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {results.item}
                  </span>
                )}
                {results.fabric && (
                  <span style={{
                    backgroundColor: '#333',
                    color: '#fff',
                    padding: '6px 12px',
                    fontSize: '10px',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {results.fabric}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 3 - Products */}
      {results && results.products.length > 0 && (
        <div style={{
          padding: '60px 50px'
        }}>
          <h2 style={{
            fontSize: '14px',
            fontWeight: '600',
            letterSpacing: '1px',
            color: '#000',
            margin: '0 0 50px 0',
            textTransform: 'uppercase',
            textAlign: 'center'
          }}>
            Our Similar & Matching Prods
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '30px'
          }}>
            {results.products.map(product => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                style={{
                  cursor: 'pointer',
                  transition: 'opacity 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <div style={{
                  aspectRatio: '1',
                  backgroundColor: '#2a2a2a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  marginBottom: '15px'
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

                <div style={{ textAlign: 'center' }}>
                  <h4 style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#000',
                    margin: '0 0 5px 0',
                    textTransform: 'lowercase'
                  }}>
                    {product.name}
                  </h4>
                  <p style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#000',
                    margin: '0'
                  }}>
                    ${product.price || '0.00'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div style={{
          padding: '20px 50px',
          backgroundColor: '#ffebee',
          color: '#d32f2f',
          fontSize: '12px'
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default ImageAnalyzer;
