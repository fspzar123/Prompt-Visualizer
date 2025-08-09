'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Documentation', href: '/documentation' },
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Help', href: '/help' }
];

const plans = [
  {
    name: 'Free',
    price: '₹0',
    features: [
      'Unlimited prompt comparisons',
      'Access to 2 AI models',
      'Basic analytics',
    ],
    icon: '🆓',
    accent: 'from-[#b8bdc2]/80 via-[#6399c1]/60 to-[#2e4b71]/80'
  },
  {
    name: 'Pro',
    price: '₹1,499 / month',
    features: [
      'All Free features',
      'Access to all models',
      'Advanced analytics',
      'Priority support',
    ],
    icon: '🚀',
    accent: 'from-[#366caa] via-[#6399c1] to-[#2e4b71]'
  },
  {
    name: 'Enterprise',
    price: '₹2,499 / month',
    features: [
      'All Pro features',
      'Custom integrations',
      'Dedicated support',
      'Team management',
    ],
    icon: '🏢',
    accent: 'from-[#2e4b71] via-[#366caa] to-[#6399c1]'
  },
];

const fixedParticles = [
  { left: 12, x: -30, duration: 3.2, delay: 0.1 },
  { left: 22, x: 10, duration: 4.1, delay: 0.5 },
  { left: 35, x: -20, duration: 2.7, delay: 1.2 },
  { left: 45, x: 5, duration: 3.8, delay: 0.7 },
  { left: 58, x: -15, duration: 2.9, delay: 1.8 },
  { left: 68, x: 20, duration: 3.4, delay: 0.3 }
];

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState('Pro');
  const [isMounted, setIsMounted] = useState(false);
  const [currentSuffix, setCurrentSuffix] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const intervalTimeout = useRef<NodeJS.Timeout | null>(null);
  const suffixes = ['Visualizer', 'Comparer', 'Analyser'];

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

  const topSubline = "Whether you're a curious explorer, an AI enthusiast, or a power user comparing outputs from DeepSeek, Gemini, or Mistral — we have the perfect plan for you. Explore smarter, compare faster, and upgrade only when you need more. Choose the plan that fits your workflow and include instant access to Prompt Comparer’s best features.";
  const topWords = topSubline.split(" ");
  const belowCardsSubline = "No hidden fees. Upgrade, downgrade, or cancel anytime. All plans include 24/7 support and instant activation.";
  const tableRows = [
    { label: 'Unlimited comparisons', keys: [true, true, true] },
    { label: 'All AI models', keys: [false, true, true] },
    { label: 'Advanced analytics', keys: [false, true, true] },
    { label: 'Priority support', keys: [false, true, true] },
    { label: 'Custom integrations', keys: [false, false, true] },
    { label: 'Team management', keys: [false, false, true] },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#fdfefe] via-[#b8bdc2] to-[#6399c1]/10 text-[#2e4b71] relative overflow-hidden">
      {/* Particle Background */}
      {isMounted && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          {fixedParticles.map((particle, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -100 }}
              animate={{
                opacity: [0, 0.3, 0],
                y: [0, window.innerHeight],
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12 overflow-x-hidden">
        {/* Floating Accent Backgrounds */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#6399c1]/20 to-[#b8bdc2]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-gradient-to-br from-[#366caa]/10 to-[#2e4b71]/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        {/* Animated Top Section */}
        <div className="relative text-center mb-16 pt-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -30 }}
            animate={{ opacity: 0.18, scale: 1, y: 0 }}
            transition={{ duration: 1.2, type: 'spring' }}
            className="absolute left-1/2 top-0 -translate-x-1/2 z-0 pointer-events-none"
          >
            <span className="text-[8rem] md:text-[10rem] text-[#6399c1]/60 select-none">₹</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: 'spring' }}
            className="relative text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#366caa] via-[#6399c1] to-[#2e4b71] bg-clip-text text-transparent drop-shadow-lg z-10"
            style={{
              backgroundSize: '200% 200%',
              animation: 'gradientMove 4s ease-in-out infinite'
            }}
          >
            Pricing
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.7, type: 'spring' }}
              className="absolute left-1/2 -bottom-4 -translate-x-1/2 w-36 h-2 rounded-full bg-gradient-to-r from-[#366caa] via-[#6399c1] to-[#2e4b71] z-0"
              style={{ originX: 0.5 }}
            />
          </motion.h1>
          <div className="relative z-10 mt-8 flex justify-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.04 } }
              }}
              className="text-xl md:text-2xl text-[#366caa] font-light max-w-2xl mx-auto flex flex-wrap gap-x-1"
            >
              <AnimatePresence>
                {topWords.map((word, i) => (
                  <motion.span
                    key={word + i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.04, duration: 0.4, type: 'spring' }}
                    exit={{ opacity: 0 }}
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
          <style>
            {`
              @keyframes gradientMove {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
            `}
          </style>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {plans.map((plan, i) => {
            const isSelected = selectedPlan === plan.name;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 60, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.7, type: 'spring' }}
                whileHover={{
                  scale: 1.045,
                  boxShadow: "0 12px 40px 0 rgba(99,153,193,0.18)",
                  rotate: isSelected ? 0.5 : 0,
                }}
                className={`relative rounded-3xl p-8 shadow-2xl border-2 group transition-all duration-500
                  ${isSelected
                    ? 'border-[#6399c1] bg-gradient-to-br from-[#6399c1]/20 via-[#366caa]/10 to-[#b8bdc2]/10'
                    : 'border-[#b8bdc2] bg-gradient-to-br from-[#fdfefe]/90 via-[#b8bdc2]/80 to-[#6399c1]/30'}
                  flex flex-col items-center overflow-hidden cursor-pointer`}
                onClick={() => setSelectedPlan(plan.name)}
              >
                {plan.name === 'Pro' && (
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5, type: 'spring' }}
                    className={`absolute top-0 right-0 bg-gradient-to-r from-[#366caa] to-[#6399c1] text-white px-4 py-1 rounded-bl-2xl font-semibold text-sm shadow-lg
                      ${isSelected ? 'opacity-100' : 'opacity-70'}`}
                  >
                    Most Popular
                  </motion.div>
                )}
                <div className={`w-16 h-16 mb-4 rounded-2xl flex items-center justify-center text-4xl shadow-lg bg-gradient-to-br ${plan.accent} group-hover:scale-110 transition-transform`}>
                  {plan.icon}
                </div>
                <h2 className="text-2xl font-bold mb-2 text-[#6399c1]">{plan.name}</h2>
                <div className="text-4xl font-extrabold mb-4 text-[#366caa] tracking-tight">{plan.price}</div>
                <ul className="mb-6 space-y-3 text-[#2e4b71]">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#6399c1] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  className={`px-8 py-3 rounded-full font-bold shadow-lg transition
                    ${isSelected
                      ? 'bg-gradient-to-r from-[#366caa] to-[#6399c1] text-white'
                      : 'border border-[#6399c1] text-[#6399c1] hover:bg-[#6399c1] hover:text-white bg-transparent'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlan(plan.name);
                  }}
                >
                  {isSelected ? 'Selected' : plan.name === 'Pro' ? 'Start Pro' : 'Select'}
                </motion.button>
                <div className={`absolute -bottom-10 -left-10 w-28 h-28 rounded-full blur-2xl z-0 ${isSelected ? 'bg-[#6399c1]/30' : 'bg-[#b8bdc2]/20'}`}></div>
              </motion.div>
            );
          })}
        </div>

        {/* Subline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, type: 'spring' }}
          className="text-lg md:text-xl text-[#366caa] text-center font-medium mt-10 mb-16"
        >
          {belowCardsSubline}
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.7, type: 'spring' }}
          className="max-w-5xl mx-auto mt-8 p-8 bg-[#fdfefe]/80 rounded-3xl border border-[#6399c1]/30 shadow-lg text-center"
        >
          <h3 className="text-3xl font-bold text-[#6399c1] mb-4">Compare All Plans</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="text-left text-[#366caa] text-lg font-bold pb-2">Feature</th>
                  {plans.map(plan => (
                    <th key={plan.name} className="text-[#6399c1] text-lg font-semibold pb-2">{plan.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-[#2e4b71]">
                {tableRows.map((row, i) => (
                  <tr key={row.label}>
                    <td className="py-2 pr-4 text-left">{row.label}</td>
                    {row.keys.map((v, j) => (
                      <td key={j} className="py-2">
                        {v ? (
                          <span className="text-green-500 text-xl">✔️</span>
                        ) : (
                          <span className="text-[#b8bdc2] text-xl">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.7, type: 'spring' }}
          className="max-w-3xl mx-auto py-16 text-center"
        >
          <h3 className="text-3xl font-bold text-[#6399c1] mb-4">Still have questions?</h3>
          <p className="text-[#2e4b71] mb-6 text-lg">Contact our team for a custom quote or to discuss which plan is right for you.</p>
          <a
            href="/help"
            className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-[#366caa] to-[#6399c1] text-white font-bold shadow-lg hover:from-[#6399c1] hover:to-[#366caa] transition"
          >
            Contact Support
          </a>
        </motion.div>
      </div>

      {/* Subtle Noise Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-10 mix-blend-overlay">
        <div className="absolute inset-0 bg-[url('/noise.png')]" />
      </div>
    </div>
  );
}
