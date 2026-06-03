// 27 — Abismo del Silencio (ABIS / Elemental)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const colNum = parseInt(ctx.slotId.split("-")[2]);
    const owner = ctx.card.ownerId;
    const luzAltar = ctx.engine.state.board[`${owner}-altar-luz` as "p-altar-luz" | "e-altar-luz"];
    const sombraAltar = ctx.engine.state.board[`${owner}-altar-sombra` as "p-altar-sombra" | "e-altar-sombra"];
    if (colNum === 1 && luzAltar) {
      const target = owner === "player" ? "enemy" : "player";
      const enemyHand = target === "player" ? ctx.engine.state.playerHand : ctx.engine.state.enemyHand;
      if (enemyHand.length > 4) {
        ctx.engine.addLog(`>> ¡Efecto Celestial de Abismo del Silencio! Rival tiene ${enemyHand.length} cartas. Descarta hasta 4.`);
      } else {
        ctx.engine.addLog(`>> ¡Efecto Celestial de Abismo del Silencio! La mano rival está en límite (≤4).`);
      }
    }
    if (colNum === 3 && sombraAltar) {
      ctx.engine.addLog(`>> ¡Efecto Umbral de Abismo del Silencio! Al destruir un enemigo por batalla, el rival descarta 1 carta extra.`);
    }
  },
  onEnemyDestroy(ctx) {
    const target = ctx.card.ownerId === "player" ? "enemy" : "player";
    ctx.engine.discard(target, 1);
    ctx.engine.addLog(`>> ¡Abismo del Silencio activa! El rival descarta 1 carta extra por destrucción.`);
  },
} as CardScript;
