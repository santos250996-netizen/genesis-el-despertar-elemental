// 67 — Refugio de la Tormenta (UMBRAL / Altar Aura)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    ctx.engine.addLog(`>> ¡Refugio de la Tormenta despierta! Gana +4 ATK. Si es atacado, devuelve el atacante a la mano.`);
  },
} as CardScript;
