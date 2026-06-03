// 43 — Gusano del Vacío (CORRUPCION / Special)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const target = ctx.card.ownerId === "player" ? "enemy" : "player";
    const enemyHand = target === "player" ? ctx.engine.state.playerHand : ctx.engine.state.enemyHand;
    if (enemyHand.length > 0) {
      ctx.engine.discard(target, 1);
      ctx.engine.addLog(`>> ¡Gusano del Vacío emerge! Devora 1 carta de la mano rival.`);
    } else {
      ctx.engine.addLog(`>> ¡Gusano del Vacío emerge! No hay cartas en la mano rival. Gana +3 ATK adicional.`);
    }
  },
} as CardScript;
