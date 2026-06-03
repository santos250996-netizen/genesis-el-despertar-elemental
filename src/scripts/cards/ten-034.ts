// ============ TENOTCH QUETZALCÓATL — TEN-034 ============
// FABULA / AURA / GENESIS / ATK 26
//
// EFECTO MONSTRUO 1 (on_place + TRIBUTO): Tributo TENOTCH: sacrifica
//   un aliado TENOTCH → roba 2 cartas.
//   → Cuando Quetzalcóatl es colocado en slot de monstruo (no altar):
//     1. Sacrificar un aliado TENOTCH
//     2. Robar 2 cartas del mazo
//
// EFECTO MONSTRUO 2 (on_turn_start): Al inicio del turno, todos los
//   monstruos TENOTCH ganan +2 ATK permanente.
//
// EFECTO ALTAR (PASIVO): Los monstruos AURA en esta columna ganan +2 ATK.

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  getAltarColumn,
  getMonsterSlot,
  cardHasArquetipo,
  cardHasAttribute,
  getAllMonsters,
  modifyPermanentAtk,
  sacrificeAllyByArquetipo,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE TENOTCH QUETZALCÓATL
// ═══════════════════════════════════════════════════════════════

export const TEN_034: CardScript = {

  // ── EFECTO MONSTRUO 1: Tributo TENOTCH → robar 2 cartas ──
  onPlace(ctx: DuelContext): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // Buscar aliado TENOTCH para sacrificar
    const sacrificed = sacrificeAllyByArquetipo(ctx.engine, owner, "TENOTCH", ctx.slotId);

    if (sacrificed) {
      ctx.engine.draw(owner, 2);
      ctx.log.push(`>> ¡Sacrificio Divino! ${ctx.card.data.name} sacrifica a ${sacrificed}. Roba 2 cartas.`);
    } else {
      ctx.log.push(`>> ${ctx.card.data.name}: No hay aliados TENOTCH para sacrificar.`);
    }
  },

  // ── EFECTO MONSTRUO 2: Inicio turno → +2 ATK a todos TENOTCH ──
  onTurnStart(ctx: DuelContext): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    const allies = getAllMonsters(ctx.engine, owner);

    let buffed = 0;
    for (const ally of allies) {
      if (cardHasArquetipo(ally.card, "TENOTCH")) {
        modifyPermanentAtk(ctx.engine, ally.slot, 2);
        buffed++;
      }
    }

    if (buffed > 0) {
      ctx.log.push(`>> ¡${ctx.card.data.name} imparte poder ancestral! +2 ATK a ${buffed} aliado(s) TENOTCH.`);
    } else {
      ctx.log.push(`>> ${ctx.card.data.name}: No hay aliados TENOTCH para buffar.`);
    }
  },

  // ── EFECTO ALTAR (PASIVO): +2 ATK a AURA en esta columna ──
  getPassiveAtkBonus(ctx: DuelContext, targetCard: CardData, targetSlot: SlotId): number {
    if (!isAltarSlot(ctx.slotId)) return 0;

    // Solo aplica a monstruos AURA
    if (!cardHasAttribute(targetCard, "AURA")) return 0;

    // Solo aplica al monstruo en la misma columna que el altar
    const owner = ctx.card.ownerId;
    const altarCol = getAltarColumn(ctx.slotId);
    const expectedMonSlot = getMonsterSlot(owner, altarCol);
    if (targetSlot !== expectedMonSlot) return 0;

    return 2;
  },
};
