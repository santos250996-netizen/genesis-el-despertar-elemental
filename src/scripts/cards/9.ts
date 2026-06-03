// 9 — Espectro del Vacío (UMBRAL / Altar)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    ctx.engine.addLog(`>> ¡Espectro del Vacío despierta! Los monstruos enemigos en esta columna pierden 3 ATK.`);
  },
} as CardScript;
