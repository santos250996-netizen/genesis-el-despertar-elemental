// ============ VALERIA, ÁNIMA DEL REFUGIO — CEL-005 ============
// ÁNIMA / CELESTIAL / NORMAL / ATK 9
//
// EFECTO MONSTRUO: Al invocar, otorga 1 contador_escudo a un monstruo
//   aliado en tu carril.
//   → Cuando Valeria es colocada en slot de monstruo:
//     1. Comprobar que está en slot de monstruo (no altar)
//     2. Buscar un monstruo aliado en las columnas adyacentes
//     3. Si hay, otorgarle 1 contador_escudo
//
// EFECTO ALTAR (PASIVO): Los monstruos en este carril ganan +2 ATK.
//   → Mientras Valeria esté en slot de altar, los monstruos en la
//     misma columna ganan +2 ATK (computado dinámicamente).

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  getAltarColumn,
  getMonsterSlot,
  getColumn,
  getAltarSlot,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE VALERIA
// ═══════════════════════════════════════════════════════════════

export const CEL_005: CardScript = {

  // ── EFECTO MONSTRUO: Al invocar, otorga 1 escudo al aliado en el mismo carril ──
  onSummon(ctx: DuelContext): void {
    // Solo activa si Valeria está en modo monstruo (no en altar)
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    const myCol = getColumn(ctx.slotId);

    // Restringir al aliado en la misma columna (carril)
    // Columna 1 → altar-luz, Columna 3 → altar-sombra, Columna 2 → sin altar
    if (myCol === 2) {
      // Columna central no tiene altar, no hay otro aliado en el carril
      ctx.log.push(`>> ${ctx.card.data.name}: Estás en la columna central, no hay aliado en este carril.`);
      return;
    }

    const altarType = myCol === 1 ? "luz" as const : "sombra" as const;
    const altarSlot = getAltarSlot(owner, altarType);
    const altarCard = ctx.engine.state.board[altarSlot];

    if (altarCard) {
      ctx.engine.addShield(altarSlot);
      ctx.log.push(`>> ¡${ctx.card.data.name} activa su efecto! Otorga escudo a ${altarCard.name} (${altarSlot}).`);
    } else {
      ctx.log.push(`>> ${ctx.card.data.name}: No hay aliado en el carril ${myCol} para otorgar escudo.`);
    }
  },

  // ── EFECTO ALTAR (PASIVO): Monstruos en este carril +2 ATK ──
  // Computado dinámicamente — no usa modifyAtk, así que no acumula.
  getPassiveAtkBonus(ctx: DuelContext, targetCard: CardData, targetSlot: SlotId): number {
    // Solo activa si Valeria está en slot de altar
    if (!isAltarSlot(ctx.slotId)) return 0;

    const owner = ctx.card.ownerId;
    const altarCol = getAltarColumn(ctx.slotId);
    const expectedMonSlot = getMonsterSlot(owner, altarCol);

    // Solo aplica al monstruo en la misma columna que el altar
    if (targetSlot !== expectedMonSlot) return 0;

    // +2 ATK al monstruo en este carril
    return 2;
  },
};
