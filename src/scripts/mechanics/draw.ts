// ============ DRAW MECHANICS ============
// Handles card drawing from deck to hand.

import type { CardData } from "@/engine/types";

/**
 * Draw cards from a deck.
 * Returns the drawn cards (popped from end of array) and the new deck.
 */
export function drawCards(
  deck: CardData[],
  count: number
): { drawn: CardData[]; remainingDeck: CardData[] } {
  const newDeck = [...deck];
  const drawn: CardData[] = [];
  for (let i = 0; i < count && newDeck.length > 0; i++) {
    drawn.push(newDeck.pop()!);
  }
  return { drawn, remainingDeck: newDeck };
}

/**
 * Draw a single card from the top of a deck.
 */
export function drawOne(
  deck: CardData[]
): { card: CardData | null; remainingDeck: CardData[] } {
  if (deck.length === 0) return { card: null, remainingDeck: deck };
  const newDeck = [...deck];
  const card = newDeck.pop()!;
  return { card, remainingDeck: newDeck };
}

/**
 * Add a card to the bottom of a deck (like sending a destroyed card back).
 */
export function addToDeckBottom(deck: CardData[], card: CardData): CardData[] {
  return [card, ...deck];
}
