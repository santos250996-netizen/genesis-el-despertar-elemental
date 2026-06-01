import { CardScript } from "@/engine/types";
export default {
  onPlace(ctx) {
    ctx.engine.addLog(`>> ${ctx.card.data.name} activado: todos los monstruos en campo tienen -1 ATK.`);
  },
} as CardScript;
