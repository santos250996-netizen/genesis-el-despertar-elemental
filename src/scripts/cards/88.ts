// 88 — Océano, el Devorador de Mundos (GENESIS — Abisma)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const owner = ctx.card.ownerId;
    const enemyPrefix = owner === "player" ? "e" : "p";
    let sunk = 0;
    for (let i = 1; i <= 3; i++) {
      const eSlot = `${enemyPrefix}-mon-${i}` as "p-mon-1" | "e-mon-1" | "p-mon-2" | "e-mon-2" | "p-mon-3" | "e-mon-3";
      if (ctx.engine.state.board[eSlot]) {
        ctx.engine.destroyCard(eSlot, "deck");
        sunk++;
      }
    }
    if (sunk > 0) {
      ctx.engine.heal(owner, sunk * 3);
      ctx.engine.addLog(`>> ¡¡¡Océano despierta!!! ${sunk} enemigo${sunk > 1 ? "s" : ""} hundidos al fondo del mazo. +${sunk * 3} LP.`);
    } else {
      ctx.engine.addLog(`>> ¡Océano despierta! No hay enemigos que hundir.`);
    }
  },
} as CardScript;
