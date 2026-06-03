// 8 — Kaelen, la Sombra Fugaz (UMBRAL / Altar)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    ctx.engine.addLog(`>> ¡Kaelen despierta! Si el rival invoca de modo normal, pierde 1 LP.`);
  },
  onEnemySummon(ctx) {
    ctx.engine.dealDamage("enemy", 1);
    ctx.engine.addLog(`>> ¡Kaelen activa! El rival pierde 1 LP por invocación.`);
  },
} as CardScript;
