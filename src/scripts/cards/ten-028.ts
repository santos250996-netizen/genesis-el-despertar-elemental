// ============ TENOTCH XIUHCÓATL — TEN-028 ============
// FERA / FULGUR / ANOMALIA / ATK 18
//
// EFECTO MONSTRUO (on_consume + TRIBUTO): Tributo TENOTCH: sacrifica
//   un aliado TENOTCH → inflige 6 de daño directo a los LP del oponente.
//   → Cuando Xiuhcóatl consume un enemigo (invocación Anomalía):
//     1. Comprobar que hay otro aliado TENOTCH en el campo
//     2. Sacrificarlo
//     3. Infligir 6 daño directo al oponente
//
// EFECTO ALTAR (PASIVO): Cuando un monstruo enemigo es destruido en
//   el carril opuesto, inflige 2 de daño directo al oponente.

import type { CardScript, DuelContext, CardData } from "@/engine/types";
import {
  isAltarSlot,
  sacrificeAllyByArquetipo,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE TENOTCH XIUHCÓATL
// ═══════════════════════════════════════════════════════════════

export const TEN_028: CardScript = {

  // ── EFECTO MONSTRUO: Tributo TENOTCH al consumir → 6 daño directo ──
  onConsume(ctx: DuelContext, _consumedEnemy: CardData): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // Buscar aliado TENOTCH para sacrificar
    const sacrificed = sacrificeAllyByArquetipo(ctx.engine, owner, "TENOTCH", ctx.slotId);

    if (sacrificed) {
      // 6 daño directo al oponente
      const target: "player" | "enemy" = owner === "player" ? "enemy" : "player";
      ctx.engine.dealDamage(target, 6);
      ctx.log.push(`>> ¡Sacrificio Sagrado! ${ctx.card.data.name} sacrifica a ${sacrificed}. ¡6 de daño directo al oponente!`);
    } else {
      ctx.log.push(`>> ${ctx.card.data.name}: No hay aliados TENOTCH para sacrificar.`);
    }
  },

  // ── EFECTO ALTAR (PASIVO): Cuando un enemigo es destruido en el carril opuesto → 2 daño ──
  onEnemyDestroy(ctx: DuelContext): void {
    if (!isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    const target: "player" | "enemy" = owner === "player" ? "enemy" : "player";

    ctx.engine.dealDamage(target, 2);
    ctx.log.push(`>> ¡${ctx.card.data.name} (altar) inflige 2 de daño directo! Enemigo destruido en carril opuesto.`);
  },
};
