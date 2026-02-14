/**
 * Security Utilities for Portfolio Application
 * Provides sanitization and validation functions
 */

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  const element = document.createElement('div');
  element.textContent = input;
  return element.innerHTML;
};

/**
 * Validate if a URL is safe for navigation
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if URL is safe
 */
export const isValidUrl = (url) => {
  if (typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url, window.location.href);
    // Only allow http and https protocols
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} - True if email is valid
 */
export const isValidEmail = (email) => {
  if (typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Create a safe event handler that prevents event hijacking
 * @param {Function} handler - The event handler to wrap
 * @returns {Function} - Wrapped event handler
 */
export const createSafeEventHandler = (handler) => {
  return (event) => {
    if (!event || typeof handler !== 'function') return;
    
    try {
      handler(event);
    } catch (error) {
      console.error('Error in event handler:', error);
    }
  };
};

/**
 * Validate DOM element exists and is safe
 * @param {string} elementId - The element ID to validate
 * @returns {HTMLElement|null} - The element if valid, null otherwise
 */
export const getSafeElement = (elementId) => {
  if (typeof elementId !== 'string' || elementId.length === 0) return null;
  
  const element = document.getElementById(elementId);
  
  // Verify the element actually belongs to the document
  if (element && document.documentElement.contains(element)) {
    return element;
  }
  
  return null;
};

/**
 * Debounce function to limit event firing
 * @param {Function} func - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  
  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      if (typeof func === 'function') {
        func(...args);
      }
    }, delay);
  };
};

/**
 * Request rate limiter
 * @param {Function} func - The function to rate limit
 * @param {number} limit - Maximum calls per interval
 * @param {number} interval - Time interval in milliseconds
 * @returns {Function} - Rate-limited function
 */
export const rateLimit = (func, limit = 1, interval = 1000) => {
  let calls = [];
  
  return function rateLimited(...args) {
    const now = Date.now();
    const recentCalls = calls.filter(time => now - time < interval);
    
    if (recentCalls.length < limit) {
      calls = [...recentCalls, now];
      if (typeof func === 'function') {
        func(...args);
      }
    }
  };
};

/**
 * Validate coordinate values
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {Object} - Validated coordinates
 */
export const validateCoordinates = (x, y, maxX = 10000, maxY = 10000) => {
  const validX = Math.min(Math.max(Number(x) || 0, 0), maxX);
  const validY = Math.min(Math.max(Number(y) || 0, 0), maxY);
  
  return { x: validX, y: validY };
};

/**
 * Log security events (in production, send to security monitoring service)
 * @param {string} eventType - Type of security event
 * @param {Object} details - Event details
 */
export const logSecurityEvent = (eventType, details = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[Security Event] ${eventType}:`, details);
  }
  
  // In production, you might want to send this to a monitoring service
  if (process.env.NODE_ENV === 'production' && window.__securityEventLogger) {
    window.__securityEventLogger(eventType, details);
  }
};

/**
 * Freeze object to prevent modification (for constants)
 * @param {Object} obj - Object to freeze
 * @returns {Object} - Frozen object
 */
export const createConstants = (obj) => {
  return Object.freeze(JSON.parse(JSON.stringify(obj)));
};
