// ============ NÓRDICO HEL — NOR-055 ============
// NECRO / UMBRAL / CORRUPCION / ATK 24
//
// EFECTO MONSTRUO 1 (on_destroy_enemy + SAQUEO): Al destruir un
//   monstruo enemigo, roba el monstruo destruido a tu campo Y
//   inflige 3 de daño directo al LP del oponente.
//   → stealEnemyToField para robar el monstruo
//   → dealDamage 3 al oponente
//
// EFECTO ALTAR (PASIVO): TODOS los monstruos enemigos pierden 2 ATK.
//   → getPassiveAtkBonus: Retorna -2 para cualquier monstruo enemigo.

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  isMonsterSlot,
  stealEnemyToField,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE NÓRDICO HEL
// ═══════════════════════════════════════════════════════════════

export const NOR_055: CardScript = {

  // ── EFECTO MONSTRUO 1: Saqueo NÓRDICO — robar enemigo + 3 daño directo ──
  onDestroyEnemy(ctx: DuelContext, destroyedEnemy: CardData): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // 1. Robar el monstruo destruido al campo propio
    const stolenName = stealEnemyToField(ctx.engine, destroyedEnemy, owner);

    // 2. Infligir 3 daño directo al LP del oponente
    const target: "player" | "enemy" = owner === "player" ? "enemy" : "player";
    ctx.engine.dealDamage(target, 3);

    if (stolenName) {
      ctx.log.push(`>> ¡Saqueo Nórdico! ${ctx.card.data.name} saquea a ${destroyedEnemy.name}. ¡Roba ${stolenName} al campo propio e inflige 3 daño directo!`);
    } else {
      ctx.log.push(`>> ¡Saqueo Nórdico! ${ctx.card.data.name} saquea a ${destroyedEnemy.name}. No se pudo robar al campo, pero inflige 3 daño directo.`);
    }
  },

  // ── EFECTO ALTAR (PASIVO): Todos los monstruos enemigos pierden 2 ATK ──
  getPassiveAtkBonus(ctx: DuelContext, targetCard: CardData, targetSlot: SlotId): number {
    if (!isAltarSlot(ctx.slotId)) return 0;

    // Determinar si el target es enemigo comparando prefijos
    const owner = ctx.card.ownerId;
    const oppPrefix = owner === "player" ? "e" : "p";

    // Solo aplica a monstruos enemigos
    if (!targetSlot.startsWith(oppPrefix)) return 0;
    if (!isMonsterSlot(targetSlot)) return 0;

    return -2;
  },
};
