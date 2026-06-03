// 54 — Llama Primordial (CELESTIAL / Altar Fulgur)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    ctx.engine.addLog(`>> ¡Llama Primordial despierta! Todos tus monstruos en campo ganan +1 ATK.`);
  },
} as CardScript;
