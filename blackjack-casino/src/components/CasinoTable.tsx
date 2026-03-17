'use client';

// ===== Main Casino Table Component =====

import React from 'react';
import { useGameStore } from '@/lib/store';
import { getThemeById } from '@/lib/themes';
import HandDisplay from './HandDisplay';
import BettingPanel from './BettingPanel';
import ActionButtons from './ActionButtons';
import GameMessage from './GameMessage';

export default function CasinoTable() {
  const { phase, playerHands, dealerHand, activeHandIndex, activeTheme, currentBet } = useGameStore();
  const theme = getThemeById(activeTheme);

  const showCards = phase !== 'betting' && phase !== 'game-over';

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Casino table felt */}
      <div
        className="relative rounded-[40px] sm:rounded-[60px] overflow-hidden shadow-2xl"
        style={{
          background: theme.feltGradient,
          minHeight: '70vh',
          border: `4px solid ${theme.borderColor}`,
          boxShadow: `0 0 40px rgba(0,0,0,0.5), inset 0 0 80px rgba(0,0,0,0.3), 0 0 0 8px ${theme.borderColor}20`,
        }}
      >
        {/* Decorative table edge line */}
        <div
          className="absolute inset-6 sm:inset-10 rounded-[30px] sm:rounded-[50px] border-2 pointer-events-none"
          style={{
            borderColor: `${theme.accentColor}15`,
          }}
        />

        {/* Decorative center diamond */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-24 h-24 sm:w-32 sm:h-32 rotate-45 border-2 rounded-lg opacity-[0.08]"
            style={{ borderColor: theme.accentColor }}
          />
        </div>

        {/* BLACKJACK text */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none">
          <span
            className="text-3xl sm:text-4xl font-bold tracking-[0.3em] uppercase opacity-[0.12]"
            style={{ color: theme.accentColor }}
          >
            BLACKJACK
          </span>
        </div>

        {/* Table content */}
        <div className="relative z-10 flex flex-col items-center justify-between py-8 sm:py-12 px-4 min-h-[70vh]">

          {/* ===== Dealer Area ===== */}
          <div className="flex flex-col items-center gap-2 min-h-[140px] sm:min-h-[180px]">
            {showCards && dealerHand.cards.length > 0 && (
              <HandDisplay
                hand={dealerHand}
                isDealer={true}
                label="Dealer"
              />
            )}
          </div>

          {/* ===== Center: Message + Betting ===== */}
          <div className="flex flex-col items-center gap-4 my-4 sm:my-6">
            {/* Current bet during play */}
            {showCards && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/10">
                <span className="text-sm text-amber-200/60">Einsatz:</span>
                <span className="text-lg font-bold text-amber-300">
                  {playerHands.reduce((sum, h) => sum + h.bet, 0)}
                </span>
              </div>
            )}

            <GameMessage />

            {phase === 'betting' && <BettingPanel />}
            {phase === 'player-turn' && <ActionButtons />}
          </div>

          {/* ===== Player Area ===== */}
          <div className="flex items-end justify-center gap-8 min-h-[140px] sm:min-h-[180px]">
            {showCards && playerHands.map((hand, i) => (
              <HandDisplay
                key={i}
                hand={hand}
                isActive={phase === 'player-turn' && i === activeHandIndex}
                label={playerHands.length > 1 ? `Hand ${i + 1}` : 'Spieler'}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
