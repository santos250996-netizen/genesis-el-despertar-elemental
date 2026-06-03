// ============ DECK DEFINITIONS ============
// Mazos predefinidos para el jugador y cada enemigo.
// Los IDs referencian CartaMaestra.id (strings como "CEL-001").
// 55 cartas totales, organizadas por arquetipo.

import { ALL_CARDS_ARRAY, CARDS } from "./cards";
import type { CardData } from "@/engine/types";

/** Mazo base de 20 cartas: "Luz y Oscuridad" (16 monstruos + 4 artefactos) */
const BASE_DECK = [
  "CEL-001", "CEL-002", "CEL-003", "CEL-004",
  "CEL-005", "CEL-006", "CEL-007", "CEL-008",
  "UMB-009", "UMB-010", "UMB-011", "UMB-012",
  "UMB-013", "UMB-014", "UMB-015", "UMB-016",
  "ART-017", "ART-018", "ART-019", "ART-020",
];

/** Mazo TENOTCH (18 cartas): 14 monstruos + 4 artefactos */
const TENOTCH_DECK = [
  "TEN-026", "TEN-027", "TEN-028", "TEN-029",
  "TEN-030", "TEN-031", "TEN-032", "TEN-033",
  "TEN-034", "TEN-035", "TEN-036", "TEN-037",
  "TEN-038", "TEN-039",
  "ART-040", "ART-041", "FUL-021", "ABI-023",
];

/** Mazo NÓRDICO (18 cartas): 14 monstruos + 4 artefactos */
const NORDICO_DECK = [
  "NOR-042", "NOR-043", "NOR-044", "NOR-045",
  "NOR-046", "NOR-047", "NOR-048", "NOR-049",
  "NOR-050", "NOR-051", "NOR-052", "NOR-053",
  "NOR-054", "NOR-055",
  "ART-056", "ART-057", "FOS-022", "FUL-021",
];

export const DECK_IDS: Record<string, string[]> = {
  player: BASE_DECK,
  Ignis: TENOTCH_DECK,
  Zephyr: NORDICO_DECK,
  Hydra: TENOTCH_DECK,
  Terran: NORDICO_DECK,
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
