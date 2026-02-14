# Pranav's Portfolio 🚀

A modern, animated, and security-hardened portfolio website built with React, showcasing cybersecurity expertise and full-stack development skills.

**Live Demo:** [pranavs-portfolio](https://github.com/pranavnadakkal/pranavs-portfolio)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Development](#development)
- [Build & Deployment](#build--deployment)
- [Security Features](#security-features)
- [Configuration](#configuration)
- [Browser Support](#browser-support)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## ✨ Features

### 🎨 **Interactive Animations**
- Custom animated cursor with trailing effect
- Smooth scroll animations on navigation
- Staggered entrance animations for sections
- Hover effects on all interactive elements
- Cybersecurity-themed background animations with:
  - Animated grid pattern
  - Floating gradient orbs
  - Matrix rain effect (binary code)
  - Security network nodes
  - Scanning lines
- Animated project cards with tech tags
- Pulsing security badge

### 🔐 **Security First**
- Content Security Policy (CSP) implemented
- XSS (Cross-Site Scripting) prevention
- CSRF protection measures
- Clickjacking prevention
- Safe external link handling
- Input validation and sanitization
- Rate limiting and debouncing utilities
- Comprehensive security documentation
- Security utilities module (`security.js`)

### 🎯 **Professional Design**
- Clean, modern UI with emerald accent color (#34d399)
- Responsive design (mobile, tablet, desktop)
- Dark theme optimized for readability
- Professional security-themed favicon
- Accessible ARIA labels
- Semantic HTML structure
- Professional PN logo with animations

### 📱 **Responsive & Mobile-Friendly**
- Mobile-first approach
- Touch-friendly interactive elements
- Optimized for all screen sizes
- Apple mobile web app support
- Progressive enhancement

### ⚡ **Performance**
- Fast loading with Vite
- Optimized animations with Framer Motion
- Passive event listeners for better performance
- Memory leak prevention
- Efficient re-render prevention with useCallback
- Optimized bundle size

---

## 🛠 Tech Stack

### **Frontend Framework**
- **React 18+** - UI library
- **Vite** - Build tool and dev server
- **Framer Motion** - Animation library
- **Tailwind CSS** - Utility-first CSS framework

### **Development Tools**
- **ESLint** - Code linting
- **Vite Config** - Optimized bundling
- **Node.js** - JavaScript runtime

### **Deployment Ready**
- Git & GitHub - Version control
- Compatible with Vercel, Netlify, GitHub Pages

---

## 📁 Project Structure

```
pranav-portfolio/
├── public/
│   ├── vite.svg              # Vite logo
│   └── favicon.svg           # Security-themed favicon
├── src/
│   ├── App.jsx               # Main application component
│   ├── App.css               # Application styles
│   ├── index.css             # Global styles
│   ├── main.jsx              # React entry point
│   ├── security.js           # Security utilities module
│   └── assets/
│       └── react.svg         # React logo
├── index.html                # HTML template with security headers
├── vite.config.js            # Vite configuration
├── eslint.config.js          # ESLint configuration
├── package.json              # Dependencies and scripts
├── README.md                 # This file
├── SECURITY.md               # Detailed security documentation
├── SECURITY_SUMMARY.md       # Security implementation summary
├── .gitignore               # Git ignore rules
└── .git/                    # Git repository

## Sections Included

### 1. **Hero Section**
- Character-by-character animated name
- Professional headline
- Call-to-action buttons with animations

### 2. **About Me Section**
- Animated introduction text with bullets
- Quick facts highlight box
- Degree, focus areas, passions

### 3. **Skills & Technologies**
- 4 animated skill categories:
  - Languages (Python, JavaScript, SQL, HTML/CSS)
  - Security & Core (Network Security, Scapy, OS concepts)
  - Frameworks & Tools (React, Flask, Tailwind, Git)
  - Methodologies (Agile, System Optimization, AI, Tech Communication)
- Staggered entrance animations
- Interactive hover effects

### 4. **Projects Section**
- 3 project showcases:
  - Intelligent Network Intrusion Detection (NIDS)
  - Process Synchronization Demo
  - Performance Bottlenecks Analysis
- Animated project cards with:
  - Icon animations
  - Tech tag cascades
  - Hover lift effects
  - GitHub links

### 5. **Contact Section**
- Animated heading with underline
- Call-to-action button with shimmer effect
- Social links (GitHub, LinkedIn)
- Floating inspiration message

### 6. **Footer**
- Copyright information
- Tech stack credits
- Security badge with icon animation
- Security practices message
```

---

## 🚀 Installation

### **Prerequisites**
- Node.js 16.x or higher
- npm 7.x or higher (or yarn/pnpm)
- Git

### **Steps**

1. **Clone the repository**
```bash
git clone https://github.com/pranavnadakkal/pranavs-portfolio.git
cd pranav-portfolio
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:5173
```

---

## 💻 Development

### **Available Scripts**

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint to check code quality
npm run lint

# Fix linting issues automatically
npm run lint -- --fix
```

### **Development Workflow**

```bash
# 1. Create a feature branch
git checkout -b feature/your-feature-name

# 2. Make your changes and save files
# ... edit files in src/ ...

# 3. Check git status
git status

# 4. Stage changes
git add .

# 5. Commit with descriptive message
git commit -m "feat: add your feature description"

# 6. Push to GitHub
git push origin feature/your-feature-name

# 7. Create a Pull Request on GitHub (optional)
```

### **Code Style Guide**

- Use functional components with React Hooks
- Use `useCallback` for memoized functions to prevent re-renders
- Implement proper cleanup in `useEffect` to prevent memory leaks
- Add comments for complex animation logic
- Follow Tailwind CSS utility conventions
- Use semantic HTML elements (`<section>`, `<nav>`, `<footer>`)
- Use `rel="noopener noreferrer"` on all external links

### **Adding New Sections**

Template for new animated section:
```jsx
<motion.section 
  id="new-section" 
  className="py-24 border-t border-slate-800"
>
  <motion.h3 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true, margin: "-100px" }}
    className="text-3xl font-bold mb-8 flex items-center"
  >
    <span className="text-emerald-400 font-mono text-xl mr-3">XX.</span> Section Title
  </motion.h3>
  
  {/* Your content here */}
</motion.section>
```

---

## 🏗 Build & Deployment

### **Production Build**

```bash
# Create optimized production build
npm run build

# Output will be in dist/ directory
# Includes minified JavaScript, CSS, and optimized assets
```

### **Preview Production Build Locally**

```bash
npm run preview
# Open http://localhost:4173
```

### **Deploy to Vercel** (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# For production deployment
vercel --prod
```

### **Deploy to Netlify**

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
netlify deploy --prod --dir=dist
```

### **Deploy to GitHub Pages**

1. Update `vite.config.js`:
```javascript
export default {
  base: '/pranavs-portfolio/',
  // ... other config
}
```

2. Build: `npm run build`
3. Push `dist/` to `gh-pages` branch

---

## 🔐 Security Features

### **Content Security Policy (CSP)**
```html
default-src 'self'                    /* Only same-origin by default */
script-src 'self' 'wasm-unsafe-eval' /* Scripts + React WASM */
style-src 'self' 'unsafe-inline'     /* Inline styles for React */
img-src 'self' data: https:           /* Images from safe sources */
font-src 'self'                       /* Fonts from same-origin */
connect-src 'self' https:             /* HTTPS connections only */
frame-ancestors 'none'                /* Cannot be embedded */
base-uri 'self'                       /* Base URL protection */
form-action 'self'                    /* Forms to same-origin */
```

### **Security Headers**
- ✅ X-UA-Compatible - Modern browser rendering
- ✅ Referrer-Policy - Prevent referrer leaks
- ✅ Permissions-Policy - Block camera, microphone, geolocation

### **Input Validation**
- Coordinate bounds checking (0 to 10000)
- Section ID whitelisting (about, skills, projects, contact)
- Event target validation
- Safe DOM element access

### **Security Utilities** (`security.js`)
- `sanitizeInput()` - HTML escape XSS prevention
- `isValidUrl()` - URL protocol validation
- `isValidEmail()` - RFC-compliant email validation
- `createSafeEventHandler()` - Error-wrapped event handlers
- `getSafeElement()` - Safe DOM element retrieval
- `debounce()` - Limit rapid function calls
- `rateLimit()` - Request throttling
- `validateCoordinates()` - Bounds checking
- `logSecurityEvent()` - Security event logging

### **External Link Security**
- All external links use `rel="noopener noreferrer"`
- Prevents window.opener access
- Hides referrer information
- Proper ARIA labels for accessibility

For detailed security information, see [SECURITY.md](./SECURITY.md)

---

## ⚙️ Configuration

### **Vite Configuration** (`vite.config.js`)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    host: 'localhost'
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
    sourcemap: false
  }
})
```

### **Environment Variables**

Create `.env.local` for development:
```bash
VITE_API_ENDPOINT=http://localhost:3000/api
VITE_EMAIL_SERVICE=your_email_service
```

Never commit `.env.local` - add to `.gitignore`

### **Tailwind CSS Configuration**

Custom colors used:
- **Primary (Emerald)**: `#34d399` - Main accent color
- **Background (Slate-900)**: `#0f172a` - Dark background
- **Text (Slate-100)**: `#f1f5f9` - Light text
- **Borders (Slate-700)**: `#334155` - Subtle borders

---

## 🌍 Browser Support

| Browser | Support | Min Version |
|---------|---------|-------------|
| Chrome | ✅ Yes | 90+ |
| Firefox | ✅ Yes | 88+ |
| Safari | ✅ Yes | 14+ |
| Edge | ✅ Yes | 90+ |
| Mobile Safari (iOS) | ✅ Yes | 14+ |
| Chrome Mobile | ✅ Yes | 90+ |

---

## 📦 Dependencies

### **Production Dependencies**
```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "framer-motion": "^10.0.0"
}
```

### **Development Dependencies**
```json
{
  "vite": "^5.0.0",
  "@vitejs/plugin-react": "^4.0.0",
  "tailwindcss": "^3.0.0",
  "postcss": "^8.0.0",
  "autoprefixer": "^10.0.0",
  "eslint": "^8.0.0"
}
```

See `package.json` for exact versions.

---

## 🎯 Feature Implementations

### **Animated Cursor**
- Position tracked via mouse events
- Smooth spring physics animation
- Trailing effect with secondary ring
- Auto-hidden when mouse leaves window

### **Scroll Navigation**
- Smooth scroll to section
- Validated section IDs
- Safe navigation handler
- No external dependencies needed

### **Cybersecurity Background**
- 5 animated components:
  1. Grid pattern (20s loop)
  2. 3 floating gradient orbs (12-18s)
  3. Matrix rain effect (8s per column)
  4. Network nodes (3-4s pulse)
  5. Scanning lines (4s sweep)
  6. Floating particles (8-12s)

### **Section Animations**
- Entrance: Fade + slide animations
- Trigger: `whileInView` on scroll
- Stagger: Children animate sequentially
- Once: `once: true` prevents re-animation

---

## 🚦 Performance Optimization

### **Best Practices Implemented**

1. **Memoization**
```javascript
const handleScroll = useCallback(() => {
  // Only recreated if dependencies change
}, []);
```

2. **Passive Event Listeners**
```javascript
addEventListener('mousemove', handler, { passive: true });
```

3. **Animation Optimization**
- Use `whileInView` instead of always animating
- Set `viewport={{ once: true }}` for scroll animations
- Limit simultaneous animations
- Use `transform` and `opacity` for performance

4. **Bundle Size**
- Vite tree-shaking removes unused code
- Framer Motion imported only what's needed
- No unnecessary dependencies

---

## 🐛 Troubleshooting

### **Issue: Dev server won't start**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### **Issue: Animations are choppy**
- Check if GPU acceleration is enabled in browser
- Reduce number of simultaneous animations
- Use `will-change` CSS sparingly
- Profile with Chrome DevTools Performance tab

### **Issue: Build fails**
```bash
# Check Node version
node --version  # Should be 16.x or higher

# Clear cache
npm cache clean --force
npm install
npm run build
```

### **Issue: Git push fails**
```bash
# Verify remote
git remote -v

# Check branch
git branch -M main

# Try push again
git push -u origin main
```

### **Issue: Security warnings in console**
- Check CSP headers in `index.html`
- Verify all external resources are HTTPS
- Check browser console for specific errors

---

## 📝 Commit Message Convention

Use semantic commit messages:

```
feat: add new feature description
fix: fix bug description
docs: update documentation
style: code style changes
refactor: refactor code
perf: performance improvements
chore: maintenance tasks
security: security updates
```

Example:
```bash
git commit -m "feat: add animated background animations
- Add matrix rain effect
- Add network nodes with pulsing
- Add scanning lines
- Implement cybersecurity theme"
```

---

## 📞 Support & Feedback

- **Report Issues**: [GitHub Issues](https://github.com/pranavnadakkal/pranavs-portfolio/issues)
- **Suggestions**: Open a GitHub discussion
- **Contact**: Email or LinkedIn (see footer)

---

## 📚 Additional Resources

- [React Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/animation)
- [OWASP Top 10](https://owasp.org/Top10/)

---

## 📊 Project Statistics

- **Total Animations**: 15+
- **Security Features**: 10+
- **Responsive Breakpoints**: 4+ (mobile, tablet, desktop, 4K)
- **Lines of Code**: 1300+
- **Build Time**: ~2 seconds
- **Bundle Size**: ~150KB (gzipped)

---

## 👤 About the Developer

**Pranav Nadakkal**
- Software Developer | Cybersecurity Enthusiast
- Master of Computer Applications (MCA) - Expected 2027
- Specialized in Network Security & AI Integration
- Focus on building secure, intelligent applications

### **Connect**
- GitHub: [@pranavnadakkal](https://github.com/pranavnadakkal)
- LinkedIn: [Pranav Nadakkal](https://linkedin.com/in/pranav-nadakkal)
- Email: your-email@example.com
- Portfolio: [pranavs-portfolio](https://github.com/pranavnadakkal/pranavs-portfolio)

---

## 📄 License

This project is open source and available under the MIT License.

```
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

## 🙏 Acknowledgments

Built with ❤️ by **Pranav Nadakkal** using:
- React & Vite for fast development
- Framer Motion for smooth animations
- Tailwind CSS for beautiful styling
- Prompt Engineering methodology for security
- Community feedback and best practices

---

**Last Updated:** February 14, 2026  
**Status:** ✅ Production Ready | 🔒 Security Hardened | ✨ Fully Animated | 📱 Responsive

⭐ If you like this project, please give it a star on GitHub!

