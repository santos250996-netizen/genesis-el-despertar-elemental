// ============ ESCUDO UMBRAL — ART-020 ============
// ARTEFACTO / EQUIPO / ATK 0
//
// EFECTO PASIVO: El monstruo equipado no puede ser destruido en combate.
//   → getPassiveAltarFlags: Retorna { undestroyable: true } para
//     el monstruo equipado.
//   → beforeDestroy: Si la carta en el slot es el monstruo equipado
//     de este artefacto, retorna true para prevenir la destrucción.
//
// NOTA: Este es un artefacto de equipo. Se coloca en el slot
// p-artifact / e-artifact y se vincula a un monstruo del campo.

import type { CardScript, DuelContext, CardData, SlotId, PassiveAltarFlags } from "@/engine/types";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE ESCUDO UMBRAL
// ═══════════════════════════════════════════════════════════════

export const ART_020: CardScript = {

  // ── EFECTO PASIVO: El monstruo equipado no puede ser destruido ──
  getPassiveAltarFlags(_ctx: DuelContext, _targetCard: CardData, _targetSlot: SlotId): PassiveAltarFlags {
    // Para artefactos de equipo, el motor solo llama getPassiveAltarFlags
    // para el monstruo equipado. Retornamos undestroyable: true.
    return { undestroyable: true };
  },

  // ── beforeDestroy: Prevenir la destrucción del monstruo equipado ──
  beforeDestroy(ctx: DuelContext): boolean {
    // Verificar si la carta que está a punto de ser destruida es
    // el monstruo equipado por este artefacto.
    // ctx.slotId es el slot de la carta siendo destruida.
    // Necesitamos buscar el artefacto en el slot de artefacto y ver si
    // su equippedTo coincide con ctx.slotId.
    const owner = ctx.card.ownerId;
    const prefix = owner === "player" ? "p" : "e";
    const artifactSlot = `${prefix}-artifact` as SlotId;
    const artifactCard = ctx.engine.state.board[artifactSlot];

    // Si hay un artefacto en el slot de artefacto y está equipado al slot
    // que está siendo destruido, prevenir la destrucción
    if (artifactCard && artifactCard.equippedTo === ctx.slotId) {
      ctx.log.push(`>> ¡Escudo Umbral protege al monstruo equipado! No puede ser destruido en combate.`);
      return true;
    }

    return false;
  },
};
