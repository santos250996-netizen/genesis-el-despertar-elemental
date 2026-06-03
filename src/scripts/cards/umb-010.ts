// ============ ESPECTRO DEL ABISMO — UMB-010 ============
// NECRO / UMBRAL / NORMAL / ATK 9
//
// EFECTO MONSTRUO: Al ser invocado, destruye la carta del altar enemigo
//   si controlas un altar UMBRAL.
//   → Cuando Espectro es invocado en slot de monstruo:
//     1. Comprobar que controlas un altar UMBRAL activo
//     2. Buscar un altar enemigo con carta
//     3. Destruir esa carta de altar
//
// EFECTO ALTAR (RESPUESTA): Cuando un enemigo ataca en este carril,
//   reduce 2 ATK al atacante.
//   → Cuando un monstruo enemigo ataca en la columna del altar:
//     1. Verificar que el ataque es en la columna del altar
//     2. Reducir 2 ATK al monstruo atacante enemigo

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  getAltarColumn,
  hasUmbralAltar,
  modifyTempAtk,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE ESPECTRO DEL ABISMO
// ═══════════════════════════════════════════════════════════════

export const UMB_010: CardScript = {

  // ── EFECTO MONSTRUO: Al ser invocado, destruye un altar enemigo ──
  onSummon(ctx: DuelContext): void {
    // Solo activa si está en modo monstruo
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // Condición: debe controlar un altar UMBRAL
    if (!hasUmbralAltar(ctx.engine, owner)) {
      ctx.log.push(`>> ${ctx.card.data.name}: No hay altar UMBRAL activo, efecto no se activa.`);
      return;
    }

    // Buscar un altar enemigo con carta para destruir
    const oppPrefix = owner === "player" ? "e" : "p";
    const altarSlots: SlotId[] = [
      `${oppPrefix}-altar-luz` as SlotId,
      `${oppPrefix}-altar-sombra` as SlotId,
    ];

    for (const altarSlot of altarSlots) {
      const altarCard = ctx.engine.state.board[altarSlot];
      if (altarCard) {
        ctx.engine.destroyCard(altarSlot, "deck");
        ctx.log.push(
          `>> ¡${ctx.card.data.name} destruye ${altarCard.name} del altar enemigo!`
        );
        return; // Solo destruye un altar
      }
    }

    ctx.log.push(`>> ${ctx.card.data.name}: No hay cartas en altares enemigos para destruir.`);
  },

  // ── EFECTO ALTAR (RESPUESTA): Enemigo ataca en carril → -2 ATK ──
  onEnemyAttack(ctx: DuelContext, attackColumn: number): void {
    // Solo activa si Espectro está en slot de altar
    if (!isAltarSlot(ctx.slotId)) return;

    const altarCol = getAltarColumn(ctx.slotId);

    // Solo activa si el ataque es en la columna del altar
    if (attackColumn !== altarCol) return;

    // Reducir 2 ATK al monstruo atacante enemigo
    const owner = ctx.card.ownerId;
    const oppPrefix = owner === "player" ? "e" : "p";
    const attackerSlot = `${oppPrefix}-mon-${attackColumn}` as SlotId;

    modifyTempAtk(ctx.engine, attackerSlot, -2);
    ctx.log.push(
      `>> ¡${ctx.card.data.name} (altar) responde al ataque! El atacante en columna ${attackColumn} pierde 2 ATK.`
    );
  },
};
