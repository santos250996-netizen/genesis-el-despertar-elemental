// 68 — Ojo del Huracán (UMBRAL / Altar Aura)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    ctx.engine.addLog(`>> ¡Ojo del Huracán despierta! Al destruir por batalla, roba 1. Si está en Col 3, -2 ATK al enemigo enfrente.`);
  },
  onEnemyDestroy(ctx) {
    ctx.engine.draw(ctx.card.ownerId, 1);
    ctx.engine.addLog(`>> ¡Ojo del Huracán activa! Robas 1 carta por destrucción.`);
  },
} as CardScript;
