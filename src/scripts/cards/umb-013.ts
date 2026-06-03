// ============ VÓRTICE DEVORADOR — UMB-013 ============
// CLASTO / UMBRAL / ANOMALÍA / ATK 16
//
// EFECTO MONSTRUO: Al destruir un monstruo enemigo, gana +3 ATK permanente.
//   → Cuando Vórtice Devorador destruye un monstruo enemigo en combate:
//     1. Comprobar que está en slot de monstruo (no altar)
//     2. Ganar +3 ATK permanente (persiste más allá de la fase de batalla)
//
// EFECTO ALTAR (PASIVO): Al inicio del turno, el monstruo enemigo con
//   menor ATK en el carril opuesto pierde 3 ATK permanente.
//   → Cuando Vórtice Devorador está en slot de altar y comienza el turno:
//     1. Buscar el monstruo enemigo con menor ATK en la columna opuesta
//     2. Reducir 3 ATK permanente a ese monstruo

import type { CardScript, DuelContext, CardData } from "@/engine/types";
import {
  isAltarSlot,
  getAltarColumn,
  getMonsterSlot,
  modifyPermanentAtk,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE VÓRTICE DEVORADOR
// ═══════════════════════════════════════════════════════════════

export const UMB_013: CardScript = {

  // ── EFECTO MONSTRUO: Al destruir un enemigo, gana +3 ATK permanente ──
  onDestroyEnemy(ctx: DuelContext, destroyedEnemy: CardData): void {
    // Solo activa si Vórtice está en modo monstruo (no en altar)
    if (isAltarSlot(ctx.slotId)) return;

    modifyPermanentAtk(ctx.engine, ctx.slotId, 3);
    ctx.log.push(
      `>> ¡${ctx.card.data.name} absorbe los restos de ${destroyedEnemy.name}! +3 ATK permanente.`
    );
  },

  // ── EFECTO ALTAR (PASIVO): Al inicio del turno, el monstruo enemigo en
  //    la columna opuesta pierde 3 ATK permanente ──
  onTurnStart(ctx: DuelContext): void {
    // Solo activa si Vórtice está en slot de altar
    if (!isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    const oppOwner: "player" | "enemy" = owner === "player" ? "enemy" : "player";
    const altarCol = getAltarColumn(ctx.slotId);

    // Buscar SOLO el monstruo enemigo en la columna opuesta al altar
    // (no buscar globalmente — el efecto aplica al carril opuesto)
    const oppMonSlot = getMonsterSlot(oppOwner, altarCol);
    const oppMonCard = ctx.engine.state.board[oppMonSlot];

    if (oppMonCard) {
      modifyPermanentAtk(ctx.engine, oppMonSlot, -3);
      ctx.log.push(
        `>> ¡${ctx.card.data.name} (altar) devora la fuerza de ${oppMonCard.name}! -3 ATK permanente al enemigo en la columna opuesta.`
      );
    } else {
      ctx.log.push(`>> ${ctx.card.data.name} (altar): No hay monstruo enemigo en la columna opuesta.`);
    }
  },
};
