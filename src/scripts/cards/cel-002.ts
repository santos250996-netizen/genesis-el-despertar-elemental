// ============ LUMINA, VOZ DEL FIRMAMENTO — CEL-002 ============
// GENS / CELESTIAL / NORMAL / ATK 8
//
// EFECTO MONSTRUO: Al invocar, si controlas un altar, roba 1 carta.
//   → Cuando Lumina es COLOCADA en un slot de monstruo:
//     1. Comprobar que está en slot de monstruo (no altar)
//     2. Comprobar si el owner tiene algún altar activo
//     3. Si sí, robar 1 carta del deck
//
// EFECTO ALTAR (TURNO): Una vez por turno, si invocas un CELESTIAL, ganas 3 LP.
//   → Cuando Lumina está en slot de altar y un aliado CELESTIAL es invocado:
//     1. Comprobar que Lumina está en slot de altar
//     2. Comprobar que la carta invocada es CELESTIAL
//     3. Comprobar que el efecto no se ha usado este turno (once_per_turn)
//     4. Si todo se cumple, ganar 3 LP y marcar como usado

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  hasAnyAltar,
  isAltarSlot,
  isCelestial,
  isOncePerTurnUsed,
  markOncePerTurnUsed,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE LUMINA
// ═══════════════════════════════════════════════════════════════

export const CEL_002: CardScript = {

  // ── EFECTO MONSTRUO: Al invocar, si controlas un altar, roba 1 carta ──
  onSummon(ctx: DuelContext): void {
    // Solo activa si Lumina está en modo monstruo (no en altar)
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // Comprobar si el owner tiene algún altar activo
    if (!hasAnyAltar(ctx.engine, owner)) {
      ctx.log.push(`>> ${ctx.card.data.name}: No hay altar activo, efecto no se activa.`);
      return;
    }

    // ¡Hay altar activo! Robar 1 carta
    ctx.engine.draw(owner, 1);
    ctx.log.push(`>> ¡${ctx.card.data.name} activa su efecto! Altar detectado → Roba 1 carta.`);
  },

  // ── EFECTO ALTAR (TURNO): Una vez por turno, si invocas un CELESTIAL, ganas 3 LP ──
  onAllySummon(ctx: DuelContext, summonedCard: CardData, _summonedSlot: SlotId): void {
    // Solo activa si Lumina está en un slot de altar
    if (!isAltarSlot(ctx.slotId)) return;

    // Comprobar si la carta invocada es CELESTIAL
    if (!isCelestial(summonedCard)) {
      ctx.log.push(`>> ${ctx.card.data.name} (altar): ${summonedCard.name} no es CELESTIAL, efecto no se activa.`);
      return;
    }

    // Comprobar si ya se usó este turno
    if (isOncePerTurnUsed(ctx.engine, ctx.slotId)) {
      ctx.log.push(`>> ${ctx.card.data.name} (altar): Efecto ya usado este turno.`);
      return;
    }

    // ¡Todo se cumple! Ganar 3 LP
    const owner = ctx.card.ownerId;
    ctx.engine.heal(owner, 3);
    markOncePerTurnUsed(ctx.engine, ctx.slotId);
    ctx.log.push(`>> ¡${ctx.card.data.name} (altar) activa su efecto! CELESTIAL invocado → +3 LP.`);
  },
};
