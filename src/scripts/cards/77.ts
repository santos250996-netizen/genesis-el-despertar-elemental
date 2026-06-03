// 77 — Arrecife Bioluminiscente (CELESTIAL / Altar Abis)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    ctx.engine.addLog(`>> ¡Arrecife Bioluminiscente despierta! +3 ATK. Al atacar, absorbe 2 LP.`);
  },
  onAttackHit(ctx) {
    const target = ctx.card.ownerId === "player" ? "enemy" : "player";
    ctx.engine.dealDamage(target, 2);
    ctx.engine.heal(ctx.card.ownerId, 2);
    ctx.engine.addLog(`>> ¡Arrecife Bioluminiscente absorbe! Drena 2 LP del rival y cura 2.`);
  },
} as CardScript;
