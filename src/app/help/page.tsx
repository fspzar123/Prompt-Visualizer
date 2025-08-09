'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';
import { MagnifyingGlassIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface HelpTopic {
  icon: string;
  title: string;
  desc: string;
  gradient?: string;
  uniqueContent?: React.ReactNode;
  link: string;
}

interface FAQ {
  question: string;
  answer: string;
}

const helpTopics: HelpTopic[] = [
  {
    icon: '📢',
    title: 'Announcements',
    desc: 'Latest product updates and feature releases',
    gradient: 'from-[#366caa]/20 to-[#6399c1]/10',
    link: '/help/announcements',
    uniqueContent: (
      <motion.div
        animate={{ y: [-5, 5, -5], rotate: [0, 360] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-2 right-2 text-xl opacity-20"
      >
        🌟
      </motion.div>
    )
  },
  {
    icon: '🛠️',
    title: 'API Docs',
    desc: 'Complete integration guides and references',
    gradient: 'from-[#2e4b71]/20 to-[#366caa]/10',
    link: '/help/api-docs',
    uniqueContent: (
      <div className="absolute bottom-4 right-4 flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 0.5, 1], opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
            className="w-2 h-2 bg-[#6399c1] rounded-full"
          />
        ))}
      </div>
    )
  },
  {
    icon: '🔐',
    title: 'Security',
    desc: 'Security protocols and compliance information',
    gradient: 'from-[#6399c1]/20 to-[#b8bdc2]/10',
    link: '/help/security',
    uniqueContent: (
      <>
        <motion.div
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 border-2 border-[#6399c1]/30 rounded-xl pointer-events-none"
        />
        <motion.div
          animate={{ y: [-5, 5, -5], rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-2 right-2 text-xl opacity-20"
        >
          🛡️
        </motion.div>
      </>
    )
  },
  {
    icon: '💳',
    title: 'Billing',
    desc: 'Payment methods and invoice management',
    gradient: 'from-[#b8bdc2]/20 to-[#366caa]/10',
    link: '/help/billing',
    uniqueContent: (
      <motion.div
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6399c1] to-[#366caa] opacity-30 group-hover:opacity-60 transition-opacity"
      />
    )
  },
  {
    icon: '🚀',
    title: 'Getting Started',
    desc: 'Beginner-friendly setup guide',
    gradient: 'from-[#366caa]/20 to-[#6399c1]/10',
    link: '/help/getting-started',
    uniqueContent: (
      <motion.div
        animate={{ x: [-10, 10, -10], rotate: [-5, 5, -5] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-4 right-4 text-2xl opacity-20"
      >
        👆
      </motion.div>
    )
  },
  {
    icon: '🤖',
    title: 'AI Features',
    desc: 'Customize AI model behavior',
    gradient: 'from-[#2e4b71]/20 to-[#6399c1]/10',
    link: '/help/ai-features',
    uniqueContent: (
      <div className="absolute left-1/2 bottom-4 -translate-x-1/2 flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            className="w-2 h-2 bg-[#366caa] rounded-full"
          />
        ))}
      </div>
    )
  },
  {
    icon: '🌐',
    title: 'Community',
    desc: '24/7 support & discussion forums',
    gradient: 'from-[#6399c1]/20 to-[#b8bdc2]/10',
    link: '/help/community',
    uniqueContent: (
      <div className="absolute inset-0 flex items-end justify-center pb-4">
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
              className="w-2 h-2 bg-[#6399c1] rounded-full"
            />
          ))}
        </div>
      </div>
    )
  },
  {
    icon: '⚡',
    title: 'Performance',
    desc: 'System optimization guides',
    gradient: 'from-[#366caa]/20 to-[#b8bdc2]/10',
    link: '/help/performance',
    uniqueContent: (
      <div className="absolute left-0 right-0 bottom-0 h-2 flex items-center">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '80%' }}
          transition={{ repeat: Infinity, duration: 2.5, repeatType: 'reverse', ease: 'easeInOut' }}
          className="h-2 bg-gradient-to-r from-[#366caa] to-[#6399c1] rounded-full"
        />
      </div>
    )
  }
];

const faqs: FAQ[] = [
  {
    question: 'How do I reset my password?',
    answer: "Visit the login page and click 'Forgot Password'. You'll receive reset instructions via email within 2 minutes."
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, UPI payments, and net banking. All transactions are GST-compliant.'
  },
  {
    question: 'How to integrate with our API?',
    answer: 'Check our Documentation section for detailed API guides and code samples in 5+ programming languages.'
  },
  {
    question: 'What security measures are in place?',
    answer: 'We use AES-256 encryption, regular security audits, and 2FA for all sensitive operations.'
  },
  {
    question: 'Can I change my subscription plan?',
    answer: 'Yes! You can upgrade/downgrade anytime. Changes take effect at your next billing cycle.'
  },
  {
    question: 'How do I contact support?',
    answer: 'Use the chat icon in the bottom-right corner for 24/7 live support.'
  },
  {
    question: 'What are API rate limits?',
    answer: 'Free tier: 100 req/min. Pro tier: 1,000 req/min. Enterprise: Custom limits.'
  },
  {
    question: 'Is my data exported regularly?',
    answer: 'We perform daily encrypted backups to multiple secure locations.'
  }
];

