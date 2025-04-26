import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Handle redirects from 404.html for SPA routing in production
const handleRedirectFromNotFound = () => {
  // Check if we have a redirect URL in sessionStorage (set by 404.html)
  const redirectUrl = sessionStorage.getItem('redirectUrl');
  if (redirectUrl && window.location.search.includes('redirect=true')) {
    // Clear the sessionStorage
    sessionStorage.removeItem('redirectUrl');
    
    // Extract the path from the redirect URL
    const url = new URL(redirectUrl);
    const path = url.pathname + url.search;
    
    // Use history API to replace the current URL with the original one
    window.history.replaceState(null, '', path);
    
    console.log('Redirected from 404.html to:', path);
  }
};

// Run the redirect handler
handleRedirectFromNotFound();

// Log environment information in development
if (import.meta.env.DEV) {
  console.log('Environment Variables:', {
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
    BASE_URL: import.meta.env.BASE_URL,
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
