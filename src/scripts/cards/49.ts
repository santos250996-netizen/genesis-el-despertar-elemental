// 49 — Érebo, el Fin de los Tiempos (GENESIS)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const owner = ctx.card.ownerId;
    const enemyPrefix = owner === "player" ? "e" : "p";
    for (let i = 1; i <= 3; i++) {
      const eSlot = `${enemyPrefix}-mon-${i}` as "p-mon-1" | "e-mon-1" | "p-mon-2" | "e-mon-2" | "p-mon-3" | "e-mon-3";
      if (ctx.engine.state.board[eSlot]) {
        ctx.engine.moveToHand(eSlot);
        ctx.engine.addLog(`>> ¡Érebo despierta! Regresa [${ctx.engine.state.board[eSlot]!.name}] a la mano del rival.`);
        break;
      }
    }
    ctx.engine.addLog(`>> ¡Érebo despierta! Atacar directo le cuesta al rival 2 LP.`);
  },
} as CardScript;
