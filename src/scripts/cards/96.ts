import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    ctx.engine.addLog(`>> ${ctx.card.data.name} activado: ataques directos causan daño doble.`);
  },
} as CardScript;
