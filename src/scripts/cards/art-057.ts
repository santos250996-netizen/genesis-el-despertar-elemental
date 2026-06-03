// ============ NÓRDICO MJOLNIR — ART-057 ============
// ARTEFACTO / EQUIPO / ATK 0
//
// EFECTO PASIVO: Da +5 ATK al monstruo equipado. Si el monstruo
//   equipado es NÓRDICO, también permite doble ataque (log message
//   por ahora, el sistema de doble ataque es complejo).
//   → getPassiveAtkBonus: +5 ATK si el target es NÓRDICO,
//     +5 ATK para cualquier target (equipo aplica al equipado)
//
// NOTA: Este es un artefacto de equipo. Se vincula a un monstruo
// del campo. El motor llama getPassiveAtkBonus solo para el
// monstruo equipado. Los artefactos NO tienen modo altar/monstruo.

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE NÓRDICO MJOLNIR
// ═══════════════════════════════════════════════════════════════

export const ART_057: CardScript = {

  // ── EFECTO PASIVO: +5 ATK al equipado; si NÓRDICO, doble ataque ──
  getPassiveAtkBonus(_ctx: DuelContext, _targetCard: CardData, _targetSlot: SlotId): number {
    // Para artefactos de equipo, el motor solo llama getPassiveAtkBonus
    // para el monstruo equipado.

    // NOTA: El doble ataque para NÓRDICO se maneja por separado en el motor.
    // No loguear aquí — esta función se llama en cada computación de ATK.

    // +5 ATK siempre (para cualquier monstruo equipado)
    return 5;
  },
};
