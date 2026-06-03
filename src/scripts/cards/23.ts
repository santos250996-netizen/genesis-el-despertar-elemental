// 23 — Leviatán Menor (ABIS / Elemental)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const colNum = parseInt(ctx.slotId.split("-")[2]);
    const owner = ctx.card.ownerId;
    const luzAltar = ctx.engine.state.board[`${owner}-altar-luz` as "p-altar-luz" | "e-altar-luz"];
    const sombraAltar = ctx.engine.state.board[`${owner}-altar-sombra` as "p-altar-sombra" | "e-altar-sombra"];
    if (colNum === 1 && luzAltar) {
      ctx.engine.heal(owner, 5);
      ctx.engine.addLog(`>> ¡Efecto Celestial de Leviatán Menor! Recuperas 5 LP.`);
    }
    if (colNum === 3 && sombraAltar) {
      const enemySlot = `${owner === "player" ? "e" : "p"}-mon-3` as "p-mon-3" | "e-mon-3";
      if (ctx.engine.state.board[enemySlot]) {
        ctx.engine.modifyAtk(enemySlot, -3);
        ctx.engine.addLog(`>> ¡Efecto Umbral de Leviatán Menor! Reduce 3 ATK del enemigo.`);
      }
    }
  },
} as CardScript;
