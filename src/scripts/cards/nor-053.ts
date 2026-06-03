// ============ NÓRDICO HEIMDALL — NOR-053 ============
// GENS / CELESTIAL / ECLIPSE / ATK 22
//
// EFECTO MONSTRUO 1 (on_destroy_enemy + SAQUEO): Al destruir un
//   monstruo enemigo, previene la destrucción de todos los monstruos
//   aliados este turno.
//   → Cuando Heimdall destruye un enemigo en batalla:
//     Marcar todos los aliados como preventDestroyThisTurn
//
// EFECTO MONSTRUO 2 (on_attack): Al atacar, gana +3 ATK.
//   → Cuando Heimdall declara ataque en modo monstruo:
//     +3 ATK temporal
//
// EFECTO ALTAR (TURNO): Una vez por turno, un monstruo CELESTIAL
//   en este carril gana +3 ATK.
//   → onTurnStart marca el efecto como activado este turno.
//   → getPassiveAtkBonus retorna +3 si está activado y el objetivo
//     es CELESTIAL en la misma columna.

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  isCelestial,
  getAltarColumn,
  getMonsterSlot,
  modifyTempAtk,
  markAllAlliesPreventDestroy,
  isOncePerTurnUsed,
  markOncePerTurnUsed,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE NÓRDICO HEIMDALL
// ═══════════════════════════════════════════════════════════════

export const NOR_053: CardScript = {

  // ── EFECTO MONSTRUO 1: Saqueo NÓRDICO — prevenir destrucción de aliados ──
  onDestroyEnemy(ctx: DuelContext, destroyedEnemy: CardData): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // Saqueo: todos los aliados son indestructibles este turno
    markAllAlliesPreventDestroy(ctx.engine, owner);
    ctx.log.push(`>> ¡Saqueo Nórdico! ${ctx.card.data.name} saquea a ${destroyedEnemy.name}. Todos los aliados son indestructibles este turno.`);
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
