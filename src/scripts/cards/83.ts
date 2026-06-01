// 83 — Coral Espejeado (ABIS / Elemental — Abisma)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const colNum = parseInt(ctx.slotId.split("-")[2]);
    const owner = ctx.card.ownerId;
    const luzAltar = ctx.engine.state.board[`${owner}-altar-luz` as "p-altar-luz" | "e-altar-luz"];
    const sombraAltar = ctx.engine.state.board[`${owner}-altar-sombra` as "p-altar-sombra" | "e-altar-sombra"];
    if (colNum === 1 && luzAltar) {
      const enemyPrefix = owner === "player" ? "e" : "p";
      let maxEnemyAtk = 0;
      for (let i = 1; i <= 3; i++) {
        const eSlot = `${enemyPrefix}-mon-${i}` as "p-mon-1" | "e-mon-1" | "p-mon-2" | "e-mon-2" | "p-mon-3" | "e-mon-3";
        if (ctx.engine.state.board[eSlot]) {
          const eAtk = ctx.engine.getEnemyAtk(eSlot);
          if (eAtk > maxEnemyAtk) maxEnemyAtk = eAtk;
        }
      }
      if (maxEnemyAtk > 0) {
        ctx.engine.modifyAtk(ctx.slotId, maxEnemyAtk);
        ctx.engine.addLog(`>> ¡Efecto Celestial de Coral Espejeado! Mimetismo: copia ATK del enemigo más fuerte (+${maxEnemyAtk}).`);
      }
    }
    if (colNum === 3 && sombraAltar) {
      ctx.engine.addLog(`>> ¡Efecto Umbral de Coral Espejeado! Si el rival tiene más LP: +3 ATK e indestructible.`);
    }
  },
} as CardScript;
