// 1 — Serafín del Ala Rota (CELESTIAL / Altar)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    ctx.engine.addLog(`>> ¡Serafín despierta! No puede ser destruido por batalla.`);
  },
} as CardScript;
