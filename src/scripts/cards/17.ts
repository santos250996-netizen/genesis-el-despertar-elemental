// 17 — Zephyr, Halcón de Tormenta (AURA / Elemental)
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
        ctx.engine.moveToHand(enemySlot);
        ctx.engine.addLog(`>> ¡Efecto Celestial de Zephyr! Regresa un monstruo enemigo a la mano.`);
      }
    }
    if (colNum === 3 && sombraAltar) {
      const eAltarSlot = `${owner === "player" ? "e" : "p"}-altar-sombra` as "p-altar-sombra" | "e-altar-sombra";
      if (ctx.engine.state.board[eAltarSlot]) {
        ctx.engine.destroyCard(eAltarSlot, "deck");
        ctx.engine.addLog(`>> ¡Efecto Umbral de Zephyr! Destruye el Altar enemigo de esta columna.`);
      }
    }
  },
} as CardScript;
