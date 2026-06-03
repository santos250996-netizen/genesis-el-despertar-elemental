// 76 — Aetheria, la Tempestad Suprema (GENESIS — Aethéria)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const owner = ctx.card.ownerId;
    const enemyPrefix = owner === "player" ? "e" : "p";
    let returned = 0;
    for (let i = 1; i <= 3; i++) {
      const eSlot = `${enemyPrefix}-mon-${i}` as "p-mon-1" | "e-mon-1" | "p-mon-2" | "e-mon-2" | "p-mon-3" | "e-mon-3";
      const eMon = ctx.engine.state.board[eSlot];
      if (eMon) {
        const eAtk = ctx.engine.getEnemyAtk(eSlot);
        if (eAtk < ctx.card.data.atk) {
          ctx.engine.moveToHand(eSlot);
          returned++;
        }
      }
    }
    if (returned > 0) {
      const target = owner === "player" ? "enemy" : "player";
      ctx.engine.dealDamage(target, returned * 2);
      ctx.engine.addLog(`>> ¡¡¡Aetheria despierta!!! Devuelve ${returned} enemigo${returned > 1 ? "s" : ""} a la mano rival. -${returned * 2} LP.`);
    } else {
      ctx.engine.addLog(`>> ¡Aetheria despierta! No hay enemigos con ATK menor que el suyo.`);
    }
  },
} as CardScript;
