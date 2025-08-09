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

const performanceMetrics = [
  {
    icon: '⚡',
    title: 'Response Time',
    value: '120ms',
    desc: 'Average API response time',
    gradient: 'from-[#366caa]/20 to-[#6399c1]/10'
  },
  {
    icon: '🚀',
    title: 'Uptime',
    value: '99.99%',
    desc: 'Monthly availability guarantee',
    gradient: 'from-[#6399c1]/20 to-[#b8bdc2]/10'
  },
  {
    icon: '📈',
    title: 'Throughput',
    value: '1M+ RPM',
    desc: 'Requests per minute capacity',
    gradient: 'from-[#b8bdc2]/20 to-[#366caa]/10'
  },
  {
    icon: '🛠️',
    title: 'Scalability',
    value: 'Auto-scale',
    desc: 'Instant horizontal scaling',
    gradient: 'from-[#2e4b71]/20 to-[#6399c1]/10'
  }
];

const tips = [
  {
    icon: '📦',
    text: 'Batch requests to optimize throughput'
  },
  {
    icon: '🗃️',
    text: 'Enable caching for frequent queries'
  },
  {
    icon: '📊',
    text: 'Monitor metrics in real-time dashboard'
  },
  {
    icon: '🔄',
    text: 'Implement exponential backoff retries'
  }
];

const fixedParticles = [
  { left: 12, x: -30, duration: 3.2, delay: 0.1 },
  { left: 25, x: 15, duration: 4.1, delay: 0.5 },
  { left: 40, x: -20, duration: 2.7, delay: 1.2 },
  { left: 55, x: 10, duration: 3.8, delay: 0.7 },
  { left: 70, x: -15, duration: 2.9, delay: 1.8 },
  { left: 85, x: 20, duration: 3.4, delay: 0.3 }
];

export default function PerformancePage() {
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
        {/* Back Button */}
        <motion.button
          onClick={() => router.back()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mb-8 flex items-center gap-2 text-[#6399c1] hover:text-[#366caa] font-semibold transition"
        >
          <ChevronRightIcon className="w-5 h-5 rotate-180" />
          Go Back
        </motion.button>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold bg-gradient-to-r from-[#366caa] to-[#6399c1] bg-clip-text text-transparent mb-16 text-center"
        >
          System Performance
        </motion.h1>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {performanceMetrics.map((metric, idx) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative bg-[#fdfefe]/80 backdrop-blur-xl border border-[#6399c1]/20 rounded-2xl p-6 hover:border-[#6399c1]/40 transition-all"
              style={{
                background: `
                  radial-gradient(100% 100% at 100% 0%, 
                    rgba(99,153,193,0.08) 0%, 
                    rgba(184,189,194,0.12) 100%
                  )`
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
              <span className="text-4xl mb-4 block">{metric.icon}</span>
              <h3 className="text-xl font-bold text-[#6399c1] mb-2">{metric.title}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#366caa]">{metric.value}</span>
                <p className="text-[#2e4b71] text-sm">{metric.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Performance Tips */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-[#fdfefe]/80 backdrop-blur-xl border border-[#6399c1]/20 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-[#6399c1] mb-12 flex items-center gap-2">
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl"
            >
              💡
            </motion.span>
            Optimization Tips
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tips.map((tip, idx) => (
              <motion.div
                key={tip.text}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-3 bg-[#b8bdc2]/30 p-4 rounded-lg"
              >
                <span className="text-2xl">{tip.icon}</span>
                <span className="text-[#2e4b71]">{tip.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Status Indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-12 bg-[#fdfefe]/80 backdrop-blur-xl border border-[#6399c1]/20 rounded-2xl p-8"
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-3 h-3 bg-[#366caa] rounded-full"
            />
            <span className="text-[#2e4b71]">All systems operational</span>
            <motion.div
              className="flex-1 h-2 bg-[#b8bdc2]/30 rounded-full overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5 }}
            >
              <div className="h-full bg-gradient-to-r from-[#6399c1] to-[#366caa] w-full" />
            </motion.div>
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
