// 5 — Luz Devoradora (CELESTIAL / Altar)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    ctx.engine.addLog(`>> ¡Luz Devoradora despierta! Cada vez que el rival invoca un monstruo de modo normal, descarta 1 carta.`);
  },
  onEnemySummon(ctx) {
    ctx.engine.discard("enemy", 1);
    ctx.engine.addLog(`>> ¡Luz Devoradora activa! El rival descarta 1 carta por invocación.`);
  },
} as CardScript;
