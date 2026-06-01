// ============ ALTAR ACTIVATION LOGIC ============
// Handles altar-specific passive effects and activation conditions.

import type { CardData, SlotId, GameState } from "@/engine/types";

/**
 * Check if a card benefits from altar effects (active altar in matching column).
 * Returns the altar card if active, null otherwise.
 */
export function getActiveAltar(
  board: Record<SlotId, CardData | null>,
  owner: "player" | "enemy",
  col: number
): CardData | null {
  const prefix = owner === "player" ? "p" : "e";
  if (col === 1) return board[`${prefix}-altar-luz` as SlotId] ?? null;
  if (col === 3) return board[`${prefix}-altar-sombra` as SlotId] ?? null;
  return null;
}

/**
 * Check if both altars are active for a given owner.
 * Required for ECLIPSE and GENESIS summons.
 */
export function bothAltarsActive(
  board: Record<SlotId, CardData | null>,
  owner: "player" | "enemy"
): boolean {
  const prefix = owner === "player" ? "p" : "e";
  return !!(board[`${prefix}-altar-luz` as SlotId] && board[`${prefix}-altar-sombra` as SlotId]);
}

/**
 * Check if a monster in a given column has altar support for its effects.
 * Celestial effects require light altar in col 1.
 * Umbral effects require shadow altar in col 3.
 */
export function hasAltarSupport(
  board: Record<SlotId, CardData | null>,
  owner: "player" | "enemy",
  col: number,
  effectType: "celestial" | "umbral"
): boolean {
  if (effectType === "celestial" && col === 1) {
    return !!getActiveAltar(board, owner, 1);
  }
  if (effectType === "umbral" && col === 3) {
    return !!getActiveAltar(board, owner, 3);
  }
  return false;
}

/**
 * Get the altar card that matches the elemental type for type-specific altar boosts.
 * E.g., altar_fulgur only boosts FULGUR monsters.
 */
export function getTypedAltarBoost(
  altar: CardData,
  monsterType: string
): number {
  // Generic altar bonuses (apply to all monsters)
  for (const effectId of ALTAR_GLOBAL_EFFECTS) {
    if (altar.flags.includes("isEnergy")) {
      // altar_all_atk_200 gives +2 to all
      // (This is checked in ATK computation, not here)
    }
  }
  return 0;
}

/** Effect IDs that apply globally to all monsters on the field. */
const ALTAR_GLOBAL_EFFECTS = [
  "altar_all_atk_200",
  "alt_fulg_all_fulg_100",
  "alt_aura_all_aura_100_discard",
] as const;
