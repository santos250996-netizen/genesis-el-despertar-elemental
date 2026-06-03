// ============ ACECHO MAGMÁTICO — FUL-021 ============
// FERA / FULGUR / SUBTERRANEO / ATK 14
//
// EFECTO MONSTRUO (on_flip): Al ser volteada por un ataque enemigo,
//   gana +6 ATK permanente y luego inflige 4 de daño directo al LP oponente.
//   → Cuando Acecho Magmático es volteada (boca arriba tras ataque):
//     1. Comprobar que está en slot de monstruo (no altar)
//     2. +6 ATK permanente (modifyPermanentAtk)
//     3. 4 daño directo al LP del oponente (engine.dealDamage)
//
// EFECTO ALTAR (PASIVO): Los monstruos FULGUR en esta columna ganan +2 ATK.
//   → getPassiveAtkBonus retorna +2 si la carta objetivo es FULGUR
//     y está en la misma columna que el altar.

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  cardHasAttribute,
  getAltarColumn,
  getMonsterSlot,
  modifyPermanentAtk,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE ACECHO MAGMÁTICO
// ═══════════════════════════════════════════════════════════════

export const FUL_021: CardScript = {

  // ── EFECTO MONSTRUO: Al ser volteada, +6 ATK y 4 daño directo ──
  onFlip(ctx: DuelContext): void {
    // Solo activa si está en modo monstruo (no en altar)
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    const opponent: "player" | "enemy" = owner === "player" ? "enemy" : "player";

    // +6 ATK permanente
    modifyPermanentAtk(ctx.engine, ctx.slotId, 6);
    ctx.log.push(`>> ¡${ctx.card.data.name} emerge de las profundidades! Gana +6 ATK permanentemente.`);

    // 4 daño directo al LP del oponente
    ctx.engine.dealDamage(opponent, 4);
    ctx.log.push(`>> ¡${ctx.card.data.name} libra una erupción magmática! 4 de daño directo al oponente.`);
  },

  // ── EFECTO ALTAR (PASIVO): FULGUR en esta columna ganan +2 ATK ──
  getPassiveAtkBonus(ctx: DuelContext, targetCard: CardData, targetSlot: SlotId): number {
    // Solo activa si Acecho Magmático está en slot de altar
    if (!isAltarSlot(ctx.slotId)) return 0;

    // La carta objetivo debe ser FULGUR
    if (!cardHasAttribute(targetCard, "FULGUR")) return 0;

    // La carta objetivo debe estar en la misma columna que el altar
    const owner = ctx.card.ownerId;
    const altarCol = getAltarColumn(ctx.slotId);
    const expectedMonSlot = getMonsterSlot(owner, altarCol);

    if (targetSlot !== expectedMonSlot) return 0;

    return 2;
  },
};
