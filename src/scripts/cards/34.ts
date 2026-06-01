// 34 — Fosa Mental (FOSO / Elemental)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const colNum = parseInt(ctx.slotId.split("-")[2]);
    const owner = ctx.card.ownerId;
    const luzAltar = ctx.engine.state.board[`${owner}-altar-luz` as "p-altar-luz" | "e-altar-luz"];
    const sombraAltar = ctx.engine.state.board[`${owner}-altar-sombra` as "p-altar-sombra" | "e-altar-sombra"];
    if (colNum === 1 && luzAltar) {
      ctx.engine.addLog(`>> ¡Efecto Celestial de Fosa Mental! ATK condicional si el rival tiene más cartas.`);
    }
    if (colNum === 3 && sombraAltar) {
      ctx.engine.blockColumn(3);
      ctx.engine.addLog(`>> ¡Efecto Umbral de Fosa Mental! Columna 3 bloqueada para el rival el próximo turno.`);
    }
  },
} as CardScript;
