'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion, Variants } from 'framer-motion';
import { Github } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Documentation', href: '/documentation' },
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Help', href: '/help' },
];

const sidebarLinks = [
  { title: 'Introduction', href: '#introduction' },
  { title: 'Installation', href: '#installation' },
  { title: 'Environment Setup', href: '#environment-setup' },
  { title: 'Running the App', href: '#running-the-app' },
  { title: 'API Reference', href: '#api-reference' },
  { title: 'FAQs', href: '#faqs' },
  { title: 'Contributing', href: '#contributing' },
];

const faqs = [
  {
    question: "Which LLMs are supported?",
    answer: (
      <>
        You can connect to any LLM with an accessible API. Check the <code className="text-[#6399c1]">.env.example</code> for examples.
      </>
    ),
  },
  {
    question: "How do I contribute?",
    answer: (
      <>
        See the <a href="#contributing" className="text-[#6399c1] underline">Contributing</a> section below.
      </>
    ),
  },
];

export default function DocumentationPage() {
  // Navbar typing effect
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

  // Sidebar active link tracking
  const [activeHash, setActiveHash] = useState<string>(sidebarLinks[0].href);

  // Scroll tracking for sidebar highlight
  useEffect(() => {
    const onScroll = () => {
      let closest = sidebarLinks[0].href;
      let minDistance = Infinity;
      for (const link of sidebarLinks) {
        const id = link.href.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80 && Math.abs(rect.top) < minDistance) {
            minDistance = Math.abs(rect.top);
            closest = link.href;
          }
        }
      }
      setActiveHash(closest);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sidebar click handler for smooth scroll
  const handleSidebarClick = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActiveHash(href);
    history.replaceState(null, '', href);
  };

  // FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } },
  };

  // Background particles (client only)
  const [particles, setParticles] = useState<{cx: string, cy: string, r: number, fill: string, duration: number}[]>([]);
  useEffect(() => {
    setParticles(Array.from({ length: 12 }, () => ({
      cx: `${Math.random() * 100}%`,
      cy: `${Math.random() * 100}%`,
      r: Math.random() * 3 + 2,
      fill: `rgba(99,153,193,${Math.random() * 0.3 + 0.2})`,
      duration: Math.random() * 10 + 5
    })));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfefe] via-[#b8bdc2] to-[#6399c1]/10 text-[#2e4b71] relative overflow-x-hidden">
      {/* Background blobs and particles */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#6399c1]/20 rounded-full blur-3xl animate-blob1" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#2e4b71]/10 rounded-full blur-2xl animate-blob2" />
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
          {particles.map((p, i) => (
            <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={p.fill}>
              <animate attributeName="cy" values={`${p.cy};90%;${p.cy}`} dur={`${p.duration}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </svg>
      </div>

      {/* Navbar */}
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
                className="relative px-5 py-1 font-semibold text-[#2e4b71] hover:text-[#6399c1] transition after:content-[''] after:block after:h-[3px] after:bg-gradient-to-r after:from-[#2e4b71] after:to-[#6399c1] after:rounded-full after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left after:mt-1"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="ml-2 p-2 text-[#6399c1] hover:text-[#366caa] transition-colors"
          >
            <Github className="w-7 h-7" />
          </motion.a>
        </nav>
      </motion.header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:block">
          <div
            className="fixed left-0 top-[7.5rem] w-72 pr-2 z-30"
            style={{ height: 'calc(100vh - 7.5rem)' }}
          >
            <nav className="rounded-2xl bg-[#fdfefe]/80 border border-[#b8bdc2]/50 shadow-lg backdrop-blur-md py-10 px-7 h-full overflow-y-auto">
              <ul className="space-y-3">
                {sidebarLinks.map(link => (
                  <li key={link.href} className="relative">
                    {activeHash === link.href && (
                      <motion.span
                        layoutId="sidebar-highlight"
                        className="absolute left-0 top-2 h-6 w-1 bg-[#6399c1] rounded-r-lg"
                        transition={{ type: 'spring', stiffness: 300 }}
                      />
                    )}
                    <a
                      href={link.href}
                      onClick={handleSidebarClick(link.href)}
                      className={`block text-lg font-semibold rounded-lg px-3 py-2 transition ${
                        activeHash === link.href
                          ? 'text-[#6399c1] bg-[#6399c1]/10 shadow'
                          : 'text-[#2e4b71] hover:text-[#366caa] hover:bg-[#6399c1]/5'
                      }`}
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-2 md:px-12 py-12 space-y-20 md:ml-72">
          {/* Introduction */}
          <motion.section
            id="introduction"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-2xl bg-[#fdfefe]/80 backdrop-blur-lg border border-[#b8bdc2]/30 shadow-xl px-8 py-10 transition hover:shadow-2xl"
          >
            <h1 className="text-4xl font-extrabold mb-4 text-[#6399c1] drop-shadow">Introduction</h1>
            <p className="text-lg leading-relaxed">
              Welcome to the <strong className="text-[#366caa]">Prompt Visualizer</strong> documentation!
              This project helps you interactively visualize, compare, and analyze prompts and responses from multiple large language models (LLMs).
              Whether you are a developer, researcher, or enthusiast, this tool aims to streamline your workflow and provide clear insights into LLM behavior.
            </p>
            <ul className="list-disc ml-8 mt-6 space-y-2 text-base">
              <li><strong className="text-[#6399c1]">Multi-LLM Support:</strong> Compare outputs from different language models side by side.</li>
              <li><strong className="text-[#6399c1]">Interactive UI:</strong> Easily input prompts and view formatted, color-coded responses.</li>
              <li><strong className="text-[#6399c1]">Extensible:</strong> Built with TypeScript and React, making it easy to extend and customize.</li>
              <li><strong className="text-[#6399c1]">Open Source:</strong> Clean, minimal codebase designed for community contributions.</li>
            </ul>
          </motion.section>

          {/* Divider */}
          <div className="flex items-center justify-center my-2">
            <div className="w-2 h-2 rounded-full bg-[#6399c1] mx-1 animate-pulse" />
            <div className="w-1/3 h-px bg-gradient-to-r from-[#6399c1]/0 via-[#6399c1]/60 to-[#6399c1]/0" />
            <div className="w-2 h-2 rounded-full bg-[#6399c1] mx-1 animate-pulse" />
          </div>

          {/* Installation */}
          <motion.section
            id="installation"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-2xl bg-[#fdfefe]/80 backdrop-blur-lg border border-[#b8bdc2]/30 shadow-xl px-8 py-8 transition hover:shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-3 text-[#366caa]">Installation</h2>
            <ol className="list-decimal ml-8 space-y-3 text-base">
              <li>Clone the repository:
                <pre className="bg-[#2e4b71]/80 rounded-lg p-3 mt-2 text-[#fdfefe] text-sm border border-[#6399c1]/20 shadow-inner"><code>git clone https://github.com/your-username/multi-llm-chatbot.git</code></pre>
              </li>
              <li>Install dependencies:
                <pre className="bg-[#2e4b71]/80 rounded-lg p-3 mt-2 text-[#fdfefe] text-sm border border-[#6399c1]/20 shadow-inner"><code>npm install</code></pre>
              </li>
            </ol>
          </motion.section>

          {/* Divider */}
          <div className="flex items-center justify-center my-2">
            <div className="w-2 h-2 rounded-full bg-[#6399c1] mx-1 animate-pulse" />
            <div className="w-1/3 h-px bg-gradient-to-r from-[#6399c1]/0 via-[#6399c1]/60 to-[#6399c1]/0" />
            <div className="w-2 h-2 rounded-full bg-[#6399c1] mx-1 animate-pulse" />
          </div>

          {/* Environment Setup */}
          <motion.section
            id="environment-setup"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-2xl bg-[#fdfefe]/80 backdrop-blur-lg border border-[#b8bdc2]/30 shadow-xl px-8 py-8 transition hover:shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-3 text-[#366caa]">Environment Setup</h2>
            <p className="text-base">
              Copy the example environment file and update it with your API keys and configuration:
            </p>
            <pre className="bg-[#2e4b71]/80 rounded-lg p-3 mt-2 text-[#fdfefe] text-sm border border-[#6399c1]/20 shadow-inner"><code>cp .env.example .env.local</code></pre>
            <p className="mt-2 text-base">
              Edit <code className="text-[#6399c1]">.env.local</code> to include your LLM provider keys and any other required settings.
            </p>
          </motion.section>

          {/* Divider */}
          <div className="flex items-center justify-center my-2">
            <div className="w-2 h-2 rounded-full bg-[#6399c1] mx-1 animate-pulse" />
            <div className="w-1/3 h-px bg-gradient-to-r from-[#6399c1]/0 via-[#6399c1]/60 to-[#6399c1]/0" />
            <div className="w-2 h-2 rounded-full bg-[#6399c1] mx-1 animate-pulse" />
          </div>

          {/* Running the App */}
          <motion.section
            id="running-the-app"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-2xl bg-[#fdfefe]/80 backdrop-blur-lg border border-[#b8bdc2]/30 shadow-xl px-8 py-8 transition hover:shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-3 text-[#366caa]">Running the App</h2>
            <p className="text-base">
              Start the development server:
            </p>
            <pre className="bg-[#2e4b71]/80 rounded-lg p-3 mt-2 text-[#fdfefe] text-sm border border-[#6399c1]/20 shadow-inner"><code>npm run dev</code></pre>
            <p className="mt-2 text-base">
              Visit <code className="text-[#6399c1]">http://localhost:3000</code> in your browser to use the application.
            </p>
          </motion.section>

          {/* Divider */}
          <div className="flex items-center justify-center my-2">
            <div className="w-2 h-2 rounded-full bg-[#6399c1] mx-1 animate-pulse" />
            <div className="w-1/3 h-px bg-gradient-to-r from-[#6399c1]/0 via-[#6399c1]/60 to-[#6399c1]/0" />
            <div className="w-2 h-2 rounded-full bg-[#6399c1] mx-1 animate-pulse" />
          </div>

          {/* API Reference */}
          <motion.section
            id="api-reference"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-2xl bg-[#fdfefe]/80 backdrop-blur-lg border border-[#b8bdc2]/30 shadow-xl px-8 py-8 transition hover:shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-3 text-[#366caa]">API Reference</h2>
            <p className="text-base">
              The API endpoints allow you to interact with multiple LLMs. See the source code for detailed usage and supported parameters.
            </p>
            <ul className="list-disc ml-8 mt-4 space-y-2 text-base">
              <li><code className="text-[#6399c1]">POST /api/prompt</code>: Send a prompt and receive responses from configured LLMs.</li>
              <li><code className="text-[#6399c1]">GET /api/models</code>: List available models and their configuration.</li>
            </ul>
          </motion.section>

          {/* Divider */}
          <div className="flex items-center justify-center my-2">
            <div className="w-2 h-2 rounded-full bg-[#6399c1] mx-1 animate-pulse" />
            <div className="w-1/3 h-px bg-gradient-to-r from-[#6399c1]/0 via-[#6399c1]/60 to-[#6399c1]/0" />
            <div className="w-2 h-2 rounded-full bg-[#6399c1] mx-1 animate-pulse" />
          </div>

          {/* FAQs */}
          <motion.section
            id="faqs"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-2xl bg-[#fdfefe]/80 backdrop-blur-lg border border-[#b8bdc2]/30 shadow-xl px-8 py-8 transition hover:shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-3 text-[#366caa]">FAQs</h2>
            <ul className="space-y-4">
              {faqs.map((faq, idx) => (
                <li key={faq.question}>
                  <button
                    className={`w-full flex justify-between items-center text-left text-lg font-semibold px-4 py-3 rounded-lg transition focus:outline-none ${
                      openFaq === idx
                        ? 'bg-[#6399c1]/10 text-[#6399c1] shadow'
                        : 'bg-transparent text-[#2e4b71] hover:bg-[#6399c1]/5'
                    }`}
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    aria-expanded={openFaq === idx}
                    aria-controls={`faq-answer-${idx}`}
                  >
                    <span>{faq.question}</span>
                    <span className={`ml-4 transition-transform ${openFaq === idx ? 'rotate-90' : ''}`}>
                      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                        <path d="M7 8l3 3 3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </button>
                  <div
                    id={`faq-answer-${idx}`}
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openFaq === idx ? 'max-h-40 mt-2 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-3 pt-1 text-base text-[#366caa]">
                      {faq.answer}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Divider */}
          <div className="flex items-center justify-center my-2">
            <div className="w-2 h-2 rounded-full bg-[#6399c1] mx-1 animate-pulse" />
            <div className="w-1/3 h-px bg-gradient-to-r from-[#6399c1]/0 via-[#6399c1]/60 to-[#6399c1]/0" />
            <div className="w-2 h-2 rounded-full bg-[#6399c1] mx-1 animate-pulse" />
          </div>

          {/* Contributing */}
          <motion.section
            id="contributing"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-2xl bg-[#fdfefe]/80 backdrop-blur-lg border border-[#b8bdc2]/30 shadow-xl px-8 py-8 transition hover:shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-3 text-[#366caa]">Contributing</h2>
            <p className="text-base">
              We welcome contributions! Please fork the repository, create a feature branch, and open a pull request. For major changes, open an issue first to discuss your ideas.
            </p>
            <ul className="list-disc ml-8 mt-4 space-y-2 text-base">
              <li>Fork the repo and create your feature branch (<code className="text-[#6399c1]">git checkout -b feature/your-feature</code>).</li>
              <li>Commit your changes and push to your fork.</li>
              <li>Open a pull request describing your changes.</li>
            </ul>
          </motion.section>
        </main>
      </div>
    </div>
  );
}
