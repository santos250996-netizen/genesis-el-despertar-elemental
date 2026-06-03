// ============ KAÉL, FRAGMENTADOR — UMB-012 ============
// CLASTO / UMBRAL / NORMAL / ATK 11
//
// EFECTO MONSTRUO: Al declarar ataque, si el monstruo enemigo en la
//   misma columna tiene menos ATK, inflige la diferencia como daño
//   directo a los LP del oponente.
//   → Cuando Kaél declara ataque:
//     1. Comprobar que está en slot de monstruo (no altar)
//     2. Obtener el monstruo enemigo en la columna opuesta
//     3. Si el enemigo tiene menos ATK, infligir diferencia como daño directo
//
// EFECTO ALTAR (PASIVO): Los monstruos UMBRAL en esta columna ganan +2 ATK.
//   → Cuando Kaél está en slot de altar:
//     Los monstruos con atributo UMBRAL en la misma columna del altar
//     reciben +2 ATK pasivo.

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  isUmbral,
  getOpposingMonster,
  altarBonusForColumn,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE KAÉL, FRAGMENTADOR
// ═══════════════════════════════════════════════════════════════

export const UMB_012: CardScript = {

  // ── EFECTO MONSTRUO: ATK difference as direct damage ──
  onAttackDeclared(ctx: DuelContext): void {
    // Solo activa si Kaél está en modo monstruo (no en altar)
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    const opposing = getOpposingMonster(ctx.engine, ctx.slotId, owner);

    if (!opposing) {
      ctx.log.push(`>> ${ctx.card.data.name}: No hay monstruo enemigo en la columna opuesta.`);
      return;
    }

    const myAtk = ctx.card.data.atk;
    const enemyAtk = opposing.card.atk;

    if (enemyAtk < myAtk) {
      const diff = myAtk - enemyAtk;
      const target: "player" | "enemy" = owner === "player" ? "enemy" : "player";
      ctx.engine.dealDamage(target, diff);
      ctx.log.push(
        `>> ¡${ctx.card.data.name} fragmenta a ${opposing.card.name}! Diferencia de ATK (${diff}) como daño directo a los LP del oponente.`
      );
    } else {
      ctx.log.push(
        `>> ${ctx.card.data.name}: El enemigo (${opposing.card.name}, ATK ${enemyAtk}) no tiene menos ATK, efecto no se activa.`
      );
    }
  },

  // ── EFECTO ALTAR (PASIVO): UMBRAL monsters in this column gain +2 ATK ──
  getPassiveAtkBonus(ctx: DuelContext, targetCard: CardData, targetSlot: SlotId): number {
    // Solo activa si Kaél está en un slot de altar
    if (!isAltarSlot(ctx.slotId)) return 0;

    // La carta objetivo debe ser UMBRAL
    if (!isUmbral(targetCard)) return 0;

    // La carta objetivo debe estar en la misma columna que este altar
    const owner = ctx.card.ownerId;
    const bonus = altarBonusForColumn(
      ctx.slotId,
      owner,
      targetCard,
      targetSlot,
      "UMBRAL",
      2
    );

    return bonus;
  },
};
