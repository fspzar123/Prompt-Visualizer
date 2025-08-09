'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Documentation', href: '/documentation' },
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Help', href: '/help' }
];

const features = [
  {
    title: "Multi-LLM Comparison",
    description: "Switch between GPT-4, Claude, and Mistral models for response analysis",
    video: "/videos/model-switch.mp4",
    gradient: "from-[#366caa]/20 to-[#6399c1]/30",
    content: [
      "Real-time model switching",
      "Side-by-side response comparison",
      "Performance metrics (F1, BERTScore)"
    ]
  },
  {
    title: "Contextual Understanding",
    description: "Semantic search powered by PineconeDB",
    video: "/videos/semantic-search.mp4",
    gradient: "from-[#2e4b71]/20 to-[#366caa]/30",
    content: [
      "Vector embedding storage",
      "Keyword extraction from queries",
      "Dynamic context retrieval"
    ]
  },
  {
    title: "Interactive Analysis",
    description: "Step-by-step explanation generation",
    video: "/videos/analysis.mp4",
    gradient: "from-[#6399c1]/20 to-[#b8bdc2]/30",
    content: [
      "Prompt refinement interface",
      "Simplified explanations",
      "Follow-up question suggestions"
    ]
  },
  {
    title: "Modular Architecture",
    description: "Scalable and extensible platform",
    video: "/videos/architecture.mp4",
    gradient: "from-[#b8bdc2]/20 to-[#2e4b71]/30",
    content: [
      "React (Vite) frontend",
      "FastAPI backend",
      "LangChain integration"
    ]
  }
];

const suffixes = ['Visualizer', 'Comparer', 'Analyser'];

export default function FeaturesPage() {
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

  const [showNav, setShowNav] = useState(true);
  const lastY = useRef(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setShowNav(latest < lastY.current || latest < 100);
    lastY.current = latest;
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#fdfefe] via-[#b8bdc2] to-[#6399c1]/10 text-[#2e4b71] overflow-x-hidden">
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

      <main className="pt-[100px] pb-10"></main>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative px-8">
        <motion.div className="absolute inset-0 bg-gradient-to-b from-[#6399c1]/10 to-transparent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} />
        <div className="text-center z-10">
          <motion.h1 className="text-7xl font-bold text-[#000000] mb-8" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            Platform Features
            <span className="block text-3xl mt-4 text-[#000000]">
              {displayed}<span className="animate-pulse">|</span>
            </span>
          </motion.h1>
          <motion.p className="text-2xl text-[#366caa] max-w-4xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            Experience next-gen AI analysis with cinematic interactions
          </motion.p>
        </div>
      </section>

      {/* Feature Cards */}
      <div className="space-y-24 px-12 pb-12">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center gap-12 min-h-[70vh]`}
          >
            <motion.div className="flex-1 rounded-2xl overflow-hidden relative group" whileHover={{ scale: 1.02 }}>
              <video autoPlay muted loop className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity">
                <source src={feature.video} type="video/mp4" />
              </video>
              <div className={`absolute inset-0 bg-gradient-to-b ${feature.gradient}`} />
            </motion.div>
            <motion.div className="flex-1 space-y-8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <h2 className="text-5xl font-bold text-[#6399c1]">{feature.title}</h2>
              <p className="text-2xl text-[#366caa]">{feature.description}</p>
              <ul className="space-y-4">
                {feature.content.map((item, idx) => (
                  <motion.li key={idx} className="text-xl text-[#366caa] flex items-center" initial={{ x: -20 }} whileInView={{ x: 0 }} transition={{ delay: idx * 0.1 }}>
                    <span className="w-3 h-3 bg-[#6399c1] rounded-full mr-4 animate-pulse" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Architecture Section */}
      <section className="min-h-screen flex items-center justify-center p-12">
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-6xl" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
          {['Frontend', 'Backend', 'Models'].map((title, i) => (
            <motion.div
              key={title}
              className="bg-[#fdfefe]/80 backdrop-blur-xl rounded-3xl p-8 border border-[#b8bdc2]/50 hover:border-[#2e4b71]/70 transition-all"
              whileHover={{ y: -10 }}
            >
              <h3 className="text-3xl font-bold text-[#2e4b71] mb-6">{title}</h3>
              <ul className="space-y-4">
                {[
                  ['React (Vite)', 'Tailwind CSS', 'Framer Motion'],
                  ['FastAPI', 'PineconeDB', 'LangChain'],
                  ['GPT-4', 'Claude', 'Mistral']
                ][i].map((item, j) => (
                  <motion.li
                    key={j}
                    className="text-xl text-[#366caa] flex items-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: j * 0.2 }}
                  >
                    <span className="w-2 h-2 bg-[#6399c1] rounded-full mr-3" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
