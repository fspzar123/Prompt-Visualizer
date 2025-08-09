'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const navLinks = [
  { label: 'Home', href: '/' },    
  { label: 'Documentation', href: '/documentation' },
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Help', href: '/help' }
];

const steps = [
  {
    icon: '📝',
    title: 'Create Account',
    desc: 'Sign up with your email and set a strong password to begin your journey.',
    gradient: 'from-[#366caa]/20 to-[#6399c1]/10'
  },
  {
    icon: '🔑',
    title: 'Verify Email',
    desc: 'Check your inbox and click the verification link to activate your account.',
    gradient: 'from-[#6399c1]/20 to-[#b8bdc2]/10'
  },
  {
    icon: '⚙️',
    title: 'Set Up Profile',
    desc: 'Add your profile details and preferences for a personalized experience.',
    gradient: 'from-[#b8bdc2]/20 to-[#366caa]/10'
  },
  {
    icon: '🔌',
    title: 'Connect Integrations',
    desc: 'Link your favorite tools and services for seamless workflow.',
    gradient: 'from-[#2e4b71]/20 to-[#6399c1]/10'
  },
  {
    icon: '🚀',
    title: 'Start Exploring',
    desc: 'Explore features, create content, and get productive instantly!',
    gradient: 'from-[#6399c1]/20 to-[#b8bdc2]/10'
  }
];

const tips = [
  {
    tip: "Explore the dashboard for quick access to all features.",
    icon: "📊"
  },
  {
    tip: "Use keyboard shortcuts to speed up your workflow.",
    icon: "⌨️"
  },
  {
    tip: "Check the documentation for detailed guides and API references.",
    icon: "📚"
  },
  {
    tip: "Join the community forum for support and tips.",
    icon: "🤝"
  }
];

export default function GettingStartedPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Typing effect for navbar
  const suffixes = ['Visualizer', 'Comparer', 'Analyser'];
  const [currentSuffix, setCurrentSuffix] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const intervalTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      if (intervalTimeout.current) clearTimeout(intervalTimeout.current);
    };
  }, []);

  useEffect(() => {
    const current = suffixes[currentSuffix];
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
  }, [displayed, typing, currentSuffix]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#fdfefe] via-[#b8bdc2] to-[#6399c1]/10 text-[#2e4b71] relative overflow-hidden">
      {/* Particle Background */}
      {isMounted && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          {[...Array(30)].map((_, i) => {
            const left = Math.random() * 100;
            const x = Math.random() * 100 - 50;
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 5;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: -100 }}
                animate={{
                  opacity: [0, 0.3, 0],
                  y: [0, window.innerHeight],
                  x: x
                }}
                transition={{ duration, repeat: Infinity, delay }}
                className="absolute w-1 h-1 bg-[#6399c1] rounded-full"
                style={{ left: `${left}%` }}
              />
            );
          })}
        </div>
      )}

      {/* Navigation Bar */}
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
              >
                <span className="relative z-10">{item.label}</span>
              </Link>
            </motion.div>
          ))}
        </nav>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-[#6399c1] hover:text-[#366caa] font-semibold transition"
        >
          <ChevronRightIcon className="w-5 h-5 rotate-180" />
          Go Back
        </button>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold bg-gradient-to-r from-[#366caa] to-[#6399c1] bg-clip-text text-transparent mb-16 text-center"
        >
          Getting Started
        </motion.h1>

        {/* Horizontal Stepper */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full overflow-x-auto py-8"
        >
          <div className="flex items-stretch gap-8 min-w-[700px]">
            {steps.map((step, idx) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.07 }}
                className={`group relative bg-[#fdfefe]/80 border border-[#6399c1]/20 rounded-xl p-6 min-w-[230px] flex-shrink-0 flex flex-col items-center justify-between hover:border-[#6399c1]/40 transition-all duration-300 overflow-hidden`}
                style={{
                  background: `radial-gradient(100% 100% at 100% 0%, rgba(99,153,193,0.08) 0%, rgba(184,189,194,0.12) 100%)`
                }}
              >
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                <span className="text-4xl mb-4 block">{step.icon}</span>
                <h3 className="text-lg font-bold text-[#6399c1] mb-2 text-center">{step.title}</h3>
                <p className="text-[#2e4b71] text-sm text-center">{step.desc}</p>
                {idx < steps.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.2 + idx * 0.1, duration: 0.6, type: 'spring' }}
                    className="absolute right-[-24px] top-1/2 -translate-y-1/2 h-1 w-12 bg-gradient-to-r from-[#6399c1] to-[#366caa] rounded-full shadow"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Animated Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="bg-[#fdfefe]/80 backdrop-blur-xl border border-[#6399c1]/20 rounded-2xl p-8 mb-16"
        >
          <h2 className="text-2xl font-bold text-[#6399c1] mb-6 flex items-center gap-2">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl"
            >
              💡
            </motion.span>
            Quick Tips
          </h2>
          <ul className="grid sm:grid-cols-2 gap-4">
            {tips.map((tip, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx, duration: 0.5 }}
                className="flex items-center gap-3 bg-[#b8bdc2]/30 rounded-lg px-4 py-3 text-[#2e4b71]"
              >
                <span className="text-xl">{tip.icon}</span>
                <span>{tip.tip}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Subtle Noise Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-10 mix-blend-overlay">
        <div className="absolute inset-0 bg-[url('/noise.png')]" />
      </div>
    </div>
  );
}
