// ============ NÓRDICO BERSERKER ÍGNEO — NOR-043 ============
// FERA / FULGUR / NORMAL / ATK 14
//
// EFECTO MONSTRUO 1 (on_destroy_enemy + SAQUEO): Al destruir un
//   monstruo enemigo, gana +4 ATK permanente.
//   → modifyPermanentAtk(slotId, 4)
//
// EFECTO ALTAR (TURNO): Una vez por turno, los monstruos FULGUR
//   en este carril ganan +2 ATK.
//   → onTurnStart marca el efecto como activado este turno.
//   → getPassiveAtkBonus retorna +2 si está activado y el objetivo
//     es FULGUR en la misma columna.

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  cardHasAttribute,
  getAltarColumn,
  getMonsterSlot,
  modifyPermanentAtk,
  isOncePerTurnUsed,
  markOncePerTurnUsed,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE NÓRDICO BERSERKER ÍGNEO
// ═══════════════════════════════════════════════════════════════

export const NOR_043: CardScript = {

  // ── EFECTO MONSTRUO 1: Saqueo NÓRDICO — ganar +4 ATK permanente ──
  onDestroyEnemy(ctx: DuelContext, destroyedEnemy: CardData): void {
    if (isAltarSlot(ctx.slotId)) return;

    modifyPermanentAtk(ctx.engine, ctx.slotId, 4);
    ctx.log.push(`>> ¡Saqueo Nórdico! ${ctx.card.data.name} saquea a ${destroyedEnemy.name}. ¡Gana +4 ATK permanente!`);
  },

  // ── EFECTO ALTAR (TURNO): Marcar como activado al inicio del turno ──
  onTurnStart(ctx: DuelContext): void {
    if (!isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    const altarCol = getAltarColumn(ctx.slotId);
    const monSlot = getMonsterSlot(owner, altarCol);
    const monCard = ctx.engine.state.board[monSlot];

    if (!monCard) return;
    if (!cardHasAttribute(monCard, "FULGUR")) return;

    // Solo marcar como activado si no se usó este turno
    if (isOncePerTurnUsed(ctx.engine, ctx.slotId)) return;
    markOncePerTurnUsed(ctx.engine, ctx.slotId);
    ctx.log.push(`>> ¡${ctx.card.data.name} (altar) activa su efecto TURNO! +2 ATK a FULGUR en carril ${altarCol}.`);
  },

  // ── EFECTO ALTAR (TURNO): +2 ATK pasivo a FULGUR en este carril ──
  // Computado dinámicamente — se activa si onTurnStart marcó el slot este turno.
  getPassiveAtkBonus(ctx: DuelContext, targetCard: CardData, targetSlot: SlotId): number {
    if (!isAltarSlot(ctx.slotId)) return 0;

    // Solo aplica si el efecto fue activado este turno
    if (!isOncePerTurnUsed(ctx.engine, ctx.slotId)) return 0;

    // Solo aplica a monstruos FULGUR
    if (!cardHasAttribute(targetCard, "FULGUR")) return 0;

    // Solo aplica al monstruo en la misma columna que el altar
    const owner = ctx.card.ownerId;
    const altarCol = getAltarColumn(ctx.slotId);
    const expectedMonSlot = getMonsterSlot(owner, altarCol);
    if (targetSlot !== expectedMonSlot) return 0;

    return 2;
  },
};
