// ============ ESPADA DEL ALBA — ART-019 ============
// ARTEFACTO / EQUIPO / ATK 0
//
// EFECTO PASIVO: El monstruo equipado gana +4 ATK.
//   → getPassiveAtkBonus: Retorna +4 para cualquier target.
//     Para artefactos de equipo, el motor solo llama este hook
//     para el monstruo equipado, así que basta con retornar +4.
//
// NOTA: Este es un artefacto de equipo. Se coloca en el slot
// p-artifact / e-artifact y se vincula a un monstruo del campo.
// El motor llamará getPassiveAtkBonus solo para el monstruo
// equipado cuando compute los ATK bonus de artefactos.

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE ESPADA DEL ALBA
// ═══════════════════════════════════════════════════════════════

export const ART_019: CardScript = {

  // ── EFECTO PASIVO: El monstruo equipado gana +4 ATK ──
  getPassiveAtkBonus(_ctx: DuelContext, _targetCard: CardData, _targetSlot: SlotId): number {
    // Para artefactos de equipo, el motor solo llama getPassiveAtkBonus
    // para el monstruo equipado. Por lo tanto, siempre retornamos +4.
    return 4;
  },
};
