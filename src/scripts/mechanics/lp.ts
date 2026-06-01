// ============ LP MANAGEMENT ============
// Life Point tracking and damage/heal operations.

export const MAX_LP = 100;
export const MIN_LP = 0;

/**
 * Deal damage to a target's LP.
 * Clamps to [0, MAX_LP].
 */
export function dealDamage(currentLP: number, amount: number): number {
  return Math.max(MIN_LP, currentLP - amount);
}

/**
 * Heal a target's LP.
 * Clamps to [0, MAX_LP].
 */
export function heal(currentLP: number, amount: number): number {
  return Math.min(MAX_LP, currentLP + amount);
}

/**
 * Check if LP has reached zero (defeat condition).
 */
export function isKO(lp: number): boolean {
  return lp <= MIN_LP;
}
