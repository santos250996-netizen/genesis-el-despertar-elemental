// ============ NÓRDICO THOR — NOR-042 ============
// GENS / FULGUR / GENESIS / ATK 28
//
// EFECTO MONSTRUO 1 (on_destroy_enemy + SAQUEO): Al destruir un
//   monstruo enemigo, destruye TODOS los monstruos enemigos con ATK
//   menor al ATK de esta carta.
//   → Obtener ATK efectivo de Thor (base + temp + perm),
//     iterar todos los monstruos enemigos y destruir los de menor ATK.
//
// EFECTO MONSTRUO 2 (on_attack_declared): Al declarar ataque,
//   inflige 3 daño directo a los LP del oponente.
//   → dealDamage(opponent, 3)
//
// EFECTO ALTAR (PASIVO): Los monstruos NÓRDICO en este carril
//   ganan +3 ATK.
//   → getPassiveAtkBonus: +3 si targetCard es NÓRDICO y está
//     en la columna del altar.

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  cardHasArquetipo,
  getAltarColumn,
  getMonsterSlot,
  getAllMonsters,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE NÓRDICO THOR
// ═══════════════════════════════════════════════════════════════

export const NOR_042: CardScript = {

  // ── EFECTO MONSTRUO 1: Saqueo NÓRDICO — destruir enemigos con ATK menor ──
  onDestroyEnemy(ctx: DuelContext, destroyedEnemy: CardData): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    const opponent = owner === "player" ? "enemy" : "player";

    // Calcular ATK efectivo de Thor (base + bonus temporal + bonus permanente)
    const baseAtk = ctx.card.data.atk;
    const tempBonus = ctx.engine.state.effects.tempAtkBonus[ctx.slotId] ?? 0;
    const permBonus = ctx.engine.state.effects.atkBonus[ctx.slotId] ?? 0;
    const effectiveAtk = baseAtk + tempBonus + permBonus;

    // Iterar todos los monstruos enemigos y destruir los de ATK menor
    // Usar ATK computado (base + bonus) en vez de card.atk base
    const enemies = getAllMonsters(ctx.engine, opponent);
    let destroyed = 0;

    for (const { card, slot } of enemies) {
      const enemyComputedAtk = (ctx.engine as any).computeEnemyMonAtk(slot).atk;
      if (enemyComputedAtk < effectiveAtk) {
        ctx.engine.destroyCard(slot);
        ctx.log.push(`>> ¡El rayo de ${ctx.card.data.name} destruye a ${card.name}! (ATK ${enemyComputedAtk} < ${effectiveAtk})`);
        destroyed++;
      }
    }

    if (destroyed > 0) {
      ctx.log.push(`>> ¡Saqueo Nórdico! ${ctx.card.data.name} saquea a ${destroyedEnemy.name}. ¡${destroyed} enemigo(s) destruido(s) por el trueno!`);
    } else {
      ctx.log.push(`>> ¡Saqueo Nórdico! ${ctx.card.data.name} saquea a ${destroyedEnemy.name}. Ningún enemigo con ATK menor a ${effectiveAtk}.`);
    }
  },

  // ── EFECTO MONSTRUO 2: Al declarar ataque, 3 daño directo al oponente ──
  onAttackDeclared(ctx: DuelContext): void {
    if (isAltarSlot(ctx.slotId)) return;

    const opponent = ctx.card.ownerId === "player" ? "enemy" : "player";
    ctx.engine.dealDamage(opponent, 3);
    ctx.log.push(`>> ¡${ctx.card.data.name} invoca el rayo! 3 daño directo al oponente.`);
  },

  // ── EFECTO ALTAR (PASIVO): NÓRDICO en este carril ganan +3 ATK ──
  getPassiveAtkBonus(ctx: DuelContext, targetCard: CardData, targetSlot: SlotId): number {
    if (!isAltarSlot(ctx.slotId)) return 0;

    // Solo aplica a monstruos NÓRDICO
    if (!cardHasArquetipo(targetCard, "NORDICO")) return 0;

    // Solo aplica al monstruo en la misma columna que el altar
    const owner = ctx.card.ownerId;
    const altarCol = getAltarColumn(ctx.slotId);
    const expectedMonSlot = getMonsterSlot(owner, altarCol);
    if (targetSlot !== expectedMonSlot) return 0;

    return 3;
  },
};
