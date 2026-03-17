'use client';

// ===== Main Game Page =====

import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/lib/store';
import CasinoTable from '@/components/CasinoTable';
import BalanceDisplay from '@/components/BalanceDisplay';
import Shop from '@/components/Shop';
import QuizPlaceholder from '@/components/QuizPlaceholder';

export default function Home() {
  const { roundNumber, resetGame } = useGameStore();
  const [showShop, setShowShop] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Prevent hydration mismatch from zustand persist
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0a0e0a] flex items-center justify-center">
        <div className="text-amber-400 text-2xl font-bold shimmer-text">
          Lade Casino...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e0a] relative overflow-hidden">
      {/* Background ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-800/10 rounded-full blur-3xl" />
      </div>

      {/* ===== Top Bar ===== */}
      <header className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-3
        bg-black/50 backdrop-blur-md border-b border-amber-500/10">

        {/* Logo + New Game */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
            <img src="/card-back.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold shimmer-text leading-tight">ARD Casino</h1>
            <p className="text-[10px] text-amber-200/40 uppercase tracking-widest">Premium Blackjack</p>
          </div>
          <div className="w-px h-8 bg-white/10 mx-1 hidden sm:block" />
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-1.5 rounded-lg bg-white/[0.06] text-white/60 font-medium text-xs
              border border-white/[0.08] hover:bg-white/[0.12] hover:text-white/90 hover:border-white/20
              transition-all duration-200 whitespace-nowrap"
          >
            🔄 New Game
          </button>
        </div>

        {/* Center: Round counter */}
        <div className="hidden sm:flex items-center gap-2 text-sm text-white/40">
          <span>Runde</span>
          <span className="text-amber-300 font-bold">{roundNumber}</span>
        </div>

        {/* Right: Balance + buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <BalanceDisplay />

          <button
            onClick={() => setShowShop(true)}
            className="px-3 sm:px-4 py-2 rounded-lg bg-amber-600/20 text-amber-300 font-semibold text-sm
              border border-amber-500/30 hover:bg-amber-600/30 hover:border-amber-400/50
              transition-all duration-200 hover:scale-105"
          >
            🏪 <span className="hidden sm:inline">Shop</span>
          </button>

          <button
            onClick={() => setShowQuiz(true)}
            className="px-3 sm:px-4 py-2 rounded-lg bg-purple-600/20 text-purple-300 font-semibold text-sm
              border border-purple-500/30 hover:bg-purple-600/30 hover:border-purple-400/50
              transition-all duration-200 hover:scale-105"
          >
            🧠 <span className="hidden sm:inline">Quiz</span>
          </button>
        </div>
      </header>

      {/* ===== Main Content ===== */}
      <main className="relative z-10 px-2 sm:px-4 py-4 sm:py-8">
        <CasinoTable />
      </main>

      {/* ===== Modals ===== */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="max-w-sm w-full mx-4 rounded-2xl bg-gradient-to-b from-gray-900 to-black
            border border-amber-500/30 shadow-2xl p-6 text-center fade-in">
            <div className="text-4xl mb-3">🔄</div>
            <h3 className="text-xl font-bold text-white mb-2">Neues Spiel starten?</h3>
            <p className="text-sm text-gray-400 mb-6">
              Dein aktueller Spielstand wird zurückgesetzt.<br />
              Du erhältst 8.000 Tokens als Startguthaben.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-5 py-2 rounded-lg bg-white/10 text-white/70 font-semibold text-sm
                  border border-white/10 hover:bg-white/15 transition-all duration-200"
              >
                Abbrechen
              </button>
              <button
                onClick={() => {
                  // Clear persisted store and reset
                  localStorage.removeItem('blackjack-casino-storage');
                  resetGame();
                  setShowResetConfirm(false);
                  window.location.reload();
                }}
                className="px-5 py-2 rounded-lg bg-amber-600 text-black font-bold text-sm
                  hover:bg-amber-500 transition-all duration-200 hover:scale-105"
              >
                Neues Spiel
              </button>
            </div>
          </div>
        </div>
      )}
      {showShop && <Shop onClose={() => setShowShop(false)} />}
      {showQuiz && <QuizPlaceholder onClose={() => setShowQuiz(false)} />}
    </div>
  );
}
