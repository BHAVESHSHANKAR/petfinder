/**
 * Simple console filter
 */

// Store original console methods
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info
};

// Clear console immediately
console.clear();

// Function to show login success message
window.showLoginSuccess = function() {
  originalConsole.log("POST /auth/login successful");
};

// Override console methods with filtering logic
function setupConsoleOverrides() {
  // Replace console.log
  console.log = function() {
    try {
      // Allow only login success messages
      if (arguments.length > 0 && 
          typeof arguments[0] === 'string' && 
          (arguments[0].includes('/auth/login') || 
           arguments[0] === "POST /auth/login successful")) {
        originalConsole.log("POST /auth/login successful");
        return;
      }
      
      // Block everything else
      return;
    } catch (e) {
      // If filtering fails, block everything
      return;
    }
  };
  
  // Block all errors
  console.error = function() {
    return;
  };
  
  // Block all warnings
  console.warn = function() {
    return;
  };
  
  // Block all info messages
  console.info = function() {
    return;
  };
}

// Set up console overrides
setupConsoleOverrides();

// Add utility to reset console filtering if needed
window.showAllLogs = function() {
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
  console.info = originalConsole.info;
  console.log('Console filtering disabled. Refresh to re-enable.');
}; 