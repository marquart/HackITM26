'use client';

// ===== Playing Card Component =====
// Authentic official playing card design with real pip layouts,
// traditional face card illustrations, and proper corner indices.
// Uses custom card back design from /public/card-back.png
// Features: dealer hole-card flip animation

import React, { useState, useEffect, useRef } from 'react';
import type { Card as CardType, Suit } from '@/lib/types';
import { SUIT_SYMBOLS, SUIT_COLORS } from '@/lib/types';

interface PlayingCardProps {
  card: CardType;
  index?: number;
  isNew?: boolean;
  small?: boolean;
}

export default function PlayingCard({ card, index = 0, isNew = false, small = false }: PlayingCardProps) {
  const w = small ? 'w-16 h-24' : 'w-[90px] h-[130px] sm:w-[100px] sm:h-[144px]';

  // Track previous faceUp state to trigger flip animation
  const prevFaceUp = useRef(card.faceUp);
  const [flipping, setFlipping] = useState(false);
  const [showFront, setShowFront] = useState(card.faceUp);

  useEffect(() => {
    if (!prevFaceUp.current && card.faceUp) {
      setFlipping(true);
      const halfTimer = setTimeout(() => setShowFront(true), 250);
      const endTimer = setTimeout(() => setFlipping(false), 520);
      prevFaceUp.current = card.faceUp;
      return () => { clearTimeout(halfTimer); clearTimeout(endTimer); };
    }
    prevFaceUp.current = card.faceUp;
    setShowFront(card.faceUp);
  }, [card.faceUp]);

  return (
    <div
      className={`${w} flex-shrink-0 ${isNew ? 'card-deal' : ''}`}
      style={{
        perspective: '800px',
        animationDelay: isNew ? `${index * 0.15}s` : '0s',
      }}
    >
      <div
        className="relative w-full h-full transition-transform duration-500 ease-in-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipping ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {showFront ? (
          <CardFace card={card} small={small} flipping={flipping} />
        ) : (
          <CardBack />
        )}
      </div>
    </div>
  );
}

/* Card Back */
function CardBack() {
  return (
    <div className="w-full h-full rounded-lg shadow-2xl overflow-hidden border border-gray-600">
      <img
        src="/card-back.png"
        alt="Card Back"
        className="w-full h-full object-cover rounded-lg"
        draggable={false}
      />
    </div>
  );
}

/* Card Face */
function CardFace({ card, small, flipping }: { card: CardType; small: boolean; flipping: boolean }) {
  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
  const color = isRed ? '#c41e3a' : '#1a1a1a';
  const symbol = SUIT_SYMBOLS[card.suit];
  const isFace = ['J', 'Q', 'K'].includes(card.rank);

  return (
    <div
      className={`w-full h-full rounded-lg shadow-2xl overflow-hidden relative ${flipping ? 'card-flip' : ''}`}
      style={{
        background: '#fff',
        border: '1px solid #c0c0c0',
      }}
    >
      {/* Top-left corner index */}
      <div className="absolute flex flex-col items-center leading-none z-20"
        style={{ top: small ? 2 : 4, left: small ? 3 : 5 }}>
        <span style={{ color, fontSize: small ? 10 : 13, fontWeight: 800, fontFamily: 'Georgia, serif', lineHeight: 1 }}>
          {card.rank}
        </span>
        <span style={{ color, fontSize: small ? 8 : 11, lineHeight: 1, marginTop: -1 }}>
          {symbol}
        </span>
      </div>

      {/* Bottom-right corner index (rotated) */}
      <div className="absolute flex flex-col items-center leading-none rotate-180 z-20"
        style={{ bottom: small ? 2 : 4, right: small ? 3 : 5 }}>
        <span style={{ color, fontSize: small ? 10 : 13, fontWeight: 800, fontFamily: 'Georgia, serif', lineHeight: 1 }}>
          {card.rank}
        </span>
        <span style={{ color, fontSize: small ? 8 : 11, lineHeight: 1, marginTop: -1 }}>
          {symbol}
        </span>
      </div>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isFace ? (
          <FaceCard rank={card.rank} suit={card.suit} small={small} />
        ) : card.rank === 'A' ? (
          <AceCard suit={card.suit} small={small} />
        ) : (
          <PipLayout rank={card.rank} suit={card.suit} small={small} />
        )}
      </div>
    </div>
  );
}

