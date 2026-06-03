// ============ TENOTCH TONATIUH — TEN-037 ============
// GENS / CELESTIAL / ECLIPSE / ATK 22
//
// EFECTO MONSTRUO 1 (on_place + TRIBUTO): Tributo TENOTCH: sacrifica
//   un aliado TENOTCH en tu campo → gana +5 ATK y previene su
//   destrucción este turno.
//   → Cuando Tonatiuh es colocado en slot de monstruo (no altar):
//     1. Comprobar que hay otro aliado TENOTCH en el campo
//     2. Sacrificarlo (mandar al fondo del mazo)
//     3. +5 ATK permanente a Tonatiuh
//     4. Marcar slot de Tonatiuh como preventDestroyThisTurn
//
// EFECTO MONSTRUO 2 (on_attack): Al atacar, gana +3 ATK.
//   → Cuando Tonatiuh declara ataque en modo monstruo:
//     +3 ATK temporal
//
// EFECTO ALTAR (TURNO): Una vez por turno, un monstruo CELESTIAL
//   en este carril gana +3 ATK.
//   → onTurnStart marca el efecto como activado este turno.
//   → getPassiveAtkBonus retorna +3 si el efecto está activado
//     y el objetivo es CELESTIAL en la misma columna.

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  isCelestial,
  getAltarColumn,
  getMonsterSlot,
  modifyTempAtk,
  modifyPermanentAtk,
  markPreventDestroy,
  isOncePerTurnUsed,
  markOncePerTurnUsed,
  sacrificeAllyByArquetipo,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE TENOTCH TONATIUH
// ═══════════════════════════════════════════════════════════════

export const TEN_037: CardScript = {

  // ── EFECTO MONSTRUO 1: Tributo TENOTCH al ser colocado ──
  onPlace(ctx: DuelContext): void {
    // Solo activa si Tonatiuh está en modo monstruo (no en altar)
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // Buscar aliado TENOTCH para sacrificar
    const sacrificed = sacrificeAllyByArquetipo(ctx.engine, owner, "TENOTCH", ctx.slotId);

    if (sacrificed) {
      // +5 ATK permanente a Tonatiuh
      modifyPermanentAtk(ctx.engine, ctx.slotId, 5);
      // Prevenir destrucción este turno
      markPreventDestroy(ctx.engine, ctx.slotId);
      ctx.log.push(`>> ¡Sacrificio Sagrado! ${ctx.card.data.name} sacrifica a ${sacrificed}. Gana +5 ATK y es indestructible este turno.`);
    } else {
      ctx.log.push(`>> ${ctx.card.data.name}: No hay aliados TENOTCH para sacrificar.`);
    }
  },

  // ── EFECTO MONSTRUO 2: Al atacar, gana +3 ATK ──
  onAttackDeclared(ctx: DuelContext): void {
    if (isAltarSlot(ctx.slotId)) return;

    modifyTempAtk(ctx.engine, ctx.slotId, 3);
    ctx.log.push(`>> ¡${ctx.card.data.name} gana +3 ATK al atacar!`);
  },

  // ── EFECTO ALTAR (TURNO): Marcar como activado al inicio del turno ──
  onTurnStart(ctx: DuelContext): void {
    if (!isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    const altarCol = getAltarColumn(ctx.slotId);
    const monSlot = getMonsterSlot(owner, altarCol);
    const monCard = ctx.engine.state.board[monSlot];

    if (!monCard) return;
    if (!isCelestial(monCard)) return;

    // Solo marcar como activado si no se usó este turno
    if (isOncePerTurnUsed(ctx.engine, ctx.slotId)) return;
    markOncePerTurnUsed(ctx.engine, ctx.slotId);
    ctx.log.push(`>> ¡${ctx.card.data.name} (altar) activa su efecto TURNO! +3 ATK a CELESTIAL en carril ${altarCol}.`);
  },

  // ── EFECTO ALTAR (TURNO): +3 ATK pasivo a CELESTIAL en este carril ──
  // Computado dinámicamente — se activa si onTurnStart marcó el slot este turno.
  getPassiveAtkBonus(ctx: DuelContext, targetCard: CardData, targetSlot: SlotId): number {
    if (!isAltarSlot(ctx.slotId)) return 0;

    // Solo aplica si el efecto fue activado este turno
    if (!isOncePerTurnUsed(ctx.engine, ctx.slotId)) return 0;

    // Solo aplica a monstruos CELESTIAL
    if (!isCelestial(targetCard)) return 0;

    // Solo aplica al monstruo en la misma columna que el altar
    const owner = ctx.card.ownerId;
    const altarCol = getAltarColumn(ctx.slotId);
    const expectedMonSlot = getMonsterSlot(owner, altarCol);
    if (targetSlot !== expectedMonSlot) return 0;

    return 3;
  },
};
