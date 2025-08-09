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

export default function AnnouncementsPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Typing effect setup (same as help page)
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
          Announcements
        </motion.h1>

        <div className="grid gap-8">
          <motion.article
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="group relative bg-[#fdfefe]/80 backdrop-blur-xl border border-[#6399c1]/20 rounded-2xl p-8 hover:border-[#6399c1]/40 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#6399c1]/10 to-[#b8bdc2]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            <div className="flex items-start gap-4">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl"
              >
                🚀
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-[#6399c1] mb-2">New AI Model Released</h2>
                <p className="text-[#366caa] mb-4">Introducing our most advanced AI model yet with 40% faster response times</p>
                <div className="flex items-center text-[#2e4b71]/70 text-sm">
                  <span className="mr-2">Posted:</span>
                  <time>June 13, 2025</time>
                  <ChevronRightIcon className="w-4 h-4 ml-2 text-[#6399c1]" />
                </div>
              </div>
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
            className="group relative bg-[#fdfefe]/80 backdrop-blur-xl border border-[#6399c1]/20 rounded-2xl p-8 hover:border-[#6399c1]/40 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#366caa]/10 to-[#6399c1]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            <div className="flex items-start gap-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-4xl"
              >
                🔧
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-[#6399c1] mb-2">System Maintenance</h2>
                <p className="text-[#366caa] mb-4">Scheduled maintenance on June 15th from 1:00 AM to 3:00 AM UTC</p>
                <div className="flex items-center text-[#2e4b71]/70 text-sm">
                  <span className="mr-2">Posted:</span>
                  <time>June 12, 2025</time>
                  <ChevronRightIcon className="w-4 h-4 ml-2 text-[#6399c1]" />
                </div>
              </div>
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", delay: 0.4 }}
            className="group relative bg-[#fdfefe]/80 backdrop-blur-xl border border-[#6399c1]/20 rounded-2xl p-8 hover:border-[#6399c1]/40 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#b8bdc2]/10 to-[#6399c1]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            <div className="flex items-start gap-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="text-4xl"
              >
                🌟
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-[#6399c1] mb-2">Community AMA Session</h2>
                <p className="text-[#366caa] mb-4">Join our live Q&A with the engineering team on June 20th</p>
                <div className="flex items-center text-[#2e4b71]/70 text-sm">
                  <span className="mr-2">Posted:</span>
                  <time>June 10, 2025</time>
                  <ChevronRightIcon className="w-4 h-4 ml-2 text-[#6399c1]" />
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </div>

      {/* Subtle Noise Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-10 mix-blend-overlay">
        <div className="absolute inset-0 bg-[url('/noise.png')]" />
      </div>
    </div>
  );
}
