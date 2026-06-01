// ============ DECK DEFINITIONS ============
// Mazos predefinidos para el jugador y cada enemigo.
// Los IDs referencian CartaMaestra.id (strings como "CEL-001").

import { ALL_CARDS_ARRAY, CARDS } from "./cards";
import type { CardData } from "@/engine/types";

/** Mazo base de 20 cartas: "Luz y Oscuridad" (16 monstruos + 4 artefactos) */
export const DECK_IDS: Record<string, string[]> = {
  player: [
    "CEL-001", "CEL-002", "CEL-003", "CEL-004",
    "CEL-005", "CEL-006", "CEL-007", "CEL-008",
    "UMB-009", "UMB-010", "UMB-011", "UMB-012",
    "UMB-013", "UMB-014", "UMB-015", "UMB-016",
    "ART-017", "ART-018", "ART-019", "ART-020",
  ],
  Ignis: [
    "CEL-001", "CEL-002", "CEL-003", "CEL-004",
    "CEL-005", "CEL-006", "CEL-007", "CEL-008",
    "UMB-009", "UMB-010", "UMB-011", "UMB-012",
    "UMB-013", "UMB-014", "UMB-015", "UMB-016",
    "ART-017", "ART-018", "ART-019", "ART-020",
  ],
  Zephyr: [
    "CEL-001", "CEL-002", "CEL-003", "CEL-004",
    "CEL-005", "CEL-006", "CEL-007", "CEL-008",
    "UMB-009", "UMB-010", "UMB-011", "UMB-012",
    "UMB-013", "UMB-014", "UMB-015", "UMB-016",
    "ART-017", "ART-018", "ART-019", "ART-020",
  ],
  Hydra: [
    "CEL-001", "CEL-002", "CEL-003", "CEL-004",
    "CEL-005", "CEL-006", "CEL-007", "CEL-008",
    "UMB-009", "UMB-010", "UMB-011", "UMB-012",
    "UMB-013", "UMB-014", "UMB-015", "UMB-016",
    "ART-017", "ART-018", "ART-019", "ART-020",
  ],
  Terran: [
    "CEL-001", "CEL-002", "CEL-003", "CEL-004",
    "CEL-005", "CEL-006", "CEL-007", "CEL-008",
    "UMB-009", "UMB-010", "UMB-011", "UMB-012",
    "UMB-013", "UMB-014", "UMB-015", "UMB-016",
    "ART-017", "ART-018", "ART-019", "ART-020",
  ],
};

/**
 * DECKS legacy: mapa de id numérico[] para compatibilidad con el motor actual.
 * El motor usa `DECKS.player` y `DECKS[enemyType]` como number[].
 */
export const DECKS: Record<string, number[]> = Object.fromEntries(
  Object.entries(DECK_IDS).map(([key, ids]) => [
    key,
    ids.map(id => {
      const card = ALL_CARDS_ARRAY.find(c => c._cartaMaestra.id === id);
      return card?.id ?? 0;
    }),
  ])
);
