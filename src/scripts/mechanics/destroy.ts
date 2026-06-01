// ============ DESTRUCTION MECHANICS ============
// Handles card removal from the board and destruction prevention.

import type { SlotId, CardData } from "@/engine/types";

export type DestroyDestination = "hand" | "deck" | "grave";

export interface DestroyResult {
  /** The destroyed card (if any). */
  card: CardData | null;
  /** Where the card was sent. */
  destination: DestroyDestination;
  /** Log message. */
  log: string;
}

/**
 * Remove a card from the board and determine where it goes.
 * By default, destroyed cards go to the bottom of the owner's deck.
 */
export function destroyCard(
  board: Record<SlotId, CardData | null>,
  slotId: SlotId,
  destination: DestroyDestination = "deck"
): { removedCard: CardData | null; newBoard: Partial<Record<SlotId, null>> } {
  const card = board[slotId];
  if (!card) {
    return { removedCard: null, newBoard: {} };
  }
  return {
    removedCard: card,
    newBoard: { [slotId]: null },
  };
}

/**
 * Check if a card should be prevented from being destroyed.
 * Called via the beforeDestroy card script hook.
 */
export function shouldPreventDestroy(
  card: CardData,
  owner: "player" | "enemy",
  noEffectDestroy: boolean,
  undestroyable: boolean,
  cause: "battle" | "effect"
): boolean {
  // Gaia's protection: no destruction by effects
  if (cause === "effect" && noEffectDestroy && owner === "player") {
    return true;
  }

  // Serafín: cannot be destroyed by battle
  if (cause === "battle" && undestroyable) {
    return true;
  }

  return false;
}
