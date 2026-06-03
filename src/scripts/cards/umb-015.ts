// ============ DESIERTO VIVIENTE — UMB-015 ============
// SECAT / UMBRAL / NORMAL / ATK 6
//
// EFECTO MONSTRUO: Al ser invocado, si controlas un altar UMBRAL,
//   gana 1 contador de escudo.
//   → Cuando Desierto Viviente es invocado al campo:
//     1. Comprobar que está en slot de monstruo (no altar)
//     2. Comprobar si controlas un altar UMBRAL activo
//     3. Si sí, añadir 1 contador de escudo a Desierto Viviente
//
// EFECTO ALTAR (TURNO): Una vez por turno, los monstruos UMBRAL en
//   este carril ganan +3 ATK.
//   → Cuando Desierto Viviente está en slot de altar y comienza el turno:
//     1. Comprobar que no se usó el efecto este turno (once/turn)
//     2. Buscar monstruos UMBRAL en la columna del altar
//     3. Dar +3 ATK temporal a cada uno

import type { CardScript, DuelContext } from "@/engine/types";
import {
  isAltarSlot,
  isUmbral,
  hasUmbralAltar,
  getAltarColumn,
  getMonsterSlot,
  modifyTempAtk,
  isOncePerTurnUsed,
  markOncePerTurnUsed,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE DESIERTO VIVIENTE
// ═══════════════════════════════════════════════════════════════

export const UMB_015: CardScript = {

  // ── EFECTO MONSTRUO: Al ser invocado, si altar UMBRAL → gana escudo ──
  onSummon(ctx: DuelContext): void {
    // Solo activa si Desierto Viviente está en modo monstruo
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // Condición: debe controlar un altar UMBRAL
    if (!hasUmbralAltar(ctx.engine, owner)) {
      ctx.log.push(`>> ${ctx.card.data.name}: No hay altar UMBRAL activo, no se gana escudo.`);
      return;
    }

    // Ganar 1 contador de escudo
    ctx.engine.addShield(ctx.slotId);
    ctx.log.push(
      `>> ¡${ctx.card.data.name} se protege con la oscuridad del altar! Gana 1 contador de escudo.`
    );
  },

  // ── EFECTO ALTAR (TURNO): Una vez/turno, UMBRAL en este carril +3 ATK ──
  onTurnStart(ctx: DuelContext): void {
    // Solo activa si Desierto Viviente está en slot de altar
    if (!isAltarSlot(ctx.slotId)) return;

    // Comprobar si ya se usó este turno
    if (isOncePerTurnUsed(ctx.engine, ctx.slotId)) {
      ctx.log.push(`>> ${ctx.card.data.name} (altar): Efecto ya usado este turno.`);
      return;
    }

    const owner = ctx.card.ownerId;
    const altarCol = getAltarColumn(ctx.slotId);
    const monSlot = getMonsterSlot(owner, altarCol);
    const monCard = ctx.engine.state.board[monSlot];

    if (!monCard) {
      ctx.log.push(`>> ${ctx.card.data.name} (altar): No hay monstruo en este carril para potenciar.`);
      return;
    }

    // Solo potenciar si es UMBRAL
    if (!isUmbral(monCard)) {
      ctx.log.push(`>> ${ctx.card.data.name} (altar): ${monCard.name} no es UMBRAL, efecto no se aplica.`);
      return;
    }

    // Dar +3 ATK temporal
    modifyTempAtk(ctx.engine, monSlot, 3);
    markOncePerTurnUsed(ctx.engine, ctx.slotId);
    ctx.log.push(
      `>> ¡${ctx.card.data.name} (altar) infunde poder umbral! ${monCard.name} gana +3 ATK este turno.`
    );
  },
};
