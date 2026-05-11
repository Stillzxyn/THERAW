import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function Story({ darkMode }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const colors = {
    bg: darkMode ? '#0f0f0f' : '#fff',
    text: darkMode ? '#fff' : '#000',
    textLight: darkMode ? '#999' : '#666',
    border: darkMode ? '#333' : '#f0f0f0',
    imageBg: darkMode ? '#1a1a1a' : '#f9f9f9'
  };

  const teamMembers = [
    {
      name: 'LENG',
      role: 'Creative Director',
      image: '/HomePagePics1.png',
      bio: 'Visionary behind RAW\'s aesthetic direction'
    },
    {
      name: 'WIN',
      role: 'Brand Strategist',
      image: '/HomePagePics2.png',
      bio: 'Architect of RAW\'s innovative vision'
    },
    {
      name: 'ZAYN',
      role: 'id:6831327321',
      image: '/Zayn.JPG',
      bio: 'Driving RAW\'s mission to redefine luxury'
    }
  ];

  return (
    <div style={{
      backgroundImage: 'url(/StoryBg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: colors.text,
      fontFamily: 'Helvetica, Arial, sans-serif',
      minHeight: '100vh'
    }}>
      {/* Hero Section */}
      <div
        style={{
          backgroundImage: 'url(/StoryBg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '200vh',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Title - OUR */}
        <div
          style={{
            position: 'absolute',
            top: '50px',
            left: '120px',
            color: '#fff',
            fontSize: '200px',
            fontWeight: '300',
            letterSpacing: '-20px',
            textTransform: 'uppercase',
            margin: '0',
            lineHeight: '0.9'
          }}
        >
          OUR
        </div>

        {/* Subtitle - STORY */}
        <div
          style={{
            position: 'absolute',
            top: '240px',
            left: '200px',
            color: '#fff',
            fontSize: '200px',
            fontWeight: '300',
            letterSpacing: '-20px',
            textTransform: 'uppercase',
            textAlign: 'right',
            lineHeight: '0.9'
          }}
        >
          STORY.
        </div>

        {/* Description - Positionable */}
        <div
          style={{
            position: 'absolute',
            top: '600px',
            right: '100px',
            textAlign: 'right',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '5px'
          }}
        >
          <p
            style={{
              fontSize: '16px',
              fontWeight: '300',
              lineHeight: '1.8',
              color: '#fff',
              letterSpacing: '0.5px',
              maxWidth: '600px',
              margin: '0',
              width: '90%'
            }}
          >
            RAW is more than a fashion brand. We are a movement dedicated to authenticity, quality, and timeless elegance. Crafted with intention, worn with purpose.
          </p>
        </div>
      </div>

      {/* Mission Section - Overlay */}
      <div style={{
        position: 'absolute',
        top: '800px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2,
        padding: '40px',
        maxWidth: '1200px',
        width: '90%'
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '300',
          letterSpacing: '1px',
          margin: '0 0 40px 0',
          textTransform: 'uppercase',
          color: '#fff'
        }}>
          OUR MISSION
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '60px'
        }}>
          <div>
            <h3 style={{
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              margin: '0 0 20px 0',
              color: '#fff'
            }}>
              AUTHENTICITY
            </h3>
            <p style={{
              fontSize: '14px',
              fontWeight: '300',
              lineHeight: '1.8',
              color: '#fff',
              margin: '0'
            }}>
              Every piece tells a story. We believe in creating garments that reflect who you truly are, not who you're expected to be.
            </p>
          </div>
          <div>
            <h3 style={{
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              margin: '0 0 20px 0',
              color: '#fff'
            }}>
              QUALITY
            </h3>
            <p style={{
              fontSize: '14px',
              fontWeight: '300',
              lineHeight: '1.8',
              color: '#fff',
              margin: '0'
            }}>
              Uncompromising standards in materials and craftsmanship. Each garment is designed to last, to be cherished, and to become a part of your story.
            </p>
          </div>
          <div>
            <h3 style={{
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              margin: '0 0 20px 0',
              color: '#fff'
            }}>
              SUSTAINABILITY
            </h3>
            <p style={{
              fontSize: '14px',
              fontWeight: '300',
              lineHeight: '1.8',
              color: '#fff',
              margin: '0'
            }}>
              We are committed to ethical practices and sustainable production. Fashion should never come at the cost of our planet.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section - Overlay */}
      <div style={{
        position: 'absolute',
        top: '1100px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2,
        padding: '40px',
        maxWidth: '1200px',
        width: '90%'
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '300',
          letterSpacing: '1px',
          margin: '0 0 60px 0',
          textTransform: 'uppercase',
          textAlign: 'center',
          color: '#fff'
        }}>
          THE PEOPLE BEHIND RAW
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '40px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {teamMembers.map((member, idx) => (
            <div key={idx} style={{
              textAlign: 'center'
            }}>
              {/* Image */}
              <div style={{
                aspectRatio: '1',
                overflow: 'hidden',
                marginBottom: '30px',
                backgroundColor: colors.border
              }}>
                <img
                  src={member.image}
                  alt={member.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              {/* Info */}
              <h3 style={{
                fontSize: '16px',
                fontWeight: '500',
                letterSpacing: '1px',
                margin: '0 0 10px 0',
                textTransform: 'uppercase',
                color: '#fff'
              }}>
                {member.name}
              </h3>
              <p style={{
                fontSize: '12px',
                fontWeight: '400',
                letterSpacing: '0.5px',
                color: '#fff',
                margin: '0 0 15px 0',
                textTransform: 'uppercase'
              }}>
                {member.role}
              </p>
              <p style={{
                fontSize: '13px',
                fontWeight: '300',
                lineHeight: '1.6',
                color: '#fff',
                margin: '0'
              }}>
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section - Overlay */}
      <div style={{
        position: 'absolute',
        top: '1700px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2,
        padding: '40px',
        textAlign: 'center',
        maxWidth: '1200px',
        width: '90%'
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '300',
          letterSpacing: '1px',
          margin: '0 0 30px 0',
          textTransform: 'uppercase',
          color: '#fff'
        }}>
          DISCOVER RAW
        </h2>
        <p style={{
          fontSize: '14px',
          fontWeight: '300',
          color: '#fff',
          margin: '0 0 40px 0',
          lineHeight: '1.8',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Explore our curated collection and find pieces that resonate with your authentic self. Every purchase is an investment in quality and timelessness.
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            padding: '15px 40px',
            backgroundColor: darkMode ? '#fff' : '#000',
            color: darkMode ? '#000' : '#fff',
            textDecoration: 'none',
            fontSize: '12px',
            fontWeight: '400',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            transition: 'opacity 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.opacity = '0.7'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        >
          SHOP NOW
        </Link>
      </div>
    </div>
  );
}

export default Story;
