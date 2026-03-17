// ===== Core Blackjack Types =====

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
}

export interface Hand {
  cards: Card[];
  bet: number;
  isDoubled: boolean;
  isStood: boolean;
  isBusted: boolean;
  isBlackjack: boolean;
  result?: 'win' | 'lose' | 'push' | 'blackjack';
}

export type GamePhase =
  | 'betting'      // Player is placing bets
  | 'dealing'      // Cards are being dealt
  | 'player-turn'  // Player's turn to act
  | 'dealer-turn'  // Dealer reveals & draws
  | 'settlement'   // Round results shown
  | 'game-over';   // Out of tokens

export type PlayerAction = 'hit' | 'stand' | 'double' | 'split';

export interface GameState {
  deck: Card[];
  playerHands: Hand[];
  activeHandIndex: number;
  dealerHand: Hand;
  phase: GamePhase;
  balance: number;
  currentBet: number;
  message: string;
  roundNumber: number;
}

export const CHIP_VALUES = [1, 5, 25, 50, 100, 500, 1000] as const;
export type ChipValue = typeof CHIP_VALUES[number];

// Chip label mapping (ARD broadcaster names from the chip image)
export const CHIP_LABELS: Record<ChipValue, string> = {
  1: 'RBB',
  5: 'HR',
  25: 'MDR',
  50: 'BR',
  100: 'SWR',
  500: 'NDR',
  1000: 'WDR',
};

// Chip color mapping matching the provided chip artwork
export const CHIP_COLORS: Record<ChipValue, string> = {
  1: '#1a3a8a',     // Blue (RBB)
  5: '#b81c1c',     // Red (HR)
  25: '#1a6b37',    // Green (MDR)
  50: '#d4760a',    // Orange (BR)
  100: '#1a1a1a',   // Black (SWR)
  500: '#6b2fa0',   // Purple (NDR)
  1000: '#c8960a',  // Gold (WDR)
};

export const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

export const SUIT_COLORS: Record<Suit, string> = {
  hearts: '#dc2626',
  diamonds: '#dc2626',
  clubs: '#1a1a1a',
  spades: '#1a1a1a',
};

// Shop theme types
export interface ShopTheme {
  id: string;
  name: string;
  description: string;
  price: number;
  feltColor: string;
  feltGradient: string;
  borderColor: string;
  accentColor: string;
  preview: string; // CSS gradient for preview
}

export const INITIAL_BALANCE = 8000;
export const MIN_BET = 1;
export const DEALER_STAND_VALUE = 17;
export const BLACKJACK_PAYOUT = 1.5; // 3:2
export const NUM_DECKS = 6;
