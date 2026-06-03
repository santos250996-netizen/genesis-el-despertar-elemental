// ============ HIDRA ABISAL — ABI-023 ============
// MARINA / ABIS / NORMAL / ATK 11
//
// EFECTO MONSTRUO (on_attack): Al declarar ataque, aplica 1 contador
//   de corrosión al monstruo enemigo en la columna opuesta.
//   → Cuando Hidra Abisal declara ataque en modo monstruo:
//     1. Comprobar que está en slot de monstruo (no altar)
//     2. Buscar el monstruo enemigo en la columna opuesta
//     3. Aplicar 1 contador de corrosión (addCorrosion)
//
// EFECTO ALTAR (TURNO): Una vez por turno, al inicio del turno,
//   aplica 1 contador de corrosión al monstruo enemigo en el carril opuesto.
//   → onTurnStart: Comprobar que está en slot de altar,
//     que no se usó este turno, buscar enemigo opuesto, aplicar corrosión.

import type { CardScript, DuelContext, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  getAltarColumn,
  getOpposingMonster,
  addCorrosion,
  isOncePerTurnUsed,
  markOncePerTurnUsed,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE HIDRA ABISAL
// ═══════════════════════════════════════════════════════════════

export const ABI_023: CardScript = {

  // ── EFECTO MONSTRUO: Al atacar, aplica 1 corrosión al enemigo opuesto ──
  onAttackDeclared(ctx: DuelContext): void {
    // Solo activa si está en modo monstruo (no en altar)
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // Buscar monstruo enemigo en la columna opuesta
    const opposing = getOpposingMonster(ctx.engine, ctx.slotId, owner);
    if (!opposing) {
      ctx.log.push(`>> ${ctx.card.data.name}: No hay enemigo opuesto para corromper.`);
      return;
    }

    // Aplicar 1 contador de corrosión
    addCorrosion(ctx.engine, opposing.slot, 1);
    ctx.log.push(
      `>> ¡${ctx.card.data.name} escupe veneno abisal! 1 corrosión a ${opposing.card.name} en ${opposing.slot}.`
    );
  },

  // ── EFECTO ALTAR (TURNO): 1/turno, corrosión al enemigo opuesto ──
  onTurnStart(ctx: DuelContext): void {
    // Solo activa si está en slot de altar
    if (!isAltarSlot(ctx.slotId)) return;

    // Comprobar si ya se usó este turno
    if (isOncePerTurnUsed(ctx.engine, ctx.slotId)) {
      ctx.log.push(`>> ${ctx.card.data.name} (altar): Efecto ya usado este turno.`);
      return;
    }

    const owner = ctx.card.ownerId;
    const altarCol = getAltarColumn(ctx.slotId);

    // Buscar el monstruo enemigo en la columna opuesta
    const oppPrefix = owner === "player" ? "e" : "p";
    const oppSlot = `${oppPrefix}-mon-${altarCol}` as SlotId;
    const oppCard = ctx.engine.state.board[oppSlot];

    if (!oppCard) {
      ctx.log.push(`>> ${ctx.card.data.name} (altar): No hay enemigo opuesto en columna ${altarCol}.`);
      return;
    }

    // Aplicar 1 contador de corrosión
    addCorrosion(ctx.engine, oppSlot, 1);
    markOncePerTurnUsed(ctx.engine, ctx.slotId);
    ctx.log.push(
      `>> ¡${ctx.card.data.name} (altar) propaga su miasma abisal! 1 corrosión a ${oppCard.name} en columna ${altarCol}.`
    );
  },
};
