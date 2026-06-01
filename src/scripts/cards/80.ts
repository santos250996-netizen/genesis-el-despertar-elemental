// 80 — Trinchera Oscura (UMBRAL / Altar Abis)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    ctx.engine.addLog(`>> ¡Trinchera Oscura despierta! Al destruir por batalla, rival descarta 1. Si el rival invoca en esa columna, pierde 2 LP.`);
  },
  onEnemyDestroy(ctx) {
    const target = ctx.card.ownerId === "player" ? "enemy" : "player";
    ctx.engine.discard(target, 1);
    ctx.engine.addLog(`>> ¡Trinchera Oscura activa! Rival descarta 1 carta por destrucción.`);
  },
  onEnemySummon(ctx) {
    const target = ctx.card.ownerId === "player" ? "enemy" : "player";
    ctx.engine.dealDamage(target, 2);
    ctx.engine.addLog(`>> ¡Trinchera Oscura activa! Rival pierde 2 LP por invocar en esa columna.`);
  },
} as CardScript;
