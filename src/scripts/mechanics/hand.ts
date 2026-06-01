// ============ HAND MANAGEMENT ============
// Operations for manipulating the hand (discard, add, remove).

import type { CardData } from "@/engine/types";

/**
 * Remove a card from hand by index.
 */
export function removeFromHand(hand: CardData[], index: number): {
  removed: CardData | null;
  remaining: CardData[];
} {
  if (index < 0 || index >= hand.length) {
    return { removed: null, remaining: hand };
  }
  return {
    removed: hand[index],
    remaining: [...hand.slice(0, index), ...hand.slice(index + 1)],
  };
}

/**
 * Add one or more cards to the hand.
 */
export function addToHand(hand: CardData[], ...cards: CardData[]): CardData[] {
  return [...hand, ...cards];
}

/**
 * Discard a random card from a hand (used for forced discard effects).
 * Returns null if hand is empty.
 */
export function discardRandom(hand: CardData[]): {
  discarded: CardData | null;
  remaining: CardData[];
} {
  if (hand.length === 0) {
    return { discarded: null, remaining: hand };
  }
  const idx = Math.floor(Math.random() * hand.length);
  const discarded = hand[idx];
  return {
    discarded,
    remaining: [...hand.slice(0, idx), ...hand.slice(idx + 1)],
  };
}

/**
 * Discard cards from the top of the hand (used for hand cap effects).
 */
export function discardFromTop(hand: CardData[], count: number): {
  discarded: CardData[];
  remaining: CardData[];
} {
  if (count <= 0) return { discarded: [], remaining: hand };
  const toDiscard = hand.slice(0, Math.min(count, hand.length));
  return {
    discarded: toDiscard,
    remaining: hand.slice(toDiscard.length),
  };
}

/**
 * Transfer a card from one player's hand to another area (deck, discard pile, etc.).
 */
export function transferFromHand(
  hand: CardData[],
  cardIndex: number,
  destination: "deck" | "grave"
): {
  removed: CardData | null;
  remaining: CardData[];
} {
  return removeFromHand(hand, cardIndex);
}
