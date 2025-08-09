'use client';

import React, { useState, useEffect } from 'react';
import ChatInput from './components/ChatInput';
import ChatHistory from './components/ChatHistory';
import axios from 'axios';

// Model type
type ModelName = 'GPT-4.1 Mini' | 'GPT-4o Mini' | 'GPT-4.1 Nano' | 'Comparison' | 'Comparison Version';

// Context file type
interface ContextFile {
  collection_name: string;
  document: string;
}

// LLM options
const LLM_OPTIONS: { id: string; name: ModelName; icon: string; gradient: string; description: string }[] = [
  {
    id: 'gpt-4.1-mini',
    name: 'GPT-4.1 Mini' as ModelName,
    icon: '🤖',
    gradient: 'from-[#366caa] via-[#6399c1] to-[#3a5d7c]', // blue gradient
    description: 'Azure OpenAI GPT-4.1 Mini'
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini' as ModelName,
    icon: '🦾',
    gradient: 'from-[#223a54] via-[#366caa] to-[#6399c1]', // blue gradient
    description: 'Azure OpenAI GPT-4o Mini'
  },
  {
    id: 'gpt-4.1-nano',
    name: 'GPT-4.1 Nano' as ModelName,
    icon: '⚡',
    gradient: 'from-[#3a5d7c] via-[#6399c1] to-[#b8bdc2]', // blue gradient
    description: 'Azure OpenAI GPT-4.1 Nano'
  },
  {
    id: 'comparison',
    name: 'Comparison' as ModelName,
    icon: '⚖️',
    gradient: 'from-[#6399c1] via-[#b8bdc2] to-[#ffffff]', // blue to white
    description: 'Compare all models'
  },
  {
    id: 'comparison-version',
    name: 'Comparison Version' as ModelName,
    icon: '📊',
    gradient: 'from-[#366caa] via-[#6399c1] to-[#3a5d7c]', // blue gradient
    description: 'Compare versions of the same product'
  }
];

const MODEL_ID_MAP: Record<ModelName, string> = {
  'GPT-4.1 Mini': 'azure/gpt-4.1-mini',
  'GPT-4o Mini': 'azure/gpt-4o-mini',
  'GPT-4.1 Nano': 'azure/gpt-4.1-nano',
  'Comparison': '',
  'Comparison Version': 'azure/gpt-4.1-mini'
};

interface Message {
  role: 'user' | 'bot';
  content: string;
  model?: string;
}

interface LLMApiResponse {
  response: string;
  context: string;
  context_files: ContextFile[];
  llm_prompt: string;
}

interface HighlightChunk {
  text: string;
  is_unique: boolean;
}
interface Highlight {
  version: string;
  chunks: HighlightChunk[];
}

function applyHighlights(originalText: string,
  chunks: HighlightChunk[]
): React.ReactNode {
  const elements = [];
  let currentIndex = 0;
  if (!Array.isArray(chunks) || chunks.length === 0) return originalText;

  chunks.forEach((chunk, idx) => {
    const { text, is_unique } = chunk;
    if (!text) return;
    const foundAt = originalText.indexOf(text, currentIndex);
    if (foundAt === -1) {
      // This chunk is missing from the text, log once for debugging
      console.warn(`Chunk "${text}" not found in originalText`, { idx, originalText });
      return;
    }
    // Add plain text before chunk
    if (foundAt > currentIndex) {
      elements.push(
        <span key={`before-${idx}`}>{originalText.slice(currentIndex, foundAt)}</span>
      );
    }
    // Add the chunk (highlighted if unique)
    elements.push(
      is_unique ? (
        <mark
          key={`highlight-${idx}`}
          style={{
            background: "#6399c1",
            color: "white",
            borderRadius: "3px",
            padding: "0 2px",
          }}
        >
          {text}
        </mark>
      ) : (
        <span key={`common-${idx}`}>{text}</span>
      )
    );
    currentIndex = foundAt + text.length;
  });

  // Any text at the end?
  if (currentIndex < originalText.length) {
    elements.push(
      <span key="remaining">{originalText.slice(currentIndex)}</span>
    );
  }

  return elements;
}

