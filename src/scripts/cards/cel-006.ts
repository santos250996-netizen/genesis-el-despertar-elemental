// ============ SOMBRA DE ESPEJO — CEL-006 ============
// ÁNIMA / CELESTIAL / ANOMALÍA / ATK 15
//
// EFECTO MONSTRUO: Se invoca consumiendo un monstruo enemigo. Hereda
//   el ATK del consumido si es mayor.
//   → Cuando Sombra de Espejo consume un enemigo (invocación Anomalía):
//     1. Comparar ATK del consumido con el propio
//     2. Si el consumido tiene más ATK, añadir la diferencia como bonus
//
// EFECTO ALTAR (TURNO): Reduce ATK del monstruo enemigo en la columna
//   opuesta del altar en 3 al ser invocado.
//   → Cuando un enemigo es invocado en la columna opuesta del altar:
//     1. Comprobar que el efecto no se usó este turno
//     2. Reducir ATK del monstruo enemigo en 3 permanentemente
//     3. Marcar como usado

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  getAltarColumn,
  isOncePerTurnUsed,
  markOncePerTurnUsed,
  modifyPermanentAtk,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE SOMBRA DE ESPEJO
// ═══════════════════════════════════════════════════════════════

export const CEL_006: CardScript = {

  // ── EFECTO MONSTRUO: Hereda ATK del consumido si es mayor ──
  onConsume(ctx: DuelContext, consumedEnemy: CardData): void {
    // Solo activa si está en modo monstruo (no en altar)
    if (isAltarSlot(ctx.slotId)) return;

    const myAtk = ctx.card.data.atk;
    const enemyAtk = consumedEnemy.atk;

    if (enemyAtk > myAtk) {
      const diff = enemyAtk - myAtk;
      ctx.engine.modifyAtk(ctx.slotId, diff);
      ctx.log.push(`>> ¡${ctx.card.data.name} hereda ATK de ${consumedEnemy.name}! +${diff} ATK (ATK heredado: ${enemyAtk}).`);
    } else {
      ctx.log.push(`>> ${ctx.card.data.name}: ${consumedEnemy.name} tiene ATK menor o igual (${enemyAtk}), no se hereda.`);
    }
  },

  // ── EFECTO ALTAR (TURNO): Reduce ATK del monstruo enemigo en la columna opuesta en 3 ──
  onEnemySummon(ctx: DuelContext): void {
    // Solo activa si Sombra de Espejo está en slot de altar
    if (!isAltarSlot(ctx.slotId)) return;

    // Comprobar si ya se usó este turno
    if (isOncePerTurnUsed(ctx.engine, ctx.slotId)) {
      ctx.log.push(`>> ${ctx.card.data.name} (altar): Reducción ya usada este turno.`);
      return;
    }

    // Obtener la columna del altar y buscar el monstruo enemigo en la columna opuesta
    const owner = ctx.card.ownerId;
    const oppPrefix = owner === "player" ? "e" : "p";
    const altarCol = getAltarColumn(ctx.slotId);
    const oppMonSlot = `${oppPrefix}-mon-${altarCol}` as SlotId;
    const oppMon = ctx.engine.state.board[oppMonSlot];

    if (!oppMon) {
      ctx.log.push(`>> ${ctx.card.data.name} (altar): No hay monstruo enemigo en la columna opuesta.`);
      return;
    }

    // Reducir ATK del monstruo enemigo en 3 permanentemente
    modifyPermanentAtk(ctx.engine, oppMonSlot, -3);
    markOncePerTurnUsed(ctx.engine, ctx.slotId);
    ctx.log.push(`>> ¡${ctx.card.data.name} (altar) reduce ATK de ${oppMon.name} en 3 (columna ${altarCol})!`);
  },
};
