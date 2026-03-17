'use client';

// ===== Hand Display Component =====

import React from 'react';
import type { Hand } from '@/lib/types';
import { formatHandValue } from '@/lib/deck';
import PlayingCard from './PlayingCard';

interface HandDisplayProps {
  hand: Hand;
  isDealer?: boolean;
  isActive?: boolean;
  label?: string;
  showValue?: boolean;
}

export default function HandDisplay({ hand, isDealer = false, isActive = false, label, showValue = true }: HandDisplayProps) {
  const value = formatHandValue(hand.cards, !isDealer || hand.cards.every(c => c.faceUp));

  const resultColors: Record<string, string> = {
    win: 'text-green-400',
    blackjack: 'text-yellow-300',
    lose: 'text-red-400',
    push: 'text-blue-300',
  };

  const resultLabels: Record<string, string> = {
    win: '🏆 Gewonnen!',
    blackjack: '🃏 Blackjack!',
    lose: '❌ Verloren',
    push: '🤝 Push',
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${isActive ? 'scale-105' : ''} transition-transform duration-300`}>
      {/* Label */}
      {label && (
        <div className="text-sm font-semibold text-amber-200/80 uppercase tracking-wider">
          {label}
        </div>
      )}

      {/* Cards */}
      <div className="flex items-center justify-center gap-[-8px]" style={{ gap: '-8px' }}>
        {hand.cards.map((card, i) => (
          <div
            key={`${card.suit}-${card.rank}-${i}`}
            style={{
              marginLeft: i > 0 ? '-12px' : '0',
              zIndex: i,
              transform: `rotate(${(i - (hand.cards.length - 1) / 2) * 3}deg)`,
            }}
          >
            <PlayingCard card={card} index={i} isNew={false} />
          </div>
        ))}
      </div>

      {/* Value display */}
      {showValue && value && (
        <div className={`
          px-3 py-1 rounded-full text-sm font-bold
          ${hand.isBusted ? 'bg-red-900/80 text-red-300' :
            hand.isBlackjack ? 'bg-yellow-900/80 text-yellow-300 glow-gold' :
            'bg-black/50 text-white'}
          backdrop-blur-sm border border-white/10
        `}>
          {hand.isBusted ? `💥 Bust (${value})` :
           hand.isBlackjack ? `✨ Blackjack!` :
           value}
        </div>
      )}

      {/* Result badge */}
      {hand.result && (
        <div className={`text-lg font-bold ${resultColors[hand.result] || 'text-white'} fade-in`}>
          {resultLabels[hand.result] || hand.result}
        </div>
      )}

      {/* Active hand indicator */}
      {isActive && !isDealer && (
        <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse shadow-lg shadow-amber-400/50" />
      )}
    </div>
  );
}
