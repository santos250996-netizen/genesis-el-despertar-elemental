// 64 — Pyraxis, el Devorador Solar (GENESIS — Piroclasma)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const owner = ctx.card.ownerId;
    const enemyPrefix = owner === "player" ? "e" : "p";
    let destroyed = 0;
    for (let i = 1; i <= 3; i++) {
      const eSlot = `${enemyPrefix}-mon-${i}` as "p-mon-1" | "e-mon-1" | "p-mon-2" | "e-mon-2" | "p-mon-3" | "e-mon-3";
      const eMon = ctx.engine.state.board[eSlot];
      if (eMon) {
        const eAtk = ctx.engine.getEnemyAtk(eSlot);
        if (eAtk < ctx.card.data.atk) {
          ctx.engine.destroyCard(eSlot, "deck");
          destroyed++;
        }
      }
    }
    if (destroyed > 0) {
      const target = owner === "player" ? "enemy" : "player";
      ctx.engine.dealDamage(target, destroyed * 2);
      ctx.engine.addLog(`>> ¡¡¡Pyraxis despierta!!! Destruye ${destroyed} enemigo${destroyed > 1 ? "s" : ""}. -${destroyed * 2} LP.`);
    } else {
      ctx.engine.addLog(`>> ¡Pyraxis despierta! No hay enemigos con ATK menor que el suyo.`);
    }
  },
} as CardScript;
