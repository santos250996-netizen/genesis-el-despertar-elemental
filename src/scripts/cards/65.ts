// 65 — Nido del Vórtice (CELESTIAL / Altar Aura)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    ctx.engine.addLog(`>> ¡Nido del Vórtice despierta! Gana +3 ATK. Al atacar, roba 1 carta.`);
  },
  onAttackHit(ctx) {
    ctx.engine.draw(ctx.card.ownerId, 1);
    ctx.engine.addLog(`>> ¡Nido del Vórtice activa! Robas 1 carta.`);
  },
} as CardScript;
