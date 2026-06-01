// ============ POSITION RULES ============
// Determines valid placement slots for cards and classifies summon types.

import type { SlotId } from "@/engine/types";
import type { CardData } from "@/engine/types";

/**
 * Returns which monster/altar/artifact slots a card can legally be placed in.
 * Does NOT check if slots are occupied — only zone eligibility.
 */
export function getValidSlots(card: CardData): SlotId[] {
  // Energy cards go to altars (type-specific)
  if (card.flags.includes("isEnergy")) {
    if (card.type === "CELESTIAL") return ["p-altar-luz"];
    if (card.type === "UMBRAL") return ["p-altar-sombra"];
    return ["p-altar-luz", "p-altar-sombra"];
  }

  // ARTEFACTO — artifact slot only
  if (card.type === "ARTEFACTO") {
    return ["p-artifact"];
  }

  // ECLIPSE and GENESIS — column 2 only (special summon)
  if (card.type === "ECLIPSE" || card.flags.includes("isGenesis")) {
    return ["p-mon-2"];
  }

  // CORRUPCION — column 3 only (special summon with sacrifice)
  if (card.type === "CORRUPCION") {
    return ["p-mon-3"];
  }

  // ANOMALIA — handled specially (targets enemy monster), not placed directly
  if (card.type === "ANOMALIA") {
    return [];
  }

  // Todas las cartas son híbridas (monstruo + altar) — pueden ir en zonas de monstruo o altares
  return ["p-mon-1", "p-mon-3", "p-altar-luz", "p-altar-sombra"];
}

/**
 * Classify the type of summon based on card type and target slot.
 * Used to enforce the "1 normal summon per turn" limit.
 */
export type SummonKind = "normal" | "special" | "altar" | "anomaly" | "artifact";

export function classifySummon(card: CardData, slotId: SlotId): SummonKind {
  if (card.type === "ANOMALIA") return "anomaly";
  if (card.type === "ARTEFACTO") return "artifact";
  if (slotId.includes("altar")) return "altar";
  if (card.type === "ECLIPSE" || card.flags.includes("isGenesis")) return "special";
  return "normal";
}

/**
 * Check if placing a card counts as a normal summon (subject to 1/turn limit).
 */
export function isNormalSummon(card: CardData, slotId: SlotId): boolean {
  return classifySummon(card, slotId) === "normal";
}

/**
 * Validate placement rules for a card into a specific slot.
 * Returns an error message string, or null if valid.
 */
export function validatePlacement(
  card: CardData,
  slotId: SlotId,
  board: Record<SlotId, any>
): string | null {
  // ARTEFACTO placement rules
  if (card.type === "ARTEFACTO") {
    if (slotId !== "p-artifact") return "Los Artefactos solo van en la ranura de Artefacto.";
    if (board["p-artifact"]) return "Ya tienes un Artefacto en el campo.";
    return null;
  }

  // ANOMALIA targets an enemy monster slot
  if (card.type === "ANOMALIA") {
    if (!slotId.startsWith("e-mon-")) return "Anomalía debe seleccionar un monstruo enemigo sintonizado.";
    const col = parseInt(slotId.split("-")[2]);
    if (col === 2) return "La zona central no puede estar sintonizada.";
    const eAltar = col === 1 ? "e-altar-luz" : "e-altar-sombra";
    if (!board[eAltar]) return "El enemigo no tiene un Altar activo en esa columna.";
    if (!board[slotId]) return "No hay monstruo enemigo en esa zona.";
    const pSlot = `p-mon-${col}` as SlotId;
    if (board[pSlot]) return `Tu zona ${col} no está vacía.`;
    return null;
  }

  // Altar placement rules — todas las cartas son híbridas y pueden ir en altares
  if (slotId.includes("altar")) {
    // No hay restricción de atributo — cualquier carta puede ir en cualquier altar
    return null;
  }

  // Column 2 restriction: only Eclipse and Genesis
  if (slotId === "p-mon-2" && card.type !== "ECLIPSE" && !card.flags.includes("isGenesis")) {
    return "La Zona Central (M2) solo acepta monstruos Eclipse o Genesis.";
  }

  // ECLIPSE requires both altars
  if (card.type === "ECLIPSE") {
    if (slotId !== "p-mon-2") return "Eclipse solo puede invocarse en la Zona Central (M2).";
    if (!board["p-altar-luz"] || !board["p-altar-sombra"]) return "Eclipse requiere ambos Altares activos.";
    return null;
  }

  // CORRUPCION requires shadow altar + sacrifice in zone 3
  if (card.type === "CORRUPCION") {
    if (slotId !== "p-mon-3") return "Corrupción solo puede invocarse en la Zona 3.";
    if (!board["p-altar-sombra"]) return "Corrupción requiere el Altar de Sombra activo.";
    if (!board["p-mon-3"]) return "Necesitas un monstruo en Zona 3 para sacrificar.";
    return null;
  }

  // GENESIS requires both altars and goes to zone 2
  if (card.flags.includes("isGenesis")) {
    if (slotId !== "p-mon-2") return "Génesis solo puede invocarse en la Columna Central.";
    if (!board["p-altar-luz"] || !board["p-altar-sombra"]) return "Se requiere Luz y Sombra activas.";
    return null;
  }

  // Check if slot is occupied
  if (board[slotId]) return `La zona ${slotId.split("-")[2]} ya está ocupada.`;

  return null;
}