/* Suit SVG shapes */
function SuitSVG({ suit, size, color }: { suit: Suit; size: number; color: string }) {
  switch (suit) {
    case 'hearts':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <path d="M50 88 C25 65 0 50 0 30 C0 12 12 0 28 0 C38 0 46 6 50 15 C54 6 62 0 72 0 C88 0 100 12 100 30 C100 50 75 65 50 88Z" fill={color} />
        </svg>
      );
    case 'diamonds':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <path d="M50 0 L95 50 L50 100 L5 50 Z" fill={color} />
        </svg>
      );
    case 'clubs':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <circle cx="50" cy="30" r="22" fill={color} />
          <circle cx="28" cy="55" r="22" fill={color} />
          <circle cx="72" cy="55" r="22" fill={color} />
          <rect x="45" y="55" width="10" height="30" fill={color} />
          <path d="M35 95 Q50 80 65 95 Z" fill={color} />
        </svg>
      );
    case 'spades':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <path d="M50 5 C50 5 0 45 0 65 C0 80 15 88 30 80 C40 74 46 65 50 55 C54 65 60 74 70 80 C85 88 100 80 100 65 C100 45 50 5 50 5Z" fill={color} />
          <rect x="45" y="65" width="10" height="22" fill={color} />
          <path d="M32 95 Q50 80 68 95 Z" fill={color} />
        </svg>
      );
  }
}

/* Ace Card */
function AceCard({ suit, small }: { suit: Suit; small: boolean }) {
  const isRed = suit === 'hearts' || suit === 'diamonds';
  const color = isRed ? '#c41e3a' : '#1a1a1a';
  const suitSize = small ? 36 : 52;

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.12))' }}>
        <SuitSVG suit={suit} size={suitSize} color={color} />
      </div>
    </div>
  );
}

/* Pip Layout for Number Cards (2-10) — standard playing card positions */
function PipLayout({ rank, suit, small }: { rank: string; suit: Suit; small: boolean }) {
  const isRed = suit === 'hearts' || suit === 'diamonds';
  const color = isRed ? '#c41e3a' : '#1a1a1a';
  const num = parseInt(rank, 10);
  const pipSize = small ? 11 : 15;

  // Official pip positions: [x%, y%, inverted]
  const pipPositions: Record<number, Array<[number, number, boolean]>> = {
    2: [
      [50, 22, false],
      [50, 78, true],
    ],
    3: [
      [50, 22, false],
      [50, 50, false],
      [50, 78, true],
    ],
    4: [
      [32, 22, false], [68, 22, false],
      [32, 78, true],  [68, 78, true],
    ],
    5: [
      [32, 22, false], [68, 22, false],
      [50, 50, false],
      [32, 78, true],  [68, 78, true],
    ],
    6: [
      [32, 22, false], [68, 22, false],
      [32, 50, false], [68, 50, false],
      [32, 78, true],  [68, 78, true],
    ],
    7: [
      [32, 22, false], [68, 22, false],
      [50, 36, false],
      [32, 50, false], [68, 50, false],
      [32, 78, true],  [68, 78, true],
    ],
    8: [
      [32, 22, false], [68, 22, false],
      [50, 36, false],
      [32, 50, false], [68, 50, false],
      [50, 64, true],
      [32, 78, true],  [68, 78, true],
    ],
    9: [
      [32, 20, false], [68, 20, false],
      [32, 37, false], [68, 37, false],
      [50, 50, false],
      [32, 63, true],  [68, 63, true],
      [32, 80, true],  [68, 80, true],
    ],
    10: [
      [32, 18, false], [68, 18, false],
      [50, 30, false],
      [32, 38, false], [68, 38, false],
      [32, 62, true],  [68, 62, true],
      [50, 70, true],
      [32, 82, true],  [68, 82, true],
    ],
  };

  const pips = pipPositions[num];
  if (!pips) return null;

  return (
    <div className="absolute" style={{
      top: small ? 16 : 22,
      bottom: small ? 16 : 22,
      left: small ? 6 : 10,
      right: small ? 6 : 10,
    }}>
      {pips.map(([x, y, inverted], i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: `translate(-50%, -50%) ${inverted ? 'rotate(180deg)' : ''}`,
          }}
        >
          <SuitSVG suit={suit} size={pipSize} color={color} />
        </div>
      ))}
    </div>
  );
}

