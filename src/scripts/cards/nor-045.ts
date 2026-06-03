// ============ NÓRDICO JORMUNGANDR — NOR-045 ============
// MARINA / ABIS / ECLIPSE / ATK 24
//
// EFECTO MONSTRUO 1 (on_destroy_enemy + SAQUEO): Al destruir un
//   monstruo enemigo, aplica corrosión a todas las columnas enemigas.
//   → addCorrosionToAllEnemies(engine, owner, 1)
//
// EFECTO MONSTRUO 2 (on_turn_start): Al inicio del turno, inflige
//   daño por corrosión: itera monstruos enemigos, revisa contadores
//   de corrosión y causa 2 daño por cada contador.
//   → Iterar getAllMonsters(opponent), para cada uno:
//     corrosionCounters[slot] * 2 daño a LP del oponente
//
// EFECTO ALTAR (PASIVO): Los monstruos enemigos en el carril
//   opuesto pierden 2 ATK.
//   → getPassiveAtkBonus: -2 para monstruos enemigos en la columna
//     opuesta al altar.

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  isMonsterSlot,
  getAltarColumn,
  getMonsterSlot,
  getAllMonsters,
  addCorrosionToAllEnemies,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE NÓRDICO JORMUNGANDR
// ═══════════════════════════════════════════════════════════════

export const NOR_045: CardScript = {

  // ── EFECTO MONSTRUO 1: Saqueo NÓRDICO — corrosión a todos los enemigos ──
  onDestroyEnemy(ctx: DuelContext, destroyedEnemy: CardData): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    const affected = addCorrosionToAllEnemies(ctx.engine, owner, 1);

    if (affected.length > 0) {
      ctx.log.push(`>> ¡Saqueo Nórdico! ${ctx.card.data.name} saquea a ${destroyedEnemy.name}. ¡Corrosión aplicada a ${affected.length} enemigo(s): ${affected.join(", ")}!`);
    } else {
      ctx.log.push(`>> ¡Saqueo Nórdico! ${ctx.card.data.name} saquea a ${destroyedEnemy.name}. No hay enemigos para corroer.`);
    }
  },

  // ── EFECTO MONSTRUO 2: Daño por corrosión al inicio del turno ──
  onTurnStart(ctx: DuelContext): void {
    if (isAltarSlot(ctx.slotId)) return;

    const opponent = ctx.card.ownerId === "player" ? "enemy" : "player";
    const enemies = getAllMonsters(ctx.engine, opponent);

    let totalDamage = 0;

    for (const { card, slot } of enemies) {
      const counters = ctx.engine.state.effects.corrosionCounters[slot] ?? 0;
      if (counters > 0) {
        const damage = counters * 2;
        ctx.engine.dealDamage(opponent, damage);
        ctx.log.push(`>> ¡La corrosión de ${ctx.card.data.name} causa ${damage} daño a ${card.name}! (${counters} contador(es))`);
        totalDamage += damage;
      }
    }

    if (totalDamage > 0) {
      ctx.log.push(`>> ${ctx.card.data.name} inflige un total de ${totalDamage} daño por corrosión.`);
    }
  },

  // ── EFECTO ALTAR (PASIVO): Enemigos en carril opuesto pierden 2 ATK ──
  getPassiveAtkBonus(ctx: DuelContext, targetCard: CardData, targetSlot: SlotId): number {
    if (!isAltarSlot(ctx.slotId)) return 0;

    // Solo aplica a monstruos enemigos
    const owner = ctx.card.ownerId;
    const oppPrefix = owner === "player" ? "e" : "p";

    if (!targetSlot.startsWith(oppPrefix)) return 0;
    if (!isMonsterSlot(targetSlot)) return 0;

    // Solo aplica al monstruo en la columna opuesta al altar
    const altarCol = getAltarColumn(ctx.slotId);
    const oppMonSlot = getMonsterSlot(owner === "player" ? "enemy" : "player", altarCol);
    if (targetSlot !== oppMonSlot) return 0;

    return -2;
  },
};
