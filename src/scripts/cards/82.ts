// 82 — Medusa Petrificante (ABIS / Elemental — Abisma)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const colNum = parseInt(ctx.slotId.split("-")[2]);
    const owner = ctx.card.ownerId;
    const luzAltar = ctx.engine.state.board[`${owner}-altar-luz` as "p-altar-luz" | "e-altar-luz"];
    const sombraAltar = ctx.engine.state.board[`${owner}-altar-sombra` as "p-altar-sombra" | "e-altar-sombra"];
    if (colNum === 1 && luzAltar) {
      const enemyPrefix = owner === "player" ? "e" : "p";
      let weakestSlot: "p-mon-1" | "e-mon-1" | "p-mon-2" | "e-mon-2" | "p-mon-3" | "e-mon-3" | null = null;
      let weakestAtk = Infinity;
      for (let i = 1; i <= 3; i++) {
        const eSlot = `${enemyPrefix}-mon-${i}` as "p-mon-1" | "e-mon-1" | "p-mon-2" | "e-mon-2" | "p-mon-3" | "e-mon-3";
        if (ctx.engine.state.board[eSlot]) {
          const eAtk = ctx.engine.getEnemyAtk(eSlot);
          if (eAtk < weakestAtk) {
            weakestAtk = eAtk;
            weakestSlot = eSlot;
          }
        }
      }
      if (weakestSlot) {
        ctx.engine.setAtkToZero(weakestSlot);
        ctx.engine.addLog(`>> ¡Efecto Celestial de Medusa! [${ctx.engine.state.board[weakestSlot]!.name}] queda petrificado con 0 ATK.`);
      }
    }
    if (colNum === 3 && sombraAltar) {
      ctx.engine.addLog(`>> ¡Efecto Umbral de Medusa! Si destruye por batalla, el enemigo va al FONDO del mazo.`);
    }
  },
  onEnemyDestroy(ctx) {
    ctx.engine.addLog(`>> ¡Medusa petrifica! El enemigo destruido se hunde al fondo del mazo.`);
  },
} as CardScript;
