'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const navLinks = [
  { label: 'Home', href: '/' }, 
  { label: 'Documentation', href: '/documentation' },
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Help', href: '/help' }
];

const communityFeatures = [
  {
    icon: '💬',
    title: 'Discussion Forum',
    desc: 'Join conversations with developers worldwide',
    gradient: 'from-[#6399c1]/20 to-[#366caa]/10'
  },
  {
    icon: '🎉',
    title: 'Events Hub',
    desc: 'Live webinars, hackathons & workshops',
    gradient: 'from-[#366caa]/20 to-[#b8bdc2]/10'
  },
  {
    icon: '🏆',
    title: 'Showcase',
    desc: 'Featured projects from our community',
    gradient: 'from-[#b8bdc2]/20 to-[#6399c1]/10'
  },
  {
    icon: '🧑💻',
    title: 'Collaborate',
    desc: 'Find contributors for your projects',
    gradient: 'from-[#2e4b71]/20 to-[#6399c1]/10'
  },
  {
    icon: '📚',
    title: 'Learning Hub',
    desc: 'Community-driven tutorials & guides',
    gradient: 'from-[#6399c1]/20 to-[#366caa]/10'
  },
  {
    icon: '🛠️',
    title: 'Open Source',
    desc: 'Contribute to community projects',
    gradient: 'from-[#366caa]/20 to-[#b8bdc2]/10'
  }
];

// Precomputed particle positions to avoid hydration errors
const fixedParticles = [
  { left: 12, x: -30, duration: 3.2, delay: 0.1 },
  { left: 22, x: 10, duration: 4.1, delay: 0.5 },
  { left: 35, x: -20, duration: 2.7, delay: 1.2 },
  { left: 45, x: 5, duration: 3.8, delay: 0.7 },
  { left: 58, x: -15, duration: 2.9, delay: 1.8 },
  { left: 68, x: 20, duration: 3.4, delay: 0.3 },
  { left: 77, x: -25, duration: 4.2, delay: 1.1 },
  { left: 88, x: 12, duration: 3.1, delay: 0.6 },
  { left: 95, x: -18, duration: 2.6, delay: 1.4 },
  { left: 8, x: 22, duration: 3.7, delay: 0.9 },
  { left: 16, x: -17, duration: 4.0, delay: 1.3 },
  { left: 27, x: 18, duration: 3.3, delay: 0.2 },
  { left: 39, x: -10, duration: 2.8, delay: 1.7 },
  { left: 51, x: 15, duration: 3.9, delay: 0.4 },
  { left: 63, x: -22, duration: 2.5, delay: 1.0 },
  { left: 74, x: 25, duration: 3.6, delay: 0.8 },
  { left: 82, x: -12, duration: 4.3, delay: 1.6 },
  { left: 91, x: 8, duration: 2.7, delay: 0.5 },
  { left: 5, x: -8, duration: 3.2, delay: 1.1 },
  { left: 19, x: 13, duration: 4.1, delay: 0.7 },
  { left: 31, x: -19, duration: 3.8, delay: 1.5 },
  { left: 43, x: 21, duration: 2.9, delay: 0.3 },
  { left: 55, x: -16, duration: 3.5, delay: 1.2 },
  { left: 66, x: 17, duration: 2.8, delay: 0.6 },
  { left: 79, x: -21, duration: 4.0, delay: 1.4 },
  { left: 85, x: 19, duration: 3.3, delay: 0.9 },
  { left: 92, x: -7, duration: 2.6, delay: 1.8 },
  { left: 14, x: 11, duration: 3.1, delay: 0.4 },
  { left: 25, x: -11, duration: 4.2, delay: 1.0 },
  { left: 36, x: 23, duration: 3.7, delay: 0.2 }
];

export default function CommunityPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [floatingDots, setFloatingDots] = useState<Array<{ left: number; top: number }>>([]);

  // Initialize floating dots positions client-side
  useEffect(() => {
    setIsMounted(true);
    const dots = Array.from({ length: 5 }, () => ({
      left: Math.random() * 80,
      top: Math.random() * 70
    }));
    setFloatingDots(dots);
  }, []);

  // Typing effect for navbar
  const suffixes = ['Visualizer', 'Comparer', 'Analyser'];
  const [currentSuffix, setCurrentSuffix] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const intervalTimeout = useRef<NodeJS.Timeout | null>(null);

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
    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      if (intervalTimeout.current) clearTimeout(intervalTimeout.current);
    };
  }, [displayed, typing, currentSuffix]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#fdfefe] via-[#b8bdc2] to-[#6399c1]/10 text-[#2e4b71] relative overflow-hidden">
      {/* Fixed Particle Background */}
      {isMounted && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          {fixedParticles.map((particle, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -100 }}
              animate={{
                opacity: [0, 0.3, 0],
                y: [0, typeof window !== 'undefined' ? window.innerHeight : 800],
                x: particle.x
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay
              }}
              className="absolute w-1 h-1 bg-[#6399c1] rounded-full"
              style={{ left: `${particle.left}%` }}
            />
          ))}
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
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
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
          Community Hub
        </motion.h1>

        {/* Community Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {communityFeatures.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="relative bg-[#fdfefe]/80 backdrop-blur-xl border border-[#6399c1]/20 rounded-2xl p-6 hover:border-[#6399c1]/40 transition-all overflow-hidden"
              style={{
                background: `
                  radial-gradient(100% 100% at 100% 0%, 
                    rgba(99,153,193,0.08) 0%, 
                    rgba(184,189,194,0.12) 100%
                  )`
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
              <span className="text-4xl mb-4 block">{feature.icon}</span>
              <h3 className="text-xl font-bold text-[#6399c1] mb-2">{feature.title}</h3>
              <p className="text-[#2e4b71] text-sm">{feature.desc}</p>
              <ChevronRightIcon className="w-5 h-5 text-[#6399c1] absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        {/* Live Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-[#fdfefe]/80 backdrop-blur-xl border border-[#6399c1]/20 rounded-2xl p-8 mb-16"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-[#6399c1] mb-4">Real-time Activity</h2>
              <p className="text-[#2e4b71] mb-6">
                Join 9,200+ developers collaborating, sharing, and learning together
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#366caa] to-[#6399c1] text-white px-8 py-3 rounded-lg font-semibold shadow-lg"
              >
                Join Community
              </motion.button>
            </div>
            <div className="flex-1 w-full">
              <div className="relative h-64 bg-[#b8bdc2]/30 rounded-xl overflow-hidden">
                {floatingDots.map((dot, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="absolute w-8 h-8 bg-gradient-to-r from-[#6399c1] to-[#366caa] rounded-full"
                    style={{
                      left: `${dot.left}%`,
                      top: `${dot.top}%`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Subtle Noise Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-10 mix-blend-overlay">
        <div className="absolute inset-0 bg-[url('/noise.png')]" />
      </div>
    </div>
  );
}