/* Face Cards — Jack, Queen, King */
function FaceCard({ rank, suit, small }: { rank: string; suit: Suit; small: boolean }) {
  const isRed = suit === 'hearts' || suit === 'diamonds';
  const suitColor = isRed ? '#c41e3a' : '#1a1a1a';
  const symbol = SUIT_SYMBOLS[suit];

  const schemes: Record<string, { primary: string; secondary: string; skin: string; hair: string; accent: string }> = {
    J: {
      primary: isRed ? '#c41e3a' : '#1a3a8a',
      secondary: isRed ? '#e8a020' : '#d4a843',
      skin: '#f2d5a0',
      hair: isRed ? '#8b4513' : '#2c2018',
      accent: '#d4a843',
    },
    Q: {
      primary: isRed ? '#9b1b30' : '#1a3070',
      secondary: isRed ? '#d4a843' : '#d4a843',
      skin: '#f5deb3',
      hair: isRed ? '#d4760a' : '#1a1a1a',
      accent: '#d4a843',
    },
    K: {
      primary: isRed ? '#8b1a1a' : '#0f1f5a',
      secondary: isRed ? '#d4a843' : '#d4a843',
      skin: '#f0d0a0',
      hair: isRed ? '#5a3010' : '#2c2018',
      accent: '#d4a843',
    },
  };
  const s = schemes[rank] || schemes.J;

  return (
    <div className="absolute" style={{
      top: small ? 14 : 20,
      bottom: small ? 14 : 20,
      left: small ? 3 : 5,
      right: small ? 3 : 5,
    }}>
      <svg viewBox="0 0 80 120" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Background panel */}
        <rect x="0" y="0" width="80" height="120" rx="2" fill={`${s.primary}12`}
          stroke={`${s.accent}40`} strokeWidth="0.8" />
        {/* Inner frame */}
        <rect x="3" y="3" width="74" height="114" rx="1.5" fill="none"
          stroke={`${s.accent}30`} strokeWidth="0.5" strokeDasharray="2 1" />

        {rank === 'J' && <JackSVG s={s} suitColor={suitColor} symbol={symbol} suit={suit} isRed={isRed} />}
        {rank === 'Q' && <QueenSVG s={s} suitColor={suitColor} symbol={symbol} suit={suit} isRed={isRed} />}
        {rank === 'K' && <KingSVG s={s} suitColor={suitColor} symbol={symbol} suit={suit} isRed={isRed} />}
      </svg>
    </div>
  );
}

