import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const col = parseInt(ctx.slotId.split("-")[2]);
    const owner = ctx.card.ownerId;
    const board = ctx.engine.state.board;
    const luzAltar = board[`${owner}-altar-luz` as "p-altar-luz" | "e-altar-luz"];
    const sombraAltar = board[`${owner}-altar-sombra` as "p-altar-sombra" | "e-altar-sombra"];

    if (col === 1 && luzAltar) {
      ctx.engine.addLog(`>> ☀ ${ctx.card.data.name} (Híbrido AURA/ABIS): enciende el Altar de la Luz.`);
    }
    if (col === 3 && sombraAltar) {
      ctx.engine.addLog(`>> 🌑 ${ctx.card.data.name} (Híbrido AURA/ABIS): enciende el Altar de la Sombra.`);
    }
  },
} as CardScript;
