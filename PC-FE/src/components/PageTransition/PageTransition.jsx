import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DogLoader from '../Loader/DogLoader';

// Define which routes should show the loader animation
const ROUTES_WITH_LOADER = [
  '/',          // Home
  '/login',     // Login
  '/register',  // Register
  '/dashboard'  // Dashboard
];

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const prevPathRef = useRef(location.pathname);
  
  useEffect(() => {
    // Only show loader when actually navigating between different pages
    if (prevPathRef.current !== location.pathname) {
      // Check if current route should show loader
      const shouldShowLoader = ROUTES_WITH_LOADER.some(route => 
        location.pathname === route || location.pathname.startsWith(`${route}/`)
      );
      
      if (shouldShowLoader) {
        // Start loading when location changes
        setIsLoading(true);
        
        // Set a timer to stop loading after 3 seconds
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 3000);
        
        // Clean up the timer when component unmounts or location changes again
        return () => clearTimeout(timer);
      }
      
      // Update the previous path reference
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname]);
  
  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(5px)',
              zIndex: 9999,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <DogLoader size="large" showCaption={true} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </>
  );
};

export default PageTransition;
