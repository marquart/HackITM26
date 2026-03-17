'use client';

// ===== Shop Component =====

import React, { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { SHOP_THEMES } from '@/lib/themes';

interface ShopProps {
  onClose: () => void;
}

export default function Shop({ onClose }: ShopProps) {
  const { balance, ownedThemes, activeTheme, buyTheme, setActiveTheme } = useGameStore();
  const [notification, setNotification] = useState<string | null>(null);

  const handleBuy = (themeId: string, price: number) => {
    if (ownedThemes.includes(themeId)) {
      setActiveTheme(themeId);
      setNotification('Design aktiviert!');
    } else if (balance >= price) {
      const success = buyTheme(themeId, price);
      if (success) {
        setActiveTheme(themeId);
        setNotification(`"${SHOP_THEMES.find(t => t.id === themeId)?.name}" gekauft & aktiviert!`);
      }
    } else {
      setNotification('Nicht genug Tokens!');
    }
    setTimeout(() => setNotification(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 rounded-2xl overflow-hidden
        bg-gradient-to-b from-gray-900 via-gray-900 to-black border border-amber-500/30 shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4
          bg-gradient-to-r from-amber-900/60 via-amber-800/40 to-amber-900/60 border-b border-amber-500/20">
          <div>
            <h2 className="text-2xl font-bold shimmer-text">🏪 Casino Shop</h2>
            <p className="text-sm text-amber-200/50">Kaufe exklusive Tisch-Designs</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-amber-200/50">Dein Guthaben</div>
              <div className="text-xl font-bold text-amber-300">{balance.toLocaleString()} Tokens</div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center
                text-white text-xl transition-colors duration-200"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 px-6 py-3 rounded-xl
            bg-amber-600 text-black font-bold shadow-lg shadow-amber-600/40 fade-in">
            {notification}
          </div>
        )}

        {/* Theme Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SHOP_THEMES.map((theme) => {
            const isOwned = ownedThemes.includes(theme.id);
            const isActive = activeTheme === theme.id;
            const canAfford = balance >= theme.price;

            return (
              <div
                key={theme.id}
                className={`
                  relative rounded-xl overflow-hidden border-2 transition-all duration-300
                  ${isActive ? 'border-amber-400 shadow-lg shadow-amber-400/20 scale-[1.02]' :
                    isOwned ? 'border-green-500/40 hover:border-green-400/60' :
                    'border-white/10 hover:border-white/20'}
                `}
              >
                {/* Preview */}
                <div
                  className="h-32 relative"
                  style={{ background: theme.feltGradient }}
                >
                  {/* Table edge */}
                  <div
                    className="absolute inset-4 rounded-full border-4 opacity-30"
                    style={{ borderColor: theme.borderColor }}
                  />

                  {/* Decorative center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-16 h-16 rounded-full border-2 opacity-20"
                      style={{ borderColor: theme.accentColor }}
                    />
                  </div>

                  {/* Active badge */}
                  {isActive && (
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-amber-500 text-black text-xs font-bold">
                      ✓ Aktiv
                    </div>
                  )}

                  {/* Owned badge */}
                  {isOwned && !isActive && (
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-green-600 text-white text-xs font-bold">
                      ✓ Gekauft
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 bg-black/60">
                  <h3 className="text-lg font-bold text-white mb-1">{theme.name}</h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{theme.description}</p>

                  {/* Price & action */}
                  <div className="flex items-center justify-between">
                    <div>
                      {theme.price === 0 ? (
                        <span className="text-green-400 font-semibold">Kostenlos</span>
                      ) : isOwned ? (
                        <span className="text-green-400 font-semibold">Im Besitz</span>
                      ) : (
                        <span className={`font-bold ${canAfford ? 'text-amber-300' : 'text-red-400'}`}>
                          {theme.price.toLocaleString()} Tokens
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleBuy(theme.id, theme.price)}
                      disabled={!isOwned && !canAfford && theme.price > 0}
                      className={`
                        px-4 py-1.5 rounded-lg font-semibold text-sm transition-all duration-200
                        ${isActive ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-default' :
                          isOwned ? 'bg-green-600 text-white hover:bg-green-500' :
                          canAfford ? 'bg-amber-600 text-black hover:bg-amber-500 hover:scale-105' :
                          'bg-gray-700 text-gray-400 cursor-not-allowed'}
                      `}
                    >
                      {isActive ? 'Aktiv' : isOwned ? 'Auswählen' : 'Kaufen'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
