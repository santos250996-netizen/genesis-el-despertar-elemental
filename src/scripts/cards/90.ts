import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    ctx.engine.addLog(`>> ${ctx.card.data.name} activado: protege contra ataques directos por Columna 2.`);
  },
} as CardScript;
