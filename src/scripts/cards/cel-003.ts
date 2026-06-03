// ============ SERAPHEL, CENTINELA RADIANTE — CEL-003 ============
// GENS / CELESTIAL / NORMAL / ATK 12
//
// EFECTO MONSTRUO: Al atacar, inflige 2 de daño directo al LP enemigo.
//   → Cuando el monstruo DECLARA el ataque:
//     1. Comprobar que está en slot de monstruo (no altar)
//     2. Infligir 2 de daño directo al LP del oponente
//
// EFECTO ALTAR (PASIVO): Los monstruos en este carril no pueden ser
//   destruidos por efectos.
//   → Cuando Seraphel está en slot de altar:
//     1. La carta de monstruo en la misma columna es indestructible
//        por efectos (undestroyable)
//     2. Se implementa vía getPassiveAltarFlags en la computación de ATK

import type { CardScript, DuelContext, CardData, SlotId, PassiveAltarFlags } from "@/engine/types";
import {
  isAltarSlot,
  getAltarColumn,
  getMonsterSlot,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE SERAPHEL
// ═══════════════════════════════════════════════════════════════

export const CEL_003: CardScript = {

  // ── EFECTO MONSTRUO: Al atacar, inflige 2 de daño directo al LP enemigo ──
  onAttackDeclared(ctx: DuelContext): void {
    // Solo activa si Seraphel está en modo monstruo (no en altar)
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    const opponent: "player" | "enemy" = owner === "player" ? "enemy" : "player";

    // Infligir 2 de daño directo al LP del oponente
    ctx.engine.dealDamage(opponent, 2);
    ctx.log.push(`>> ¡${ctx.card.data.name} activa su efecto! Daño directo → -2 LP ${opponent === "player" ? "tuyo" : "enemigo"}.`);
  },

  // ── EFECTO ALTAR (PASIVO): Los monstruos en este carril no pueden ser
  //    destruidos por efectos ──
  getPassiveAltarFlags(ctx: DuelContext, targetCard: CardData, targetSlot: SlotId): PassiveAltarFlags {
    // Solo activa si Seraphel está en slot de altar
    if (!isAltarSlot(ctx.slotId)) return {};

    const owner = ctx.card.ownerId;
    const altarCol = getAltarColumn(ctx.slotId);
    const expectedMonSlot = getMonsterSlot(owner, altarCol);

    // La carta objetivo debe estar en la misma columna que el altar
    if (targetSlot !== expectedMonSlot) return {};

    // El monstruo en este carril es indestructible por efectos
    return { undestroyable: true };
  },
};
