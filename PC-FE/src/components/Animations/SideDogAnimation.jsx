import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import sideDogAnimation from '../../assets/sidedog.json';

const SideDogAnimation = ({ width = 300, height = 300, position = 'right' }) => {
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
  const [animationSize, setAnimationSize] = useState({ width, height });

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
      
      // Adjust animation size based on screen width
      if (currentWidth < BREAKPOINTS.sm) { // Extra small
        setAnimationSize({
          width: Math.min(180, currentWidth * 0.4),
          height: Math.min(180, currentWidth * 0.4)
        });
      } else if (currentWidth < BREAKPOINTS.md) { // Small
        setAnimationSize({
          width: Math.min(220, currentWidth * 0.5),
          height: Math.min(220, currentWidth * 0.5)
        });
      } else if (currentWidth < BREAKPOINTS.lg) { // Medium
        setAnimationSize({
          width: Math.min(280, currentWidth * 0.3),
          height: Math.min(280, currentWidth * 0.3)
        });
      } else { // Large and above
        setAnimationSize({ width, height });
      }
    };
    
    // Set initial size
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width, height]);

  // Calculate position styles based on screen size and position prop
  const getPositionStyles = () => {
    const baseStyles = {
      width: animationSize.width, 
      height: animationSize.height,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transition: 'all 0.3s ease'
    };
    
    // For mobile devices, position the animation on the side
    if (screenSize.isMobile) {
      return {
        ...baseStyles,
        position: 'relative',
        margin: position === 'left' ? '0 auto 0 0' : '0 0 0 auto',
        transform: position === 'left' ? 'translateX(-10%)' : 'translateX(10%)',
      };
    }
    
    // For tablets, adjust positioning
    if (screenSize.isTablet) {
      return {
        ...baseStyles,
        margin: position === 'left' ? '0 auto 0 0' : '0 0 0 auto',
      };
    }
    
    // For desktop
    return {
      ...baseStyles,
      margin: position === 'left' ? '0 auto 0 0' : '0 0 0 auto',
    };
  };

  return (
    <div style={getPositionStyles()}>
      <Lottie 
        animationData={sideDogAnimation} 
        loop={true}
        style={{ width: '100%', height: '100%' }}
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice'
        }}
      />
    </div>
  );
};

export default SideDogAnimation;
