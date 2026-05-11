import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home({ showSidebar, setShowSidebar, setSidebarGender, darkMode }) {

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: darkMode ? '#0f0f0f' : '#fff',
      margin: 0,
      padding: 0,
      transition: 'background-color 0.3s ease'
    }}>
      {/* Video Section */}
      <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#000',
        margin: 0,
        padding: 0,
        flexShrink: 0
      }}>
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'fill',
            zIndex: 1
          }}
        >
          <source src="/HomepageVideo.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 2
        }} />

        {/* Text overlay - no background bar */}
        <div style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3
        }}>
          {/* Season text */}
          <h1 style={{
            fontSize: '64px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: '700',
            letterSpacing: '-5px',
            color: '#fff',
            margin: '0 0 20px 0',
            textAlign: 'center'
          }}>
            ONLY  RAW  MATERIAL     ALLOWED.
          </h1>

        </div>

      </div>

      {/* Images Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0',
        padding: '0',
        backgroundColor: darkMode ? '#0f0f0f' : '#fff',
        transition: 'background-color 0.3s ease'
      }}>
        {/* Picture 1 */}
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          display: 'block'
        }}>
          <img
            src="/HomePagePics1.png"
            alt="Essentials"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
          />
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            backgroundColor: 'transparent',
            padding: '10px'
          }}>
            <p style={{
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: '400',
              color: '#fff',
              margin: '0 0 8px 0',
              letterSpacing: '1px'
            }}>
              ESSENTIALS
            </p>
            <p style={{
              fontSize: '11px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: '300',
              color: '#fff',
              margin: 0,
              letterSpacing: '0.5px',
              opacity: 0.8
            }}>
              SPRING 2025
            </p>
          </div>
        </div>

        {/* Picture 2 */}
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          display: 'block'
        }}>
          <img
            src="/HomePagePics2.png"
            alt="Urban Edge"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
          />
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            backgroundColor: 'transparent',
            padding: '10px',
            textAlign: 'right'
          }}>
            <p style={{
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: '400',
              color: '#fff',
              margin: '0 0 8px 0',
              letterSpacing: '1px'
            }}>
              URBAN EDGE
            </p>
            <p style={{
              fontSize: '11px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: '300',
              color: '#fff',
              margin: 0,
              letterSpacing: '0.5px',
              opacity: 0.8
            }}>
              AUTUMN 2025
            </p>
          </div>
        </div>

        {/* Picture 3 */}
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          display: 'block'
        }}>
          <img
            src="/HomePagePics3.png"
            alt="Minimalist"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            backgroundColor: 'transparent',
            padding: '10px'
          }}>
            <p style={{
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: '400',
              color: '#fff',
              margin: '0 0 8px 0',
              letterSpacing: '1px'
            }}>
              STREET SMART
            </p>
            <p style={{
              fontSize: '11px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: '300',
              color: '#fff',
              margin: 0,
              letterSpacing: '0.5px',
              opacity: 0.8
            }}>
              SPRING 2024
            </p>
          </div>
        </div>

        {/* Picture 4 */}
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          display: 'block'
        }}>
          <img
            src="/HomePagePics4.png"
            alt="Luxury"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            backgroundColor: 'transparent',
            padding: '10px',
            textAlign: 'right'
          }}>
            <p style={{
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: '400',
              color: '#fff',
              margin: '0 0 8px 0',
              letterSpacing: '1px'
            }}>
              HAUTE COUTURE
            </p>
            <p style={{
              fontSize: '11px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: '300',
              color: '#fff',
              margin: 0,
              letterSpacing: '0.5px',
              opacity: 0.8
            }}>
              AUTUMN 2021
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
