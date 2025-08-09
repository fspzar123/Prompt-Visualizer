import React, { useState, useEffect } from 'react';

interface ChatInputProps {
  onSend: (msg: string) => void;
  loading?: boolean;
  context?: string[]; // send previous messages or suggestion context
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, loading, context = [] }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);

const [isFocused, setIsFocused] = useState(false);


  // Fetch suggestions
  useEffect(() => {
    if (input.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: input,
            context,
          }),
        });
        const data = await res.json();
        setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
      } catch (err) {
        console.error('Failed to fetch suggestions', err);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 150);
    return () => clearTimeout(delayDebounce);
  }, [input, context]);

  const handleSend = () => {
    if (input.trim() && !loading) {
      onSend(input.trim());
      setInput('');
      setSuggestions([]);
      setActiveSuggestion(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (activeSuggestion >= 0) {
        setInput(suggestions[activeSuggestion]);
        setSuggestions([]);
        e.preventDefault();
      } else {
        handleSend();
      }
    }

    if (e.key === 'ArrowDown') {
      setActiveSuggestion((prev) => Math.min(prev + 1, suggestions.length - 1));
    }

    if (e.key === 'ArrowUp') {
      setActiveSuggestion((prev) => Math.max(prev - 1, 0));
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setInput(suggestion);
    setSuggestions([]);
    setActiveSuggestion(-1);
  };

  return (
    <div className="w-full flex justify-center py-4 relative">
      <div className="flex w-full max-w-xl items-center bg-gray-800 rounded-full px-5 py-2 shadow-sm relative">
        <input
          className="flex-1 bg-transparent border-none outline-none px-2 py-2 text-amber-50 placeholder-gray-400 text-base"
          placeholder="Write a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)} // delay to allow clicks
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className={`ml-2 flex items-center justify-center w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <svg className="w-5 h-5" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Suggestion List */}
      {suggestions.length > 0 && isFocused && (
      <ul
        className="absolute left-1/2 transform -translate-x-1/2 bottom-14
                   w-full max-w-xl rounded-xl shadow-lg z-50
                   bg-gradient-to-br from-zinc-900 via-zinc-800 to-[#3a5d7c]
                   border border-[#366caa]/40 backdrop-blur-md
                   text-sm text-white overflow-hidden animate-fade-in"
      >
        {suggestions.map((s, idx) => (
          <li
            key={idx}
            onClick={() => selectSuggestion(s)}
            className={`
              px-4 py-2 cursor-pointer
              border-b border-zinc-700/40
              transition duration-200
              ${idx === activeSuggestion
                ? 'bg-[#3a5d7c] text-blue-300 font-medium'
                : 'hover:bg-zinc-700/70'}
            `}
          >
            {s}
          </li>
        ))}
      </ul>
      )}

    </div>
  );
};

export default ChatInput;
