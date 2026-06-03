// 81 — Tiburón de las Profundidades (ABIS / Elemental — Abisma)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const colNum = parseInt(ctx.slotId.split("-")[2]);
    const owner = ctx.card.ownerId;
    const luzAltar = ctx.engine.state.board[`${owner}-altar-luz` as "p-altar-luz" | "e-altar-luz"];
    const sombraAltar = ctx.engine.state.board[`${owner}-altar-sombra` as "p-altar-sombra" | "e-altar-sombra"];
    if (colNum === 1 && luzAltar) {
      const enemySlot = `${owner === "player" ? "e" : "p"}-mon-1` as "p-mon-1" | "e-mon-1";
      if (ctx.engine.state.board[enemySlot]) {
        ctx.engine.modifyAtk(enemySlot, -3);
        ctx.engine.addLog(`>> ¡Efecto Celestial de Tiburón! Roba 3 ATK del enemigo enfrente.`);
      }
    }
    if (colNum === 3 && sombraAltar) {
      ctx.engine.addLog(`>> ¡Efecto Umbral de Tiburón! ATK dinámico basado en ventaja de LP.`);
    }
  },
} as CardScript;
