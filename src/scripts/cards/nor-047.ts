// ============ NÓRDICO AEGIR — NOR-047 ============
// SATIVA / ABIS / NORMAL / ATK 10
//
// EFECTO MONSTRUO 1 (on_destroy_enemy + SAQUEO): Al destruir un
//   monstruo enemigo, recupera 5 LP.
//   → heal(owner, 5)
//
// EFECTO MONSTRUO 2 (on_place): Al ser colocada, ganas 2 LP.
//   → heal(owner, 2)
//
// EFECTO ALTAR (TURNO): Una vez por turno, si controlas un
//   monstruo ABIS en este carril, ganas 2 LP.
//   → onTurnStart: Verificar si hay ABIS en la columna del altar,
//     si sí y no se usó este turno, heal(owner, 2) y marcar uso.

import type { CardScript, DuelContext, CardData } from "@/engine/types";
import {
  isAltarSlot,
  cardHasAttribute,
  getAltarColumn,
  getMonsterSlot,
  isOncePerTurnUsed,
  markOncePerTurnUsed,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE NÓRDICO AEGIR
// ═══════════════════════════════════════════════════════════════

export const NOR_047: CardScript = {

  // ── EFECTO MONSTRUO 1: Saqueo NÓRDICO — recuperar 5 LP ──
  onDestroyEnemy(ctx: DuelContext, destroyedEnemy: CardData): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    ctx.engine.heal(owner, 5);
    ctx.log.push(`>> ¡Saqueo Nórdico! ${ctx.card.data.name} saquea a ${destroyedEnemy.name}. ¡Recupera 5 LP!`);
  },

  // ── EFECTO MONSTRUO 2: Al ser colocada, ganas 2 LP ──
  onPlace(ctx: DuelContext): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    ctx.engine.heal(owner, 2);
    ctx.log.push(`>> ¡${ctx.card.data.name} activa su efecto al ser invocada! Gana 2 LP.`);
  },

  // ── EFECTO ALTAR (TURNO): Una vez por turno, si controlas ABIS en este carril, +2 LP ──
  onTurnStart(ctx: DuelContext): void {
    if (!isAltarSlot(ctx.slotId)) return;

    // Solo una vez por turno
    if (isOncePerTurnUsed(ctx.engine, ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    const altarCol = getAltarColumn(ctx.slotId);
    const monSlot = getMonsterSlot(owner, altarCol);
    const monCard = ctx.engine.state.board[monSlot];

    // Verificar que hay un monstruo ABIS en este carril
    if (!monCard || !cardHasAttribute(monCard, "ABIS")) return;

    markOncePerTurnUsed(ctx.engine, ctx.slotId);
    ctx.engine.heal(owner, 2);
    ctx.log.push(`>> ¡${ctx.card.data.name} (altar) activa su efecto TURNO! +2 LP por controlar un monstruo ABIS en carril ${altarCol}.`);
  },
};
