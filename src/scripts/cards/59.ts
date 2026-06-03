// 59 — Volcán de Obsidiana (FULGUR / Elemental — Piroclasma)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const colNum = parseInt(ctx.slotId.split("-")[2]);
    const owner = ctx.card.ownerId;
    const luzAltar = ctx.engine.state.board[`${owner}-altar-luz` as "p-altar-luz" | "e-altar-luz"];
    const sombraAltar = ctx.engine.state.board[`${owner}-altar-sombra` as "p-altar-sombra" | "e-altar-sombra"];
    if (colNum === 1 && luzAltar) {
      ctx.engine.addLog(`>> ¡Efecto Celestial de Volcán de Obsidiana! Inmune a reducciones de ATK.`);
    }
    if (colNum === 3 && sombraAltar) {
      ctx.engine.addLog(`>> ¡Efecto Umbral de Volcán de Obsidiana! Penetración activada.`);
    }
  },
} as CardScript;
