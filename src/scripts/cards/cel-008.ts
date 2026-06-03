// ============ QUIMERA DE LUZ — CEL-008 ============
// FÁBULA / CELESTIAL / CORRUPCIÓN / ATK 20
//
// EFECTO MONSTRUO: Al atacar, destruye la carta con menor ATK del
//   carril enemigo (si hay altar UMBRAL activo).
//   → Cuando Quimera declara ataque:
//     1. Comprobar que hay altar UMBRAL activo (condición)
//     2. Buscar la carta con menor ATK en el lado enemigo
//     3. Destruirla
//
// EFECTO ALTAR (PASIVO): Reduce el ATK de los monstruos enemigos
//   en el carril opuesto en 3.
//   → Cuando Quimera está en slot de altar:
//     Las cartas enemigas en la columna opuesta pierden 3 ATK

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  getAltarColumn,
  getColumn,
  hasUmbralAltar,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE QUIMERA DE LUZ
// ═══════════════════════════════════════════════════════════════

export const CEL_008: CardScript = {

  // ── EFECTO MONSTRUO: Al atacar, destruye la carta con menor ATK del carril enemigo ──
  onAttackDeclared(ctx: DuelContext): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // Condición: debe haber altar UMBRAL activo
    if (!hasUmbralAltar(ctx.engine, owner)) {
      ctx.log.push(`>> ${ctx.card.data.name}: No hay altar UMBRAL activo, efecto no se activa.`);
      return;
    }

    // Restringir búsqueda al carril enemigo opuesto (misma columna)
    const myCol = getColumn(ctx.slotId);
    const oppPrefix = owner === "player" ? "e" : "p";
    const oppSlot = `${oppPrefix}-mon-${myCol}` as SlotId;
    const oppCard = ctx.engine.state.board[oppSlot];

    if (!oppCard) {
      ctx.log.push(`>> ${ctx.card.data.name}: No hay monstruo enemigo en el carril opuesto.`);
      return;
    }

    // Usar ATK computado para la comparación
    const computedAtk = (ctx.engine as any).computeEnemyMonAtk(oppSlot).atk;

    // Destruir la carta enemiga en el carril opuesto
    ctx.engine.destroyCard(oppSlot, "deck");
    ctx.log.push(`>> ¡${ctx.card.data.name} activa su efecto! Destruye a ${oppCard.name} (ATK computado:${computedAtk}) en el carril opuesto.`);
  },

  // ── EFECTO ALTAR (PASIVO): Reduce ATK enemigo en el carril opuesto en 3 ──
  getPassiveAtkBonus(ctx: DuelContext, targetCard: CardData, targetSlot: SlotId): number {
    if (!isAltarSlot(ctx.slotId)) return 0;

    // La carta objetivo debe ser enemiga
    const owner = ctx.card.ownerId;
    const oppPrefix = owner === "player" ? "e" : "p";
    const altarCol = getAltarColumn(ctx.slotId);

    // Solo afecta la columna opuesta al altar
    const oppMonSlot = `${oppPrefix}-mon-${altarCol}` as SlotId;
    if (targetSlot !== oppMonSlot) return 0;

    // Reducir 3 ATK (retorno negativo = debuff)
    return -3;
  },
};
