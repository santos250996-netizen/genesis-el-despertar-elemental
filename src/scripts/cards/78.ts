// 78 — Manantial Primordial (CELESTIAL / Altar Abis)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    ctx.engine.addLog(`>> ¡Manantial Primordial despierta! +2 ATK por cada 5 LP que te falten (max +8). Al destruir por batalla, roba 1.`);
  },
  onEnemyDestroy(ctx) {
    ctx.engine.draw(ctx.card.ownerId, 1);
    ctx.engine.addLog(`>> ¡Manantial Primordial activa! Robas 1 carta por destrucción.`);
  },
} as CardScript;
