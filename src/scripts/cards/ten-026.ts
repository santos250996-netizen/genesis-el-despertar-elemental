// ============ TENOTCH HUITZILOPOCHTLI — TEN-026 ============
// GENS / FULGUR / GENESIS / ATK 28
//
// EFECTO MONSTRUO 1 (on_place + TRIBUTO): Tributo TENOTCH: sacrifica
//   un aliado TENOTCH → destruye 1 monstruo enemigo.
//   → Cuando Huitzilopochtli es colocado en slot de monstruo (no altar):
//     1. Comprobar que hay otro aliado TENOTCH en el campo
//     2. Sacrificarlo (mandar al fondo del mazo)
//     3. Encontrar el primer monstruo enemigo y destruirlo
//
// EFECTO MONSTRUO 2 (on_attack): Al declarar ataque, inflige 3 de daño
//   directo a los LP del oponente.
//
// EFECTO ALTAR (PASIVO): Los monstruos TENOTCH en esta columna ganan +3 ATK.

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  cardHasArquetipo,
  getAltarColumn,
  getMonsterSlot,
  sacrificeAllyByArquetipo,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE TENOTCH HUITZILOPOCHTLI
// ═══════════════════════════════════════════════════════════════

export const TEN_026: CardScript = {

  // ── EFECTO MONSTRUO 1: Tributo TENOTCH → destruir 1 monstruo enemigo ──
  onPlace(ctx: DuelContext): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // Buscar aliado TENOTCH para sacrificar
    const sacrificed = sacrificeAllyByArquetipo(ctx.engine, owner, "TENOTCH", ctx.slotId);

    if (sacrificed) {
      // Encontrar el primer monstruo enemigo y destruirlo
      const oppPrefix = owner === "player" ? "e" : "p";
      let destroyed = false;
      for (const col of [1, 2, 3] as const) {
        const slot = `${oppPrefix}-mon-${col}` as SlotId;
        const card = ctx.engine.state.board[slot];
        if (card) {
          ctx.engine.destroyCard(slot);
          ctx.log.push(`>> ¡Sacrificio Sagrado! ${ctx.card.data.name} sacrifica a ${sacrificed}. ¡Destruye a ${card.name}!`);
          destroyed = true;
          break;
        }
      }
      if (!destroyed) {
        ctx.log.push(`>> ¡Sacrificio Sagrado! ${ctx.card.data.name} sacrifica a ${sacrificed}. No hay monstruos enemigos para destruir.`);
      }
    } else {
      ctx.log.push(`>> ${ctx.card.data.name}: No hay aliados TENOTCH para sacrificar.`);
    }
  },

  // ── EFECTO MONSTRUO 2: Al declarar ataque, 3 daño directo al oponente ──
  onAttackDeclared(ctx: DuelContext): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    const target: "player" | "enemy" = owner === "player" ? "enemy" : "player";

    ctx.engine.dealDamage(target, 3);
    ctx.log.push(`>> ¡${ctx.card.data.name} inflige 3 de daño directo al oponente al atacar!`);
  },

  // ── EFECTO ALTAR (PASIVO): +3 ATK a TENOTCH en esta columna ──
  getPassiveAtkBonus(ctx: DuelContext, targetCard: CardData, targetSlot: SlotId): number {
    if (!isAltarSlot(ctx.slotId)) return 0;

    // Solo aplica a monstruos TENOTCH
    if (!cardHasArquetipo(targetCard, "TENOTCH")) return 0;

    // Solo aplica al monstruo en la misma columna que el altar
    const owner = ctx.card.ownerId;
    const altarCol = getAltarColumn(ctx.slotId);
    const expectedMonSlot = getMonsterSlot(owner, altarCol);
    if (targetSlot !== expectedMonSlot) return 0;

    return 3;
  },
};
