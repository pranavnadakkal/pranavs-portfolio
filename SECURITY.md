# Security Guidelines for Portfolio

## 🔒 Security Measures Implemented

### 1. **Input Validation & Sanitization**
- All mouse coordinates are validated and clamped to safe ranges
- Navigation section IDs are whitelisted to prevent arbitrary navigation
- Email and URL inputs are validated before use

### 2. **Event Handling Security**
- Event listeners use `passive: true` flag for better performance
- All event handlers properly clean up to prevent memory leaks
- Safe event handler wrappers prevent event hijacking

### 3. **XSS (Cross-Site Scripting) Prevention**
- Content Security Policy (CSP) implemented in `index.html`
- External links use `rel="noopener noreferrer"` to prevent window hijacking
- No `innerHTML` used with user input
- All dynamic content properly escaped

### 4. **CSRF (Cross-Site Request Forgery) Protection**
- No state-changing operations through simple GET requests
- Mailto links use safe protocol restrictions
- Form actions are properly validated

### 5. **Secure External Links**
```jsx
// ✅ SECURE - All external links use:
<a href="https://github.com" target="_blank" rel="noopener noreferrer" />

// ✅ SECURE - Aria labels for accessibility:
<a href="..." aria-label="GitHub profile" />
```

### 6. **DOM Security**
- Element validation before manipulation
- Safe element selection with validation
- Prevention of DOM-based XSS attacks

### 7. **Performance & Security**
- Debouncing and rate limiting on frequent operations
- Request animation frames properly cancelled on cleanup
- Memory leak prevention through proper cleanup

### 8. **Content Security Policy**
```html
<meta http-equiv="Content-Security-Policy" 
  content="default-src 'self'; 
           script-src 'self' 'wasm-unsafe-eval'; 
           style-src 'self' 'unsafe-inline'; 
           img-src 'self' data: https:; 
           font-src 'self'; 
           connect-src 'self' https:; 
           frame-ancestors 'none'; 
           base-uri 'self'; 
           form-action 'self'" />
```

### 9. **Permissions Policy**
```html
<meta http-equiv="Permissions-Policy" 
  content="camera=(), microphone=(), geolocation=()" />
```

### 10. **Referrer Policy**
```html
<meta name="referrer" content="strict-origin-when-cross-origin" />
```

## 📋 Security Best Practices Used

### Code Security
- ✅ Constant validation of coordinates and parameters
- ✅ Whitelist-based navigation (only allow defined sections)
- ✅ Type checking before processing user input
- ✅ Try-catch blocks in critical operations
- ✅ Proper error handling without exposing internals

### DOM Security
- ✅ `textContent` used instead of `innerHTML` for user input
- ✅ Safe element selection with existence validation
- ✅ Event target validation before processing

### Link Security
- ✅ `rel="noopener"` prevents window.opener access
- ✅ `rel="noreferrer"` hides referrer information
- ✅ `target="_blank"` safely opens new tabs
- ✅ URL validation before navigation

### External Resources
- ✅ Only HTTPS allowed for external connections
- ✅ Script sources limited to same-origin + wasm-unsafe-eval (for React)
- ✅ Font sources restricted to same-origin

## 🔐 Environment Variables (Future Implementation)

When integrating backend services, use environment variables:

```javascript
// ✅ SECURE - Use environment variables
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
const EMAIL_SERVICE = import.meta.env.VITE_EMAIL_SERVICE;

// ❌ AVOID - Hardcoding credentials
const API_KEY = "sk_live_..."; // NEVER DO THIS
```

## 🛡️ Security Utilities Available

### Available Functions in `security.js`

```javascript
import {
  sanitizeInput,        // Sanitize user input to prevent XSS
  isValidUrl,          // Validate URLs before navigation
  isValidEmail,        // Validate email addresses
  createSafeEventHandler, // Wrap event handlers safely
  getSafeElement,      // Safely get DOM elements
  debounce,            // Debounce frequent operations
  rateLimit,           // Rate limit requests
  validateCoordinates, // Validate coordinate values
  logSecurityEvent,    // Log security events
  createConstants      // Create frozen constants
} from './security.js';
```

## 🚀 Deployment Security Checklist

Before deploying to production:

- [ ] Enable HTTPS/SSL certificate
- [ ] Configure proper CORS headers on backend
- [ ] Set secure cookies (`Secure`, `HttpOnly`, `SameSite`)
- [ ] Implement rate limiting on backend
- [ ] Regular security audits and dependency updates
- [ ] Monitor for suspicious activities
- [ ] Keep dependencies up to date: `npm audit fix`
- [ ] Use security headers (Helmet.js if using Express)

## 🔄 Regular Security Maintenance

```bash
# Check for security vulnerabilities
npm audit

# Fix security vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated

# Update packages safely
npm update
```

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/Top10/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [React Security Best Practices](https://react.dev/learn/security)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

## 📞 Report Security Issues

If you discover any security vulnerabilities, please:
1. Do NOT open a public issue
2. Email security details privately
3. Allow time for a fix before public disclosure

---

**Last Updated:** February 14, 2026
**Status:** ✅ Security-Hardened Portfolio
