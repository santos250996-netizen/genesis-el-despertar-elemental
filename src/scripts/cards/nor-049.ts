// ============ NÓRDICO ENANO FORJADOR — NOR-049 ============
// ARTIFEX / FOSO / NORMAL / ATK 16 / contador_escudo: 1
//
// EFECTO MONSTRUO 1 (on_summon): Al ser invocado, gana 1 contador
//   de escudo adicional.
//   → Cuando Enano Forjador es invocado en slot de monstruo:
//     addShield al propio slot
//
// EFECTO MONSTRUO 2 (before_destroy): Si tiene contadores de escudo,
//   consume 1 escudo y previene la destrucción.
//   → beforeDestroy retorna true si contador_escudo > 0,
//     consumiendo 1 escudo en el proceso.
//
// EFECTO MONSTRUO 3 (on_destroy_enemy + SAQUEO): Al destruir un
//   monstruo enemigo, equips artifact from deck (placeholder: roba 1).
//   → Cuando Enano Forjador destruye un enemigo:
//     Roba 1 carta como placeholder del sistema de equips
//
// EFECTO ALTAR (PASIVO): Cuando un monstruo FOSO es invocado en este
//   carril, gana 1 contador de escudo.
//   → onAllySummon: Si la carta invocada tiene atributo FOSO
//     y está en la columna del altar, darle 1 escudo.

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  getAltarColumn,
  getMonsterSlot,
  cardHasAttribute,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE NÓRDICO ENANO FORJADOR
// ═══════════════════════════════════════════════════════════════

export const NOR_049: CardScript = {

  // ── EFECTO MONSTRUO 1: Al ser invocado, gana 1 escudo adicional ──
  onSummon(ctx: DuelContext): void {
    if (isAltarSlot(ctx.slotId)) return;

    ctx.engine.addShield(ctx.slotId);
    ctx.log.push(`>> ¡${ctx.card.data.name} forja un escudo! Gana 1 contador de escudo al ser invocado.`);
  },

  // ── EFECTO MONSTRUO 2: Si tiene escudo, previene destrucción ──
  beforeDestroy(ctx: DuelContext): boolean {
    if (isAltarSlot(ctx.slotId)) return false;

    // Verificar si tiene contadores de escudo
    const shieldCount = ctx.engine.state.effects.shieldCounters[ctx.slotId] ?? 0;
    const cardShield = ctx.card.data.contador_escudo ?? 0;

    if (shieldCount > 0 || cardShield > 0) {
      // Consumir 1 escudo
      const consumed = ctx.engine.consumeShield(ctx.slotId);
      if (consumed) {
        ctx.log.push(`>> ¡${ctx.card.data.name} consume un escudo y previene su destrucción!`);
        return true;
      }
    }

    return false;
  },

  // ── EFECTO MONSTRUO 3: Saqueo — equipar artefacto del mazo (placeholder: roba 1) ──
  onDestroyEnemy(ctx: DuelContext, destroyedEnemy: CardData): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // Placeholder: el sistema de equipar artefactos no está implementado,
    // así que robamos 1 carta como compensación temporal
    ctx.engine.draw(owner, 1);
    ctx.log.push(`>> ¡Saqueo Nórdico! ${ctx.card.data.name} saquea a ${destroyedEnemy.name}. Equipa artefacto del mazo (placeholder: roba 1 carta).`);
  },

  // ── EFECTO ALTAR (PASIVO): FOSO invocado en este carril gana 1 escudo ──
  onAllySummon(ctx: DuelContext, summonedCard: CardData, summonedSlot: SlotId): void {
    if (!isAltarSlot(ctx.slotId)) return;

    // Verificar que la carta invocada tiene atributo FOSO
    if (!cardHasAttribute(summonedCard, "FOSO")) return;

    // Verificar que está en la columna del altar
    const owner = ctx.card.ownerId;
    const altarCol = getAltarColumn(ctx.slotId);
    const expectedMonSlot = getMonsterSlot(owner, altarCol);

    if (summonedSlot !== expectedMonSlot) return;

    // Dar 1 contador de escudo
    ctx.engine.addShield(summonedSlot);
    ctx.log.push(`>> ¡${ctx.card.data.name} (altar) forja un escudo para ${summonedCard.name}! +1 contador de escudo.`);
  },
};
