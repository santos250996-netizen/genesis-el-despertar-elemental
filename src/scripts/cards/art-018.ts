// ============ TIERRA BALDÍA — ART-018 ============
// ARTEFACTO / CAMPO / ATK 0
//
// EFECTO PASIVO 1: TODOS los monstruos (ambos lados) pierden 1 ATK.
//   → getPassiveAtkBonus: Siempre retorna -1, sin importar el target.
//     Aplica a monstruos de ambos jugadores.
//
// EFECTO PASIVO 2: Los contadores de escudo no pueden ser activados.
//   → getPassiveAltarFlags: Retorna flag para indicar que los escudos
//     están desactivados. (El flag pasivo no está implementado en el
//     motor aún — por ahora se loguea la intención.)
//
// NOTA: Este es un artefacto de campo. Su getPassiveAtkBonus aplica
// a TODOS los monstruos en el campo (ambos lados).
// La integración del motor para bonus de artefactos se añadirá después.

import type { CardScript, DuelContext, CardData, SlotId, PassiveAltarFlags } from "@/engine/types";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE TIERRA BALDÍA
// ═══════════════════════════════════════════════════════════════

export const ART_018: CardScript = {

  // ── EFECTO PASIVO 1: Todos los monstruos pierden 1 ATK ──
  getPassiveAtkBonus(_ctx: DuelContext, _targetCard: CardData, _targetSlot: SlotId): number {
    // Tierra Baldía afecta a TODOS los monstruos del campo,
    // sin importar el atributo, arquetipo o dueño.
    // Siempre retorna -1.
    return -1;
  },

  // ── EFECTO PASIVO 2: Escudos no pueden ser activados ──
  getPassiveAltarFlags(_ctx: DuelContext, _targetCard: CardData, _targetSlot: SlotId): PassiveAltarFlags {
    // Los escudos no pueden ser activados mientras Tierra Baldía esté en el campo.
    return { shieldsDisabled: true };
  },
};
