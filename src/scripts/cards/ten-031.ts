// ============ TENOTCH CHALCHIUHTLICUE — TEN-031 ============
// SATIVA / ABIS / NORMAL / ATK 10
//
// EFECTO MONSTRUO 1 (on_place + TRIBUTO): Tributo TENOTCH: sacrifica
//   un aliado TENOTCH → encuentra un monstruo TENOTCH en tu campo
//   y dale 1 contador_escudo.
//   → Cuando Chalchiuhtlicue es colocada en slot de monstruo (no altar):
//     1. Comprobar que hay otro aliado TENOTCH en el campo
//     2. Sacrificarlo
//     3. Encontrar un monstruo TENOTCH en tu campo (incluyéndose)
//     4. Darle 1 contador_escudo
//
// EFECTO MONSTRUO 2 (on_place, sin tributo): Si no se realiza el tributo,
//   gana 3 LP.
//
// EFECTO ALTAR (TURNO): Una vez por turno, si controlas un monstruo ABIS
//   en este carril, gana 2 LP.

import type { CardScript, DuelContext, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  cardHasArquetipo,
  cardHasAttribute,
  getAltarColumn,
  getMonsterSlot,
  sacrificeAllyByArquetipo,
  isOncePerTurnUsed,
  markOncePerTurnUsed,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE TENOTCH CHALCHIUHTLICUE
// ═══════════════════════════════════════════════════════════════

export const TEN_031: CardScript = {

  // ── EFECTO MONSTRUO: Tributo TENOTCH al ser colocada → escudo a TENOTCH ──
  //    Si no hay tributo posible, gana 3 LP en su lugar
  onPlace(ctx: DuelContext): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // Buscar aliado TENOTCH para sacrificar
    const sacrificed = sacrificeAllyByArquetipo(ctx.engine, owner, "TENOTCH", ctx.slotId);

    if (sacrificed) {
      // Buscar un monstruo TENOTCH en tu campo para darle escudo
      const prefix = owner === "player" ? "p" : "e";
      const slots: SlotId[] = [
        `${prefix}-mon-1` as SlotId,
        `${prefix}-mon-2` as SlotId,
        `${prefix}-mon-3` as SlotId,
      ];

      let shielded = false;
      for (const slot of slots) {
        const card = ctx.engine.state.board[slot];
        if (card && cardHasArquetipo(card, "TENOTCH")) {
          ctx.engine.addShield(slot);
          ctx.log.push(`>> ¡Sacrificio Sagrado! ${ctx.card.data.name} sacrifica a ${sacrificed}. ${card.name} gana 1 contador de escudo.`);
          shielded = true;
          break;
        }
      }
      if (!shielded) {
        ctx.log.push(`>> ¡Sacrificio Sagrado! ${ctx.card.data.name} sacrifica a ${sacrificed}. No hay monstruos TENOTCH para dar escudo.`);
      }
    } else {
      // Sin tributo: ganar 3 LP
      ctx.engine.heal(owner, 3);
      ctx.log.push(`>> ${ctx.card.data.name}: No hay aliados TENOTCH para sacrificar. Gana 3 LP.`);
    }
  },

  // ── EFECTO ALTAR (TURNO): Una vez por turno, si controlas un ABIS en este carril → +2 LP ──
  onTurnStart(ctx: DuelContext): void {
    if (!isAltarSlot(ctx.slotId)) return;

    // Comprobar si ya se usó este turno
    if (isOncePerTurnUsed(ctx.engine, ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    const altarCol = getAltarColumn(ctx.slotId);
    const monSlot = getMonsterSlot(owner, altarCol);
    const monCard = ctx.engine.state.board[monSlot];

    // Debe haber un monstruo ABIS en este carril
    if (!monCard || !cardHasAttribute(monCard, "ABIS")) return;

    // ¡Todo se cumple! Ganar 2 LP
    markOncePerTurnUsed(ctx.engine, ctx.slotId);
    ctx.engine.heal(owner, 2);
    ctx.log.push(`>> ¡${ctx.card.data.name} (altar) activa su efecto TURNO! ABIS en carril ${altarCol} → +2 LP.`);
  },
};
