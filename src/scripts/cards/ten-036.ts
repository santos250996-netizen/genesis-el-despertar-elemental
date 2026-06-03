// ============ TENOTCH TZITZIMIMEH — TEN-036 ============
// ANIMA / AURA / ANOMALIA / ATK 16
//
// EFECTO MONSTRUO 1 (on_place + TRIBUTO): Tributo TENOTCH: sacrifica
//   un aliado TENOTCH → todos los monstruos enemigos pierden 3 ATK.
//   → Cuando Tzitzimimeh es colocado en slot de monstruo (no altar):
//     1. Sacrificar un aliado TENOTCH
//     2. Iterar monstruos enemigos y aplicar -3 ATK permanente a cada uno
//
// EFECTO ALTAR (RESPUESTA): Cuando un enemigo ataca en este carril,
//   ese enemigo pierde 2 ATK permanente.

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  getAltarColumn,
  getAllMonsters,
  modifyPermanentAtk,
  sacrificeAllyByArquetipo,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE TENOTCH TZITZIMIMEH
// ═══════════════════════════════════════════════════════════════

export const TEN_036: CardScript = {

  // ── EFECTO MONSTRUO 1: Tributo TENOTCH → -3 ATK a todos los enemigos ──
  onPlace(ctx: DuelContext): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // Buscar aliado TENOTCH para sacrificar
    const sacrificed = sacrificeAllyByArquetipo(ctx.engine, owner, "TENOTCH", ctx.slotId);

    if (sacrificed) {
      // Todos los monstruos enemigos pierden 3 ATK
      const enemy = owner === "player" ? "enemy" : "player";
      const enemies = getAllMonsters(ctx.engine, enemy);

      for (const enemyMon of enemies) {
        modifyPermanentAtk(ctx.engine, enemyMon.slot, -3);
      }

      ctx.log.push(`>> ¡Sacrificio Anómalo! ${ctx.card.data.name} sacrifica a ${sacrificed}. ${enemies.length} monstruo(s) enemigo(s) pierden 3 ATK.`);
    } else {
      ctx.log.push(`>> ${ctx.card.data.name}: No hay aliados TENOTCH para sacrificar.`);
    }
  },

  // ── EFECTO ALTAR (RESPUESTA): Enemigo ataca en este carril → pierde 2 ATK ──
  onEnemyAttack(ctx: DuelContext, attackColumn: number): void {
    if (!isAltarSlot(ctx.slotId)) return;

    // Solo activar si el ataque es en la columna del altar
    if (attackColumn !== getAltarColumn(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    const oppPrefix = owner === "player" ? "e" : "p";

    // Encontrar el slot del monstruo atacante enemigo
    const attackingSlot = `${oppPrefix}-mon-${attackColumn}` as SlotId;
    const attackingCard = ctx.engine.state.board[attackingSlot];

    if (attackingCard) {
      modifyPermanentAtk(ctx.engine, attackingSlot, -2);
      ctx.log.push(`>> ¡${ctx.card.data.name} (altar) responde al ataque! ${attackingCard.name} pierde 2 ATK.`);
    }
  },
};
