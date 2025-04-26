import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import dogLoaderAnimation from '../../assets/dogloader.json';

const DogLoader = ({ size = 'medium', showCaption = true }) => {
  // Screen size breakpoints
  const BREAKPOINTS = {
    xs: 480,  // Extra small devices
    sm: 576,  // Small devices
    md: 768,  // Medium devices
    lg: 992,  // Large devices
    xl: 1200  // Extra large devices
  };

  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < BREAKPOINTS.md,
    isTablet: window.innerWidth >= BREAKPOINTS.md && window.innerWidth < BREAKPOINTS.lg,
    isDesktop: window.innerWidth >= BREAKPOINTS.lg
  });
  
  // Handle responsive sizing
  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;
      
      // Update screen size state
      setScreenSize({
        width: currentWidth,
        height: currentHeight,
        isMobile: currentWidth < BREAKPOINTS.md,
        isTablet: currentWidth >= BREAKPOINTS.md && currentWidth < BREAKPOINTS.lg,
        isDesktop: currentWidth >= BREAKPOINTS.lg
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Define responsive sizes for the loader
  const getSize = () => {
    if (screenSize.width < BREAKPOINTS.sm) { // Extra small devices
      return {
        small: { width: 80, height: 80 },
        medium: { width: 120, height: 120 },
        large: { width: 180, height: 180 }
      }[size];
    } else if (screenSize.width < BREAKPOINTS.md) { // Small devices
      return {
        small: { width: 90, height: 90 },
        medium: { width: 150, height: 150 },
        large: { width: 220, height: 220 }
      }[size];
    } else if (screenSize.width < BREAKPOINTS.lg) { // Medium devices
      return {
        small: { width: 100, height: 100 },
        medium: { width: 180, height: 180 },
        large: { width: 250, height: 250 }
      }[size];
    } else { // Large devices and above
      return {
        small: { width: 120, height: 120 },
        medium: { width: 200, height: 200 },
        large: { width: 300, height: 300 }
      }[size];
    }
  };

  // Get responsive styles for the container
  const getContainerStyle = () => {
    return {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: screenSize.isMobile ? '10px' : '20px',
      transition: 'all 0.3s ease'
    };
  };

  // Get responsive styles for the caption
  const getCaptionStyle = () => {
    const baseFontSize = size === 'small' ? 14 : size === 'medium' ? 18 : 24;
    const responsiveFontSize = screenSize.isMobile ? baseFontSize * 0.8 : baseFontSize;
    
    return {
      marginTop: screenSize.isMobile ? '10px' : '20px',
      fontSize: `${responsiveFontSize}px`,
      fontWeight: '500',
      color: '#222222',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      maxWidth: '100%',
      padding: '0 10px'
    };
  };

  return (
    <div style={getContainerStyle()}>
      <Lottie 
        animationData={dogLoaderAnimation} 
        loop={true}
        style={getSize()}
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice'
        }}
      />
      {showCaption && (
        <div style={getCaptionStyle()}>
          Reuniting pets with their families
        </div>
      )}
    </div>
  );
};

export default DogLoader;
