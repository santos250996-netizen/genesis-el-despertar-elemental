// ============ NÓRDICO SURTR — NOR-044 ============
// FERA / FULGUR / ANOMALIA / ATK 18
//
// EFECTO MONSTRUO 1 (on_destroy_enemy + SAQUEO): Al destruir un
//   monstruo enemigo, inflige 5 daño directo a los LP del oponente.
//   → dealDamage(opponent, 5)
//
// EFECTO ALTAR (PASIVO): Cuando un enemigo es destruido en el
//   carril opuesto, inflige 2 daño directo a los LP del enemigo.
//   → onEnemyDestroy: dealDamage(opponent, 2)
//   Nota: Se activa cuando cualquier enemigo es destruido mientras
//   esta carta está en modo altar. El filtrado por carril opuesto
//   puede ser manejado por el motor de efectos.

import type { CardScript, DuelContext, CardData } from "@/engine/types";
import {
  isAltarSlot,
  getAltarColumn,
  getMonsterSlot,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE NÓRDICO SURTR
// ═══════════════════════════════════════════════════════════════

export const NOR_044: CardScript = {

  // ── EFECTO MONSTRUO 1: Saqueo NÓRDICO — 5 daño directo al oponente ──
  onDestroyEnemy(ctx: DuelContext, destroyedEnemy: CardData): void {
    if (isAltarSlot(ctx.slotId)) return;

    const opponent = ctx.card.ownerId === "player" ? "enemy" : "player";
    ctx.engine.dealDamage(opponent, 5);
    ctx.log.push(`>> ¡Saqueo Nórdico! ${ctx.card.data.name} saquea a ${destroyedEnemy.name}. ¡5 daño directo al oponente!`);
  },

  // ── EFECTO ALTAR (PASIVO): Enemigo destruido en carril opuesto → 2 daño ──
  onEnemyDestroy(ctx: DuelContext): void {
    if (!isAltarSlot(ctx.slotId)) return;

    // Filtrar por columna opuesta: verificar si hay un slot de monstruo enemigo vacío
    // en la columna del altar (el enemigo destruido estaba en esa columna)
    const opponent = ctx.card.ownerId === "player" ? "enemy" : "player";
    const altarCol = getAltarColumn(ctx.slotId);
    const enemyMonSlot = getMonsterSlot(opponent, altarCol);
    const enemyMonCard = ctx.engine.state.board[enemyMonSlot];

    // Si el slot del monstruo enemigo en la columna opuesta NO está vacío,
    // significa que la destrucción no fue en esta columna — no activar
    if (enemyMonCard !== null && enemyMonCard !== undefined) return;

    ctx.engine.dealDamage(opponent, 2);
    ctx.log.push(`>> ¡${ctx.card.data.name} (altar) canaliza la destrucción! 2 daño directo al oponente.`);
  },
};
