'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const navLinks = [
  { label: 'Home', href: '/' },   
  { label: 'Documentation', href: '/documentation' },
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Help', href: '/help' }
];

const aiFeatures = [
  {
    icon: '🧠',
    title: 'Natural Language Understanding',
    desc: 'Parse and comprehend text, extract intent, and analyze sentiment in real time.',
    details: 'Our NLU engine supports over 30 languages and can extract custom entities, intent, and emotion from any text input. Use it for chatbots, analytics, or content tagging.',
    gradient: 'from-[#366caa]/20 to-[#6399c1]/10'
  },
  {
    icon: '🎨',
    title: 'Content Generation',
    desc: 'Generate creative text, summaries, or code completions with a single API call.',
    details: 'Leverage our advanced generative models for marketing copy, blog posts, code suggestions, and more. Control tone, length, and style with simple parameters.',
    gradient: 'from-[#6399c1]/20 to-[#b8bdc2]/10'
  },
  {
    icon: '🛡️',
    title: 'Bias Filters',
    desc: 'Automatic moderation and bias detection for safer outputs.',
    details: 'AI-powered moderation flags toxic, biased, or unsafe outputs before they reach your users. Configure custom blocklists and sensitivity levels for your use case.',
    gradient: 'from-[#2e4b71]/20 to-[#366caa]/10'
  },
  {
    icon: '🗣️',
    title: 'Conversational Memory',
    desc: 'Maintain context and state across multi-turn conversations.',
    details: 'Enable persistent, context-aware chatbots and assistants. Our memory engine stores and summarizes conversation history for more natural, human-like interactions.',
    gradient: 'from-[#b8bdc2]/20 to-[#6399c1]/10'
  },
  {
    icon: '📈',
    title: 'Adaptive Learning',
    desc: 'Models improve over time based on your feedback and data.',
    details: 'Fine-tune models on your own data, provide feedback on outputs, and watch the AI adapt to your domain. Monitor improvements in the analytics dashboard.',
    gradient: 'from-[#366caa]/20 to-[#b8bdc2]/10'
  }
];

const faqs = [
  {
    question: 'Can I fine-tune the AI model?',
    answer: 'Yes, you can upload your own data and fine-tune models for your specific domain.'
  },
  {
    question: 'How do I enable safety filters?',
    answer: 'Safety filters are enabled by default, but you can customize their strictness in your dashboard.'
  },
  {
    question: 'Does the AI remember previous chats?',
    answer: 'With conversational memory enabled, the AI can maintain context across multiple turns.'
  },
  {
    question: 'How is bias detected?',
    answer: 'Our system uses a combination of rule-based and ML-driven approaches to flag and reduce bias.'
  },
  {
    question: 'Can I monitor model improvements?',
    answer: 'Yes, the analytics dashboard provides insights into model learning and performance trends.'
  }
];

export default function AIFeaturesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
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
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
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
          className="text-5xl font-bold bg-gradient-to-r from-[#366caa] to-[#6399c1] bg-clip-text text-transparent mb-12 text-center"
        >
          AI Features
        </motion.h1>

        {/* Tabbed Features Section */}
        <div className="flex flex-col md:flex-row gap-10 mb-16">
          <div className="flex md:flex-col gap-4 md:w-1/3 w-full justify-center">
            {aiFeatures.map((feature, idx) => (
              <motion.button
                key={feature.title}
                onClick={() => setActiveTab(idx)}
                whileHover={{ scale: 1.04 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors w-full
                  ${activeTab === idx
                    ? 'bg-gradient-to-r from-[#6399c1]/30 to-[#366caa]/10 text-[#6399c1] shadow-lg'
                    : 'bg-[#fdfefe]/60 text-[#2e4b71] hover:bg-[#b8bdc2]/40'}`}
              >
                <span className="text-2xl">{feature.icon}</span>
                <span>{feature.title}</span>
              </motion.button>
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={aiFeatures[activeTab].title}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35, type: 'spring' }}
                className="relative bg-[#fdfefe]/80 border border-[#6399c1]/20 rounded-2xl p-8 min-h-[260px] shadow-xl overflow-hidden"
                style={{
                  background: `radial-gradient(100% 100% at 100% 0%, rgba(99,153,193,0.08) 0%, rgba(184,189,194,0.12) 100%)`
                }}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${aiFeatures[activeTab].gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{aiFeatures[activeTab].icon}</span>
                  <h3 className="text-2xl font-bold text-[#6399c1]">{aiFeatures[activeTab].title}</h3>
                </div>
                <p className="text-[#366caa] text-lg mb-4">{aiFeatures[activeTab].desc}</p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-[#2e4b71] text-base"
                >
                  {aiFeatures[activeTab].details}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Animated FAQ Section */}
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
            AI Features FAQ
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={faq.question} className="border-b border-[#6399c1]/10 pb-4">
                <button
                  onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
                  className="w-full flex justify-between items-center text-left"
                >
                  <span className="text-[#2e4b71] font-semibold hover:text-[#6399c1] transition-colors">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: activeFAQ === idx ? 90 : 0 }}
                    className="text-[#6399c1]"
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {activeFAQ === idx && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-2 text-[#366caa]"
                    >
                      {faq.answer}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            ))}
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
