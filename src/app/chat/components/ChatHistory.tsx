'use client';

import React from 'react';

interface Message {
  role: 'user' | 'bot';
  content: string;
  model?: string;
}

const modelAvatars: Record<string, string> = {
  'GPT-4': '🤖',
  'Claude': '🦙',
  'Mistral': '🌊',
  'Bot': '🤖'
};

const ChatHistory: React.FC<{ messages: Message[] }> = ({ messages }) => (
  <div className="flex flex-col gap-4 mb-4 max-h-96 overflow-y-auto">
    {messages.map((msg, idx) => (
      <div
        key={idx}
        className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
      >
        {msg.role === 'bot' && (
          <span className="text-2xl">{modelAvatars[msg.model || 'Bot']}</span>
        )}
        <div className={`p-3 rounded-2xl shadow-md max-w-[70%] transition-all duration-200
          ${msg.role === 'user'
            ? 'bg-gradient-to-br from-indigo-300 to-pink-300 text-gray-900 rounded-br-sm'
            : 'bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-gray-100 rounded-bl-sm'
          }`}
        >
          <div className="text-xs opacity-60 mb-1 flex items-center gap-1">
            {msg.role === 'user' ? 'You' : <span className="font-bold">{msg.model}</span>}
          </div>
          <div className="whitespace-pre-wrap">{msg.content}</div>
        </div>
        {msg.role === 'user' && (
          <span className="text-2xl bg-gradient-to-br from-indigo-400 to-pink-400 text-white rounded-full px-2 py-1">🧑</span>
        )}
      </div>
    ))}
  </div>
);

export default ChatHistory;
