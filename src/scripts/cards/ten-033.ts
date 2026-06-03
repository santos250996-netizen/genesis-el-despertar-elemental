// ============ TENOTCH COATLICUE — TEN-033 ============
// ARTIFEX / FOSO / NORMAL / ATK 16 / contador_escudo: 2
//
// EFECTO MONSTRUO 1 (on_summon): Al ser invocada, gana 1 contador de escudo adicional.
//   → Cuando Coatlicue es invocada en slot de monstruo:
//     +1 contador_escudo
//
// EFECTO MONSTRUO 2 (before_destroy): Si tiene contadores de escudo > 0,
//   consume 1 escudo y previene la destrucción.
//
// EFECTO MONSTRUO 3 (on_place + TRIBUTO): Tributo TENOTCH: sacrifica un
//   aliado TENOTCH → da 1 escudo a todos los monstruos TENOTCH en este carril.
//
// EFECTO ALTAR (PASIVO): Cuando un monstruo FOSO es invocado en este carril,
//   gana 1 contador de escudo.

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  isMonsterSlot,
  getAltarColumn,
  getMonsterSlot,
  cardHasArquetipo,
  cardHasAttribute,
  sacrificeAllyByArquetipo,
  getColumn,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE TENOTCH COATLICUE
// ═══════════════════════════════════════════════════════════════

export const TEN_033: CardScript = {

  // ── EFECTO MONSTRUO 1: Al ser invocada, gana 1 escudo ──
  onSummon(ctx: DuelContext): void {
    if (isAltarSlot(ctx.slotId)) return;

    ctx.engine.addShield(ctx.slotId);
    ctx.log.push(`>> ¡${ctx.card.data.name} gana 1 contador de escudo al ser invocada!`);
  },

  // ── EFECTO MONSTRUO 2: Prevenir destrucción con escudo ──
  beforeDestroy(ctx: DuelContext): boolean {
    if (isAltarSlot(ctx.slotId)) return false;

    // Verificar si tiene escudos disponibles en el estado
    const shieldCount = ctx.engine.state.effects.shieldCounters[ctx.slotId] ?? 0;
    if (shieldCount > 0) {
      ctx.engine.consumeShield(ctx.slotId);
      ctx.log.push(`>> ¡${ctx.card.data.name} consume 1 escudo y previene su destrucción!`);
      return true;
    }

    return false;
  },

  // ── EFECTO MONSTRUO 3: Tributo TENOTCH → escudo a TENOTCH en carril ──
  onPlace(ctx: DuelContext): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // Buscar aliado TENOTCH para sacrificar
    const sacrificed = sacrificeAllyByArquetipo(ctx.engine, owner, "TENOTCH", ctx.slotId);

    if (sacrificed) {
      // Dar 1 escudo a todos los monstruos TENOTCH en este carril
      const col = getColumn(ctx.slotId);
      const monSlot = getMonsterSlot(owner, col);
      const monCard = ctx.engine.state.board[monSlot];

      let shielded = 0;
      if (monCard && cardHasArquetipo(monCard, "TENOTCH")) {
        ctx.engine.addShield(monSlot);
        shielded++;
      }

      ctx.log.push(`>> ¡Sacrificio Protector! ${ctx.card.data.name} sacrifica a ${sacrificed}. Da 1 escudo a ${shielded} aliado(s) TENOTCH en carril ${col}.`);
    } else {
      ctx.log.push(`>> ${ctx.card.data.name}: No hay aliados TENOTCH para sacrificar.`);
    }
  },

  // ── EFECTO ALTAR (PASIVO): FOSO invocado en este carril → +1 escudo ──
  onAllySummon(ctx: DuelContext, summonedCard: CardData, summonedSlot: SlotId): void {
    if (!isAltarSlot(ctx.slotId)) return;

    // Solo aplica si el invocado es FOSO
    if (!cardHasAttribute(summonedCard, "FOSO")) return;

    // Solo aplica si está en la misma columna (carril) que el altar
    const owner = ctx.card.ownerId;
    const altarCol = getAltarColumn(ctx.slotId);
    const expectedMonSlot = getMonsterSlot(owner, altarCol);

    if (summonedSlot !== expectedMonSlot) return;

    ctx.engine.addShield(summonedSlot);
    ctx.log.push(`>> ¡${ctx.card.data.name} (altar) otorga 1 escudo a ${summonedCard.name} (FOSO en carril ${altarCol})!`);
  },
};
