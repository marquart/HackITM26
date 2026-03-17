'use client';

// ===== Casino Chip Component =====
// Uses the uploaded chip images exactly as provided.
// No labels, no background — just the chip image, fully visible with clean edges.

import React from 'react';
import type { ChipValue } from '@/lib/types';
import { CHIP_LABELS, CHIP_COLORS } from '@/lib/types';

interface ChipProps {
  value: ChipValue;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  count?: number;
}

const CHIP_IMAGES: Record<ChipValue, string> = {
  1: '/chips/chip-1.png',
  5: '/chips/chip-5.png',
  25: '/chips/chip-25.png',
  50: '/chips/chip-50.png',
  100: '/chips/chip-100.png',
  500: '/chips/chip-500.png',
  1000: '/chips/chip-1000.png',
};

const PX = { sm: 52, md: 68, lg: 84 };

export default function Chip({ value, onClick, disabled = false, size = 'md', count }: ChipProps) {
  const label = CHIP_LABELS[value];
  const chipColor = CHIP_COLORS[value];
  const imgSrc = CHIP_IMAGES[value];
  const px = PX[size];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative flex-shrink-0 flex items-center justify-center
        cursor-pointer select-none
        transition-all duration-200 ease-out group
        ${disabled
          ? 'opacity-40 cursor-not-allowed'
          : 'hover:scale-110 hover:-translate-y-1 active:scale-95 active:translate-y-0'}
      `}
      style={{
        width: px,
        height: px,
        background: 'none',
        border: 'none',
        padding: 0,
        overflow: 'visible',
        filter: disabled ? 'grayscale(0.5) brightness(0.7)' : 'none',
      }}
      title={`${label} – ${value} Token${value !== 1 ? 's' : ''}`}
    >
      {/* The chip image — displayed fully, never clipped */}
      <img
        src={imgSrc}
        alt={`${label} ${value}`}
        style={{
          display: 'block',
          width: px,
          height: px,
          objectFit: 'contain',
          filter: disabled
            ? 'none'
            : 'drop-shadow(0 2px 4px rgba(0,0,0,0.6)) drop-shadow(0 4px 10px rgba(0,0,0,0.35))',
        }}
        draggable={false}
      />

      {/* Hover glow ring */}
      {!disabled && (
        <div
          className="absolute rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            inset: -2,
            boxShadow: `0 0 14px 3px ${chipColor}55, 0 0 28px 6px ${chipColor}20`,
          }}
        />
      )}

      {/* Count badge */}
      {count !== undefined && count > 0 && (
        <div
          className="absolute flex items-center justify-center text-[10px] font-bold text-white"
          style={{
            top: -3, right: -3,
            minWidth: 20, height: 20,
            padding: '0 4px', borderRadius: 10,
            zIndex: 20,
            background: chipColor,
            border: '2px solid rgba(255,255,255,0.85)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
          }}
        >
          {count}
        </div>
      )}
    </button>
  );
}
