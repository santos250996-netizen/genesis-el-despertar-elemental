// ============ TENOTCH MICTLANTECUHTLI — TEN-039 ============
// NECRO / UMBRAL / CORRUPCION / ATK 24
//
// EFECTO MONSTRUO 1 (on_place + TRIBUTO): Tributo TENOTCH: sacrifica
//   un aliado TENOTCH → aplica corrosión a todas las columnas enemigas
//   e infecta a todos los monstruos enemigos.
//   → Cuando Mictlantecuhtli es colocado en slot de monstruo (no altar):
//     1. Sacrificar un aliado TENOTCH
//     2. addCorrosionToAllEnemies con amount 1
//
// EFECTO MONSTRUO 2 (on_destroy_enemy): Al destruir un monstruo enemigo,
//   inflige 3 puntos de daño directo al LP del oponente.
//
// EFECTO ALTAR (PASIVO): Todos los monstruos enemigos pierden 2 ATK.

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  sacrificeAllyByArquetipo,
  addCorrosionToAllEnemies,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE TENOTCH MICTLANTECUHTLI
// ═══════════════════════════════════════════════════════════════

export const TEN_039: CardScript = {

  // ── EFECTO MONSTRUO 1: Tributo TENOTCH → corrosión a todos los enemigos ──
  onPlace(ctx: DuelContext): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // Buscar aliado TENOTCH para sacrificar
    const sacrificed = sacrificeAllyByArquetipo(ctx.engine, owner, "TENOTCH", ctx.slotId);

    if (sacrificed) {
      // Aplicar corrosión a todos los monstruos enemigos
      const affected = addCorrosionToAllEnemies(ctx.engine, owner, 1);
      ctx.log.push(`>> ¡Sacrificio Mortal! ${ctx.card.data.name} sacrifica a ${sacrificed}. Corrosión aplicada a ${affected.length} monstruo(s) enemigo(s).`);
    } else {
      ctx.log.push(`>> ${ctx.card.data.name}: No hay aliados TENOTCH para sacrificar.`);
    }
  },

  // ── EFECTO MONSTRUO 2: Al destruir enemigo → 3 daño directo ──
  onDestroyEnemy(ctx: DuelContext, destroyedEnemy: CardData): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    const target = owner === "player" ? "enemy" : "player";
    ctx.engine.dealDamage(target, 3);
    ctx.log.push(`>> ¡${ctx.card.data.name} cosecha almas! 3 daño directo al oponente por destruir a ${destroyedEnemy.name}.`);
  },

  // ── EFECTO ALTAR (PASIVO): Todos los monstruos enemigos pierden 2 ATK ──
  getPassiveAtkBonus(ctx: DuelContext, targetCard: CardData, targetSlot: SlotId): number {
    if (!isAltarSlot(ctx.slotId)) return 0;

    const owner = ctx.card.ownerId;
    const oppPrefix = owner === "player" ? "e" : "p";

    // Solo aplica a slots del oponente
    if (!targetSlot.startsWith(oppPrefix)) return 0;

    // Solo aplica a monstruos (no altares)
    if (!targetSlot.includes("mon")) return 0;

    return -2;
  },
};
