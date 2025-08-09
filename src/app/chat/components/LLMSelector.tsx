'use client';

import React from 'react';

interface LLMOption {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface LLMSelectorProps {
  selected: string;
  options: LLMOption[];
  onChange: (model: string) => void;
}

const LLMSelector: React.FC<LLMSelectorProps> = ({ selected, options, onChange }) => (
  <div className="flex flex-col gap-4">
    {options.map(opt => (
      <button
        key={opt.id}
        className={`flex items-center gap-3 px-5 py-3 rounded-xl font-semibold shadow transition
          ${selected === opt.name
            ? `bg-gradient-to-r ${opt.color} text-white scale-105 ring-2 ring-indigo-400`
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:scale-105'
          }`}
        onClick={() => onChange(opt.name)}
        type="button"
      >
        <span className="text-2xl">{opt.icon}</span>
        <span className="text-lg">{opt.name}</span>
      </button>
    ))}
  </div>
);

export default LLMSelector;
