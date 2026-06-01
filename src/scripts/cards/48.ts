// 48 — Aethel, el Núcleo Primigenio (GENESIS)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const target = ctx.card.ownerId === "player" ? "enemy" : "player";
    ctx.engine.dealDamage(target, 8);
    ctx.engine.setGlobalAtkBonus(2);
    ctx.engine.addLog(`>> ¡Aethel despierta! Inflige 8 daño directo. Todos tus monstruos ganan +2 ATK.`);
  },
} as CardScript;
