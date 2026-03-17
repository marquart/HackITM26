'use client';

// ===== Action Buttons Component =====

import React from 'react';
import { useGameStore } from '@/lib/store';

export default function ActionButtons() {
  const { phase, hit, stand, double, split, getAvailableActions } = useGameStore();

  if (phase !== 'player-turn') return null;

  const available = getAvailableActions();

  const buttons = [
    {
      action: 'hit',
      label: 'Hit',
      icon: '🎯',
      style: 'from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-blue-600/30',
      fn: hit,
    },
    {
      action: 'stand',
      label: 'Stand',
      icon: '✋',
      style: 'from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-amber-600/30',
      fn: stand,
    },
    {
      action: 'double',
      label: 'Double',
      icon: '⚡',
      style: 'from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 shadow-purple-600/30',
      fn: double,
    },
    {
      action: 'split',
      label: 'Split',
      icon: '✌️',
      style: 'from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 shadow-green-600/30',
      fn: split,
    },
  ];

  return (
    <div className="flex items-center justify-center gap-3 fade-in">
      {buttons.map((btn) => {
        const isAvailable = available.includes(btn.action);
        return (
          <button
            key={btn.action}
            onClick={btn.fn}
            disabled={!isAvailable}
            className={`
              px-6 py-3 rounded-xl font-bold text-white text-lg
              bg-gradient-to-r ${btn.style}
              shadow-lg transition-all duration-200
              hover:scale-105 active:scale-95
              disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:scale-100
              border border-white/10
            `}
          >
            <span className="mr-1">{btn.icon}</span> {btn.label}
          </button>
        );
      })}
    </div>
  );
}
