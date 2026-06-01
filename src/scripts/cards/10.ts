// 10 — Umbral del Olvido (UMBRAL / Altar)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    ctx.engine.addLog(`>> ¡Umbral del Olvido despierta! El rival descarta 1 carta al inicio de cada uno de sus turnos.`);
  },
  onTurnStart(ctx) {
    const owner = ctx.card.ownerId;
    const target = owner === "player" ? "enemy" : "player";
    ctx.engine.discard(target, 1);
    ctx.engine.addLog(`>> ¡Umbral del Olvido activa! El rival descarta 1 carta al inicio del turno.`);
  },
} as CardScript;
