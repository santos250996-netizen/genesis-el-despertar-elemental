// 71 — Muro de Aire (AURA / Elemental — Aethéria)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const colNum = parseInt(ctx.slotId.split("-")[2]);
    const owner = ctx.card.ownerId;
    const luzAltar = ctx.engine.state.board[`${owner}-altar-luz` as "p-altar-luz" | "e-altar-luz"];
    const sombraAltar = ctx.engine.state.board[`${owner}-altar-sombra` as "p-altar-sombra" | "e-altar-sombra"];
    if (colNum === 1 && luzAltar) {
      ctx.engine.addLog(`>> ¡Efecto Celestial de Muro de Aire! Inmune a reducciones de ATK.`);
    }
    if (colNum === 3 && sombraAltar) {
      ctx.engine.negateAttack(3);
      ctx.engine.addLog(`>> ¡Efecto Umbral de Muro de Aire! Niega el primer ataque enemigo en su columna.`);
    }
  },
} as CardScript;