export default function HomePage() {
  const [selectedLLM, setSelectedLLM] = useState<ModelName>(LLM_OPTIONS[0].name);
  const [messages, setMessages] = useState<Message[]>([]);
  const [responses, setResponses] = useState<{ model: string; content: string }[]>([]);
  const [versionResponses, setVersionResponses] = useState<{ version: string; content: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<{ [product: string]: string[] }>({});
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [contextFiles, setContextFiles] = useState<ContextFile[]>([]);
  const [promptEditable, setPromptEditable] = useState<string>('');
  const [originalSystemInstructions, setOriginalSystemInstructions] = useState<string>("");
  const [systemInstructionsEditable, setSystemInstructionsEditable] = useState<string>("");
  const [bestAnswer, setBestAnswer] = useState<string | null>(null);
  const [bestLoading, setBestLoading] = useState(false);
  const [showLLMSelector, setShowLLMSelector] = useState(false);
  const [semanticHighlights, setSemanticHighlights] = useState<Highlight[] | null>(null);

  // Fetch products on mount
  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/products').then(res => setProducts(res.data));
  }, []);

  // Fetch context when both product and version are selected
  useEffect(() => {
    if (selectedProduct && selectedVersion) {
      axios.post('http://127.0.0.1:5000/api/context', {
        product: selectedProduct,
        version: selectedVersion
      }).then(res => setContextFiles(res.data));
    } else {
      setContextFiles([]);
    }
  }, [selectedProduct, selectedVersion]);


  useEffect(() => {
    if (promptEditable) {
      const parts = promptEditable.split('--- CONVERSATION HISTORY ---');
      const baseInstructions = parts[0].trim();
      setOriginalSystemInstructions(baseInstructions);
      setSystemInstructionsEditable(""); // start empty for new input
    }
  }, [promptEditable]);

  useEffect(() => {
    if (semanticHighlights) {
      console.log("semanticHighlights updated:", semanticHighlights);
    }
  }, [semanticHighlights]);

  const handleSend = async (prompt: string) => {
    const updatedMessages: Message[] = [
      ...messages,
      { role: 'user' as const, content: prompt }
    ];
    setMessages(updatedMessages as Message[]);
    setLoading(true);
    setBestAnswer(null);

    try {
      const history: Message[] = updatedMessages
        .slice(-6)
        .map(({ role, content, model }) => ({
          role: role === 'user' ? 'user' : 'bot',
          content,
          ...(model ? { model } : {})
        }));

      if (selectedLLM === 'Comparison') {
        const compareModels: ModelName[] = ['GPT-4.1 Mini', 'GPT-4o Mini', 'GPT-4.1 Nano'];
        const results = await Promise.all(
          compareModels.map(async modelName => {
            const res = await axios.post<LLMApiResponse>(
              'http://127.0.0.1:5000/api/chat',
              {
                prompt,
                model: MODEL_ID_MAP[modelName as Exclude<ModelName, 'Comparison'>],
                product: selectedProduct,
                version: selectedVersion,
                history
              }
            );
            setContextFiles(res.data.context_files || []);
            setPromptEditable(res.data.llm_prompt);
            return { model: modelName, content: res.data.response };
          })
        );
        setResponses(results);
        setMessages(prev => [
          ...prev,
          ...results.map(r => ({
            role: 'bot' as const,
            content: r.content,
            model: r.model
          }))
        ]);
        //setContextFiles([]);
        //setPromptEditable('');
      } else if (selectedLLM === 'Comparison Version') {
        try {
          const version1 = selectedVersion;
          const response = await axios.post('http://127.0.0.1:5000/api/send-versions', {
          version1
        });

        const versionsToCompare: string[] = response.data.received_versions;
        const results = await Promise.all(
          versionsToCompare.map(async version => {
            console.log('Fetching response for version:', version);
            const res = await axios.post<LLMApiResponse>(
              'http://127.0.0.1:5000/api/chat',
              {
                prompt,
                model: MODEL_ID_MAP['Comparison Version'],
                product: selectedProduct,
                version,
                history
              }
            );
            setContextFiles(res.data.context_files || []);
            setMessages(prev => [
              ...prev,
              { role: 'bot', content: res.data.response, model: 'Comparison Version' }
            ]);
            console.log('Response for version:', version, 'is', res.data.response);
            return { version, content: res.data.response };
          })
        );
        setVersionResponses(results);
        try {
          const res = await axios.post('http://127.0.0.1:5000/api/semantic-llm-diff', {
            question: prompt,
            answers: results.map(r => r.content),
            versions: results.map(r => r.version)
          });
          console.log("versionResponses:", versionResponses);
          console.log("semanticHighlights:", semanticHighlights);
          setSemanticHighlights(res.data.highlights);
        } catch (err) {
          setSemanticHighlights(null);
        }
      } catch (err) {
        console.error('Failed to fetch versions or chat responses:', err);
      }
      }else {
        const res = await axios.post<LLMApiResponse>(
          'http://127.0.0.1:5000/api/chat',
          {
            prompt,
            model: MODEL_ID_MAP[selectedLLM as Exclude<ModelName, 'Comparison'>],
            product: selectedProduct,
            version: selectedVersion,
            history
          }
        );
        setContextFiles(res.data.context_files || []);
        setPromptEditable(res.data.llm_prompt);
        setResponses([{ model: selectedLLM, content: res.data.response }]);
        setMessages(prev => [
          ...prev,
          { role: 'bot', content: res.data.response, model: selectedLLM }
        ]);
      }
    } catch (e) {
      setMessages(prev => [
        ...prev,
        { role: 'bot', content: 'Error contacting backend.', model: selectedLLM }
      ]);
      //setContextFiles([]);
      //setPromptEditable('');
    } finally {
      setLoading(false);
    }
  };

  const handleBestAnswer = async () => {
    setBestLoading(true);
    setBestAnswer(null);
    try {
      const res = await axios.post<{ best: string }>(
        'http://127.0.0.1:5000/api/compare',
        {
          question: messages.find(m => m.role === 'user')?.content || '',
          answers: responses.map(r => r.content),
          models: responses.map(r => r.model)
        }
      );
      setBestAnswer(res.data.best);
    } catch (e) {
      setBestAnswer('Could not determine the best answer. Please try again.');
    } finally {
      setBestLoading(false);
    }
  };

  const handleBestVersionAnswer = async () => {
    setBestLoading(true);
    setBestAnswer(null);
    try {
      const res = await axios.post<{ best: string }>(
        'http://127.0.0.1:5000/api/compare-version',
        {
          question: messages.find(m => m.role === 'user')?.content || '',
          answers: versionResponses.map(r => r.content),
          versions: versionResponses.map(r => r.version)
        }
      );
      setBestAnswer(res.data.best);
    } catch (e) {
      setBestAnswer('Could not determine the best answer. Please try again.');
    } finally {
      setBestLoading(false);
    }
  };

  const handlePromptSend = async () => {
    const userPrompt = messages.findLast(m => m.role === 'user')?.content || 'Regenerate using updated instructions.';
    
    const updatedMessages = [
      ...messages,
      { role: 'user', content: userPrompt }
    ];
    setMessages(updatedMessages as Message[]);
    setLoading(true);
    setBestAnswer(null);

    try {
      const history = updatedMessages
        .slice(-6)
        .map(({ role, content }) => ({ role, content }));
      
        const finalSystemInstructions = [originalSystemInstructions, systemInstructionsEditable.trim()]
        .filter(Boolean) // removes empty strings
        .join('\n\n');    // or use any other delimiter

      if (selectedLLM === 'Comparison') {
        const compareModels: ModelName[] = ['GPT-4.1 Mini', 'GPT-4o Mini', 'GPT-4.1 Nano'];
        const results = await Promise.all(
          compareModels.map(async modelName => {
            const res = await axios.post<LLMApiResponse>(
              'http://127.0.0.1:5000/api/chat',
              {
                model: MODEL_ID_MAP[modelName as Exclude<ModelName, 'Comparison'>],
                product: selectedProduct,
                version: selectedVersion,
                history,
                system_instructions: finalSystemInstructions, // <-- send edited instructions!
                prompt: userPrompt // <-- send user prompt
              }
            );
            return { model: modelName, content: res.data.response };
          })
        );
        setResponses(results);
        setMessages(prev => [
          ...prev,
          ...results.map(r => ({
            role: 'bot' as const,
            content: r.content,
            model: r.model
          }))
        ]);
        //setContextFiles([]);
        //setPromptEditable('');
      } else if (selectedLLM === 'Comparison Version') {
        try {
          const version1 = selectedVersion;
          const response = await axios.post('http://127.0.0.1:5000/api/send-versions', {
          version1
        });

        const versionsToCompare: string[] = response.data.received_versions;
        const results = await Promise.all(
          versionsToCompare.map(async version => {
            const res = await axios.post<LLMApiResponse>(
              'http://127.0.0.1:5000/api/chat',
              {
                prompt,
                model: MODEL_ID_MAP['Comparison Version'],
                product: selectedProduct,
                version,
                history
              }
            );
            return { version, content: res.data.response };
          })
        );
        setVersionResponses(results);
      } catch (err) {
        console.error('Failed to fetch versions or chat responses:', err);
      }
      }else {
        const res = await axios.post<LLMApiResponse>(
          'http://127.0.0.1:5000/api/chat',
          {
            model: MODEL_ID_MAP[selectedLLM as Exclude<ModelName, 'Comparison'>],
            product: selectedProduct,
            version: selectedVersion,
            system_instructions: systemInstructionsEditable, // <-- send edited instructions!
            history, // <-- send history!
            prompt: userPrompt // <-- send user prompt
          }
        );
        setResponses([{ model: selectedLLM, content: res.data.response }]);
        setMessages(prev => [
          ...prev,
          { role: 'bot', content: res.data.response, model: selectedLLM }
        ]);
      }
    } catch (e) {
      setMessages(prev => [
        ...prev,
        { role: 'bot', content: 'Error contacting backend.', model: selectedLLM }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setResponses([]);
    setContextFiles([]);
    setPromptEditable('');
    setBestAnswer(null);
  };


  const selectedLLMOption = LLM_OPTIONS.find(opt => opt.name === selectedLLM);
  const isChatting = messages.length > 0;

  
  // UI for guided selection
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2a3a] via-[#223a54] to-[#3a5d7c] text-[#e5eaf0] relative overflow-hidden">
      {/* Floating Header */}
      <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-[#1a2a3a]/95 backdrop-blur-xl rounded-full px-8 py-4 border border-[#366caa]/60 shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#366caa] to-[#6399c1] flex items-center justify-center">
                <span className="text-sm font-bold text-white">P</span>
              </div>
              <span className="text-lg font-light text-[#e5eaf0]">Prompt Visualizer</span>
            </div>
            <div className="h-4 w-px bg-[#366caa]"></div>
            <button
              onClick={() => setShowLLMSelector(!showLLMSelector)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                showLLMSelector 
                  ? 'bg-[#223a54] scale-105' 
                  : 'hover:bg-[#223a54]'
              }`}
            >
              <span className="text-xl">{selectedLLMOption?.icon}</span>
              <span className="text-sm font-medium">{selectedLLM}</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-300 ${showLLMSelector ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="h-4 w-px bg-[#366caa]"></div>
            <button
              onClick={handleClear}
              className="p-2 rounded-full hover:bg-[#223a54] transition-colors"
              title="Clear chat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Floating LLM Selector */}
      {showLLMSelector && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-[#1a2a3a]/95 backdrop-blur-xl rounded-2xl p-6 border border-[#366caa]/60 shadow-2xl">
            <div className="grid grid-cols-2 gap-4 w-96">
              {LLM_OPTIONS.map((llm) => (
                <button
                  key={llm.id}
                  onClick={() => {
                    setSelectedLLM(llm.name);
                    setShowLLMSelector(false);
                  }}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    selectedLLM === llm.name
                      ? 'border-[#6399c1]/70 bg-gradient-to-r from-[#223a54] to-[#1a2a3a] scale-105'
                      : 'border-[#366caa]/60 hover:border-[#6399c1]/70 hover:bg-[#223a54]/70'
                  }`}
                >
                  <div className="text-center space-y-2">
                    <div className={`text-2xl bg-clip-text text-transparent bg-gradient-to-r ${llm.gradient}`}>{llm.icon}</div>
                    <div className="text-sm font-medium text-[#e5eaf0]">{llm.name}</div>
                    <div className="text-xs text-[#b8bdc2]">{llm.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="pt-32 pb-16 px-8 flex flex-col items-center min-h-screen">
        <div className="w-full max-w-4xl mx-auto">
          {/* Guided selection UI */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-center">
            <select
              className="p-2 rounded bg-[#223a54] text-[#e5eaf0] border border-[#366caa]"
              value={selectedProduct}
              onChange={e => {
                setSelectedProduct(e.target.value);
                setSelectedVersion('');
              }}
            >
              <option value="">Select Product</option>
              {Object.keys(products).map(product => (
                <option key={product} value={product}>{product}</option>
              ))}
            </select>
            <select
              className="p-2 rounded bg-[#223a54] text-[#e5eaf0] border border-[#366caa]"
              value={selectedVersion}
              onChange={e => setSelectedVersion(e.target.value)}
              disabled={!selectedProduct}
            >
              <option value="">Select Version</option>
              {selectedProduct && products[selectedProduct]?.map(version => (
                <option key={version} value={version}>{version}</option>
              ))}
            </select>
          </div>

          {/* Only show chat if both product and version are selected */}
          {selectedProduct && selectedVersion ? (
            <div className="bg-[#223a54]/80 backdrop-blur-xl rounded-3xl border border-[#366caa]/60 shadow-2xl">
              <div className="p-8 min-h-[500px] max-h-[500px] overflow-y-auto">
                <ChatHistory messages={messages} />
              </div>
              <div className="p-6 border-t border-[#366caa]/60">
                <ChatInput
                  onSend={handleSend}
                  loading={loading}
                  context={messages.map(m => m.content).slice(-5)} // recent user/bot chat lines
                />
              </div>
            </div>
          ) : (
            <div className="text-center text-[#0d1e30] mt-12">
              Please select a product and version to begin chatting.
            </div>
          )}

          {/* Context & Prompt Cards */}
          {(isChatting) && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Context Card */}
              {(
                <div className="bg-[#223a54]/80 backdrop-blur-xl rounded-2xl border border-[#366caa]/60 p-6 shadow-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#366caa] to-[#6399c1] flex items-center justify-center">
                      <span className="text-sm">📁</span>
                    </div>
                    <span className="text-sm font-medium text-[#e5eaf0]">Context Files</span>
                  </div>
    
                  {/* New scrollable wrapper */}
                  <div className="max-h-80 overflow-y-auto pr-2 space-y-2">
                    {contextFiles.map((file, idx) => (
                      <div key={idx} className="mb-2 p-2 bg-[#1a2a3a]/80 rounded text-sm text-[#b8bdc2]">
                        <div><b>Collection:</b> {file.collection_name}</div>
                        <div className="mt-1 whitespace-pre-wrap break-words"><b>Document:</b> {file.document}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prompt Editor Card */}
              {(
              <div className="bg-[#223a54]/80 backdrop-blur-xl rounded-2xl border border-[#366caa]/60 p-6 shadow-xl">
                <h3 className="text-sm font-medium text-[#e5eaf0] mb-2">Append Custom Instructions to System Prompt</h3>
                <p className="text-xs text-[#b8bdc2] mb-3">
                  These instructions will be appended to the system instructions provided to the AI. You can use them to modify the assistant’s behavior, tone, or output style.
                </p>
                <textarea
                  className="w-full h-48 p-3 rounded-lg bg-[#1a2a3a]/80 border border-[#366caa]/60 text-[#e5eaf0] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#6399c1]/50"
                  value={systemInstructionsEditable}
                  onChange={(e) => setSystemInstructionsEditable(e.target.value)}
                  placeholder="e.g., Please respond in bullet points. Be concise and formal..."
                />
                <button
                  onClick={handlePromptSend}
                  disabled={loading}
                  className="w-full mt-4 py-2 px-4 rounded-lg bg-gradient-to-r from-[#366caa] to-[#6399c1] text-white font-medium hover:shadow-lg transition-all disabled:opacity-50"
                >
                  Send Updated Instructions
                </button>

                {/* Optional Preview */}
                <details className="mt-4 text-sm text-[#b8bdc2]">
                  <summary className="cursor-pointer">🔍 Preview Final Instructions</summary>
                  <div className="mt-2 whitespace-pre-wrap bg-[#1a2a3a]/50 p-3 rounded border border-[#366caa]/50">
                    {[originalSystemInstructions, systemInstructionsEditable.trim()].filter(Boolean).join('\n\n')}
                  </div>
                </details>
              </div>
            )}
            </div>
          )}
        </div>

        {/* Response Grid for Comparison */}
        {responses.length > 0 && selectedLLM === 'Comparison' && (
          <div className="w-full max-w-6xl mx-auto mt-12">
            <div className="text-center mb-8">
              {responses.length === 3 && (
                <button
                  onClick={handleBestAnswer}
                  disabled={bestLoading}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-[#366caa] to-[#6399c1] text-white font-medium hover:shadow-lg transition-all"
                >
                  {bestLoading ? 'Finding Best Answer...' : '🏆 Find Best Answer'}
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {responses.map((resp, idx) => (
                <div
                  key={resp.model}
                  className="bg-[#223a54]/80 backdrop-blur-xl rounded-2xl border border-[#366caa]/60 p-6 shadow-xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-2xl bg-clip-text text-transparent bg-gradient-to-r ${LLM_OPTIONS.find(o => o.name === resp.model)?.gradient}`}>
                      {LLM_OPTIONS.find(o => o.name === resp.model)?.icon}
                    </span>
                    <span className="text-lg font-medium text-white">{resp.model}</span>
                  </div>
                  <div className="text-[#b8bdc2] text-sm leading-relaxed whitespace-pre-wrap">
                    {resp.content}
                  </div>
                </div>
              ))}
            </div>

            {bestAnswer && (
              <div className="mt-8 bg-gradient-to-r from-[#223a54]/90 to-[#3a5d7c]/90 backdrop-blur-xl rounded-2xl border border-[#366caa]/60 p-8 shadow-2xl">
                <div className="text-center mb-6">
                  <div className="text-3xl mb-2">🏆</div>
                  <span className="text-xl font-medium text-[#b8bdc2]">Best Answer</span>
                </div>
                <div className="text-white leading-relaxed whitespace-pre-wrap">
                  {bestAnswer}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Single Model Response */}
        {responses.length > 0 && selectedLLM !== 'Comparison' && (
          <div className="w-full max-w-4xl mx-auto mt-12">
            <div className="bg-[#223a54]/80 backdrop-blur-xl rounded-2xl border border-[#366caa]/60 p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <span className={`text-2xl bg-clip-text text-transparent bg-gradient-to-r ${selectedLLMOption?.gradient}`}>
                  {selectedLLMOption?.icon}
                </span>
                <span className="text-xl font-medium text-white">{selectedLLM}</span>
              </div>
              <div className="text-[#b8bdc2] leading-relaxed whitespace-pre-wrap">
                {responses[0].content}
              </div>
            </div>
          </div>
        )}
      </div>

      {/*Response Grid for Version Comparison */}
      {versionResponses.length > 0 && selectedLLM === 'Comparison Version' &&(
        <div className="w-full max-w-6xl mx-auto mt-12">
          <div className="text-center mb-8">
            {versionResponses.length === 3 && (
              <button
                onClick={handleBestVersionAnswer}
                disabled={bestLoading}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-[#366caa] to-[#6399c1] text-white font-medium hover:shadow-lg transition-all"
              >
                {bestLoading ? 'Finding Best Answer...' : '🏆 Find Best Answer'}
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {versionResponses.map((response, idx) => {
              // Defensive: fallback if highlights array is reordered or missing
              const highlightData = semanticHighlights?.find(
                (h) => h.version === response.version
              );
              const highlightedChunks = highlightData?.chunks || [];

              return (
                <div
                  key={response.version}
                  className="bg-[#223a54]/80 backdrop-blur-xl rounded-2xl border border-[#366caa]/60 p-6 shadow-xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-lg font-medium text-white">{response.version}</span>
                  </div>
                  <div className="text-[#b8bdc2] text-sm leading-relaxed whitespace-pre-wrap">
                    {highlightedChunks.length > 0
                      ? applyHighlights(response.content, highlightedChunks)
                      : <span>{response.content}</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {bestAnswer && (
            <div className="mt-8 bg-gradient-to-r from-[#223a54]/90 to-[#3a5d7c]/90 backdrop-blur-xl rounded-2xl border border-[#366caa]/60 p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="text-3xl mb-2">🏆</div>
                <span className="text-xl font-medium text-[#b8bdc2]">Best Answer</span>
              </div>
              <div className="text-white leading-relaxed whitespace-pre-wrap">
                {bestAnswer}
              </div>
            </div>
          )}
        </div>
      )}



      {/* Ambient Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#366caa]/20 to-[#6399c1]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-[#1a2a3a]/20 to-[#223a54]/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
