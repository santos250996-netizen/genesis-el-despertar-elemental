// 12 — Chispa Errante (FULGUR / Elemental)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const colNum = parseInt(ctx.slotId.split("-")[2]);
    const owner = ctx.card.ownerId;
    const luzAltar = ctx.engine.state.board[`${owner}-altar-luz` as "p-altar-luz" | "e-altar-luz"];
    const sombraAltar = ctx.engine.state.board[`${owner}-altar-sombra` as "p-altar-sombra" | "e-altar-sombra"];
    if (colNum === 1 && luzAltar) {
      ctx.engine.setGlobalAtkBonus(2);
      ctx.engine.addLog(`>> ¡Efecto Celestial de Chispa Errante! Todos tus monstruos ganan +2 ATK.`);
    }
    if (colNum === 3 && sombraAltar) {
      const eAltarSlot = `${owner === "player" ? "e" : "p"}-altar-sombra` as "p-altar-sombra" | "e-altar-sombra";
      if (ctx.engine.state.board[eAltarSlot]) {
        ctx.engine.destroyCard(eAltarSlot, "deck");
        ctx.engine.addLog(`>> ¡Efecto Umbral de Chispa Errante! Destruye el Altar enemigo de esta columna.`);
      }
    }
  },
} as CardScript;
