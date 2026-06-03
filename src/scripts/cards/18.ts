// 18 — Hada del Mistral (AURA / Elemental)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const colNum = parseInt(ctx.slotId.split("-")[2]);
    const owner = ctx.card.ownerId;
    const luzAltar = ctx.engine.state.board[`${owner}-altar-luz` as "p-altar-luz" | "e-altar-luz"];
    const sombraAltar = ctx.engine.state.board[`${owner}-altar-sombra` as "p-altar-sombra" | "e-altar-sombra"];
    if (colNum === 1 && luzAltar) {
      ctx.engine.addLog(`>> ¡Efecto Celestial de Hada del Mistral! Baraja 1 carta de tu mano para robar 1 nueva.`);
    }
    if (colNum === 3 && sombraAltar) {
      const target = owner === "player" ? "enemy" : "player";
      ctx.engine.discard(target, 1);
      ctx.engine.addLog(`>> ¡Efecto Umbral de Hada del Mistral! Obliga al oponente a descartar 1 carta.`);
      ctx.engine.compensationDraw(target);
    }
  },
} as CardScript;
