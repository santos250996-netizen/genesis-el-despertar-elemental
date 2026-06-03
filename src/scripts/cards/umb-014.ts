// ============ ECLIPSE PERMANENTE — UMB-014 ============
// CLASTO / UMBRAL / ECLIPSE / ATK 25
//
// EFECTO MONSTRUO: Al declarar ataque, si controlas ambos altares,
//   destruye todas las cartas en la columna atacada (ambos lados).
//   → Cuando Eclipse Permanente declara ataque:
//     1. Comprobar que está en slot de monstruo (no altar)
//     2. Comprobar si controlas ambos altares activos
//     3. Si sí, destruir todas las cartas en la columna del ataque
//        (monstruos y altares en esa columna, ambos lados del tablero)
//
// EFECTO ALTAR (PASIVO): Todos los monstruos enemigos pierden 2 ATK.
//   → Cuando Eclipse Permanente está en slot de altar:
//     Cualquier monstruo enemigo (targetSlot empieza con prefijo oponente)
//     recibe -2 ATK pasivo.

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  hasBothAltars,
  getColumn,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE ECLIPSE PERMANENTE
// ═══════════════════════════════════════════════════════════════

export const UMB_014: CardScript = {

  // ── EFECTO MONSTRUO: Si ambos altares, destruir columna atacada ──
  onAttackDeclared(ctx: DuelContext): void {
    // Solo activa si Eclipse está en modo monstruo (no en altar)
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // Condición: debe controlar ambos altares
    if (!hasBothAltars(ctx.engine, owner)) {
      ctx.log.push(`>> ${ctx.card.data.name}: No controlas ambos altares, efecto no se activa.`);
      return;
    }

    // Obtener la columna del ataque
    const col = getColumn(ctx.slotId);

    // Construir lista de slots en esta columna (ambos lados)
    const playerPrefix = "p";
    const enemyPrefix = "e";
    const slotsToDestroy: SlotId[] = [];

    // Monstruos en la columna (ambos lados)
    slotsToDestroy.push(`${playerPrefix}-mon-${col}` as SlotId);
    slotsToDestroy.push(`${enemyPrefix}-mon-${col}` as SlotId);

    // Altares en la columna (luz=1, sombra=3)
    if (col === 1) {
      slotsToDestroy.push(`${playerPrefix}-altar-luz` as SlotId);
      slotsToDestroy.push(`${enemyPrefix}-altar-luz` as SlotId);
    } else if (col === 3) {
      slotsToDestroy.push(`${playerPrefix}-altar-sombra` as SlotId);
      slotsToDestroy.push(`${enemyPrefix}-altar-sombra` as SlotId);
    }

    // Destruir todas las cartas presentes en esos slots
    // EXCEPTO la propia Eclipse (no se destruye a sí misma)
    const destroyed: string[] = [];
    for (const slot of slotsToDestroy) {
      if (slot === ctx.slotId) continue; // Eclipse no se destruye a sí misma
      const card = ctx.engine.state.board[slot];
      if (card) {
        ctx.engine.destroyCard(slot, "deck");
        destroyed.push(`${card.name} (${slot})`);
      }
    }

    if (destroyed.length > 0) {
      ctx.log.push(
        `>> ¡${ctx.card.data.name} desata el ECLIPSE! Columna ${col} arrasada: ${destroyed.join(", ")}.`
      );
    } else {
      ctx.log.push(
        `>> ${ctx.card.data.name}: Columna ${col} vacía, no hay cartas que destruir.`
      );
    }
  },

  // ── EFECTO ALTAR (PASIVO): Todos los monstruos enemigos pierden 2 ATK ──
  getPassiveAtkBonus(ctx: DuelContext, targetCard: CardData, targetSlot: SlotId): number {
    // Solo activa si Eclipse está en un slot de altar
    if (!isAltarSlot(ctx.slotId)) return 0;

    const owner = ctx.card.ownerId;
    const oppPrefix = owner === "player" ? "e" : "p";

    // La carta objetivo debe ser un monstruo enemigo (slot empieza con prefijo oponente)
    if (!targetSlot.startsWith(oppPrefix)) return 0;

    // Solo afecta slots de monstruo (no altares enemigos)
    if (!targetSlot.includes("mon")) return 0;

    // Todos los monstruos enemigos pierden 2 ATK
    return -2;
  },
};
