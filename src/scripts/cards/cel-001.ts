// ============ AETHEL, PORTADOR DEL ALBA — CEL-001 ============
// GENS / CELESTIAL / NORMAL / ATK 10
//
// EFECTO MONSTRUO: Al atacar, si tienes un altar CELESTIAL activo, gana +2 ATK.
//   → Cuando el monstruo DECLARA el ataque:
//     1. Comprobar que la carta está atacando (está en slot de monstruo)
//     2. Comprobar si hay un altar con carta atributo CELESTIAL activo
//     3. Si sí, gana +2 ATK TEMPORAL (solo dura la fase de batalla)
//
// EFECTO ALTAR (PASIVO): Las cartas atributo CELESTIAL en la columna
//   donde está puesto como altar ganan +2 ATK.

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  hasCelestialAltar,
  isAltarSlot,
  isCelestial,
  getAltarColumn,
  getMonsterSlot,
  modifyTempAtk,
  altarBonusForColumn,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE AETHEL
// ═══════════════════════════════════════════════════════════════

export const CEL_001: CardScript = {

  // ── EFECTO MONSTRUO: Al declarar ataque, si hay altar CELESTIAL activo, gana +2 ATK ──
  onAttackDeclared(ctx: DuelContext): void {
    // Solo activa si la carta está en modo monstruo (no en altar)
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // Comprobar si hay un altar con carta CELESTIAL activo
    if (!hasCelestialAltar(ctx.engine, owner)) {
      ctx.log.push(`>> ${ctx.card.data.name}: No hay altar CELESTIAL activo, efecto no se activa.`);
      return;
    }

    // ¡Hay altar CELESTIAL! Gana +2 ATK temporal (solo durante esta batalla)
    modifyTempAtk(ctx.engine, ctx.slotId, 2);
    ctx.log.push(`>> ¡${ctx.card.data.name} activa su efecto! Altar CELESTIAL detectado → +2 ATK este combate.`);
  },

  // ── EFECTO ALTAR (PASIVO): Cartas CELESTIAL en la misma columna ganan +2 ATK ──
  getPassiveAtkBonus(ctx: DuelContext, targetCard: CardData, targetSlot: SlotId): number {
    // Solo activa si Aethel está en un slot de altar
    if (!isAltarSlot(ctx.slotId)) return 0;

    // La carta objetivo debe ser CELESTIAL
    if (!isCelestial(targetCard)) return 0;

    // La carta objetivo debe estar en la misma columna que este altar
    const owner = ctx.card.ownerId;
    const bonus = altarBonusForColumn(
      ctx.slotId,
      owner,
      targetCard,
      targetSlot,
      "CELESTIAL",
      2
    );

    return bonus;
  },
};
