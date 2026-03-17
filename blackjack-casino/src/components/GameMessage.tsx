'use client';

// ===== Game Message Display =====

import React from 'react';
import { useGameStore } from '@/lib/store';

export default function GameMessage() {
  const { message, phase, newRound, resetGame, balance } = useGameStore();

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Message */}
      <div className={`
        px-6 py-3 rounded-2xl text-center font-semibold text-lg
        backdrop-blur-sm border
        ${phase === 'settlement'
          ? 'bg-black/60 border-amber-500/30 text-amber-100'
          : 'bg-black/40 border-white/10 text-white/90'}
        fade-in max-w-lg
      `}>
        {message}
      </div>

      {/* Continue / Reset buttons */}
      {phase === 'settlement' && (
        <div className="flex items-center gap-3 fade-in">
          <button
            onClick={newRound}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500
              text-black font-bold text-lg shadow-lg shadow-amber-600/30
              hover:from-amber-500 hover:to-amber-400 hover:scale-105
              active:scale-95 transition-all duration-200"
          >
            Nächste Runde 🎲
          </button>
        </div>
      )}

      {phase === 'game-over' && (
        <div className="flex flex-col items-center gap-4 fade-in">
          <p className="text-red-300 text-lg">Du hast keine Tokens mehr!</p>
          <button
            onClick={resetGame}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500
              text-white font-bold text-lg shadow-lg shadow-red-600/30
              hover:from-red-500 hover:to-red-400 hover:scale-105
              active:scale-95 transition-all duration-200"
          >
            Neues Spiel starten (8.000 Tokens)
          </button>
        </div>
      )}
    </div>
  );
}
