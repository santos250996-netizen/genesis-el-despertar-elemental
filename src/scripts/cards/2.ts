// 2 — Guardián del Alba (CELESTIAL / Altar)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    ctx.engine.addLog(`>> ¡Guardián del Alba despierta! Todos tus monstruos ganan +2 ATK.`);
  },
} as CardScript;
