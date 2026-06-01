// 7 — Vórtice Oscuro (UMBRAL / Altar)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    ctx.engine.addLog(`>> ¡Vórtice Oscuro despierta! Al atacar, el rival no activa efectos.`);
  },
} as CardScript;
