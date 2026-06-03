// ============ BASTIÓN RÚNICO — FOS-022 ============
// ARTIFEX / FOSO / NORMAL / ATK 16, contador_escudo: 2
//
// EFECTO MONSTRUO 1 (on_summon): Al ser invocado, gana 1 contador de
//   escudo adicional.
//   → Cuando Bastión Rúnico es invocado en slot de monstruo:
//     1. Comprobar que está en slot de monstruo (no altar)
//     2. Añadir 1 contador de escudo (engine.addShield)
//
// EFECTO MONSTRUO 2 (before_destroy): Si este monstruo tiene contadores
//   de escudo > 0, consume 1 escudo y previene la destrucción.
//   → Antes de que Bastión Rúnico sea destruido:
//     1. Comprobar que está en slot de monstruo
//     2. Verificar si tiene escudos (engine.state.effects.shieldCounters)
//     3. Si sí, consumir 1 escudo y retornar true (prevenir destrucción)
//
// EFECTO ALTAR (PASIVO): Cuando un monstruo FOSO es invocado en este
//   carril, gana 1 contador de escudo.
//   → onAllySummon: Si la carta invocada es FOSO y está en la columna
//     del altar, darle 1 contador de escudo.

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  cardHasAttribute,
  getAltarColumn,
  getMonsterSlot,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE BASTIÓN RÚNICO
// ═══════════════════════════════════════════════════════════════

export const FOS_022: CardScript = {

  // ── EFECTO MONSTRUO 1: Al ser invocado, gana 1 escudo ──
  onSummon(ctx: DuelContext): void {
    // Solo activa si está en modo monstruo (no en altar)
    if (isAltarSlot(ctx.slotId)) return;

    ctx.engine.addShield(ctx.slotId);
    ctx.log.push(`>> ¡${ctx.card.data.name} se fortifica! Gana 1 contador de escudo.`);
  },

  // ── EFECTO MONSTRUO 2: Si tiene escudo, previene la destrucción ──
  beforeDestroy(ctx: DuelContext): boolean {
    // Solo activa si está en modo monstruo (no en altar)
    if (isAltarSlot(ctx.slotId)) return false;

    // Verificar si tiene contadores de escudo
    const shields = ctx.engine.state.effects.shieldCounters[ctx.slotId] ?? 0;
    if (shields > 0) {
      // Consumir 1 escudo y prevenir la destrucción
      ctx.engine.consumeShield(ctx.slotId);
      ctx.log.push(`>> ¡${ctx.card.data.name} resiste el impacto! Consume 1 escudo y evita la destrucción.`);
      return true;
    }

    return false;
  },

  // ── EFECTO ALTAR (PASIVO): FOSO invocado en este carril gana 1 escudo ──
  onAllySummon(ctx: DuelContext, summonedCard: CardData, summonedSlot: SlotId): void {
    // Solo activa si Bastión Rúnico está en slot de altar
    if (!isAltarSlot(ctx.slotId)) return;

    // La carta invocada debe ser FOSO
    if (!cardHasAttribute(summonedCard, "FOSO")) return;

    // La carta invocada debe estar en la misma columna que el altar
    const owner = ctx.card.ownerId;
    const altarCol = getAltarColumn(ctx.slotId);
    const expectedMonSlot = getMonsterSlot(owner, altarCol);

    if (summonedSlot !== expectedMonSlot) return;

    // Dar 1 contador de escudo al monstruo invocado
    ctx.engine.addShield(summonedSlot);
    ctx.log.push(`>> ¡${ctx.card.data.name} (altar) bendice a ${summonedCard.name} con una runa protectora! +1 escudo.`);
  },
};
