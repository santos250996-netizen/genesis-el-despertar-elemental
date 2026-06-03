// ============ NÓRDICO YMIR — NOR-048 ============
// CLASTO / FOSO / CORRUPCION / ATK 20
//
// EFECTO MONSTRUO 1 (on_destroy_enemy + SAQUEO): Al destruir un
//   monstruo enemigo, invoca 1 monstruo NÓRDICO del mazo al campo.
//   → Cuando Ymir destruye un enemigo en batalla:
//     1. Buscar slot vacío con findEmptyMonsterSlot
//     2. Buscar carta NÓRDICO en el mazo
//     3. Remover del mazo y colocarla en el slot vacío
//
// EFECTO MONSTRUO 2 (on_attack_declared): El monstruo enemigo en la
//   columna opuesta pierde 2 ATK permanente.
//   → Cuando Ymir declara ataque:
//     modifyPermanentAtk -2 al enemigo opuesto
//
// EFECTO ALTAR (PASIVO): TODOS los monstruos enemigos pierden 1 ATK.
//   → getPassiveAtkBonus: Retorna -1 para cualquier monstruo enemigo.

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  isMonsterSlot,
  getOpposingMonster,
  modifyPermanentAtk,
  findEmptyMonsterSlot,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE NÓRDICO YMIR
// ═══════════════════════════════════════════════════════════════

export const NOR_048: CardScript = {

  // ── EFECTO MONSTRUO 1: Saqueo NÓRDICO — invocar NÓRDICO del mazo ──
  onDestroyEnemy(ctx: DuelContext, destroyedEnemy: CardData): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // Buscar slot vacío
    const emptySlot = findEmptyMonsterSlot(ctx.engine, owner);
    if (!emptySlot) {
      ctx.log.push(`>> ¡Saqueo Nórdico! ${ctx.card.data.name} saquea a ${destroyedEnemy.name}. No hay slots vacíos para invocar.`);
      return;
    }

    // Buscar carta NÓRDICO en el mazo
    const deck = owner === "player"
      ? [...ctx.engine.state.playerDeck]
      : [...ctx.engine.state.enemyDeck];

    let foundIdx = -1;
    for (let i = deck.length - 1; i >= 0; i--) {
      if (deck[i].arquetipo === "NORDICO") {
        foundIdx = i;
        break;
      }
    }

    if (foundIdx < 0) {
      ctx.log.push(`>> ¡Saqueo Nórdico! ${ctx.card.data.name} saquea a ${destroyedEnemy.name}. No hay cartas NÓRDICO en el mazo.`);
      return;
    }

    // Remover del mazo y colocar en el campo
    const summoned = deck.splice(foundIdx, 1)[0];
    const placedCard = { ...summoned, es_altar: false };

    if (owner === "player") {
      ctx.engine.state.playerDeck = deck;
    } else {
      ctx.engine.state.enemyDeck = deck;
    }

    ctx.engine.state.board = { ...ctx.engine.state.board, [emptySlot]: placedCard };
    ctx.log.push(`>> ¡Saqueo Nórdico! ${ctx.card.data.name} saquea a ${destroyedEnemy.name}. Invoca ${summoned.name} del mazo a ${emptySlot}.`);
  },

  // ── EFECTO MONSTRUO 2: Al atacar, enemigo opuesto pierde 2 ATK ──
  onAttackDeclared(ctx: DuelContext): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    const opposing = getOpposingMonster(ctx.engine, ctx.slotId, owner);

    if (opposing) {
      modifyPermanentAtk(ctx.engine, opposing.slot, -2);
      ctx.log.push(`>> ¡${ctx.card.data.name} debilita al enemigo! ${opposing.card.name} pierde 2 ATK permanente.`);
    } else {
      ctx.log.push(`>> ${ctx.card.data.name}: No hay enemigo opuesto para debilitar.`);
    }
  },

  // ── EFECTO ALTAR (PASIVO): Todos los monstruos enemigos pierden 1 ATK ──
  getPassiveAtkBonus(ctx: DuelContext, targetCard: CardData, targetSlot: SlotId): number {
    if (!isAltarSlot(ctx.slotId)) return 0;

    // Determinar si el target es enemigo comparando prefijos
    const owner = ctx.card.ownerId;
    const oppPrefix = owner === "player" ? "e" : "p";

    // Solo aplica a monstruos enemigos
    if (!targetSlot.startsWith(oppPrefix)) return 0;
    if (!isMonsterSlot(targetSlot)) return 0;

    return -1;
  },
};
