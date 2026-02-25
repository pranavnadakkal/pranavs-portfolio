import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import './App.css';

// Security: Constants for event handling and validation
const VALID_SCROLL_SECTIONS = new Set(['about', 'skills', 'projects', 'contact']);
const MAX_COORDINATES = { x: 10000, y: 10000 };

// Security: Safe navigation handler
const handleSafeNavigation = (sectionId) => {
  if (!VALID_SCROLL_SECTIONS.has(sectionId)) {
    console.warn(`Invalid section: ${sectionId}`);
    return;
  }
  const element = document.getElementById(sectionId);
  if (element && element.scrollIntoView instanceof Function) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// Security: Safe coordinate validation
const validateCoordinates = (x, y) => {
  const validX = Math.min(Math.max(Number(x) || 0, 0), MAX_COORDINATES.x);
  const validY = Math.min(Math.max(Number(y) || 0, 0), MAX_COORDINATES.y);
  return { x: validX, y: validY };
};

// Hexagon data — stable positions (no Math.random in render)
const HEXAGONS = [
  { left: '8%', top: '12%', dur: '9s', delay: '0s' },
  { left: '80%', top: '8%', dur: '11s', delay: '1.5s' },
  { left: '55%', top: '35%', dur: '13s', delay: '3s' },
  { left: '20%', top: '60%', dur: '10s', delay: '0.8s' },
  { left: '88%', top: '55%', dur: '14s', delay: '2s' },
  { left: '40%', top: '80%', dur: '8s', delay: '4s' },
  { left: '5%', top: '85%', dur: '12s', delay: '1s' },
  { left: '70%', top: '75%', dur: '9s', delay: '2.5s' },
];

// Deep Space – stable star positions (no Math.random in render)
const STARS = [
  { left: '3%', top: '5%', size: 1 }, { left: '11%', top: '19%', size: 2 },
  { left: '22%', top: '8%', size: 1 }, { left: '34%', top: '3%', size: 1 },
  { left: '47%', top: '14%', size: 2 }, { left: '58%', top: '7%', size: 1 },
  { left: '69%', top: '21%', size: 1 }, { left: '79%', top: '11%', size: 2 },
  { left: '89%', top: '4%', size: 1 }, { left: '95%', top: '17%', size: 1 },
  { left: '7%', top: '33%', size: 2 }, { left: '16%', top: '44%', size: 1 },
  { left: '29%', top: '37%', size: 1 }, { left: '41%', top: '51%', size: 2 },
  { left: '54%', top: '36%', size: 1 }, { left: '64%', top: '47%', size: 1 },
  { left: '76%', top: '41%', size: 2 }, { left: '86%', top: '54%', size: 1 },
  { left: '93%', top: '34%', size: 1 }, { left: '2%', top: '63%', size: 2 },
  { left: '14%', top: '71%', size: 1 }, { left: '26%', top: '66%', size: 1 },
  { left: '39%', top: '76%', size: 2 }, { left: '51%', top: '69%', size: 1 },
  { left: '63%', top: '73%', size: 1 }, { left: '74%', top: '62%', size: 2 },
  { left: '84%', top: '79%', size: 1 }, { left: '92%', top: '67%', size: 1 },
  { left: '9%', top: '87%', size: 2 }, { left: '21%', top: '91%', size: 1 },
  { left: '33%', top: '84%', size: 1 }, { left: '46%', top: '89%', size: 2 },
  { left: '57%', top: '83%', size: 1 }, { left: '71%', top: '88%', size: 1 },
  { left: '81%', top: '94%', size: 2 }, { left: '91%', top: '84%', size: 1 },
  { left: '31%', top: '26%', size: 1 }, { left: '53%', top: '43%', size: 2 },
  { left: '19%', top: '56%', size: 1 }, { left: '68%', top: '31%', size: 1 },
  { left: '44%', top: '58%', size: 2 }, { left: '5%', top: '47%', size: 1 },
  { left: '72%', top: '15%', size: 1 }, { left: '85%', top: '25%', size: 1 },
  { left: '25%', top: '13%', size: 2 }, { left: '60%', top: '96%', size: 1 },
  { left: '96%', top: '48%', size: 1 }, { left: '43%', top: '29%', size: 2 },
  { left: '78%', top: '72%', size: 1 }, { left: '37%', top: '59%', size: 1 },
];

const SKILLS = [
  { category: 'Languages', items: [{ name: 'Python', pct: 88 }, { name: 'JavaScript', pct: 82 }, { name: 'SQL', pct: 75 }, { name: 'HTML/CSS', pct: 90 }] },
  { category: 'Security & Core', items: [{ name: 'Network Security', pct: 80 }, { name: 'Scapy', pct: 72 }, { name: 'Process Sync', pct: 78 }, { name: 'OS Concepts', pct: 85 }] },
  { category: 'Frameworks', items: [{ name: 'React & Vite', pct: 85 }, { name: 'Flask', pct: 78 }, { name: 'Tailwind CSS', pct: 88 }, { name: 'Git & GitHub', pct: 90 }] },
  { category: 'Methodologies', items: [{ name: 'Agile', pct: 82 }, { name: 'System Optimization', pct: 76 }, { name: 'AI Integration', pct: 74 }, { name: 'Tech Communication', pct: 88 }] },
];

export default function App() {
  // Mouse Position Logic for the Spotlight Effect and Animated Cursor
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(true);
  const cursorRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);

  // Scroll progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  // Security: Memoized event handler to prevent unnecessary re-renders
  const updateMousePosition = useCallback((e) => {
    // Security: Validate and sanitize mouse coordinates
    if (e && typeof e.clientX === 'number' && typeof e.clientY === 'number') {
      const safeCoords = validateCoordinates(e.clientX, e.clientY);
      setMousePosition(safeCoords);
      cursorRef.current = safeCoords;
      setIsMoving(true);
    }
  }, []);

  const animate = useCallback(() => {
    setCursorPosition((prev) => {
      const dx = cursorRef.current.x - prev.x;
      const dy = cursorRef.current.y - prev.y;
      const newX = prev.x + dx * 0.15;
      const newY = prev.y + dy * 0.15;
      return {
        x: Math.max(0, newX),
        y: Math.max(0, newY),
      };
    });
    animationFrameRef.current = requestAnimationFrame(animate);
  }, []);

  const handleMouseEnter = useCallback(() => setIsMoving(true), []);
  const handleMouseLeave = useCallback(() => setIsMoving(false), []);

  useEffect(() => {
    // Security: Add event listeners with passive flag for better performance
    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    window.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      // Security: Clean up event listeners to prevent memory leaks
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateMousePosition, handleMouseEnter, handleMouseLeave, animate]);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-violet-400 selection:text-slate-900 relative overflow-hidden cursor-none">

      {/* Scroll Progress Bar */}
      <motion.div
        className="scroll-progress"
        style={{ scaleX }}
      />

      {/* Subtle Space Grid */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Cosmic Nebula Orbs */}
      <motion.div className="pointer-events-none fixed inset-0 z-10">
        {/* Indigo – Top Left */}
        <motion.div
          className="absolute top-0 left-0 rounded-full"
          style={{ width: 640, height: 640, background: 'radial-gradient(circle, rgba(99,102,241,0.38) 0%, rgba(67,56,202,0.16) 40%, transparent 70%)', filter: 'blur(60px)' }}
          animate={{ x: [0, 80, 0], y: [0, 60, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Violet – Bottom Right */}
        <motion.div
          className="absolute bottom-0 right-0 rounded-full"
          style={{ width: 560, height: 560, background: 'radial-gradient(circle, rgba(139,92,246,0.32) 0%, rgba(109,40,217,0.13) 40%, transparent 70%)', filter: 'blur(70px)' }}
          animate={{ x: [0, -70, 0], y: [0, -80, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Cyan – Centre */}
        <motion.div
          className="absolute rounded-full"
          style={{ top: '30%', left: '20%', width: 480, height: 480, background: 'radial-gradient(circle, rgba(34,211,238,0.18) 0%, rgba(6,182,212,0.07) 40%, transparent 70%)', filter: 'blur(80px)' }}
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Purple – Top Right */}
        <motion.div
          className="absolute top-0 right-0 rounded-full"
          style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(168,85,247,0.26) 0%, rgba(126,34,206,0.11) 40%, transparent 70%)', filter: 'blur(50px)' }}
          animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Fuchsia – Bottom Left */}
        <motion.div
          className="absolute rounded-full"
          style={{ bottom: '25%', left: 0, width: 320, height: 320, background: 'radial-gradient(circle, rgba(217,70,239,0.2) 0%, transparent 70%)', filter: 'blur(60px)' }}
          animate={{ scale: [1, 1.3, 1], y: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Starfield */}
      <div className="pointer-events-none fixed inset-0 z-5">
        {STARS.map((star, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            style={{ left: star.left, top: star.top, width: star.size, height: star.size }}
            animate={{ opacity: [0.2, 0.95, 0.2], scale: [1, 1.5, 1] }}
            transition={{ duration: 2 + (i % 5) * 0.9, repeat: Infinity, ease: 'easeInOut', delay: (i % 7) * 0.45 }}
          />
        ))}
      </div>

      {/* Shooting Stars */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`shoot-${i}`}
          className="pointer-events-none fixed z-6"
          style={{
            top: `${10 + i * 28}%`,
            left: '-10%',
            width: 150,
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)',
            filter: 'blur(0.5px)',
          }}
          animate={{ x: ['0vw', '130vw'], opacity: [0, 0.9, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 4 + 2, repeatDelay: 10 + i * 5, ease: 'easeIn' }}
        />
      ))}

      {/* Cosmic Dust Particles */}
      <motion.div className="pointer-events-none fixed inset-0 z-6">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`dust-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${8 + i * 11}%`,
              top: `${15 + (i % 4) * 20}%`,
              width: i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
              background:
                i % 3 === 0 ? 'rgba(196,181,253,0.9)' :
                  i % 3 === 1 ? 'rgba(125,211,252,0.9)' :
                    'rgba(249,168,212,0.7)',
              boxShadow:
                i % 3 === 0 ? '0 0 8px rgba(196,181,253,0.7)' :
                  i % 3 === 1 ? '0 0 8px rgba(125,211,252,0.7)' :
                    '0 0 6px rgba(249,168,212,0.6)',
            }}
            animate={{ y: [0, -140, 0], opacity: [0.5, 1, 0.5], x: [0, i % 2 === 0 ? 25 : -25, 0] }}
            transition={{ duration: 10 + i * 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
          />
        ))}
      </motion.div>

      {/* Animated Custom Cursor */}
      <motion.div
        animate={{
          x: cursorPosition.x - 10,
          y: cursorPosition.y - 10,
        }}
        transition={{
          type: "spring",
          damping: 30,
          mass: 0.2,
          stiffness: 300,
        }}
        className="pointer-events-none fixed w-5 h-5 z-50"
        style={{
          borderRadius: '50%',
          background: 'radial-gradient(circle, #a78bfa 0%, rgba(139,92,246,0.5) 100%)',
          boxShadow: '0 0 25px rgba(139,92,246,0.8), inset 0 0 15px rgba(139,92,246,0.6)',
          left: 0,
          top: 0,
        }}
      />

      {/* Cursor Trail */}
      <motion.div
        animate={{
          x: cursorPosition.x - 15,
          y: cursorPosition.y - 15,
        }}
        transition={{
          type: "spring",
          damping: 20,
          mass: 0.3,
          stiffness: 200,
        }}
        className="pointer-events-none fixed w-8 h-8 z-40"
        style={{
          border: '2px solid rgba(139,92,246,0.5)',
          borderRadius: '50%',
          left: 0,
          top: 0,
        }}
      />

      {/* Interactive Spotlight Background */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.09), transparent 80%)`
        }}
      />

      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center max-w-5xl mx-auto relative z-40 backdrop-blur-sm">
        {/* Professional PN Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          className="cursor-pointer group"
        >
          <motion.div
            className="relative inline-flex items-center justify-center"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.3 }}
          >
            {/* Logo Background Circle */}
            <svg width="48" height="48" viewBox="0 0 48 48" className="absolute text-emerald-400/20">
              <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>

            {/* Animated Border */}
            <motion.svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              className="absolute text-emerald-400"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
            </motion.svg>

            {/* Logo Text */}
            <div className="relative z-10 flex items-center justify-center">
              <span className="font-bold text-lg tracking-wider text-emerald-400 group-hover:text-emerald-300 transition-colors">
                PN
              </span>
            </div>
          </motion.div>

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-slate-800 px-3 py-1 rounded text-xs font-mono text-emerald-400 whitespace-nowrap pointer-events-none"
          >
            Pranav Nadakkal
          </motion.div>
        </motion.div>

        {/* Navigation Links */}
        <motion.ul
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex space-x-8 text-sm font-mono text-slate-300 hidden md:flex"
        >
          {['About', 'Skills', 'Projects', 'Contact'].map((item, index) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            >
              <motion.a
                href={`#${item.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault();
                  // Security: Use safe navigation handler
                  handleSafeNavigation(item.toLowerCase());
                }}
                className="relative group cursor-pointer"
                whileHover={{ color: '#34d399' }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <span>{item}</span>

                {/* Animated underline */}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-300"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            </motion.li>
          ))}
        </motion.ul>
      </nav>

      <main className="max-w-5xl mx-auto px-6 relative z-40">

        {/* Hero Section */}
        <section className="py-32 flex flex-col justify-center items-start min-h-[80vh]">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-emerald-400 font-mono mb-4 text-lg"
          >
            Hi, my name is
          </motion.p>
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold text-slate-100 tracking-tight mb-4 flex flex-wrap glitch"
            data-text="Pranav Nadakkal."
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 1 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05, delayChildren: 0.4 }
              }
            }}
          >
            {"Pranav Nadakkal.".split("").map((char, index) => (
              <motion.span
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
                }}
                whileHover={{
                  color: '#34d399',
                  y: -10,
                  scale: 1.15,
                  textShadow: '0 0 20px rgba(52,211,153,0.8)',
                  transition: { type: 'spring', stiffness: 500, damping: 10 }
                }}
                className={`cursor-default inline-block ${char === ' ' ? 'w-4 md:w-6' : ''}`}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.55, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-6xl font-bold text-slate-400 mb-6 typing-cursor"
          >
            I build and secure digital systems.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-xl text-lg text-slate-400 mb-10 leading-relaxed"
          >
            I am a software developer with a strong focus on cybersecurity and creating robust, intelligent applications.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-4"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#projects"
              className="bg-transparent border border-emerald-400 text-emerald-400 hover:bg-emerald-400/10 px-8 py-4 rounded font-mono transition-all"
            >
              Check out my work
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/resume.pdf"
              download="Pranav_Nadakkal_Resume.pdf"
              className="bg-emerald-400/10 border border-emerald-400 text-emerald-400 hover:bg-emerald-400/20 px-8 py-4 rounded font-mono transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Resume
            </motion.a>
          </motion.div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 border-t border-slate-800">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: '-100px' }}
            className="text-3xl font-bold mb-12 flex items-center"
          >
            <span className="text-emerald-400 font-mono text-xl mr-3 section-num">01.</span> About Me
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="md:col-span-2 text-slate-300 text-lg leading-relaxed space-y-6"
            >
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative pl-6 hover:text-emerald-400/80 transition-colors duration-300"
              >
                <span className="absolute left-0 text-emerald-400">▹</span>
                Hello! I'm Pranav, and I enjoy creating things that live on the internet, whether that means building software from scratch or ensuring networks remain secure against modern threats.
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative pl-6 hover:text-emerald-400/80 transition-colors duration-300"
              >
                <span className="absolute left-0 text-emerald-400">▹</span>
                I am currently pursuing my Master of Computer Applications (MCA), with an expected graduation in 2027. My academic journey and personal projects have given me a solid foundation in software engineering principles, operating systems, and network security.
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative pl-6 hover:text-emerald-400/80 transition-colors duration-300"
              >
                <span className="absolute left-0 text-emerald-400">▹</span>
                When I'm not coding or researching the latest in artificial intelligence and cybersecurity, I'm usually working on hands-on projects to bridge the gap between theory and real-world application.
              </motion.p>
            </motion.div>

            {/* Highlight Stats Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{
                boxShadow: "0 0 30px rgba(52, 211, 153, 0.2)",
                y: -5
              }}
              className="bg-slate-800/40 border border-slate-700/60 rounded-lg p-6 backdrop-blur-sm hover:border-emerald-400/40 transition-all duration-300"
            >
              <h4 className="text-emerald-400 font-bold mb-6 text-lg font-mono">Quick Facts</h4>

              <motion.div
                className="space-y-5"
                variants={{
                  hidden: { opacity: 1 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="flex items-start gap-3"
                >
                  <span className="text-emerald-400 mt-1">✓</span>
                  <div>
                    <p className="text-slate-300 font-mono text-sm">Degree</p>
                    <p className="text-slate-400 text-xs">Bachelor of Computer Science + Masters in Computer Applications (2027)</p>
                  </div>
                </motion.div>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="flex items-start gap-3"
                >
                  <span className="text-emerald-400 mt-1">✓</span>
                  <div>
                    <p className="text-slate-300 font-mono text-sm">Focus Areas</p>
                    <p className="text-slate-400 text-xs">Cybersecurity, AI, Software Development</p>
                  </div>
                </motion.div>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="flex items-start gap-3"
                >
                  <span className="text-emerald-400 mt-1">✓</span>
                  <div>
                    <p className="text-slate-300 font-mono text-sm">Passion</p>
                    <p className="text-slate-400 text-xs">Building Robust Systems</p>
                  </div>
                </motion.div>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="flex items-start gap-3"
                >
                  <span className="text-emerald-400 mt-1">✓</span>
                  <div>
                    <p className="text-slate-300 font-mono text-sm">Love</p>
                    <p className="text-slate-400 text-xs">Creating Projects, Securing Systems</p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-24 border-t border-slate-800">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: '-100px' }}
            className="text-3xl font-bold mb-8 flex items-center text-slate-100"
          >
            <span className="text-emerald-400 font-mono text-xl mr-3 section-num">02.</span> Skills &amp; Technologies
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-400 font-mono text-sm">
            {SKILLS.map((group, gi) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: gi * 0.1 }}
                viewport={{ once: true, margin: '-100px' }}
                whileHover={{
                  y: -6,
                  boxShadow: '0 0 30px rgba(52, 211, 153, 0.25)',
                  transition: { duration: 0.3 }
                }}
                className="p-6 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-emerald-400/60 transition-colors cursor-default neon-pulse"
              >
                <h4 className="text-emerald-400 mb-5 text-base font-sans font-bold tracking-wide">{group.category}</h4>
                <div className="space-y-4">
                  {group.items.map((skill, si) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: gi * 0.1 + si * 0.07 }}
                      viewport={{ once: true, margin: '-80px' }}
                    >
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300 text-xs font-mono">▹ {skill.name}</span>
                        <motion.span
                          className="text-emerald-400 text-xs font-mono"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: gi * 0.1 + si * 0.07 + 0.3 }}
                          viewport={{ once: true }}
                        >{skill.pct}%</motion.span>
                      </div>
                      <div className="h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background: 'linear-gradient(90deg, #34d399, #10b981)',
                            boxShadow: '0 0 8px rgba(52,211,153,0.6)',
                          }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.pct}%` }}
                          transition={{
                            duration: 1.2,
                            delay: gi * 0.1 + si * 0.1 + 0.2,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          viewport={{ once: true, margin: '-80px' }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-24 border-t border-slate-800">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl font-bold mb-12 flex items-center text-slate-100"
          >
            <span className="text-emerald-400 font-mono text-xl mr-3">03.</span> Some Things I've Built
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* NIDS Project */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{
                y: -10,
                boxShadow: "0 20px 40px rgba(52, 211, 153, 0.15)",
              }}
              className="bg-slate-800/50 p-8 rounded-lg border border-slate-700 hover:border-emerald-400/50 transition-all duration-300 group relative overflow-hidden"
            >
              {/* Animated background glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 via-emerald-400/0 to-emerald-400/0 group-hover:from-emerald-400/5 group-hover:via-emerald-400/5 group-hover:to-emerald-400/0"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />

              <div className="relative z-10">
                <motion.div
                  className="flex justify-between items-center mb-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.svg
                    className="w-10 h-10 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                  </motion.svg>
                  <motion.div
                    className="flex space-x-4"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <motion.a
                      href="#"
                      className="text-slate-400 hover:text-emerald-400 transition-colors"
                      whileHover={{ scale: 1.2 }}
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                    </motion.a>
                  </motion.div>
                </motion.div>
                <motion.h4
                  className="text-xl font-bold text-slate-100 mb-3 group-hover:text-emerald-400 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  Intelligent Network Intrusion Detection
                </motion.h4>
                <motion.p
                  className="text-slate-400 text-sm mb-6 line-clamp-4"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                >
                  A robust NIDS built to actively monitor network traffic and detect anomalous behavior. Developed using an agile methodology, this system analyzes packet data in real-time to identify potential security threats.
                </motion.p>
                <motion.ul
                  className="flex flex-wrap gap-3 font-mono text-xs text-emerald-400"
                  variants={{
                    hidden: { opacity: 1 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.05 }
                    }
                  }}
                  initial="hidden"
                  whileHover="visible"
                >
                  {['Python', 'Scapy', 'Flask', 'Agile'].map((tech, idx) => (
                    <motion.li
                      key={idx}
                      variants={{
                        hidden: { opacity: 0.6 },
                        visible: { opacity: 1 }
                      }}
                      className="bg-emerald-400/10 px-2 py-1 rounded"
                    >
                      {tech}
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </motion.div>

            {/* Process Sync Demo Project */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{
                y: -10,
                boxShadow: "0 20px 40px rgba(52, 211, 153, 0.15)",
              }}
              className="bg-slate-800/50 p-8 rounded-lg border border-slate-700 hover:border-emerald-400/50 transition-all duration-300 group relative overflow-hidden"
            >
              {/* Animated background glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 via-emerald-400/0 to-emerald-400/0 group-hover:from-emerald-400/5 group-hover:via-emerald-400/5 group-hover:to-emerald-400/0"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />

              <div className="relative z-10">
                <motion.div
                  className="flex justify-between items-center mb-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.svg
                    className="w-10 h-10 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                  </motion.svg>
                  <motion.div
                    className="flex space-x-4"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    <motion.a
                      href="#"
                      className="text-slate-400 hover:text-emerald-400 transition-colors"
                      whileHover={{ scale: 1.2 }}
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                    </motion.a>
                  </motion.div>
                </motion.div>
                <motion.h4
                  className="text-xl font-bold text-slate-100 mb-3 group-hover:text-emerald-400 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  Process Synchronization Demo
                </motion.h4>
                <motion.p
                  className="text-slate-400 text-sm mb-6 line-clamp-4"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                >
                  An interactive application designed to visualize complex operating system concepts like critical sections, mutex locks, and semaphores.
                </motion.p>
                <motion.ul
                  className="flex flex-wrap gap-3 font-mono text-xs text-emerald-400"
                  variants={{
                    hidden: { opacity: 1 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.05 }
                    }
                  }}
                  initial="hidden"
                  whileHover="visible"
                >
                  {['React', 'Tailwind', 'Vite'].map((tech, idx) => (
                    <motion.li
                      key={idx}
                      variants={{
                        hidden: { opacity: 0.6 },
                        visible: { opacity: 1 }
                      }}
                      className="bg-emerald-400/10 px-2 py-1 rounded"
                    >
                      {tech}
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </motion.div>

            {/* Performance Bottlenecks Project */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{
                y: -10,
                boxShadow: "0 20px 40px rgba(52, 211, 153, 0.15)",
              }}
              className="bg-slate-800/50 p-8 rounded-lg border border-slate-700 hover:border-emerald-400/50 transition-all duration-300 group relative overflow-hidden"
            >
              {/* Animated background glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 via-emerald-400/0 to-emerald-400/0 group-hover:from-emerald-400/5 group-hover:via-emerald-400/5 group-hover:to-emerald-400/0"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />

              <div className="relative z-10">
                <motion.div
                  className="flex justify-between items-center mb-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.svg
                    className="w-10 h-10 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </motion.svg>
                  <motion.div
                    className="flex space-x-4"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    <motion.a
                      href="#"
                      className="text-slate-400 hover:text-emerald-400 transition-colors"
                      whileHover={{ scale: 1.2 }}
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
                    </motion.a>
                  </motion.div>
                </motion.div>
                <motion.h4
                  className="text-xl font-bold text-slate-100 mb-3 group-hover:text-emerald-400 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  Performance Bottlenecks in Production
                </motion.h4>
                <motion.p
                  className="text-slate-400 text-sm mb-6 line-clamp-4"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                >
                  An educational presentation detailing strategies for identifying and handling performance bottlenecks in large-scale production systems.
                </motion.p>
                <motion.ul
                  className="flex flex-wrap gap-3 font-mono text-xs text-emerald-400"
                  variants={{
                    hidden: { opacity: 1 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.05 }
                    }
                  }}
                  initial="hidden"
                  whileHover="visible"
                >
                  {['System Architecture', 'Research', 'Optimization'].map((tech, idx) => (
                    <motion.li
                      key={idx}
                      variants={{
                        hidden: { opacity: 0.6 },
                        visible: { opacity: 1 }
                      }}
                      className="bg-emerald-400/10 px-2 py-1 rounded"
                    >
                      {tech}
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 border-t border-slate-800 text-center max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-emerald-400 font-mono mb-4"
          >
            04. What's Next?
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-4xl md:text-5xl font-bold text-slate-100 mb-6 relative inline-block"
          >
            Get In Touch
            {/* Animated underline */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true, margin: "-100px" }}
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400"
            />
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-slate-400 text-lg mb-10 leading-relaxed"
          >
            I'm actively expanding my technical skills and building new projects. Whether you have a question, a potential opportunity, or just want to connect, my inbox is open!
          </motion.p>

          {/* Say Hello Button with Enhanced Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.a
              whileHover={{
                scale: 1.08,
                boxShadow: "0 0 30px rgba(52, 211, 153, 0.6), inset 0 0 20px rgba(52, 211, 153, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              href="mailto:pranavnadakkal1@gmail.com"
              aria-label="Send email"
              rel="noopener"
              className="inline-block bg-transparent border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400/10 px-10 py-4 rounded font-mono transition-all relative overflow-hidden group"
            >
              {/* Background animation on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 opacity-0 group-hover:opacity-100"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />
              <span className="relative z-10">Say Hello</span>
            </motion.a>
          </motion.div>

          {/* Social Links with Enhanced Animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex justify-center space-x-12 mt-20"
          >
            {/* GitHub Link */}
            <motion.div
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <motion.a
                href="https://github.com/pranavnadakkal"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="relative group inline-block"
              >
                <motion.div
                  className="text-slate-400 group-hover:text-emerald-400 font-mono transition-colors text-lg font-bold"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  GitHub
                </motion.div>

                {/* Animated border on hover */}
                <motion.div
                  className="absolute -inset-2 border border-emerald-400/0 group-hover:border-emerald-400/50 rounded-lg"
                  transition={{ duration: 0.3 }}
                />

                {/* Bottom line animation */}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-300"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            </motion.div>

            {/* Divider */}
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-emerald-400/50"
            >
              •
            </motion.div>

            {/* LinkedIn Link */}
            <motion.div
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <motion.a
                href="https://linkedin.com/in/pranavnadakkal"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="relative group inline-block"
              >
                <motion.div
                  className="text-slate-400 group-hover:text-emerald-400 font-mono transition-colors text-lg font-bold"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                >
                  LinkedIn
                </motion.div>

                {/* Animated border on hover */}
                <motion.div
                  className="absolute -inset-2 border border-emerald-400/0 group-hover:border-emerald-400/50 rounded-lg"
                  transition={{ duration: 0.3 }}
                />

                {/* Bottom line animation */}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-300"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Animated Footer Message */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mt-20 text-slate-500 font-mono text-sm"
          >
            <motion.p
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ✨ Let's build something amazing together ✨
            </motion.p>
          </motion.div>
        </section>

        {/* Footer Section */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="border-t border-slate-800 py-12 mt-16"
        >
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-slate-400 font-mono text-sm">
              <motion.span
                whileHover={{ color: '#34d399' }}
                transition={{ duration: 0.3 }}
                className="cursor-default"
              >
                © {new Date().getFullYear()} Pranav Nadakkal.
              </motion.span>
              <span className="hidden md:inline text-slate-600">•</span>
              <motion.span
                whileHover={{ color: '#34d399' }}
                transition={{ duration: 0.3 }}
                className="cursor-default"
              >
                Designed & Built with
              </motion.span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
                className="inline-block mx-1"
              >
                ❤️
              </motion.span>
              <motion.span
                whileHover={{ color: '#34d399' }}
                transition={{ duration: 0.3 }}
                className="cursor-default"
              >
                by Prompt Engineering by Pranav Nadakkal
              </motion.span>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-slate-500 font-mono text-xs mt-6"
            >
              Built with React, Vite, Tailwind CSS & Framer Motion
            </motion.p>

            {/* Security Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mt-8 pt-8 border-t border-slate-800"
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-400/5 border border-emerald-400/30 hover:border-emerald-400/60 transition-all"
                whileHover={{
                  boxShadow: "0 0 20px rgba(52, 211, 153, 0.2)",
                }}
              >
                <motion.svg
                  className="w-4 h-4 text-emerald-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </motion.svg>
                <span className="text-emerald-400 font-mono text-xs font-semibold">
                  🔒 Secured by Pranav Nadakkal
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-slate-600 font-mono text-xs mt-3 max-w-xs"
              >
                This website implements enterprise-level security practices and is continuously monitored for vulnerabilities.
              </motion.p>
            </motion.div>
          </div>
        </motion.footer>

      </main>
    </div>
  )
}