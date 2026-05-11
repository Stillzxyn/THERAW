import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;

  // Group products by gender and category
  const groupedProducts = {};
  products.forEach((product) => {
    const gender = product.gender || 'OTHER';
    const category = product.category || 'OTHER';
    const key = `${gender} / ${category}`;

    if (!groupedProducts[key]) {
      groupedProducts[key] = [];
    }
    groupedProducts[key].push(product);
  });

  return (
    <div style={{ backgroundColor: '#fff' }}>
      {Object.entries(groupedProducts).map(([groupName, groupProducts]) => (
        <div key={groupName}>
          {/* Category Title */}
          <div style={{
            padding: '30px 20px 20px 20px',
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: '300',
            letterSpacing: '0.5px',
            color: '#000',
            textTransform: 'uppercase',
            borderBottom: '1px solid #f0f0f0'
          }}>
            {groupName}
          </div>

          {/* Products Grid with Borders */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            borderLeft: '1px solid #f0f0f0',
            borderRight: '1px solid #f0f0f0',
            borderBottom: '1px solid #f0f0f0'
          }}>
            {groupProducts.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{
                  borderRight: '1px solid #f0f0f0',
                  borderBottom: '1px solid #f0f0f0',
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f9f9f9',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}>
                  {/* Product Image */}
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
                  padding: '15px',
                  borderRight: '1px solid #f0f0f0',
                  borderBottom: '1px solid #f0f0f0',
                  minHeight: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start'
                }}>
                  <h3 style={{
                    fontSize: '12px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: '400',
                    letterSpacing: '0.5px',
                    color: '#000',
                    margin: '0 0 8px 0',
                    textTransform: 'uppercase'
                  }}>
                    {product.name}
                  </h3>
                  <p style={{
                    fontSize: '13px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: '500',
                    color: '#000',
                    margin: '0',
                    letterSpacing: '0.5px'
                  }}>
                    ${product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Products;
