// ===== Zustand Game Store =====

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, GamePhase, Hand, Card, ChipValue } from './types';
import { INITIAL_BALANCE, BLACKJACK_PAYOUT } from './types';
import {
  createShoe,
  createHand,
  dealCard,
  handValueAll,
  isBlackjack,
  isBusted,
  canSplit,
  canDouble,
  shouldDealerHit,
} from './deck';

interface GameStore extends GameState {
  // Shop & settings
  ownedThemes: string[];
  activeTheme: string;

  // Actions - Betting
  placeBet: (amount: ChipValue) => void;
  removeBet: (amount: ChipValue) => void;
  clearBet: () => void;

  // Actions - Game
  startRound: () => void;
  hit: () => void;
  stand: () => void;
  double: () => void;
  split: () => void;
  newRound: () => void;
  resetGame: () => void;

  // Actions - Shop
  buyTheme: (themeId: string, price: number) => boolean;
  setActiveTheme: (themeId: string) => void;

  // Helpers
  canPlayerAct: () => boolean;
  getAvailableActions: () => string[];
}

function createInitialState(): GameState {
  return {
    deck: createShoe(),
    playerHands: [createHand(0)],
    activeHandIndex: 0,
    dealerHand: createHand(0),
    phase: 'betting',
    balance: INITIAL_BALANCE,
    currentBet: 0,
    message: 'Setze deinen Einsatz!',
    roundNumber: 0,
  };
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),
      ownedThemes: ['classic-green'],
      activeTheme: 'classic-green',

      // ---- Betting ----
      placeBet: (amount: ChipValue) => {
        const { balance, currentBet, phase } = get();
        if (phase !== 'betting') return;
        if (balance < amount) return;
        set({
          currentBet: currentBet + amount,
          balance: balance - amount,
        });
      },

      removeBet: (amount: ChipValue) => {
        const { balance, currentBet, phase } = get();
        if (phase !== 'betting') return;
        if (currentBet < amount) return;
        set({
          currentBet: currentBet - amount,
          balance: balance + amount,
        });
      },

      clearBet: () => {
        const { balance, currentBet, phase } = get();
        if (phase !== 'betting') return;
        set({
          currentBet: 0,
          balance: balance + currentBet,
        });
      },

      // ---- Start Round ----
      startRound: () => {
        const { currentBet, phase, deck: currentDeck } = get();
        if (phase !== 'betting' || currentBet < 1) return;

        let deck = currentDeck.length < 52 ? createShoe() : [...currentDeck];

        // Create player hand with bet
        const playerHand = createHand(currentBet);
        const dealerHand = createHand(0);

        // Deal: player, dealer, player, dealer(face-down)
        let result = dealCard(deck, true);
        playerHand.cards.push(result.card);
        deck = result.deck;

        result = dealCard(deck, true);
        dealerHand.cards.push(result.card);
        deck = result.deck;

        result = dealCard(deck, true);
        playerHand.cards.push(result.card);
        deck = result.deck;

        result = dealCard(deck, false); // Dealer hole card face-down
        dealerHand.cards.push(result.card);
        deck = result.deck;

        // Check for naturals
        const playerBJ = isBlackjack(playerHand.cards);
        const dealerBJ = isBlackjack(dealerHand.cards);

        if (playerBJ || dealerBJ) {
          // Reveal dealer hole card
          dealerHand.cards[1].faceUp = true;

          if (playerBJ && dealerBJ) {
            playerHand.isBlackjack = true;
            playerHand.result = 'push';
            set({
              deck,
              playerHands: [playerHand],
              dealerHand,
              phase: 'settlement',
              message: 'Push! Beide Blackjack.',
              balance: get().balance + currentBet,
              currentBet: 0,
              roundNumber: get().roundNumber + 1,
            });
          } else if (playerBJ) {
            playerHand.isBlackjack = true;
            playerHand.result = 'blackjack';
            const winnings = currentBet + Math.floor(currentBet * BLACKJACK_PAYOUT);
            set({
              deck,
              playerHands: [playerHand],
              dealerHand,
              phase: 'settlement',
              message: `Blackjack! Du gewinnst ${winnings} Tokens!`,
              balance: get().balance + winnings,
              currentBet: 0,
              roundNumber: get().roundNumber + 1,
            });
          } else {
            playerHand.result = 'lose';
            set({
              deck,
              playerHands: [playerHand],
              dealerHand,
              phase: 'settlement',
              message: 'Dealer hat Blackjack. Du verlierst.',
              currentBet: 0,
              roundNumber: get().roundNumber + 1,
            });
          }
          return;
        }

        set({
          deck,
          playerHands: [playerHand],
          activeHandIndex: 0,
          dealerHand,
          phase: 'player-turn',
          message: 'Dein Zug! Hit, Stand, Double oder Split?',
          currentBet: 0,
          roundNumber: get().roundNumber + 1,
        });
      },

      // ---- Hit ----
      hit: () => {
        const { phase, playerHands, activeHandIndex, deck: currentDeck } = get();
        if (phase !== 'player-turn') return;

        const hands = [...playerHands];
        const hand = { ...hands[activeHandIndex], cards: [...hands[activeHandIndex].cards] };
        let deck = [...currentDeck];

        const result = dealCard(deck, true);
        hand.cards.push(result.card);
        deck = result.deck;

        if (isBusted(hand.cards)) {
          hand.isBusted = true;
          hand.result = 'lose';
          hands[activeHandIndex] = hand;

          // Check if there are more hands to play
          const nextHandIndex = findNextActiveHand(hands, activeHandIndex);
          if (nextHandIndex === -1) {
            // All hands done, go to dealer turn (or settlement if all busted)
            const allBusted = hands.every((h) => h.isBusted);
            if (allBusted) {
              set({
                deck,
                playerHands: hands,
                phase: 'settlement',
                message: 'Bust! Du hast dich überkauft.',
              });
            } else {
              // Run dealer turn
              set({ deck, playerHands: hands, activeHandIndex: 0 });
              setTimeout(() => get().runDealerTurn?.(), 500);
              runDealerTurnImmediate(set, get, hands, deck);
            }
          } else {
            set({
              deck,
              playerHands: hands,
              activeHandIndex: nextHandIndex,
              message: `Hand ${nextHandIndex + 1} ist dran.`,
            });
          }
        } else {
          hands[activeHandIndex] = hand;
          set({ deck, playerHands: hands, message: 'Hit oder Stand?' });
        }
      },

      // ---- Stand ----
      stand: () => {
        const { phase, playerHands, activeHandIndex, deck } = get();
        if (phase !== 'player-turn') return;

        const hands = [...playerHands];
        hands[activeHandIndex] = { ...hands[activeHandIndex], isStood: true };

        const nextHandIndex = findNextActiveHand(hands, activeHandIndex);
        if (nextHandIndex === -1) {
          // Dealer's turn
          runDealerTurnImmediate(set, get, hands, deck);
        } else {
          set({
            playerHands: hands,
            activeHandIndex: nextHandIndex,
            message: `Hand ${nextHandIndex + 1} ist dran.`,
          });
        }
      },

      // ---- Double Down ----
      double: () => {
        const { phase, playerHands, activeHandIndex, balance, deck: currentDeck } = get();
        if (phase !== 'player-turn') return;

        const hands = [...playerHands];
        const hand = { ...hands[activeHandIndex], cards: [...hands[activeHandIndex].cards] };

        if (!canDouble(hand, balance)) return;

        let deck = [...currentDeck];
        const additionalBet = hand.bet;

        // Deal one more card
        const result = dealCard(deck, true);
        hand.cards.push(result.card);
        deck = result.deck;
        hand.bet += additionalBet;
        hand.isDoubled = true;
        hand.isStood = true;

        if (isBusted(hand.cards)) {
          hand.isBusted = true;
          hand.result = 'lose';
        }

        hands[activeHandIndex] = hand;

        const nextHandIndex = findNextActiveHand(hands, activeHandIndex);
        if (nextHandIndex === -1) {
          if (hands.every((h) => h.isBusted)) {
            set({
              deck,
              playerHands: hands,
              balance: balance - additionalBet,
              phase: 'settlement',
              message: 'Bust nach Double Down!',
            });
          } else {
            runDealerTurnImmediate(set, get, hands, deck, balance - additionalBet);
          }
        } else {
          set({
            deck,
            playerHands: hands,
            balance: balance - additionalBet,
            activeHandIndex: nextHandIndex,
            message: `Hand ${nextHandIndex + 1} ist dran.`,
          });
        }
      },

      // ---- Split ----
      split: () => {
        const { phase, playerHands, activeHandIndex, balance, deck: currentDeck } = get();
        if (phase !== 'player-turn') return;

        const hands = [...playerHands];
        const hand = hands[activeHandIndex];

        if (!canSplit(hand, balance)) return;

        let deck = [...currentDeck];
        const splitBet = hand.bet;

        // Create two new hands from the split
        const hand1 = createHand(splitBet);
        hand1.cards.push({ ...hand.cards[0] });
        const result1 = dealCard(deck, true);
        hand1.cards.push(result1.card);
        deck = result1.deck;

        const hand2 = createHand(splitBet);
        hand2.cards.push({ ...hand.cards[1] });
        const result2 = dealCard(deck, true);
        hand2.cards.push(result2.card);
        deck = result2.deck;

        // Replace the current hand with two new hands
        hands.splice(activeHandIndex, 1, hand1, hand2);

        set({
          deck,
          playerHands: hands,
          balance: balance - splitBet,
          activeHandIndex,
          message: `Hand ${activeHandIndex + 1} ist dran. Du hast gesplittet!`,
        });
      },

      // ---- New Round ----
      newRound: () => {
        const { balance } = get();
        if (balance <= 0) {
          set({
            ...createInitialState(),
            phase: 'game-over',
            balance: 0,
            message: 'Keine Tokens mehr! Starte ein neues Spiel.',
          });
          return;
        }
        set({
          playerHands: [createHand(0)],
          activeHandIndex: 0,
          dealerHand: createHand(0),
          phase: 'betting',
          currentBet: 0,
          message: 'Setze deinen Einsatz!',
        });
      },

      // ---- Reset Game ----
      resetGame: () => {
        set({
          ...createInitialState(),
          ownedThemes: get().ownedThemes,
          activeTheme: get().activeTheme,
        });
      },

      // ---- Shop ----
      buyTheme: (themeId: string, price: number) => {
        const { balance, ownedThemes } = get();
        if (balance < price) return false;
        if (ownedThemes.includes(themeId)) return false;
        set({
          balance: balance - price,
          ownedThemes: [...ownedThemes, themeId],
        });
        return true;
      },

      setActiveTheme: (themeId: string) => {
        const { ownedThemes } = get();
        if (!ownedThemes.includes(themeId)) return;
        set({ activeTheme: themeId });
      },

      // ---- Helpers ----
      canPlayerAct: () => {
        return get().phase === 'player-turn';
      },

      getAvailableActions: () => {
        const { phase, playerHands, activeHandIndex, balance } = get();
        if (phase !== 'player-turn') return [];

        const hand = playerHands[activeHandIndex];
        if (!hand) return [];

        const actions: string[] = ['hit', 'stand'];
        if (canDouble(hand, balance)) actions.push('double');
        if (canSplit(hand, balance) && playerHands.length < 4) actions.push('split');

        return actions;
      },
    }),
    {
      name: 'blackjack-casino-storage',
      partialize: (state) => ({
        balance: state.balance,
        ownedThemes: state.ownedThemes,
        activeTheme: state.activeTheme,
        roundNumber: state.roundNumber,
      }),
    }
  )
);

