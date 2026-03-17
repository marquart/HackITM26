'use client';

// ===== Quiz Placeholder Modal =====

import React from 'react';

interface QuizPlaceholderProps {
  onClose: () => void;
}

export default function QuizPlaceholder({ onClose }: QuizPlaceholderProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative max-w-md w-full mx-4 rounded-2xl overflow-hidden
        bg-gradient-to-b from-gray-900 to-black border border-purple-500/30 shadow-2xl p-8 text-center">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20
            flex items-center justify-center text-white transition-colors"
        >
          ✕
        </button>

        {/* Content */}
        <div className="flex flex-col items-center gap-6">
          <div className="text-6xl">🧠</div>
          <h2 className="text-2xl font-bold shimmer-text">Quiz</h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
          <p className="text-gray-300 leading-relaxed">
            Bald verfügbar! Im Quiz-Modus kannst du durch das Beantworten
            von Fragen zusätzliche Tokens verdienen.
          </p>
          <div className="flex items-center gap-2 text-purple-400 text-sm">
            <span className="animate-pulse">●</span>
            <span>Coming Soon</span>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-purple-600 text-white font-semibold
              hover:bg-purple-500 transition-colors duration-200"
          >
            Zurück zum Spiel
          </button>
        </div>
      </div>
    </div>
  );
}
