// 4 — Destello Primordial (CELESTIAL / Altar)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    ctx.engine.addLog(`>> ¡Destello Primordial despierta! El rival no puede activar efectos en tu fase de robo.`);
  },
} as CardScript;