const navLinks = [
  { label: 'Home', href: '/' }, 
  { label: 'Documentation', href: '/documentation' },
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Help', href: '/help' }
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTopics, setFilteredTopics] = useState(helpTopics);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
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
    const fuse = new Fuse(helpTopics, { keys: ['title', 'desc'], threshold: 0.3 });
    if (searchQuery.length > 0) {
      setFilteredTopics(fuse.search(searchQuery).map(({ item }) => item));
    } else {
      setFilteredTopics(helpTopics);
    }
  }, [searchQuery]);

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
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#366caa] to-[#6399c1] bg-clip-text text-transparent mb-6">
            Help Center
          </h1>
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search knowledge base..."
              className="w-full px-6 py-4 rounded-xl bg-[#fdfefe]/60 border border-[#6399c1]/20 text-[#2e4b71] 
                focus:outline-none focus:ring-2 focus:ring-[#6399c1] backdrop-blur-xl transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <MagnifyingGlassIcon className="w-6 h-6 text-[#6399c1] absolute right-4 top-4" />
          </div>
        </motion.div>

        {/* Help Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
          {filteredTopics.map((topic, idx) => (
            <Link href={topic.link} key={topic.title} className="block group">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="relative bg-[#fdfefe]/80 backdrop-blur-xl border border-[#6399c1]/20 rounded-xl p-6 
                  hover:border-[#6399c1]/40 transition-all duration-300 overflow-hidden"
                style={{
                  background: `
                    radial-gradient(100% 100% at 100% 0%, 
                      rgba(99,153,193,0.08) 0%, 
                      rgba(184,189,194,0.12) 100%
                    )`
                }}
              >
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${topic.gradient} opacity-0 
                  group-hover:opacity-20 transition-opacity duration-500`} />
                <span className="text-4xl mb-4 block">{topic.icon}</span>
                <h3 className="text-xl font-bold text-[#366caa] mb-2">{topic.title}</h3>
                <p className="text-[#2e4b71] text-sm">{topic.desc}</p>
                <ChevronRightIcon className="w-5 h-5 text-[#6399c1] absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                {topic.uniqueContent}
              </motion.div>
            </Link>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="bg-[#fdfefe]/80 backdrop-blur-xl border border-[#6399c1]/20 rounded-xl p-8 mb-16"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#366caa] to-[#6399c1] bg-clip-text text-transparent mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={faq.question} className="border-b border-[#6399c1]/10 pb-6 last:border-0">
                <button
                  onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
                  className="w-full flex justify-between items-center text-left group"
                >
                  <motion.span
                    whileHover={{ x: 5 }}
                    className="text-lg font-medium text-[#2e4b71] group-hover:text-[#6399c1] transition-colors"
                  >
                    {faq.question}
                  </motion.span>
                  <motion.span
                    animate={{ rotate: activeFAQ === idx ? 90 : 0 }}
                    className="text-[#6399c1]"
                  >
                    <ChevronRightIcon className="w-5 h-5 transition-transform" />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {activeFAQ === idx && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-4 text-[#366caa]"
                    >
                      {faq.answer}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-[#fdfefe]/80 backdrop-blur-xl border border-[#6399c1]/20 rounded-2xl p-8"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#366caa] to-[#6399c1] bg-clip-text text-transparent mb-8">
            Contact Support
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="text-3xl">📧</span>
                <div>
                  <h3 className="text-xl font-semibold text-[#366caa] mb-2">Email Support</h3>
                  <a 
                    href="mailto:support@prompthub.com" 
                    className="text-[#2e4b71] hover:text-[#6399c1] transition-colors"
                  >
                    support@prompthub.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <span className="text-3xl">🕒</span>
                <div>
                  <h3 className="text-xl font-semibold text-[#366caa] mb-2">Support Hours</h3>
                  <p className="text-[#2e4b71]">
                    24/7 Priority Support<br/>
                    Average Response Time: 12 minutes
                  </p>
                </div>
              </div>
            </div>

            <motion.form 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div>
                <label className="block text-[#2e4b71] mb-2">Your Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-lg bg-[#b8bdc2]/30 border border-[#6399c1]/20 focus:outline-none focus:ring-2 focus:ring-[#6399c1]"
                />
              </div>
              <div>
                <label className="block text-[#2e4b71] mb-2">Your Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 rounded-lg bg-[#b8bdc2]/30 border border-[#6399c1]/20 focus:outline-none focus:ring-2 focus:ring-[#6399c1]"
                />
              </div>
              <div>
                <label className="block text-[#2e4b71] mb-2">Message</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-[#b8bdc2]/30 border border-[#6399c1]/20 focus:outline-none focus:ring-2 focus:ring-[#6399c1]"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-[#366caa] to-[#6399c1] text-white rounded-lg transition-all"
              >
                Send Message
              </motion.button>
            </motion.form>
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
