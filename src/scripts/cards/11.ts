// 11 — Pyros, Coloso de Ceniza (FULGUR / Elemental)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const colNum = parseInt(ctx.slotId.split("-")[2]);
    const owner = ctx.card.ownerId;
    const luzAltar = ctx.engine.state.board[`${owner}-altar-luz` as "p-altar-luz" | "e-altar-luz"];
    if (colNum === 1 && luzAltar) {
      const target = owner === "player" ? "enemy" : "player";
      ctx.engine.dealDamage(target, 4);
      ctx.engine.addLog(`>> ¡Efecto Celestial de Pyros! Inflige 4 daño directo.`);
    }
  },
} as CardScript;
