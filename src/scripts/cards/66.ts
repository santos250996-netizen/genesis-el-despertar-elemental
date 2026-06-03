// 66 — Brisa del Alba (CELESTIAL / Altar Aura)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    ctx.engine.addLog(`>> ¡Brisa del Alba despierta! Todos tus monstruos en campo +1 ATK. Al destruir por batalla, oponente descarta 1.`);
  },
  onEnemyDestroy(ctx) {
    const target = ctx.card.ownerId === "player" ? "enemy" : "player";
    ctx.engine.discard(target, 1);
    ctx.engine.addLog(`>> ¡Brisa del Alba activa! Oponente descarta 1 carta por destrucción.`);
  },
} as CardScript;
