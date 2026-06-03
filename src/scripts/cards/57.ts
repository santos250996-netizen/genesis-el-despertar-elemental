// 57 — Ignis, Corazón Ígneo (FULGUR / Elemental — Piroclasma)
import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    const colNum = parseInt(ctx.slotId.split("-")[2]);
    const owner = ctx.card.ownerId;
    const luzAltar = ctx.engine.state.board[`${owner}-altar-luz` as "p-altar-luz" | "e-altar-luz"];
    const sombraAltar = ctx.engine.state.board[`${owner}-altar-sombra` as "p-altar-sombra" | "e-altar-sombra"];
    if (colNum === 1 && luzAltar) {
      ctx.engine.addLog(`>> ¡Efecto Celestial de Ignis! Cada FULGUR en campo gana +1 ATK.`);
    }
    if (colNum === 3 && sombraAltar) {
      ctx.engine.addLog(`>> ¡Efecto Umbral de Ignis! Al destruir enemigo por batalla, 2 LP daño al rival.`);
    }
  },
  onEnemyDestroy(ctx) {
    const target = ctx.card.ownerId === "player" ? "enemy" : "player";
    ctx.engine.dealDamage(target, 2);
    ctx.engine.addLog(`>> ¡Ignis quema! 2 LP daño al rival por destrucción.`);
  },
} as CardScript;
