// 79 — Fosa Abisal (UMBRAL / Altar Abis)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    ctx.engine.addLog(`>> ¡Fosa Abisal despierta! +4 ATK. El enemigo enfrente pierde 2 ATK.`);
  },
} as CardScript;
