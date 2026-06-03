// 21 — Tormento Silencioso (AURA / Elemental)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const colNum = parseInt(ctx.slotId.split("-")[2]);
    const owner = ctx.card.ownerId;
    const luzAltar = ctx.engine.state.board[`${owner}-altar-luz` as "p-altar-luz" | "e-altar-luz"];
    const sombraAltar = ctx.engine.state.board[`${owner}-altar-sombra` as "p-altar-sombra" | "e-altar-sombra"];
    if (colNum === 1 && luzAltar) {
      const target = owner === "player" ? "enemy" : "player";
      ctx.engine.discard(target, 1);
      ctx.engine.addLog(`>> ¡Efecto Celestial de Tormento Silencioso! El rival elige y descarta 1 carta.`);
      ctx.engine.compensationDraw(target);
    }
    if (colNum === 3 && sombraAltar) {
      ctx.engine.addLog(`>> ¡Efecto Umbral de Tormento Silencioso! ATK condicional si el rival tiene ≤3 cartas.`);
    }
  },
} as CardScript;
