// 86 — Kraken Colosal (CORRUPCION / Special — Abisma)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const owner = ctx.card.ownerId;
    const enemyPrefix = owner === "player" ? "e" : "p";
    let altarsDestroyed = 0;
    for (const eAltarSlot of [`${enemyPrefix}-altar-luz`, `${enemyPrefix}-altar-sombra`] as ("p-altar-luz" | "e-altar-luz" | "p-altar-sombra" | "e-altar-sombra")[]) {
      if (ctx.engine.state.board[eAltarSlot]) {
        ctx.engine.destroyCard(eAltarSlot, "deck");
        altarsDestroyed++;
      }
    }
    if (altarsDestroyed > 0) {
      ctx.engine.heal(owner, altarsDestroyed * 2);
      ctx.engine.addLog(`>> ¡Kraken Colosal emerge! Destruye ${altarsDestroyed} altar${altarsDestroyed > 1 ? "es" : ""} enemigo${altarsDestroyed > 1 ? "s" : ""}. +${altarsDestroyed * 2} LP.`);
    } else {
      ctx.engine.addLog(`>> ¡Kraken Colosal emerge! No hay altares enemigos que destruir.`);
    }
  },
} as CardScript;
