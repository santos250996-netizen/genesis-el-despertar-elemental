// 53 — Hoguera Ancestral (CELESTIAL / Altar Fulgur)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    ctx.engine.addLog(`>> ¡Hoguera Ancestral despierta! Gana +3 ATK. Al atacar, inflige 2 LP extra al rival.`);
  },
  onAttackHit(ctx) {
    const target = ctx.card.ownerId === "player" ? "enemy" : "player";
    ctx.engine.dealDamage(target, 2);
    ctx.engine.addLog(`>> ¡Hoguera Ancestral quema! 2 LP extra al rival.`);
  },
} as CardScript;
