// ============ SUMMON MECHANICS ============
// Manages normal summon limits and summon counting.

import type { CardData, SlotId } from "@/engine/types";
import { classifySummon } from "../field/positioning";

/** Maximum normal summons allowed per turn. */
export const MAX_NORMAL_SUMMONS_PER_TURN = 1;

/**
 * Check if a summon can be performed given the current summon count.
 * Special summons, altar placements, and anomalies are exempt.
 */
export function canSummon(
  card: CardData,
  slotId: SlotId,
  summonedThisTurn: number
): { allowed: boolean; reason?: string } {
  const kind = classifySummon(card, slotId);

  // Altar placements, special summons, and anomalies are exempt from the limit
  if (kind !== "normal") {
    return { allowed: true };
  }

  if (summonedThisTurn >= MAX_NORMAL_SUMMONS_PER_TURN) {
    return {
      allowed: false,
      reason: "Solo puedes realizar 1 Invocación Normal por turno (M1 o M3).",
    };
  }

  return { allowed: true };
}

/**
 * Increment the summon counter for the turn.
 */
export function incrementSummonCount(
  card: CardData,
  slotId: SlotId,
  current: number
): number {
  const kind = classifySummon(card, slotId);
  // Only normal summons increment the counter
  return kind === "normal" ? current + 1 : current;
}
