'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  // Typing animation for navbar suffix
  const suffixes = ['Visualizer', 'Comparer', 'Analyser'];
  const [currentSuffix, setCurrentSuffix] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const intervalTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      if (intervalTimeout.current) clearTimeout(intervalTimeout.current);
    };
  }, []);

  // Typing animation effect for suffix
  useEffect(() => {
    let current = suffixes[currentSuffix];
    if (typing) {
      if (displayed.length < current.length) {
        typingTimeout.current = setTimeout(() => {
          setDisplayed(current.slice(0, displayed.length + 1));
        }, 80);
      } else {
        intervalTimeout.current = setTimeout(() => setTyping(false), 1200);
      }
    } else {
      if (displayed.length > 0) {
        typingTimeout.current = setTimeout(() => {
          setDisplayed(current.slice(0, displayed.length - 1));
        }, 50);
      } else {
        setTyping(true);
        setCurrentSuffix((prev) => (prev + 1) % suffixes.length);
      }
    }
    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      if (intervalTimeout.current) clearTimeout(intervalTimeout.current);
    };
    // eslint-disable-next-line
  }, [displayed, typing, currentSuffix]);

  const features = [
    {
      icon: '⚡',
      title: 'Instant Comparison',
      description: 'Real-time responses from multiple AI models',
      gradient: 'from-[#366caa] to-[#6296c0]'
    },
    {
      icon: '🎯',
      title: 'Smart Analysis',
      description: 'AI-powered best answer detection',
      gradient: 'from-[#2e4b71] to-[#366caa]'
    },
    {
      icon: '🚀',
      title: 'Lightning Fast',
      description: 'Optimized for speed and performance',
      gradient: 'from-[#6296c0] to-[#b8bdc2]'
    },
    {
      icon: '🧠',
      title: 'Adaptive Memory',
      description: 'Context-aware memory system for coherent conversations',
      gradient: 'from-[#6399c1] to-[#2e4b71]'
    },
    {
      icon: '🌐',
      title: 'Multilingual Support',
      description: 'Interact in multiple languages fluently',
      gradient: 'from-[#b8bdc2] to-[#366caa]'
    },
    {
      icon: '🔒',
      title: 'Private & Secure',
      description: 'Your data is safe with end-to-end security protocols',
      gradient: 'from-[#2e4b71] to-[#153059]'
    }
  ];

  const steps = [
    { icon: "📝", title: "Enter Prompt", desc: "Type or paste your query." },
    { icon: "🔍", title: "Smart Search", desc: "Relevant info from your files." },
    { icon: "🤖", title: "AI Comparison", desc: "See responses from multiple models." },
    { icon: "🏆", title: "Best Answer", desc: "Get the most relevant result." }
  ];

  const navLinks = [
    { label: 'Documentation', href: '/documentation' },
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Help', href: '/help' }
  ];

  return (
    <div className="min-h-screen w-full bg-[#fdfefe] text-[#2e4b71] relative overflow-hidden">
      {/* Interactive Background Elements */}
      <motion.div 
        className="fixed pointer-events-none w-96 h-96 rounded-full opacity-20 transition-all duration-1000 ease-out"
        animate={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
        style={{
          background: 'radial-gradient(circle, rgba(99,153,193,0.18) 0%, transparent 70%)',
        }}
      />

      {/* Top Navigation */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="flex items-center justify-between px-12 py-7 bg-gradient-to-r from-[#2e4b71]/80 via-[#6399c1]/70 to-[#fdfefe]/10 border-b border-[#b8bdc2]/40 shadow-lg"
      >
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0.7, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#366caa] to-[#6399c1] flex items-center justify-center shadow-md"
          >
            <span className="text-2xl">🤖</span>
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7, type: "spring" }}
            className="text-2xl font-extrabold text-[#002744] tracking-tight drop-shadow-sm flex items-center"
          >
            Prompt{' '}
            <span className="inline-block min-w-[130px] ml-1 text-[#ffffff]"> 
              {displayed}
              <span className="animate-pulse">|</span>
            </span>
          </motion.span>
        </div>
        <nav className="flex gap-2 items-center mt-3">
          {navLinks.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.1, duration: 0.4 }}
              className="flex items-center h-full"
            >
              <Link
                href={item.href}
                className="relative px-5 py-1 font-semibold text-[#2e4b71] hover:text-[#6399c1] transition
                  after:content-[''] after:block after:h-[3px] after:bg-gradient-to-r after:from-[#2e4b71] after:to-[#6399c1] after:rounded-full after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left after:mt-1"
                style={{ transition: 'color 0.2s' }}
              >
                <span className="relative z-10">{item.label}</span>
              </Link>
            </motion.div>
          ))}
        </nav>
      </motion.header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-12 pt-24 pb-16 max-w-7xl mx-auto">
        {/* Left: Animated Headline and CTA */}
        <div className="flex-1 flex flex-col items-start">
          <motion.span
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
            className="uppercase tracking-widest text-[#6399c1] font-bold mb-4"
          >
            Best AI Prompting Experience
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, type: "spring" }}
            className="text-5xl md:text-6xl font-extrabold text-[#2e4b71] mb-3 leading-tight"
          >
            <span className="block">Visualize, compare,</span>
            <span className="block">and enjoy the power of <span className="bg-gradient-to-r from-[#366caa] via-[#6399c1] to-[#2e4b71] bg-clip-text text-transparent">AI</span></span>
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.6, type: "spring" }}
            className="w-28 h-1 bg-gradient-to-r from-[#366caa] to-[#6399c1] rounded-full mb-7 origin-left"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, type: "spring" }}
            className="text-xl text-[#366caa] mb-10 max-w-lg"
          >
            Prompt Visualizer brings your queries to life. Instantly compare responses from leading AI models, customize your prompts, and discover the best answers for your needs.
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <button
              onClick={() => router.push('/sign-in')}
              className="px-8 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-[#2e4b71] via-[#366caa] to-[#6399c1] text-white shadow-lg hover:scale-105 hover:shadow-[#6399c1]/30 transition"
            >
              Get Started
            </button>
          </motion.div>
        </div>
        {/* Right: Animated Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, x: 80 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
          className="flex-1 flex justify-center items-center mt-12 md:mt-0"
        >
          <div className="w-80 h-80 rounded-full bg-gradient-to-br from-[#6399c1]/20 via-[#2e4b71]/10 to-[#fdfefe]/30 flex items-center justify-center shadow-2xl relative">
            <motion.span
              initial={{ scale: 0.7, rotate: 10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.7, duration: 0.7, type: "spring" }}
              className="text-[7rem]"
            >
              📝
            </motion.span>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.7, scale: 1 }}
              transition={{ delay: 1, duration: 0.7 }}
              className="absolute top-10 left-10 w-10 h-10 bg-gradient-to-br from-[#6399c1]/50 to-[#2e4b71]/10 rounded-full blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.7, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.7 }}
              className="absolute bottom-10 right-10 w-14 h-14 bg-gradient-to-br from-[#366caa]/40 to-[#6399c1]/10 rounded-full blur-2xl"
            />
          </div>
        </motion.div>
      </section>
      {/* Feature Cards */}
      <motion.div
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={{
          visible: { transition: { staggerChildren: 0.13 } }
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto mb-24"
      >
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ type: "spring", duration: 0.7 }}
            className={`
              group relative p-8 rounded-3xl bg-[#fdfefe]/80 backdrop-blur-xl border border-[#b8bdc2]/50
              hover:border-[#2e4b71]/70 hover:shadow-2xl hover:-translate-y-4 transition-all duration-500
              ${idx >= 3 ? 'md:mt-12' : ''}
            `}
            style={{
              boxShadow: idx % 2 === 1
                ? '0 8px 32px 0 rgba(44,77,113,0.12)'
                : '0 4px 16px 0 rgba(44,77,113,0.06)'
            }}
          >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <span className="text-3xl">{feature.icon}</span>
            </div>
            <h3 className="text-2xl font-bold text-[#2e4b71] mb-4">{feature.title}</h3>
            <p className="text-[#366caa] leading-relaxed">{feature.description}</p>
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#6399c1]/10 to-[#2e4b71]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </motion.div>
        ))}
      </motion.div>

      {/* Section Divider */}
      <div className="w-full flex justify-center mb-20">
        <div className="w-32 h-2 rounded-full bg-gradient-to-r from-[#366caa] via-[#2e4b71] to-[#6399c1] opacity-60"></div>
      </div>

      {/* How It Works Stepper */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.2, duration: 0.7, type: "spring" }}
        className="max-w-4xl mx-auto mb-24 px-4"
      >
        <h2 className="text-3xl font-bold text-[#2e4b71] mb-10 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.3 + idx * 0.1, duration: 0.6, type: "spring" }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#366caa] to-[#6399c1] flex items-center justify-center text-3xl mb-4 shadow-lg">{step.icon}</div>
              <h4 className="text-xl font-semibold text-[#2e4b71] mb-2">{step.title}</h4>
              <p className="text-[#366caa] text-center">{step.desc}</p>
              {idx < steps.length - 1 && (
                <div className="hidden md:block h-1 w-20 bg-gradient-to-r from-[#366caa] to-[#6399c1] my-4 rounded-full"></div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Testimonial Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.7, duration: 0.7, type: "spring" }}
        className="max-w-2xl mx-auto mb-32 px-4"
      >
        <h2 className="text-4xl font-bold text-[#2e4b71] mb-10 text-center">Testimonials</h2>
        <div className="bg-[#fdfefe]/60 border border-[#2e4b71]/10 rounded-2xl p-8 shadow-xl flex flex-col items-center">
          <div className="text-4xl mb-4">“</div>
          <p className="text-lg text-[#366caa] mb-6 text-center italic">
            Prompt Comparer is a game changer! I can finally compare LLMs and get the most relevant answer, all with a beautiful and intuitive UI.
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#366caa] to-[#6399c1] flex items-center justify-center text-white">A</div>
            <span className="text-[#2e4b71] font-semibold">Alex, Product Designer</span>
          </div>
        </div>
      </motion.div>

      {/* Persistent Scroll Indicator (always visible) */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-50">
        <div className="w-6 h-10 border-2 border-[#6399c1]/60 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-[#6399c1] rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      {/* Ambient Background Effects */}
            {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#6399c1]/10 via-transparent to-[#2e4b71]/10"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#2e4b71]/10 to-[#366caa]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-[#6399c1]/10 to-[#2e4b71]/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Temenos-style Footer */}
      <footer className="w-full py-6 bg-[#2E4B71] border-t border-[#b8bdc2]/30 flex justify-center items-center">
        <span className="text-[#FDFEFE] text-base font-medium">
          © 2025 Prompt Visualizer. All rights reserved.
        </span>
      </footer>
    </div>

  );
}
