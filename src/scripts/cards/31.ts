// 31 — Brote Telúrico (FOSO / Elemental)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const colNum = parseInt(ctx.slotId.split("-")[2]);
    const owner = ctx.card.ownerId;
    const luzAltar = ctx.engine.state.board[`${owner}-altar-luz` as "p-altar-luz" | "e-altar-luz"];
    const sombraAltar = ctx.engine.state.board[`${owner}-altar-sombra` as "p-altar-sombra" | "e-altar-sombra"];
    if (colNum === 1 && luzAltar) {
      const deck = owner === "player" ? ctx.engine.state.playerDeck : ctx.engine.state.enemyDeck;
      const idx = deck.findIndex((c) => c.type === "CELESTIAL");
      if (idx >= 0) {
        ctx.engine.addLog(`>> ¡Efecto Celestial de Brote Telúrico! Añade [${deck[idx].name}] a tu mano desde el mazo.`);
      }
    }
    if (colNum === 3 && sombraAltar) {
      const deck = owner === "player" ? ctx.engine.state.playerDeck : ctx.engine.state.enemyDeck;
      const idx = deck.findIndex((c) => c.type === "UMBRAL");
      if (idx >= 0) {
        ctx.engine.addLog(`>> ¡Efecto Umbral de Brote Telúrico! Añade [${deck[idx].name}] a tu mano desde el mazo.`);
      }
    }
  },
} as CardScript;
