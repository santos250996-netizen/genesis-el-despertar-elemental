// ============ NÓRDICO VALQUIRIA — NOR-051 ============
// FABULA / AURA / NORMAL / ATK 12
//
// EFECTO MONSTRUO 1 (on_destroy_enemy + SAQUEO): Al destruir un
//   monstruo enemigo, da 2 contadores de escudo a un monstruo
//   aliado NÓRDICO.
//   → Buscar primer aliado NÓRDICO (incluyendo a sí misma)
//     y darle 2 escudos (addShield × 2)
//
// EFECTO ALTAR (TURNO): Una vez por turno, 1 monstruo en este
//   carril gana 1 contador de escudo.
//   → onTurnStart: Si no se usó este turno, dar 1 escudo al
//     monstruo en la columna del altar

import type { CardScript, DuelContext, CardData } from "@/engine/types";
import {
  isAltarSlot,
  getAltarColumn,
  getMonsterSlot,
  cardHasArquetipo,
  getAllMonsters,
  isOncePerTurnUsed,
  markOncePerTurnUsed,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE NÓRDICO VALQUIRIA
// ═══════════════════════════════════════════════════════════════

export const NOR_051: CardScript = {

  // ── EFECTO MONSTRUO 1: Saqueo NÓRDICO — dar 2 escudos a aliado NÓRDICO ──
  onDestroyEnemy(ctx: DuelContext, destroyedEnemy: CardData): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    const allies = getAllMonsters(ctx.engine, owner);

    // Buscar primer aliado NÓRDICO (incluyendo a sí misma)
    const target = allies.find(a => cardHasArquetipo(a.card, "NORDICO"));

    if (!target) {
      ctx.log.push(`>> ¡Saqueo Nórdico! ${ctx.card.data.name} saquea a ${destroyedEnemy.name}. No hay aliados NÓRDICO para dar escudos.`);
      return;
    }

    // Dar 2 contadores de escudo
    ctx.engine.addShield(target.slot);
    ctx.engine.addShield(target.slot);
    ctx.log.push(`>> ¡Saqueo Nórdico! ${ctx.card.data.name} saquea a ${destroyedEnemy.name}. ${target.card.name} gana 2 contadores de escudo.`);
  },

  // ── EFECTO ALTAR (TURNO): Una vez por turno, 1 monstruo en este carril gana 1 escudo ──
  onTurnStart(ctx: DuelContext): void {
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
      ctx.log.push(`>> ${ctx.card.data.name} (altar): No hay monstruo en este carril para dar escudo.`);
      return;
    }

    // Dar 1 contador de escudo
    ctx.engine.addShield(monSlot);
    markOncePerTurnUsed(ctx.engine, ctx.slotId);
    ctx.log.push(`>> ¡${ctx.card.data.name} (altar) protege a ${monCard.name}! +1 contador de escudo en carril ${altarCol}.`);
  },
};
