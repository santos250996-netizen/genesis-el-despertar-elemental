// ============ MALAKOR, SUSURRO FINAL — UMB-009 ============
// NECRO / UMBRAL / NORMAL / ATK 11
//
// EFECTO MONSTRUO: Al destruir un monstruo enemigo, inflige 3 de daño
//   directo a los LP del oponente.
//   → Cuando Malakor destruye un monstruo enemigo en combate:
//     1. Comprobar que Malakor está en slot de monstruo
//     2. Infligir 3 de daño directo a los LP enemigos
//
// EFECTO ALTAR (PASIVO): Los monstruos enemigos destruidos en este
//   carril no activan sus efectos al morir.
//   → Cuando Malakor está en slot de altar:
//     Los monstruos enemigos en la columna opuesta tienen sus
//     efectos on_destroy negados (negateEnemyDestroyEffects = true).

import type { CardScript, DuelContext, CardData, SlotId, PassiveAltarFlags } from "@/engine/types";
import {
  isAltarSlot,
  getAltarColumn,
  getMonsterSlot,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE MALAKOR
// ═══════════════════════════════════════════════════════════════

export const UMB_009: CardScript = {

  // ── EFECTO MONSTRUO: Al destruir un enemigo, 3 daño directo ──
  onDestroyEnemy(ctx: DuelContext, destroyedEnemy: CardData): void {
    // Solo activa si Malakor está en modo monstruo (no en altar)
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    const target: "player" | "enemy" = owner === "player" ? "enemy" : "player";

    ctx.engine.dealDamage(target, 3);
    ctx.log.push(
      `>> ¡${ctx.card.data.name} activa su efecto al destruir a ${destroyedEnemy.name}! 3 de daño directo a los LP del oponente.`
    );
  },

  // ── EFECTO ALTAR (PASIVO): Enemigos destruidos en el carril no
  //    activan efectos al morir ──
  getPassiveAltarFlags(
    ctx: DuelContext,
    targetCard: CardData,
    targetSlot: SlotId
  ): PassiveAltarFlags {
    if (!isAltarSlot(ctx.slotId)) return {};

    const owner = ctx.card.ownerId;
    const oppPrefix = owner === "player" ? "e" : "p";
    const altarCol = getAltarColumn(ctx.slotId);
    const oppMonSlot = getMonsterSlot(oppPrefix === "e" ? "enemy" : "player", altarCol);

    // Solo afecta monstruos enemigos en la columna opuesta al altar
    if (targetSlot !== oppMonSlot) return {};

    // La carta objetivo debe ser enemiga
    const isEnemy =
      (owner === "player" && targetSlot.startsWith("e")) ||
      (owner === "enemy" && targetSlot.startsWith("p"));

    if (!isEnemy) return {};

    return { negateEnemyDestroyEffects: true };
  },
};
