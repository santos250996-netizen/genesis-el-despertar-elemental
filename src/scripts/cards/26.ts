// 26 — Sirena de las Mareas (ABIS / Elemental)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const colNum = parseInt(ctx.slotId.split("-")[2]);
    const owner = ctx.card.ownerId;
    const luzAltar = ctx.engine.state.board[`${owner}-altar-luz` as "p-altar-luz" | "e-altar-luz"];
    const sombraAltar = ctx.engine.state.board[`${owner}-altar-sombra` as "p-altar-sombra" | "e-altar-sombra"];
    if (colNum === 1 && luzAltar) {
      const enemyDeck = owner === "player" ? ctx.engine.state.enemyDeck : ctx.engine.state.playerDeck;
      if (enemyDeck.length > 0) {
        const top2 = enemyDeck.slice(-2).reverse();
        const names = top2.map((c) => c.name).join(", ");
        ctx.engine.addLog(`>> ¡Efecto Celestial de Sirena! Cartas superiores del rival: ${names}.`);
      }
    }
    if (colNum === 3 && sombraAltar) {
      const enemySlot = `${owner === "player" ? "e" : "p"}-mon-3` as "p-mon-3" | "e-mon-3";
      if (ctx.engine.state.board[enemySlot]) {
        ctx.engine.setAtkToZero(enemySlot);
        ctx.engine.addLog(`>> ¡Efecto Umbral de Sirena! [${ctx.engine.state.board[enemySlot]!.name}] queda con 0 ATK este turno.`);
      }
    }
  },
} as CardScript;
