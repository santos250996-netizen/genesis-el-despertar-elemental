// ============ HADA DEL CREPÚSCULO — CEL-007 ============
// FÁBULA / CELESTIAL / NORMAL / ATK 7
//
// EFECTO MONSTRUO: Al invocar, puedes cambiar un monstruo aliado
//   entre modo altar y modo monstruo.
//   → Cuando Hada es colocada en slot de monstruo:
//     1. Buscar un monstruo aliado que pueda cambiarse de modo
//     2. Si hay altar vacío, mover el monstruo al slot de altar
//        (o viceversa: altar → monstruo si hay slot de monstruo vacío)
//
// EFECTO ALTAR (TURNO): Una vez por turno, puedes mover un monstruo
//   entre carriles.
//   → Cuando Hada está en slot de altar:
//     1. Mover un monstruo aliado a otra columna vacía
//     2. Solo 1 vez por turno

import type { CardScript, DuelContext, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  isOncePerTurnUsed,
  markOncePerTurnUsed,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE HADA DEL CREPÚSCULO
// ═══════════════════════════════════════════════════════════════

export const CEL_007: CardScript = {

  // ── EFECTO MONSTRUO: Cambiar un aliado entre modo altar y monstruo ──
  // NOTA: El cambio de modo es una acción que requiere elección del jugador.
  // Para el script automático (AI-friendly), intercambiamos el primer monstruo
  // aliado con un altar vacío si existe. Al mover entre slots, se actualiza
  // el flag es_altar correctamente.
  onSummon(ctx: DuelContext): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    const prefix = owner === "player" ? "p" : "e";
    const board = ctx.engine.state.board;

    // Buscar un altar vacío donde colocar un monstruo
    const luzAltarSlot = `${prefix}-altar-luz` as SlotId;
    const sombraAltarSlot = `${prefix}-altar-sombra` as SlotId;
    const emptyAltar = !board[luzAltarSlot] ? luzAltarSlot : (!board[sombraAltarSlot] ? sombraAltarSlot : null);

    // Buscar un monstruo aliado (no a sí misma) para mover al altar
    let moved = false;
    if (emptyAltar) {
      for (const c of [1, 2, 3] as const) {
        const monSlot = `${prefix}-mon-${c}` as SlotId;
        if (monSlot === ctx.slotId) continue; // No a sí misma
        const monCard = board[monSlot];
        if (monCard) {
          // Mover monstruo al altar vacío — actualizar es_altar a true
          const altarCard = { ...monCard, es_altar: true };
          const newBoard = { ...board, [emptyAltar]: altarCard, [monSlot]: null };
          ctx.engine.state.board = newBoard;
          ctx.log.push(`>> ¡${ctx.card.data.name} activa su efecto! ${monCard.name} cambia a modo altar (${emptyAltar}).`);
          moved = true;
          break;
        }
      }
    }

    if (!moved) {
      // Intentar lo contrario: altar → monstruo si hay slot vacío
      for (const altarSlot of [luzAltarSlot, sombraAltarSlot] as SlotId[]) {
        const altarCard = board[altarSlot];
        if (!altarCard) continue;

        for (const c of [1, 2, 3] as const) {
          const monSlot = `${prefix}-mon-${c}` as SlotId;
          if (board[monSlot]) continue;

          // Mover carta de altar a slot de monstruo vacío — actualizar es_altar a false
          const monCard = { ...altarCard, es_altar: false };
          const newBoard = { ...board, [monSlot]: monCard, [altarSlot]: null };
          ctx.engine.state.board = newBoard;
          ctx.log.push(`>> ¡${ctx.card.data.name} activa su efecto! ${altarCard.name} cambia a modo monstruo (${monSlot}).`);
          moved = true;
          break;
        }
        if (moved) break;
      }
    }

    if (!moved) {
      ctx.log.push(`>> ${ctx.card.data.name}: No hay espacio para cambiar modos.`);
    }
  },

  // ── EFECTO ALTAR (TURNO): Mover un monstruo entre carriles ──
  onTurnStart(ctx: DuelContext): void {
    if (!isAltarSlot(ctx.slotId)) return;

    // Comprobar si ya se usó este turno
    if (isOncePerTurnUsed(ctx.engine, ctx.slotId)) {
      ctx.log.push(`>> ${ctx.card.data.name} (altar): Movimiento ya usado este turno.`);
      return;
    }

    const owner = ctx.card.ownerId;
    const prefix = owner === "player" ? "p" : "e";
    const board = ctx.engine.state.board;

    // Buscar un monstruo en una columna y moverlo a otra vacía
    for (const fromCol of [1, 2, 3] as const) {
      const fromSlot = `${prefix}-mon-${fromCol}` as SlotId;
      const card = board[fromSlot];
      if (!card) continue;

      for (const toCol of [1, 2, 3] as const) {
        if (toCol === fromCol) continue;
        const toSlot = `${prefix}-mon-${toCol}` as SlotId;
        if (board[toSlot]) continue;

        // Mover
        const newBoard = { ...board };
        newBoard[toSlot] = card;
        newBoard[fromSlot] = null;
        ctx.engine.state.board = newBoard;
        markOncePerTurnUsed(ctx.engine, ctx.slotId);
        ctx.log.push(`>> ¡${ctx.card.data.name} (altar) activa su efecto! ${card.name} se mueve de carril ${fromCol} a ${toCol}.`);
        return;
      }
    }

    ctx.log.push(`>> ${ctx.card.data.name} (altar): No hay monstruos para mover.`);
  },
};
