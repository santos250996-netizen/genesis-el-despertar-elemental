// 22 — Viento del Destierro (AURA / Elemental)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const colNum = parseInt(ctx.slotId.split("-")[2]);
    const owner = ctx.card.ownerId;
    const luzAltar = ctx.engine.state.board[`${owner}-altar-luz` as "p-altar-luz" | "e-altar-luz"];
    const sombraAltar = ctx.engine.state.board[`${owner}-altar-sombra` as "p-altar-sombra" | "e-altar-sombra"];
    if (colNum === 1 && luzAltar) {
      const target = owner === "player" ? "enemy" : "player";
      ctx.engine.discard(target, 1);
      ctx.engine.addLog(`>> ¡Efecto Celestial de Viento del Destierro! Roba 1 carta de la mano rival al fondo del mazo.`);
      ctx.engine.compensationDraw(target);
    }
    if (colNum === 3 && sombraAltar) {
      ctx.engine.negateAttack(3);
      ctx.engine.addLog(`>> ¡Efecto Umbral de Viento del Destierro! El próximo ataque enemigo en columna 3 será negado.`);
    }
  },
} as CardScript;
