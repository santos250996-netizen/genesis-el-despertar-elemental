// 58 — Incendio Salvaje (FULGUR / Elemental — Piroclasma)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const colNum = parseInt(ctx.slotId.split("-")[2]);
    const owner = ctx.card.ownerId;
    const luzAltar = ctx.engine.state.board[`${owner}-altar-luz` as "p-altar-luz" | "e-altar-luz"];
    const sombraAltar = ctx.engine.state.board[`${owner}-altar-sombra` as "p-altar-sombra" | "e-altar-sombra"];
    if (colNum === 1 && luzAltar) {
      const target = owner === "player" ? "enemy" : "player";
      ctx.engine.dealDamage(target, 3);
      ctx.engine.addLog(`>> ¡Efecto Celestial de Incendio Salvaje! 3 LP daño directo al rival.`);
    }
    if (colNum === 3 && sombraAltar) {
      ctx.engine.addLog(`>> ¡Efecto Umbral de Incendio Salvaje! ATK condicional si hay otro FULGUR.`);
    }
  },
} as CardScript;
