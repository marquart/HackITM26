'use client';

// ===== Betting Panel Component =====
// Premium casino chip tray with polished layout, felt backing, and gold accents

import React from 'react';
import { useGameStore } from '@/lib/store';
import type { ChipValue } from '@/lib/types';
import Chip from './Chip';

export default function BettingPanel() {
  const { balance, currentBet, phase, placeBet, clearBet, startRound } = useGameStore();

  if (phase !== 'betting') return null;

  return (
    <div className="flex flex-col items-center gap-5 fade-in w-full max-w-lg mx-auto">
      {/* Current bet display */}
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[11px] text-amber-300/50 uppercase tracking-[0.2em] font-medium">Dein Einsatz</span>
        <span className="text-4xl font-bold shimmer-text">
          {currentBet.toLocaleString()}
        </span>
      </div>

      {/* ===== Chips ===== */}
      <div className="flex flex-col items-center gap-4">
        {/* Top row: 1, 5, 25, 50 */}
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          {([1, 5, 25, 50] as ChipValue[]).map((value) => (
            <Chip
              key={value}
              value={value}
              onClick={() => placeBet(value)}
              disabled={balance < value}
              size="lg"
            />
          ))}
        </div>

        {/* Bottom row: 100, 500, 1000 */}
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          {([100, 500, 1000] as ChipValue[]).map((value) => (
            <Chip
              key={value}
              value={value}
              onClick={() => placeBet(value)}
              disabled={balance < value}
              size="lg"
            />
          ))}
        </div>
      </div>

      {/* ===== Action Buttons ===== */}
      <div className="flex items-center gap-3 sm:gap-4 w-full justify-center">
        <button
          onClick={clearBet}
          disabled={currentBet === 0}
          className="px-5 sm:px-6 py-2.5 rounded-xl bg-red-950/70 text-red-200 font-semibold text-sm
            border border-red-800/40 hover:bg-red-900/70 hover:border-red-700/50
            disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200"
        >
          Zurücksetzen
        </button>

        <button
          onClick={startRound}
          disabled={currentBet < 1}
          className="px-8 sm:px-10 py-3 rounded-xl bg-gradient-to-b from-amber-500 to-amber-600
            text-black font-bold text-base sm:text-lg
            shadow-lg shadow-amber-700/30
            hover:from-amber-400 hover:to-amber-500 hover:shadow-amber-600/40
            disabled:opacity-25 disabled:cursor-not-allowed
            transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
        >
          Karten geben! 🃏
        </button>
      </div>
    </div>
  );
}
