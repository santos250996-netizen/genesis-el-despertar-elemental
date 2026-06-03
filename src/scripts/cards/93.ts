import { CardScript } from "@/engine/types";
export default {
  onTurnStart(ctx) {
    const owner = ctx.card.ownerId;
    const lp = ctx.engine.state[`${owner}LP` as "playerLP" | "enemyLP"];
    if (lp > 1) {
      ctx.engine.heal(owner, -1);
      ctx.engine.draw(owner, 1);
      ctx.engine.addLog(`>> ${ctx.card.data.name}: paga 1 LP para robar 1 carta.`);
    }
  },
} as CardScript;
