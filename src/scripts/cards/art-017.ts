// ============ CRUZADA CELESTIAL — ART-017 ============
// ARTEFACTO / CAMPO / ATK 0
//
// EFECTO PASIVO: Los monstruos CELESTIAL ganan +1 ATK.
//   Los monstruos UMBRAL pierden -1 ATK.
//   → getPassiveAtkBonus:
//     Si targetCard.atributo === "CELESTIAL" → +1
//     Si targetCard.atributo === "UMBRAL" → -1
//     Si no → 0
//
// NOTA: Este es un artefacto de campo. Su getPassiveAtkBonus
// aplica a TODOS los monstruos en el campo (ambos lados).
// La integración del motor para bonus de artefactos se
// añadirá después — el script implementa los hooks correctos.

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isCelestial,
  isUmbral,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE CRUZADA CELESTIAL
// ═══════════════════════════════════════════════════════════════

export const ART_017: CardScript = {

  // ── EFECTO PASIVO: CELESTIAL +1 ATK, UMBRAL -1 ATK ──
  getPassiveAtkBonus(_ctx: DuelContext, targetCard: CardData, _targetSlot: SlotId): number {
    // Los artefactos de campo aplican a todos los monstruos del campo
    // (ambos lados, sin restricción de columna o owner)
    if (isCelestial(targetCard)) {
      return 1;
    }
    if (isUmbral(targetCard)) {
      return -1;
    }
    return 0;
  },
};
