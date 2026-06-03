// ============ NÓRDICO ODIN — NOR-050 ============
// FABULA / AURA / GENESIS / ATK 26
//
// EFECTO MONSTRUO 1 (on_destroy_enemy + SAQUEO): Al destruir un
//   monstruo enemigo, roba 3 cartas.
//   → Cuando Odin destruye un enemigo en batalla:
//     draw(owner, 3)
//
// EFECTO MONSTRUO 2 (on_turn_start): Al inicio del turno, todos los
//   monstruos NÓRDICO ganan +2 ATK.
//   → Iterar sobre todos los monstruos propios, si tienen
//     arquetipo NÓRDICO, modificar ATK +2
//
// EFECTO ALTAR (PASIVO): Los monstruos AURA en este carril ganan +2 ATK.
//   → getPassiveAtkBonus: +2 para AURA en la columna del altar

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  cardHasArquetipo,
  getAllMonsters,
  modifyTempAtk,
  altarBonusForColumn,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE NÓRDICO ODIN
// ═══════════════════════════════════════════════════════════════

export const NOR_050: CardScript = {

  // ── EFECTO MONSTRUO 1: Saqueo NÓRDICO — robar 3 cartas ──
  onDestroyEnemy(ctx: DuelContext, destroyedEnemy: CardData): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    ctx.engine.draw(owner, 3);
    ctx.log.push(`>> ¡Saqueo Nórdico! ${ctx.card.data.name} saquea a ${destroyedEnemy.name}. ¡Roba 3 cartas!`);
  },

  // ── EFECTO MONSTRUO 2: Al inicio del turno, todos los NÓRDICO ganan +2 ATK ──
  onTurnStart(ctx: DuelContext): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    const allies = getAllMonsters(ctx.engine, owner);

    let buffed = 0;
    for (const ally of allies) {
      if (cardHasArquetipo(ally.card, "NORDICO")) {
        modifyTempAtk(ctx.engine, ally.slot, 2);
        buffed++;
      }
    }

    if (buffed > 0) {
      ctx.log.push(`>> ¡${ctx.card.data.name} bendice a los NÓRDICO! ${buffed} aliado(s) ganan +2 ATK.`);
    } else {
      ctx.log.push(`>> ${ctx.card.data.name}: No hay aliados NÓRDICO para buffar.`);
    }
  },

  // ── EFECTO ALTAR (PASIVO): AURA en este carril ganan +2 ATK ──
  getPassiveAtkBonus(ctx: DuelContext, targetCard: CardData, targetSlot: SlotId): number {
    if (!isAltarSlot(ctx.slotId)) return 0;

    const owner = ctx.card.ownerId;
    const bonus = altarBonusForColumn(
      ctx.slotId,
      owner,
      targetCard,
      targetSlot,
      "AURA",
      2
    );

    return bonus;
  },
};
