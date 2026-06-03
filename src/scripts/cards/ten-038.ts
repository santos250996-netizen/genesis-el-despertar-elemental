// ============ TENOTCH CENTEOTL — TEN-038 ============
// SATIVA / CELESTIAL / NORMAL / ATK 10
//
// EFECTO MONSTRUO 1 (on_place + TRIBUTO): Tributo TENOTCH: sacrifica
//   un aliado TENOTCH → recupera 1 carta TENOTCH del mazo.
//   → Cuando Centeotl es colocada en slot de monstruo (no altar):
//     1. Comprobar que hay otro aliado TENOTCH en el campo
//     2. Sacrificarlo
//     3. Buscar 1 carta TENOTCH en el mazo y añadirla a la mano
//
// EFECTO MONSTRUO 2 (on_destroy): Al ser destruida, roba 1 carta.
//   → Cuando Centeotl es destruida en modo monstruo:
//     Roba 1 carta del mazo
//
// EFECTO ALTAR (PASIVO): Al inicio de tu turno, ganas 1 LP por cada
//   monstruo TENOTCH en este carril.
//   → Cuando Centeotl está en slot de altar:
//     Al inicio del turno, contar monstruos TENOTCH en la misma
//     columna y ganar 1 LP por cada uno.

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  getAltarColumn,
  getMonsterSlot,
  cardHasArquetipo,
  sacrificeAllyByArquetipo,
  recoverFromDeckByArquetipo,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE TENOTCH CENTEOTL
// ═══════════════════════════════════════════════════════════════

export const TEN_038: CardScript = {

  // ── EFECTO MONSTRUO 1: Tributo TENOTCH → recuperar TENOTCH del mazo ──
  onPlace(ctx: DuelContext): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // Buscar aliado TENOTCH para sacrificar
    const sacrificed = sacrificeAllyByArquetipo(ctx.engine, owner, "TENOTCH", ctx.slotId);

    if (sacrificed) {
      // Recuperar 1 carta TENOTCH del mazo
      const recoveredName = recoverFromDeckByArquetipo(ctx.engine, owner, "TENOTCH");
      if (recoveredName) {
        ctx.log.push(`>> ¡Sacrificio Sagrado! ${ctx.card.data.name} sacrifica a ${sacrificed}. Recupera ${recoveredName} del mazo.`);
      } else {
        ctx.log.push(`>> ¡Sacrificio Sagrado! ${ctx.card.data.name} sacrifica a ${sacrificed}. No hay cartas TENOTCH en el mazo.`);
      }
    } else {
      ctx.log.push(`>> ${ctx.card.data.name}: No hay aliados TENOTCH para sacrificar.`);
    }
  },

  // ── EFECTO MONSTRUO 2: Al ser destruida, roba 1 carta ──
  onDestroy(ctx: DuelContext): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    ctx.engine.draw(owner, 1);
    ctx.log.push(`>> ¡${ctx.card.data.name} activa su efecto al ser destruida! Roba 1 carta.`);
  },

  // ── EFECTO ALTAR (PASIVO): Al inicio del turno, +1 LP por cada TENOTCH en carril ──
  onTurnStart(ctx: DuelContext): void {
    if (!isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    const altarCol = getAltarColumn(ctx.slotId);
    const monSlot = getMonsterSlot(owner, altarCol);
    const monCard = ctx.engine.state.board[monSlot];

    // Contar monstruos TENOTCH en este carril
    // Solo el monstruo en la columna del altar cuenta (no el altar mismo)
    let count = 0;
    if (monCard && cardHasArquetipo(monCard, "TENOTCH")) {
      count++;
    }

    if (count > 0) {
      ctx.engine.heal(owner, count);
      ctx.log.push(`>> ¡${ctx.card.data.name} (altar) otorga +${count} LP! (${count} TENOTCH en carril ${altarCol}).`);
    } else {
      ctx.log.push(`>> ${ctx.card.data.name} (altar): No hay monstruos TENOTCH en este carril.`);
    }
  },
};
