// ============ NÓRDICO HUGINN & MUNINN — NOR-052 ============
// ANIMA / AURA / ANOMALIA / ATK 16
//
// EFECTO MONSTRUO 1 (on_destroy_enemy + SAQUEO): Al destruir un
//   monstruo enemigo, niega el siguiente efecto enemigo este turno.
//   → Loguear mensaje de negación (sistema de negación complejo
//     pendiente de implementar).
//
// EFECTO ALTAR (RESPUESTA): Cuando un enemigo ataca en este carril,
//   ese enemigo pierde 2 ATK permanente.
//   → onEnemyAttack: Si el ataque es en la columna del altar,
//     modifyPermanentAtk -2 al atacante

import type { CardScript, DuelContext, CardData } from "@/engine/types";
import {
  isAltarSlot,
  getAltarColumn,
  getMonsterSlot,
  modifyPermanentAtk,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE NÓRDICO HUGINN & MUNINN
// ═══════════════════════════════════════════════════════════════

export const NOR_052: CardScript = {

  // ── EFECTO MONSTRUO 1: Saqueo NÓRDICO — negar siguiente efecto enemigo ──
  onDestroyEnemy(ctx: DuelContext, destroyedEnemy: CardData): void {
    if (isAltarSlot(ctx.slotId)) return;

    // Incrementar negatedEffects — el motor lo consulta para suprimir efectos
    const current = ctx.engine.state.effects.negatedEffects || 0;
    ctx.engine.state.effects.negatedEffects = current + 1;
    ctx.log.push(`>> ¡Saqueo Nórdico! ${ctx.card.data.name} saquea a ${destroyedEnemy.name}. ¡Niega el siguiente efecto enemigo este turno!`);
  },

  // ── EFECTO ALTAR (RESPUESTA): Enemigo ataca en carril → pierde 2 ATK ──
  onEnemyAttack(ctx: DuelContext, attackColumn: number): void {
    if (!isAltarSlot(ctx.slotId)) return;

    const altarCol = getAltarColumn(ctx.slotId);

    // Solo activa si el ataque es en la columna del altar
    if (attackColumn !== altarCol) return;

    // Reducir 2 ATK permanente al monstruo atacante enemigo
    const owner = ctx.card.ownerId;
    const opponent = owner === "player" ? "enemy" : "player";
    const attackerSlot = getMonsterSlot(opponent, attackColumn);

    modifyPermanentAtk(ctx.engine, attackerSlot, -2);
    ctx.log.push(`>> ¡${ctx.card.data.name} (altar) observa el ataque! El atacante en columna ${attackColumn} pierde 2 ATK permanente.`);
  },
};
