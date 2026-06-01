// 69 — Zéfir, Señor de los Vientos (AURA / Elemental — Aethéria)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const colNum = parseInt(ctx.slotId.split("-")[2]);
    const owner = ctx.card.ownerId;
    const luzAltar = ctx.engine.state.board[`${owner}-altar-luz` as "p-altar-luz" | "e-altar-luz"];
    const sombraAltar = ctx.engine.state.board[`${owner}-altar-sombra` as "p-altar-sombra" | "e-altar-sombra"];
    if (colNum === 1 && luzAltar) {
      ctx.engine.addLog(`>> ¡Efecto Celestial de Zéfir! ATK dinámico basado en cartas en mano.`);
    }
    if (colNum === 3 && sombraAltar) {
      ctx.engine.addLog(`>> ¡Efecto Umbral de Zéfir! Al destruir por batalla, devuelve 1 enemigo a la mano.`);
    }
  },
  onEnemyDestroy(ctx) {
    const owner = ctx.card.ownerId;
    const enemyPrefix = owner === "player" ? "e" : "p";
    for (let i = 1; i <= 3; i++) {
      const eSlot = `${enemyPrefix}-mon-${i}` as "p-mon-1" | "e-mon-1" | "p-mon-2" | "e-mon-2" | "p-mon-3" | "e-mon-3";
      if (ctx.engine.state.board[eSlot]) {
        ctx.engine.moveToHand(eSlot);
        ctx.engine.addLog(`>> ¡Zéfir activa! Devuelve [${ctx.engine.state.board[eSlot]?.name}] a la mano.`);
        break;
      }
    }
  },
} as CardScript;
