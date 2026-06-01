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

  // ECLIPSE and GENESIS — column 2 (special summon) o altares (como altar)
  if (card.type === "ECLIPSE" || card.flags.includes("isGenesis")) {
    return ["p-mon-2", "p-altar-luz", "p-altar-sombra"];
  }

  // CORRUPCION — column 3 (sacrificio) o altares (como altar)
  if (card.type === "CORRUPCION") {
    return ["p-mon-3", "p-altar-luz", "p-altar-sombra"];
  }

  // ANOMALIA — puede ir en altares (como híbrida) o consumir monstruo enemigo
  if (card.type === "ANOMALIA") {
    return ["p-altar-luz", "p-altar-sombra"];
  }

  // Todas las cartas son híbridas (monstruo + altar) — pueden ir en CUALQUIER zona de monstruo o altares
  return ["p-mon-1", "p-mon-2", "p-mon-3", "p-altar-luz", "p-altar-sombra"];
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

  // ANOMALIA — en altar se permite (como híbrida), en e-mon consume monstruo enemigo
  if (card.type === "ANOMALIA") {
    if (slotId.includes("altar")) {
      // En altar: se permite sin requisitos (efecto altar)
      return null;
    }
    if (!slotId.startsWith("e-mon-")) return "Anomalía debe seleccionar un monstruo enemigo sintonizado o un Altar.";
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

  // Column 2: ahora abierta para invocación NORMAL también
  // (Solo Eclipse/Genesis tienen requisitos especiales en M2, pero ya se validan abajo)

  // ECLIPSE: en p-mon-2 requiere ambos altares, en altar va normal
  if (card.type === "ECLIPSE") {
    if (slotId === "p-mon-2") {
      if (!board["p-altar-luz"] || !board["p-altar-sombra"]) return "Eclipse requiere ambos Altares activos.";
      return null;
    }
    // Si va al altar, se permite sin requisitos especiales
    return null;
  }

  // CORRUPCION: en p-mon-3 requiere sacrificio, en altar va normal
  if (card.type === "CORRUPCION") {
    if (slotId === "p-mon-3") {
      if (!board["p-altar-sombra"]) return "Corrupción requiere el Altar de Sombra activo.";
      if (!board["p-mon-3"]) return "Necesitas un monstruo en Zona 3 para sacrificar.";
      return null;
    }
    // Si va al altar, se permite sin requisitos especiales
    return null;
  }

  // GENESIS: en p-mon-2 requiere ambos altares, en altar va normal
  if (card.flags.includes("isGenesis")) {
    if (slotId === "p-mon-2") {
      if (!board["p-altar-luz"] || !board["p-altar-sombra"]) return "Se requiere Luz y Sombra activas.";
      return null;
    }
    // Si va al altar, se permite sin requisitos especiales
    return null;
  }

  // Check if slot is occupied
  if (board[slotId]) return `La zona ${slotId.split("-")[2]} ya está ocupada.`;

  return null;
}
