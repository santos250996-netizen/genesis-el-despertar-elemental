// ============ NÓRDICO DRAKKAR — ART-056 ============
// ARTEFACTO / CAMPO / ATK 0
//
// EFECTO PASIVO: Cuando un monstruo NÓRDICO activa Saqueo, todos los
//   monstruos NÓRDICO ganan +1 ATK. Por simplicidad, otorga +1 ATK
//   pasivamente a todos los monstruos NÓRDICO.
//   → getPassiveAtkBonus: +1 ATK para cualquier monstruo NÓRDICO
//
// NOTA: Este es un artefacto de campo. Su getPassiveAtkBonus aplica
// a TODOS los monstruos en el campo (ambos lados). Los artefactos
// NO tienen modo altar/monstruo — están siempre en el slot de
// artefacto y sus efectos son siempre pasivos.

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  cardHasArquetipo,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE NÓRDICO DRAKKAR
// ═══════════════════════════════════════════════════════════════

export const ART_056: CardScript = {

  // ── EFECTO PASIVO: Todos los NÓRDICO ganan +1 ATK ──
  getPassiveAtkBonus(ctx: DuelContext, targetCard: CardData, _targetSlot: SlotId): number {
    // Artefacto de campo: aplica a todos los monstruos del campo
    // (ambos lados, sin restricción de columna o owner)
    if (cardHasArquetipo(targetCard, "NORDICO")) {
      return 1;
    }
    return 0;
  },
};
