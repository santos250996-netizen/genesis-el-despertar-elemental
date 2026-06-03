// 84 — Anguila de las Corrientes (ABIS / Elemental — Abisma)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const colNum = parseInt(ctx.slotId.split("-")[2]);
    const owner = ctx.card.ownerId;
    const luzAltar = ctx.engine.state.board[`${owner}-altar-luz` as "p-altar-luz" | "e-altar-luz"];
    const sombraAltar = ctx.engine.state.board[`${owner}-altar-sombra` as "p-altar-sombra" | "e-altar-sombra"];
    if (colNum === 1 && luzAltar) {
      const enemyPrefix = owner === "player" ? "e" : "p";
      for (let i = 1; i <= 3; i++) {
        const eSlot = `${enemyPrefix}-mon-${i}` as "p-mon-1" | "e-mon-1" | "p-mon-2" | "e-mon-2" | "p-mon-3" | "e-mon-3";
        if (ctx.engine.state.board[eSlot]) {
          ctx.engine.modifyAtk(eSlot, -2);
        }
      }
      ctx.engine.addLog(`>> ¡Efecto Celestial de Anguila! Tsunami: todos los enemigos pierden 2 ATK.`);
    }
    if (colNum === 3 && sombraAltar) {
      ctx.engine.addLog(`>> ¡Efecto Umbral de Anguila! ATK condicional por cada monstruo enemigo en el campo.`);
    }
  },
} as CardScript;