// ---- Helper: find next playable hand ----
function findNextActiveHand(hands: Hand[], currentIndex: number): number {
  for (let i = currentIndex + 1; i < hands.length; i++) {
    if (!hands[i].isStood && !hands[i].isBusted) return i;
  }
  return -1;
}

// ---- Dealer turn logic (runs synchronously and updates state) ----
function runDealerTurnImmediate(
  set: (partial: Partial<GameStore>) => void,
  get: () => GameStore,
  playerHands: Hand[],
  currentDeck: Card[],
  overrideBalance?: number,
) {
  let deck = [...currentDeck];
  const dealerHand = { ...get().dealerHand, cards: [...get().dealerHand.cards] };
  const balance = overrideBalance ?? get().balance;

  // Reveal hole card
  dealerHand.cards[1] = { ...dealerHand.cards[1], faceUp: true };

  // Dealer draws
  while (shouldDealerHit(dealerHand.cards)) {
    const result = dealCard(deck, true);
    dealerHand.cards.push(result.card);
    deck = result.deck;
  }

  const dealerValue = handValueAll(dealerHand.cards);
  const dealerBusted = dealerValue > 21;

  // Settle each hand
  let totalWinnings = 0;
  const settledHands = playerHands.map((hand) => {
    const h = { ...hand };
    if (h.isBusted) {
      h.result = 'lose';
      return h;
    }

    const playerValue = handValueAll(h.cards);

    if (dealerBusted) {
      h.result = 'win';
      totalWinnings += h.bet * 2;
    } else if (playerValue > dealerValue) {
      h.result = 'win';
      totalWinnings += h.bet * 2;
    } else if (playerValue === dealerValue) {
      h.result = 'push';
      totalWinnings += h.bet;
    } else {
      h.result = 'lose';
    }

    return h;
  });

  // Build message
  let message = '';
  if (dealerBusted) {
    message = `Dealer bust (${dealerValue})! `;
  } else {
    message = `Dealer hat ${dealerValue}. `;
  }

  const wins = settledHands.filter((h) => h.result === 'win').length;
  const pushes = settledHands.filter((h) => h.result === 'push').length;
  const losses = settledHands.filter((h) => h.result === 'lose').length;

  if (wins > 0) message += `${wins}x Gewonnen! `;
  if (pushes > 0) message += `${pushes}x Push. `;
  if (losses > 0 && wins === 0 && pushes === 0) message += 'Du verlierst.';
  if (totalWinnings > 0) message += `+${totalWinnings} Tokens`;

  set({
    deck,
    dealerHand,
    playerHands: settledHands,
    phase: 'settlement',
    balance: balance + totalWinnings,
    message,
  });
}

// For type compatibility
interface GameStore extends GameState {
  ownedThemes: string[];
  activeTheme: string;
  runDealerTurn?: () => void;
  placeBet: (amount: ChipValue) => void;
  removeBet: (amount: ChipValue) => void;
  clearBet: () => void;
  startRound: () => void;
  hit: () => void;
  stand: () => void;
  double: () => void;
  split: () => void;
  newRound: () => void;
  resetGame: () => void;
  buyTheme: (themeId: string, price: number) => boolean;
  setActiveTheme: (themeId: string) => void;
  canPlayerAct: () => boolean;
  getAvailableActions: () => string[];
}
