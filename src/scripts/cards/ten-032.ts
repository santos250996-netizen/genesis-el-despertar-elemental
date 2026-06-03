// ============ TENOTCH CIPACTLI — TEN-032 ============
// CLASTO / FOSO / CORRUPCION / ATK 20
//
// EFECTO MONSTRUO 1 (on_place + TRIBUTO): Tributo TENOTCH: sacrifica
//   un aliado TENOTCH → aplica corrosión a 1 columna enemiga e infecta
//   al monstruo en la columna opuesta.
//   → Cuando Cipactli es colocado en slot de monstruo (no altar):
//     1. Sacrificar un aliado TENOTCH
//     2. Aplicar corrosión a la columna enemiga opuesta
//     3. Infectar (addCorrosion) al monstruo opuesto
//
// EFECTO MONSTRUO 2 (on_attack): Al declarar ataque, el monstruo enemigo
//   en la columna opuesta pierde 2 ATK permanentemente.
//
// EFECTO ALTAR (PASIVO): Todos los monstruos enemigos pierden 1 ATK.

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  getOpposingMonster,
  modifyPermanentAtk,
  sacrificeAllyByArquetipo,
  addCorrosion,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE TENOTCH CIPACTLI
// ═══════════════════════════════════════════════════════════════

export const TEN_032: CardScript = {

  // ── EFECTO MONSTRUO 1: Tributo TENOTCH → corrosión + infectar ──
  onPlace(ctx: DuelContext): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // Buscar aliado TENOTCH para sacrificar
    const sacrificed = sacrificeAllyByArquetipo(ctx.engine, owner, "TENOTCH", ctx.slotId);

    if (sacrificed) {
      // Aplicar corrosión e infectar al monstruo en la columna opuesta
      const opposing = getOpposingMonster(ctx.engine, ctx.slotId, owner);
      if (opposing) {
        addCorrosion(ctx.engine, opposing.slot, 1);
        ctx.log.push(`>> ¡Sacrificio Corrupto! ${ctx.card.data.name} sacrifica a ${sacrificed}. Aplica corrosión a ${opposing.card.name} en columna opuesta.`);
      } else {
        ctx.log.push(`>> ¡Sacrificio Corrupto! ${ctx.card.data.name} sacrifica a ${sacrificed}. No hay monstruo enemigo en columna opuesta para infectar.`);
      }
    } else {
      ctx.log.push(`>> ${ctx.card.data.name}: No hay aliados TENOTCH para sacrificar.`);
    }
  },

  // ── EFECTO MONSTRUO 2: Al atacar, enemigo opuesto pierde 2 ATK ──
  onAttackDeclared(ctx: DuelContext): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    const opposing = getOpposingMonster(ctx.engine, ctx.slotId, owner);

    if (opposing) {
      modifyPermanentAtk(ctx.engine, opposing.slot, -2);
      ctx.log.push(`>> ¡${ctx.card.data.name} debilita a ${opposing.card.name}! Pierde 2 ATK.`);
    }
  },

  // ── EFECTO ALTAR (PASIVO): Todos los monstruos enemigos pierden 1 ATK ──
  getPassiveAtkBonus(ctx: DuelContext, targetCard: CardData, targetSlot: SlotId): number {
    if (!isAltarSlot(ctx.slotId)) return 0;

    const owner = ctx.card.ownerId;
    const oppPrefix = owner === "player" ? "e" : "p";

    // Solo aplica a slots del oponente
    if (!targetSlot.startsWith(oppPrefix)) return 0;

    // Solo aplica a monstruos (no altares)
    if (!targetSlot.includes("mon")) return 0;

    return -1;
  },
};
