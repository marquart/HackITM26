// ===== Blackjack Deck & Hand Logic =====

import type { Card, Suit, Rank, Hand } from './types';
import { NUM_DECKS, DEALER_STAND_VALUE } from './types';

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

/**
 * Creates a fresh multi-deck shoe, shuffled.
 */
export function createShoe(numDecks: number = NUM_DECKS): Card[] {
  const shoe: Card[] = [];
  for (let d = 0; d < numDecks; d++) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        shoe.push({ suit, rank, faceUp: true });
      }
    }
  }
  return shuffle(shoe);
}

/**
 * Fisher-Yates shuffle.
 */
export function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Get the numeric value of a single card (Ace = 11 initially).
 */
export function cardValue(rank: Rank): number {
  if (rank === 'A') return 11;
  if (['K', 'Q', 'J'].includes(rank)) return 10;
  return parseInt(rank, 10);
}

/**
 * Calculate the best hand value, adjusting Aces from 11 to 1 as needed.
 */
export function handValue(cards: Card[]): number {
  let total = 0;
  let aces = 0;

  for (const card of cards) {
    if (!card.faceUp) continue; // Don't count face-down cards for display
    total += cardValue(card.rank);
    if (card.rank === 'A') aces++;
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  return total;
}

/**
 * Calculate hand value counting ALL cards (including face-down).
 */
export function handValueAll(cards: Card[]): number {
  let total = 0;
  let aces = 0;

  for (const card of cards) {
    total += cardValue(card.rank);
    if (card.rank === 'A') aces++;
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  return total;
}

/**
 * Check if a hand has a soft total (contains an Ace counted as 11).
 */
export function isSoft(cards: Card[]): boolean {
  let total = 0;
  let aces = 0;

  for (const card of cards) {
    total += cardValue(card.rank);
    if (card.rank === 'A') aces++;
  }

  // Reduce aces until we're at or under 21
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  return aces > 0 && total <= 21;
}

/**
 * Check if the hand is a natural Blackjack (2 cards, value 21).
 */
export function isBlackjack(cards: Card[]): boolean {
  return cards.length === 2 && handValueAll(cards) === 21;
}

/**
 * Check if the hand is busted.
 */
export function isBusted(cards: Card[]): boolean {
  return handValueAll(cards) > 21;
}

/**
 * Check if a hand can be split (two cards of same rank).
 */
export function canSplit(hand: Hand, balance: number): boolean {
  if (hand.cards.length !== 2) return false;
  if (hand.isDoubled) return false;
  if (balance < hand.bet) return false;
  return cardValue(hand.cards[0].rank) === cardValue(hand.cards[1].rank);
}

/**
 * Check if a hand can be doubled down (first two cards, enough balance).
 */
export function canDouble(hand: Hand, balance: number): boolean {
  if (hand.cards.length !== 2) return false;
  if (hand.isDoubled) return false;
  if (balance < hand.bet) return false;
  return true;
}

/**
 * Deal one card from the deck.
 */
export function dealCard(deck: Card[], faceUp: boolean = true): { card: Card; deck: Card[] } {
  if (deck.length === 0) {
    // Reshuffle if out of cards
    const newDeck = createShoe();
    const card = { ...newDeck[0], faceUp };
    return { card, deck: newDeck.slice(1) };
  }
  const card = { ...deck[0], faceUp };
  return { card, deck: deck.slice(1) };
}

/**
 * Create a new empty hand with a bet.
 */
export function createHand(bet: number): Hand {
  return {
    cards: [],
    bet,
    isDoubled: false,
    isStood: false,
    isBusted: false,
    isBlackjack: false,
  };
}

/**
 * Determines if dealer should keep hitting (standard: stand on all 17s).
 */
export function shouldDealerHit(cards: Card[]): boolean {
  return handValueAll(cards) < DEALER_STAND_VALUE;
}

/**
 * Format hand value for display, indicating soft totals.
 */
export function formatHandValue(cards: Card[], countAll: boolean = false): string {
  const fn = countAll ? handValueAll : handValue;
  const val = fn(cards);
  if (val === 0) return '';
  if (isSoft(cards) && val <= 21 && cards.length === 2) {
    const hardVal = val - 10;
    return `${hardVal}/${val}`;
  }
  return String(val);
}
