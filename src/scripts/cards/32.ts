// 32 — Fisura Viviente (FOSO / Elemental)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const colNum = parseInt(ctx.slotId.split("-")[2]);
    const owner = ctx.card.ownerId;
    const luzAltar = ctx.engine.state.board[`${owner}-altar-luz` as "p-altar-luz" | "e-altar-luz"];
    const sombraAltar = ctx.engine.state.board[`${owner}-altar-sombra` as "p-altar-sombra" | "e-altar-sombra"];
    if (colNum === 1 && luzAltar) {
      ctx.engine.addLog(`>> ¡Efecto Celestial de Fisura Viviente! ATK condicional activado.`);
    }
    if (colNum === 3 && sombraAltar) {
      ctx.engine.addLog(`>> ¡Efecto Umbral de Fisura Viviente! Gana +6 ATK corrupto.`);
    }
  },
} as CardScript;
