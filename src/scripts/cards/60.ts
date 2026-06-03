// 60 — Tormenta Ígnea (FULGUR / Elemental — Piroclasma)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const colNum = parseInt(ctx.slotId.split("-")[2]);
    const owner = ctx.card.ownerId;
    const luzAltar = ctx.engine.state.board[`${owner}-altar-luz` as "p-altar-luz" | "e-altar-luz"];
    const sombraAltar = ctx.engine.state.board[`${owner}-altar-sombra` as "p-altar-sombra" | "e-altar-sombra"];
    if (colNum === 1 && luzAltar) {
      ctx.engine.setGlobalAtkBonus(2);
      ctx.engine.addLog(`>> ¡Efecto Celestial de Tormenta Ígnea! Todos tus FULGUR ganan +2 ATK.`);
    }
    if (colNum === 3 && sombraAltar) {
      ctx.engine.addLog(`>> ¡Efecto Umbral de Tormenta Ígnea! ATK condicional con 2+ FULGUR en campo.`);
    }
  },
} as CardScript;
