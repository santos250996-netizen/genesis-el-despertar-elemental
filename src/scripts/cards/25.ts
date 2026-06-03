// 25 — Coral de Espinas (ABIS / Elemental)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const colNum = parseInt(ctx.slotId.split("-")[2]);
    const owner = ctx.card.ownerId;
    const luzAltar = ctx.engine.state.board[`${owner}-altar-luz` as "p-altar-luz" | "e-altar-luz"];
    const sombraAltar = ctx.engine.state.board[`${owner}-altar-sombra` as "p-altar-sombra" | "e-altar-sombra"];
    if (colNum === 1 && luzAltar) {
      ctx.engine.addLog(`>> ¡Efecto Celestial de Coral de Espinas! Ganará +1 ATK cada vez que robes.`);
    }
    if (colNum === 3 && sombraAltar) {
      ctx.engine.blockColumn(3);
      ctx.engine.addLog(`>> ¡Efecto Umbral de Coral de Espinas! Columna 3 bloqueada para el rival el próximo turno.`);
    }
  },
  onDraw(ctx) {
    ctx.engine.modifyAtk(ctx.slotId, 1);
    ctx.engine.addLog(`>> ¡Coral de Espinas! Gana +1 ATK por robo.`);
  },
} as CardScript;
