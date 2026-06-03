// 50 — Poseidón, la Furia Abisal (GENESIS)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    ctx.engine.heal(ctx.card.ownerId, 8);
    ctx.engine.setGlobalAtkBonus(2);
    ctx.engine.addLog(`>> ¡Poseidón despierta! Recuperas 8 LP. Todos tus monstruos ganan +2 ATK.`);
  },
} as CardScript;
