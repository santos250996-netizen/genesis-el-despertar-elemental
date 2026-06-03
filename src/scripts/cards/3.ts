// 3 — Valeria, Portadora del Amanecer (CELESTIAL / Altar)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    ctx.engine.addLog(`>> ¡Valeria despierta! Gana +4 ATK.`);
  },
} as CardScript;
