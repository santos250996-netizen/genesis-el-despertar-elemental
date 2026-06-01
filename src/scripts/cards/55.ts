// 55 — Brasas del Inframundo (UMBRAL / Altar Fulgur)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const target = ctx.card.ownerId === "player" ? "enemy" : "player";
    ctx.engine.dealDamage(target, 2);
    ctx.engine.addLog(`>> ¡Brasas del Inframundo despierta! Gana +4 ATK. Inflige 2 LP daño directo al rival.`);
  },
} as CardScript;
