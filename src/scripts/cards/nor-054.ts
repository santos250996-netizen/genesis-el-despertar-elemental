// ============ NÓRDICO FREYA — NOR-054 ============
// SATIVA / CELESTIAL / NORMAL / ATK 10
//
// EFECTO MONSTRUO 1 (on_destroy_enemy + SAQUEO): Al destruir un
//   monstruo enemigo, recupera 1 carta NÓRDICO del cementerio/mazo.
//   → Cuando Freya destruye un enemigo en batalla:
//     Buscar 1 carta NÓRDICO en el mazo y añadirla a la mano
//
// EFECTO MONSTRUO 2 (on_place): Al invocar, ganas 3 LP.
//   → Cuando Freya es colocada en slot de monstruo (no altar):
//     Ganar 3 LP
//
// EFECTO ALTAR (PASIVO): Al inicio de tu turno, ganas 1 LP por cada
//   monstruo NÓRDICO en este carril.
//   → Idéntico al altar de Centeotl pero con NÓRDICO en vez de TENOTCH.

import type { CardScript, DuelContext, CardData } from "@/engine/types";
import {
  isAltarSlot,
  getAltarColumn,
  getMonsterSlot,
  cardHasArquetipo,
  recoverFromDeckByArquetipo,
  isOncePerTurnUsed,
  markOncePerTurnUsed,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE NÓRDICO FREYA
// ═══════════════════════════════════════════════════════════════

export const NOR_054: CardScript = {

  // ── EFECTO MONSTRUO 1: Saqueo NÓRDICO — recuperar NÓRDICO del mazo ──
  onDestroyEnemy(ctx: DuelContext, destroyedEnemy: CardData): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // Recuperar 1 carta NÓRDICO del mazo
    const recoveredName = recoverFromDeckByArquetipo(ctx.engine, owner, "NORDICO");
    if (recoveredName) {
      ctx.log.push(`>> ¡Saqueo Nórdico! ${ctx.card.data.name} saquea a ${destroyedEnemy.name}. Recupera ${recoveredName} del mazo.`);
    } else {
      ctx.log.push(`>> ¡Saqueo Nórdico! ${ctx.card.data.name} saquea a ${destroyedEnemy.name}. No hay cartas NÓRDICO en el mazo.`);
    }
  },

  // ── EFECTO MONSTRUO 2: Al ser colocada, ganas 3 LP ──
  onPlace(ctx: DuelContext): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    ctx.engine.heal(owner, 3);
    ctx.log.push(`>> ¡${ctx.card.data.name} activa su efecto al ser invocada! Gana 3 LP.`);
  },

  // ── EFECTO ALTAR (PASIVO): Al inicio del turno, +1 LP por cada NÓRDICO en carril ──
  onTurnStart(ctx: DuelContext): void {
    if (!isAltarSlot(ctx.slotId)) return;

    // Once per turn check
    if (isOncePerTurnUsed(ctx.engine, ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    const altarCol = getAltarColumn(ctx.slotId);
    const monSlot = getMonsterSlot(owner, altarCol);
    const monCard = ctx.engine.state.board[monSlot];

    // Contar monstruos NÓRDICO en este carril (NO contar el altar mismo)
    let count = 0;
    if (monCard && cardHasArquetipo(monCard, "NORDICO")) {
      count++;
    }

    if (count > 0) {
      markOncePerTurnUsed(ctx.engine, ctx.slotId);
      ctx.engine.heal(owner, count);
      ctx.log.push(`>> ¡${ctx.card.data.name} (altar) otorga +${count} LP! (${count} NÓRDICO en carril ${altarCol}).`);
    } else {
      ctx.log.push(`>> ${ctx.card.data.name} (altar): No hay monstruos NÓRDICO en este carril.`);
    }
  },
};
