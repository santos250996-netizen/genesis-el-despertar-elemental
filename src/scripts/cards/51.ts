// 51 — Gaia, el Titán de la Tierra (GENESIS)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    ctx.engine.setNoEffectDestroy(true);
    ctx.engine.addLog(`>> ¡Gaia despierta! Tus monstruos no pueden ser destruidos por efectos.`);
  },
} as CardScript;
