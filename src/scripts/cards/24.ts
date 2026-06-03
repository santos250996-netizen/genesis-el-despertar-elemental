// 24 — Gota del Océano (ABIS / Elemental)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const colNum = parseInt(ctx.slotId.split("-")[2]);
    const owner = ctx.card.ownerId;
    const luzAltar = ctx.engine.state.board[`${owner}-altar-luz` as "p-altar-luz" | "e-altar-luz"];
    const sombraAltar = ctx.engine.state.board[`${owner}-altar-sombra` as "p-altar-sombra" | "e-altar-sombra"];
    if (colNum === 1 && luzAltar) {
      ctx.engine.addLog(`>> ¡Efecto Celestial de Gota del Océano! Gana +5 ATK.`);
    }
    if (colNum === 3 && sombraAltar) {
      ctx.engine.addLog(`>> ¡Efecto Umbral de Gota del Océano! Al morir, el atacante irá al fondo del mazo.`);
    }
  },
  beforeDestroy(ctx) {
    ctx.engine.addLog(`>> ¡Gota del Océano activa su efecto al morir! El atacante va al fondo del mazo.`);
    return false;
  },
} as CardScript;
