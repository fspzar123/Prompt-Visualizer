'use client';

import React from 'react';

interface LLMOption {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface ComparisonProps {
  responses: { model: string; content: string }[];
  llmOptions: LLMOption[];
}

const ResponseComparison: React.FC<ComparisonProps> = ({ responses, llmOptions }) => (
  <div className="mt-8">
    <h3 className="font-semibold mb-3 text-lg text-center">Model Responses</h3>
    <div className="grid md:grid-cols-3 gap-6">
      {responses.map((res, i) => {
        const opt = llmOptions.find(o => o.name === res.model);
        return (
          <div
            key={opt ? opt.id : res.model}
            className={`rounded-xl shadow-lg p-4 text-white bg-gradient-to-br ${opt?.color ?? 'from-gray-400 to-gray-600'}`}
          >
            <div className="flex items-center gap-2 mb-2 font-bold text-xl">
              <span>{opt?.icon}</span>
              {res.model}
            </div>
            <div className="text-base">{res.content}</div>
          </div>
        );
      })}
    </div>
  </div>
);

export default ResponseComparison;
