// 28 — Tsunami Aniquilador (ABIS / Elemental)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const colNum = parseInt(ctx.slotId.split("-")[2]);
    const owner = ctx.card.ownerId;
    const luzAltar = ctx.engine.state.board[`${owner}-altar-luz` as "p-altar-luz" | "e-altar-luz"];
    const sombraAltar = ctx.engine.state.board[`${owner}-altar-sombra` as "p-altar-sombra" | "e-altar-sombra"];
    if (colNum === 1 && luzAltar) {
      const target = owner === "player" ? "enemy" : "player";
      const enemyHand = target === "player" ? ctx.engine.state.playerHand : ctx.engine.state.enemyHand;
      if (enemyHand.length > 0) {
        ctx.engine.discard(target, 1);
        ctx.engine.addLog(`>> ¡Efecto Celestial de Tsunami! Elige 1 carta rival para mandarla al fondo del mazo.`);
        ctx.engine.compensationDraw(target);
      }
    }
    if (colNum === 3 && sombraAltar) {
      ctx.engine.addLog(`>> ¡Efecto Umbral de Tsunami! ATK condicional si el rival tiene 0 cartas en mano.`);
    }
  },
} as CardScript;
