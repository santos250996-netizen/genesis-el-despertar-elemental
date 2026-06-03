import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    ctx.engine.addLog(`>> ${ctx.card.data.name} activado: invocaciones especiales prohibidas.`);
  },
} as CardScript;