/* Jack illustration */
function JackSVG({ s, suitColor, symbol, suit, isRed }: {
  s: { primary: string; secondary: string; skin: string; hair: string; accent: string };
  suitColor: string; symbol: string; suit: Suit; isRed: boolean;
}) {
  return (
    <g>
      {/* Hat */}
      <ellipse cx="40" cy="20" rx="18" ry="6" fill={s.primary} />
      <rect x="22" y="14" width="36" height="8" rx="2" fill={s.primary} />
      <rect x="24" y="19" width="32" height="1.5" fill={s.accent} rx="0.5" />
      {/* Feather */}
      <path d="M54 14 Q62 6 58 0" fill="none" stroke={s.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M56 12 Q64 8 60 2" fill="none" stroke={s.secondary} strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />

      {/* Face */}
      <ellipse cx="40" cy="32" rx="12" ry="14" fill={s.skin} stroke={`${s.hair}30`} strokeWidth="0.5" />
      <path d="M28 28 Q28 18 35 16" fill={s.hair} opacity="0.8" />
      <path d="M52 28 Q52 18 45 16" fill={s.hair} opacity="0.8" />

      {/* Eyes */}
      <ellipse cx="35" cy="30" rx="2" ry="1.5" fill="white" />
      <ellipse cx="45" cy="30" rx="2" ry="1.5" fill="white" />
      <circle cx="35.5" cy="30.3" r="1" fill={suitColor} />
      <circle cx="45.5" cy="30.3" r="1" fill={suitColor} />
      <ellipse cx="35" cy="29" rx="2.5" ry="0.6" fill={s.hair} opacity="0.7" />
      <ellipse cx="45" cy="29" rx="2.5" ry="0.6" fill={s.hair} opacity="0.7" />

      {/* Nose & mouth */}
      <path d="M40 32 L39 35 L41 35" fill="none" stroke={`${s.hair}50`} strokeWidth="0.5" />
      <path d="M37 38 Q40 40 43 38" fill="none" stroke="#b07060" strokeWidth="0.7" />

      {/* Collar */}
      <path d="M28 46 L35 42 L40 44 L45 42 L52 46 L48 50 L32 50 Z" fill="white" stroke={s.accent} strokeWidth="0.5" />

      {/* Tunic */}
      <path d="M24 50 L32 48 L40 50 L48 48 L56 50 L58 95 L22 95 Z" fill={s.primary} />
      <rect x="38" y="50" width="4" height="45" fill={s.accent} opacity="0.5" />
      <rect x="22" y="68" width="36" height="4" rx="1" fill={s.secondary} />
      <rect x="37" y="67" width="6" height="6" rx="1" fill={s.accent} stroke={`${s.accent}80`} strokeWidth="0.5" />

      {/* Sleeves */}
      <path d="M24 50 L14 65 L18 67 L28 55 Z" fill={s.primary} />
      <path d="M56 50 L66 65 L62 67 L52 55 Z" fill={s.primary} />
      <path d="M14 65 L18 67 L16 72 L12 70 Z" fill="white" stroke={s.accent} strokeWidth="0.3" />
      <path d="M66 65 L62 67 L64 72 L68 70 Z" fill="white" stroke={s.accent} strokeWidth="0.3" />

      {/* Hand + staff */}
      <circle cx="14" cy="72" r="3" fill={s.skin} />
      <line x1="14" y1="72" x2="14" y2="90" stroke={s.accent} strokeWidth="1.5" strokeLinecap="round" />

      {/* Suit symbol on tunic */}
      <text x="40" y="85" textAnchor="middle" fontSize="12" fill={suitColor} fontFamily="serif">{symbol}</text>
      <rect x="22" y="92" width="36" height="3" fill={s.accent} opacity="0.4" />
    </g>
  );
}

/* Queen illustration */
function QueenSVG({ s, suitColor, symbol, suit, isRed }: {
  s: { primary: string; secondary: string; skin: string; hair: string; accent: string };
  suitColor: string; symbol: string; suit: Suit; isRed: boolean;
}) {
  return (
    <g>
      {/* Crown */}
      <path d="M25 20 L28 8 L33 16 L40 5 L47 16 L52 8 L55 20 Z" fill={s.accent} stroke={`${s.accent}90`} strokeWidth="0.5" />
      <circle cx="28" cy="10" r="1.8" fill={isRed ? '#dc2626' : '#2563eb'} />
      <circle cx="40" cy="7" r="2.2" fill={isRed ? '#dc2626' : '#2563eb'} />
      <circle cx="52" cy="10" r="1.8" fill={isRed ? '#dc2626' : '#2563eb'} />
      <rect x="25" y="18" width="30" height="4" rx="1" fill={s.accent} />
      <rect x="26" y="19" width="28" height="2" fill={`${s.primary}60`} rx="0.5" />

      {/* Hair */}
      <path d="M26 24 Q25 38 30 40 L30 24 Z" fill={s.hair} />
      <path d="M54 24 Q55 38 50 40 L50 24 Z" fill={s.hair} />
      <path d="M30 22 Q40 20 50 22 Q48 24 40 24 Q32 24 30 22" fill={s.hair} />

      {/* Face */}
      <ellipse cx="40" cy="34" rx="11" ry="13" fill={s.skin} stroke={`${s.hair}20`} strokeWidth="0.5" />

      {/* Eyes */}
      <ellipse cx="35.5" cy="32" rx="2" ry="1.3" fill="white" />
      <ellipse cx="44.5" cy="32" rx="2" ry="1.3" fill="white" />
      <circle cx="36" cy="32.2" r="0.9" fill={suitColor} />
      <circle cx="45" cy="32.2" r="0.9" fill={suitColor} />
      <path d="M33 31 Q35.5 29.5 38 31" fill="none" stroke={s.hair} strokeWidth="0.5" />
      <path d="M42 31 Q44.5 29.5 47 31" fill="none" stroke={s.hair} strokeWidth="0.5" />

      {/* Nose & lips */}
      <path d="M40 34 L39.2 37 L40.8 37" fill="none" stroke={`${s.hair}40`} strokeWidth="0.4" />
      <path d="M37 39 Q40 41.5 43 39" fill="#c06060" stroke="#a05050" strokeWidth="0.3" />

      {/* Necklace */}
      <path d="M30 46 Q40 52 50 46" fill="none" stroke={s.accent} strokeWidth="1" />
      <circle cx="40" cy="51" r="2.5" fill={isRed ? '#dc2626' : '#2563eb'} stroke={s.accent} strokeWidth="0.5" />

      {/* Dress bodice */}
      <path d="M26 48 Q33 46 40 48 Q47 46 54 48 L56 72 L24 72 Z" fill={s.primary} />
      <path d="M30 46 Q35 50 40 48 Q45 50 50 46" fill={s.skin} stroke={`${s.primary}60`} strokeWidth="0.4" />
      <line x1="40" y1="48" x2="40" y2="72" stroke={s.accent} strokeWidth="0.8" opacity="0.5" />

      {/* Dress skirt */}
      <path d="M24 72 L18 100 L62 100 L56 72 Z" fill={s.primary} />
      <line x1="30" y1="72" x2="26" y2="100" stroke={`${s.accent}20`} strokeWidth="0.5" />
      <line x1="50" y1="72" x2="54" y2="100" stroke={`${s.accent}20`} strokeWidth="0.5" />
      <line x1="40" y1="72" x2="40" y2="100" stroke={`${s.accent}20`} strokeWidth="0.5" />

      {/* Sleeves */}
      <path d="M26 48 L16 62 L20 64 L28 54 Z" fill={s.primary} />
      <path d="M54 48 L64 62 L60 64 L52 54 Z" fill={s.primary} />
      <ellipse cx="18" cy="63" rx="3" ry="2" fill="white" stroke={s.accent} strokeWidth="0.3" />
      <ellipse cx="62" cy="63" rx="3" ry="2" fill="white" stroke={s.accent} strokeWidth="0.3" />

      {/* Hands */}
      <circle cx="16" cy="66" r="2.5" fill={s.skin} />
      <circle cx="64" cy="66" r="2.5" fill={s.skin} />

      {/* Flower */}
      <circle cx="64" cy="60" r="3" fill={isRed ? '#dc2626' : '#2563eb'} opacity="0.6" />
      <circle cx="64" cy="60" r="1.5" fill={s.accent} />
      <line x1="64" y1="63" x2="64" y2="70" stroke="#2d6b2d" strokeWidth="0.8" />

      {/* Suit symbol */}
      <text x="40" y="92" textAnchor="middle" fontSize="10" fill={suitColor} fontFamily="serif">{symbol}</text>
      <rect x="18" y="97" width="44" height="3" rx="0.5" fill={s.accent} opacity="0.3" />
    </g>
  );
}

/* King illustration */
function KingSVG({ s, suitColor, symbol, suit, isRed }: {
  s: { primary: string; secondary: string; skin: string; hair: string; accent: string };
  suitColor: string; symbol: string; suit: Suit; isRed: boolean;
}) {
  return (
    <g>
      {/* Crown */}
      <path d="M22 22 L26 6 L30 16 L34 8 L40 2 L46 8 L50 16 L54 6 L58 22 Z" fill={s.accent} stroke={`${s.accent}90`} strokeWidth="0.6" />
      <circle cx="26" cy="9" r="2" fill={isRed ? '#dc2626' : '#2563eb'} />
      <circle cx="34" cy="10" r="1.5" fill="#22c55e" />
      <circle cx="40" cy="5" r="2.5" fill={isRed ? '#dc2626' : '#2563eb'} />
      <circle cx="46" cy="10" r="1.5" fill="#22c55e" />
      <circle cx="54" cy="9" r="2" fill={isRed ? '#dc2626' : '#2563eb'} />
      <line x1="40" y1="2" x2="40" y2="-2" stroke={s.accent} strokeWidth="1.2" />
      <line x1="38" y1="0" x2="42" y2="0" stroke={s.accent} strokeWidth="1" />
      <rect x="22" y="20" width="36" height="4" rx="1" fill={s.accent} />
      <rect x="23" y="21" width="34" height="2" rx="0.5" fill={`${s.primary}50`} />

      {/* Hair */}
      <path d="M27 26 Q26 38 30 42 L30 26 Z" fill={s.hair} />
      <path d="M53 26 Q54 38 50 42 L50 26 Z" fill={s.hair} />

      {/* Face */}
      <ellipse cx="40" cy="36" rx="12" ry="14" fill={s.skin} stroke={`${s.hair}20`} strokeWidth="0.5" />

      {/* Beard */}
      <path d="M30 42 Q32 48 40 52 Q48 48 50 42 Q48 40 40 40 Q32 40 30 42" fill={s.hair} opacity="0.6" />
      <path d="M34 44 Q40 54 46 44" fill={s.hair} opacity="0.3" />

      {/* Eyes */}
      <ellipse cx="35" cy="34" rx="2.2" ry="1.5" fill="white" />
      <ellipse cx="45" cy="34" rx="2.2" ry="1.5" fill="white" />
      <circle cx="35.5" cy="34.3" r="1.1" fill={suitColor} />
      <circle cx="45.5" cy="34.3" r="1.1" fill={suitColor} />
      <path d="M32 32 Q35 30 38 32" fill="none" stroke={s.hair} strokeWidth="0.8" />
      <path d="M42 32 Q45 30 48 32" fill="none" stroke={s.hair} strokeWidth="0.8" />

      {/* Nose & mouth */}
      <path d="M40 36 L39 39 L41 39" fill="none" stroke={`${s.hair}50`} strokeWidth="0.5" />
      <path d="M38 43 Q40 44.5 42 43" fill="none" stroke="#a06060" strokeWidth="0.5" />

      {/* Collar / Ermine */}
      <path d="M24 54 L32 50 L40 52 L48 50 L56 54 L54 58 L26 58 Z" fill="white" stroke={s.accent} strokeWidth="0.4" />
      <circle cx="30" cy="55" r="0.8" fill="#1a1a1a" />
      <circle cx="36" cy="54" r="0.8" fill="#1a1a1a" />
      <circle cx="44" cy="54" r="0.8" fill="#1a1a1a" />
      <circle cx="50" cy="55" r="0.8" fill="#1a1a1a" />

      {/* Robe */}
      <path d="M22 58 L34 56 L40 58 L46 56 L58 58 L60 100 L20 100 Z" fill={s.primary} />
      <line x1="40" y1="58" x2="40" y2="100" stroke={s.accent} strokeWidth="1" opacity="0.5" />
      <line x1="32" y1="70" x2="48" y2="70" stroke={s.accent} strokeWidth="0.6" opacity="0.4" />

      {/* Belt */}
      <rect x="22" y="74" width="36" height="4" rx="1" fill={s.secondary} />
      <rect x="37" y="73" width="6" height="6" rx="1" fill={s.accent} stroke={`${s.accent}80`} strokeWidth="0.5" />

      {/* Sleeves */}
      <path d="M22 58 L10 74 L14 76 L24 64 Z" fill={s.primary} />
      <path d="M58 58 L70 74 L66 76 L56 64 Z" fill={s.primary} />
      <path d="M10 74 L14 76 L12 80 L8 78 Z" fill="white" stroke={s.accent} strokeWidth="0.3" />
      <path d="M70 74 L66 76 L68 80 L72 78 Z" fill="white" stroke={s.accent} strokeWidth="0.3" />

      {/* Hands */}
      <circle cx="10" cy="80" r="3" fill={s.skin} />
      <circle cx="70" cy="80" r="3" fill={s.skin} />

      {/* Scepter */}
      <line x1="70" y1="60" x2="70" y2="80" stroke={s.accent} strokeWidth="2" strokeLinecap="round" />
      <circle cx="70" cy="58" r="3.5" fill={s.accent} stroke={`${s.accent}80`} strokeWidth="0.5" />
      <circle cx="70" cy="58" r="1.5" fill={isRed ? '#dc2626' : '#2563eb'} />

      {/* Sword */}
      <line x1="10" y1="65" x2="10" y2="80" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="68" x2="14" y2="68" stroke="#888" strokeWidth="1.2" strokeLinecap="round" />

      {/* Suit symbol */}
      <text x="40" y="92" textAnchor="middle" fontSize="10" fill={suitColor} fontFamily="serif">{symbol}</text>
      <rect x="20" y="97" width="40" height="3" rx="0.5" fill={s.accent} opacity="0.3" />
    </g>
  );
}
