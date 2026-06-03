// 56 — Ceniza Eterna (UMBRAL / Altar Fulgur)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    ctx.engine.addLog(`>> ¡Ceniza Eterna despierta! Al destruir enemigo por batalla, rival pierde 2 LP extra.`);
  },
  onEnemyDestroy(ctx) {
    const target = ctx.card.ownerId === "player" ? "enemy" : "player";
    ctx.engine.dealDamage(target, 2);
    ctx.engine.addLog(`>> ¡Ceniza Eterna activa! Rival pierde 2 LP extra por destrucción.`);
  },
} as CardScript;
