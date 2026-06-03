// ============ TENOTCH EHÉCATL — TEN-035 ============
// FABULA / AURA / NORMAL / ATK 12
//
// EFECTO MONSTRUO 1 (on_place + TRIBUTO): Tributo TENOTCH: sacrifica
//   un aliado TENOTCH → devuelve 1 monstruo enemigo a su mazo.
//   → Cuando Ehécatl es colocado en slot de monstruo (no altar):
//     1. Sacrificar un aliado TENOTCH
//     2. Devolver el monstruo enemigo opuesto a su mazo
//
// EFECTO ALTAR (TURNO): Una vez por turno, puedes mover un monstruo
//   entre carriles. (Log placeholder — la lógica de movimiento es compleja.)

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  getOpposingMonster,
  sacrificeAllyByArquetipo,
  isOncePerTurnUsed,
  markOncePerTurnUsed,
  getAllMonsters,
  findEmptyMonsterSlot,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE TENOTCH EHÉCATL
// ═══════════════════════════════════════════════════════════════

export const TEN_035: CardScript = {

  // ── EFECTO MONSTRUO 1: Tributo TENOTCH → devolver enemigo al mazo ──
  onPlace(ctx: DuelContext): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // Buscar aliado TENOTCH para sacrificar
    const sacrificed = sacrificeAllyByArquetipo(ctx.engine, owner, "TENOTCH", ctx.slotId);

    if (sacrificed) {
      // Devolver el monstruo enemigo opuesto a su mazo
      const opposing = getOpposingMonster(ctx.engine, ctx.slotId, owner);

      if (opposing) {
        const enemyName = opposing.card.name;
        ctx.engine.moveToDeck(opposing.slot);
        ctx.log.push(`>> ¡Sacrificio de Viento! ${ctx.card.data.name} sacrifica a ${sacrificed}. Devuelve a ${enemyName} al mazo enemigo.`);
      } else {
        ctx.log.push(`>> ¡Sacrificio de Viento! ${ctx.card.data.name} sacrifica a ${sacrificed}. No hay monstruo enemigo en columna opuesta.`);
      }
    } else {
      ctx.log.push(`>> ${ctx.card.data.name}: No hay aliados TENOTCH para sacrificar.`);
    }
  },

  // ── EFECTO ALTAR (TURNO): Una vez por turno, mover monstruo entre carriles ──
  onTurnStart(ctx: DuelContext): void {
    if (!isAltarSlot(ctx.slotId)) return;

    // Verificar si ya se usó este turno
    if (isOncePerTurnUsed(ctx.engine, ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // Buscar monstruos del owner y slots vacíos
    const myMonsters = getAllMonsters(ctx.engine, owner);
    const emptySlot = findEmptyMonsterSlot(ctx.engine, owner);

    if (myMonsters.length === 0 || !emptySlot) {
      ctx.log.push(`>> ${ctx.card.data.name} (altar): No hay monstruos para mover o slots vacíos.`);
      return;
    }

    // Auto-move: mover el monstruo con menor ATK a la mejor posición disponible
    // Ordenar por ATK ascendente para encontrar el más débil
    const sorted = [...myMonsters].sort((a, b) => a.card.atk - b.card.atk);
    const weakest = sorted[0];

    // No mover si el más débil ya está en la columna del altar (es mejor dejarlo ahí)
    // Mover al slot vacío disponible
    const fromSlot = weakest.slot;
    const toSlot = emptySlot;

    // Ejecutar el movimiento usando laneChange del engine
    ctx.engine.laneChange(fromSlot, toSlot);

    // Marcar como usado este turno
    markOncePerTurnUsed(ctx.engine, ctx.slotId);

    ctx.log.push(`>> ¡${ctx.card.data.name} (altar) activa Viento de Cambio! ${weakest.card.name} se mueve de ${fromSlot} a ${toSlot}.`);
  },
};
