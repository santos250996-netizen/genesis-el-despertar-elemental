// 52 — Oblivion, el Vacío Definitivo (GENESIS)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const target = ctx.card.ownerId === "player" ? "enemy" : "player";
    const enemyHand = target === "player" ? ctx.engine.state.playerHand : ctx.engine.state.enemyHand;
    if (enemyHand.length > 0) {
      const count = enemyHand.length;
      ctx.engine.discard(target, count);
      ctx.engine.dealDamage(target, count * 2);
      ctx.engine.addLog(`>> ¡¡¡Oblivion despierta!!! Destruye TODA la mano rival (${count} cartas). -${count * 2} LP.`);
    } else {
      ctx.engine.addLog(`>> ¡Oblivion despierta! El rival no tiene cartas en mano.`);
    }
  },
} as CardScript;
