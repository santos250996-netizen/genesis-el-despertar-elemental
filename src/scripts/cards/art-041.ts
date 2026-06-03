// ============ TENOTCH PIEDRA DEL SOL — ART-041 ============
// ARTEFACTO / EQUIPO / ATK 0 / ARQUETIPO: TENOTCH
//
// EFECTO PASIVO: El monstruo equipado gana +3 ATK por cada carta
//   TENOTCH en el campo.
//   → getPassiveAtkBonus: Cuenta las cartas TENOTCH en el campo
//     (monstruos y altares del jugador), multiplica por 3, y
//     retorna ese valor como bonus para el monstruo equipado.
//
// NOTA: Este es un artefacto de equipo con arquetipo TENOTCH.
// Para artefactos de equipo, el motor solo llama getPassiveAtkBonus
// para el monstruo equipado. Contamos TENOTCH en ambos lados del
// campo (jugador y enemigo) según el diseño del efecto.

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  cardHasArquetipo,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE TENOTCH PIEDRA DEL SOL
// ═══════════════════════════════════════════════════════════════

/**
 * Cuenta las cartas TENOTCH en el campo del jugador que controla
 * este artefacto (monstruos + altares).
 */
function countTenotchOnField(ctx: DuelContext): number {
  const owner = ctx.card.ownerId;
  const prefix = owner === "player" ? "p" : "e";

  // Slots a revisar: monstruos y altares del owner
  const slots: SlotId[] = [
    `${prefix}-mon-1` as SlotId,
    `${prefix}-mon-2` as SlotId,
    `${prefix}-mon-3` as SlotId,
    `${prefix}-altar-luz` as SlotId,
    `${prefix}-altar-sombra` as SlotId,
  ];

  let count = 0;
  for (const slot of slots) {
    const card = ctx.engine.state.board[slot];
    if (card && cardHasArquetipo(card, "TENOTCH")) {
      count++;
    }
  }

  return count;
}

export const ART_041: CardScript = {

  // ── EFECTO PASIVO: +3 ATK por cada TENOTCH en el campo ──
  getPassiveAtkBonus(ctx: DuelContext, _targetCard: CardData, _targetSlot: SlotId): number {
    // Para artefactos de equipo, el motor solo llama getPassiveAtkBonus
    // para el monstruo equipado. Contamos TENOTCH en el campo y
    // retornamos +3 por cada uno.
    const tenotchCount = countTenotchOnField(ctx);
    const bonus = tenotchCount * 3;

    if (bonus > 0) {
      ctx.log.push(
        `>> Piedra del Sol: ${tenotchCount} TENOTCH en el campo → +${bonus} ATK al monstruo equipado.`
      );
    }

    return bonus;
  },
};
