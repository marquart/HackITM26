'use client';

// ===== Balance Display Component =====

import React from 'react';
import { useGameStore } from '@/lib/store';

export default function BalanceDisplay() {
  const { balance } = useGameStore();

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-sm border border-amber-500/20">
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xs font-bold text-black">
        T
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] text-amber-200/50 uppercase tracking-wider leading-none">Balance</span>
        <span className="text-lg font-bold text-amber-200 leading-tight">{balance.toLocaleString()}</span>
      </div>
    </div>
  );
}
