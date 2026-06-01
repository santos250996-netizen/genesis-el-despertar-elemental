// ============ BOARD ZONE SYSTEM ============
// EDOPRO-style zone definitions for the Genesis card game board.

export const ZONES = {
  PLAYER_MONSTERS: ["p-mon-1", "p-mon-2", "p-mon-3"] as const,
  PLAYER_ALTARS: ["p-altar-luz", "p-altar-sombra"] as const,
  PLAYER_ARTIFACT: ["p-artifact"] as const,
  ENEMY_MONSTERS: ["e-mon-1", "e-mon-2", "e-mon-3"] as const,
  ENEMY_ALTARS: ["e-altar-luz", "e-altar-sombra"] as const,
  ENEMY_ARTIFACT: ["e-artifact"] as const,

  /** All slots on the board (order matters for iteration). */
  ALL: [
    // Player side (front)
    "p-mon-1", "p-mon-2", "p-mon-3",
    "p-altar-luz", "p-altar-sombra",
    "p-artifact",
    // Enemy side (back)
    "e-mon-1", "e-mon-2", "e-mon-3",
    "e-altar-luz", "e-altar-sombra",
    "e-artifact",
  ] as const,
} as const;

/** Extract column number (1, 2, 3) from any slotId like "p-mon-1" or "e-altar-sombra". */
export function getColumn(slotId: string): number {
  return parseInt(slotId.split("-")[2]);
}

/** Check if a slot belongs to the player. */
export function isPlayerSlot(slotId: string): boolean {
  return slotId.startsWith("p-");
}

/** Check if a slot belongs to the enemy. */
export function isEnemySlot(slotId: string): boolean {
  return slotId.startsWith("e-");
}

/** Check if a slot is a monster zone (not altar). */
export function isMonsterSlot(slotId: string): boolean {
  return slotId.includes("mon");
}

/** Check if a slot is an altar zone. */
export function isAltarSlot(slotId: string): boolean {
  return slotId.includes("altar");
}

/** Check if a slot is an artifact zone. */
export function isArtifactSlot(slotId: string): boolean {
  return slotId.includes("artifact");
}

/** Get the corresponding enemy altar slot for a given column. */
export function getEnemyAltarForColumn(col: number): "e-altar-luz" | "e-altar-sombra" {
  return col === 1 ? "e-altar-luz" : "e-altar-sombra";
}

/** Get the altar slot for a given owner and column. */
export function getAltarForColumn(
  owner: "player" | "enemy",
  col: number
): "p-altar-luz" | "p-altar-sombra" | "e-altar-luz" | "e-altar-sombra" {
  const prefix = owner === "player" ? "p" : "e";
  return col === 1 ? `${prefix}-altar-luz` : `${prefix}-altar-sombra`;
}

/** Get the light altar slot for a given owner. */
export function getLightAltar(owner: "player" | "enemy"): "p-altar-luz" | "e-altar-luz" {
  return owner === "player" ? "p-altar-luz" : "e-altar-luz";
}

/** Get the shadow altar slot for a given owner. */
export function getShadowAltar(owner: "player" | "enemy"): "p-altar-sombra" | "e-altar-sombra" {
  return owner === "player" ? "p-altar-sombra" : "e-altar-sombra";
}

/** Get the monster slot for a given owner and column. */
export function getMonsterSlot(
  owner: "player" | "enemy",
  col: number
): string {
  const prefix = owner === "player" ? "p" : "e";
  return `${prefix}-mon-${col}`;
}

/** Get the artifact slot for a given owner. */
export function getArtifactSlot(owner: "player" | "enemy"): "p-artifact" | "e-artifact" {
  return owner === "player" ? "p-artifact" : "e-artifact";
}

/** Get the opposite column for lane change (1->3, 3->1). */
export function getOppositeColumn(col: number): number {
  return col === 1 ? 3 : 1;
}
