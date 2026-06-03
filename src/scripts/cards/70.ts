// 70 — Tornado Voraz (AURA / Elemental — Aethéria)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const colNum = parseInt(ctx.slotId.split("-")[2]);
    const owner = ctx.card.ownerId;
    const luzAltar = ctx.engine.state.board[`${owner}-altar-luz` as "p-altar-luz" | "e-altar-luz"];
    const sombraAltar = ctx.engine.state.board[`${owner}-altar-sombra` as "p-altar-sombra" | "e-altar-sombra"];
    if (colNum === 1 && luzAltar) {
      const target = owner === "player" ? "enemy" : "player";
      ctx.engine.dealDamage(target, 2);
      ctx.engine.addLog(`>> ¡Efecto Celestial de Tornado Voraz! 2 LP daño directo al rival.`);
    }
    if (colNum === 3 && sombraAltar) {
      ctx.engine.addLog(`>> ¡Efecto Umbral de Tornado Voraz! ATK condicional si hay otro AURA.`);
    }
  },
} as CardScript;
