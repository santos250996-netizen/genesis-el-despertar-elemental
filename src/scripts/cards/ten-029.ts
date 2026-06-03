// ============ TENOTCH TLALOC — TEN-029 ============
// MARINA / ABIS / ECLIPSE / ATK 24
//
// EFECTO MONSTRUO 1 (on_place + TRIBUTO): Tributo TENOTCH: sacrifica
//   un aliado TENOTCH → aplica corrosión a todos los monstruos enemigos.
//   → Cuando Tlaloc es colocado en slot de monstruo (no altar):
//     1. Comprobar que hay otro aliado TENOTCH en el campo
//     2. Sacrificarlo
//     3. Aplicar 1 contador de corrosión a todos los monstruos enemigos
//
// EFECTO MONSTRUO 2 (on_turn_start): Al inicio del turno, inflige 2 de
//   daño por cada contador de corrosión a los monstruos enemigos con
//   corrosión en el carril opuesto.
//
// EFECTO ALTAR (PASIVO): Los monstruos enemigos en el carril opuesto
//   pierden 2 ATK (return -2).

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  getColumn,
  getAltarColumn,
  getMonsterSlot,
  sacrificeAllyByArquetipo,
  addCorrosionToAllEnemies,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE TENOTCH TLALOC
// ═══════════════════════════════════════════════════════════════

export const TEN_029: CardScript = {

  // ── EFECTO MONSTRUO 1: Tributo TENOTCH → corrosión a enemigos ──
  onPlace(ctx: DuelContext): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // Buscar aliado TENOTCH para sacrificar
    const sacrificed = sacrificeAllyByArquetipo(ctx.engine, owner, "TENOTCH", ctx.slotId);

    if (sacrificed) {
      // Aplicar corrosión a todos los monstruos enemigos
      const affected = addCorrosionToAllEnemies(ctx.engine, owner, 1);
      if (affected.length > 0) {
        ctx.log.push(`>> ¡Sacrificio Sagrado! ${ctx.card.data.name} sacrifica a ${sacrificed}. Corrosión aplicada a: ${affected.join(", ")}.`);
      } else {
        ctx.log.push(`>> ¡Sacrificio Sagrado! ${ctx.card.data.name} sacrifica a ${sacrificed}. No hay monstruos enemigos para corroer.`);
      }
    } else {
      ctx.log.push(`>> ${ctx.card.data.name}: No hay aliados TENOTCH para sacrificar.`);
    }
  },

  // ── EFECTO MONSTRUO 2: Daño por corrosión al inicio del turno ──
  onTurnStart(ctx: DuelContext): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    const oppPrefix = owner === "player" ? "e" : "p";
    const myCol = getColumn(ctx.slotId);
    const oppSlot = `${oppPrefix}-mon-${myCol}` as SlotId;
    const oppCard = ctx.engine.state.board[oppSlot];

    if (!oppCard) return;

    // Comprobar si el enemigo tiene contadores de corrosión
    const corrosionCount = ctx.engine.state.effects.corrosionCounters[oppSlot] ?? 0;
    if (corrosionCount > 0) {
      const damage = corrosionCount * 2;
      ctx.engine.dealDamage(oppPrefix === "e" ? "enemy" : "player", damage);
      ctx.log.push(`>> ¡${ctx.card.data.name} activa corrosión! ${oppCard.name} recibe ${damage} de daño por corrosión (${corrosionCount} contador/es).`);
    }
  },

  // ── EFECTO ALTAR (PASIVO): Enemigos en carril opuesto pierden 2 ATK ──
  getPassiveAtkBonus(ctx: DuelContext, targetCard: CardData, targetSlot: SlotId): number {
    if (!isAltarSlot(ctx.slotId)) return 0;

    // Solo aplica a slots de monstruo enemigo en la columna opuesta
    const owner = ctx.card.ownerId;
    const oppPrefix = owner === "player" ? "e" : "p";
    const altarCol = getAltarColumn(ctx.slotId);
    const oppMonSlot = getMonsterSlot(oppPrefix === "e" ? "enemy" : "player", altarCol);

    if (targetSlot !== oppMonSlot) return 0;

    // Verificar que el objetivo es enemigo
    const isEnemy =
      (owner === "player" && targetSlot.startsWith("e")) ||
      (owner === "enemy" && targetSlot.startsWith("p"));
    if (!isEnemy) return 0;

    return -2;
  },
};
