// 6 — Malakor, Susurro del Abismo (UMBRAL / Altar)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    ctx.engine.addLog(`>> ¡Malakor despierta! Gana +3 ATK.`);
  },
} as CardScript;
