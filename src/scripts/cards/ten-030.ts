// ============ TENOTCH AHUIZOTL — TEN-030 ============
// MARINA / ABIS / SUBTERRANEO / ATK 12
//
// EFECTO MONSTRUO (on_flip + TRIBUTO): Tributo TENOTCH: sacrifica
//   un aliado TENOTCH → roba 1 carta e inflige 3 de daño directo
//   al oponente.
//   → Cuando Ahuizotl es volteada (Subterráneo: enemigo ataca su columna):
//     1. Comprobar que hay otro aliado TENOTCH en el campo
//     2. Sacrificarlo
//     3. Robar 1 carta
//     4. Infligir 3 daño directo al oponente
//
// EFECTO ALTAR (PASIVO): Cuando un monstruo ABIS es invocado en este
//   carril, gana 1 contador_escudo.

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  cardHasAttribute,
  getAltarColumn,
  getMonsterSlot,
  sacrificeAllyByArquetipo,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE TENOTCH AHUIZOTL
// ═══════════════════════════════════════════════════════════════

export const TEN_030: CardScript = {

  // ── EFECTO MONSTRUO: Tributo TENOTCH al ser volteada → robar + 3 daño ──
  onFlip(ctx: DuelContext): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // Buscar aliado TENOTCH para sacrificar
    const sacrificed = sacrificeAllyByArquetipo(ctx.engine, owner, "TENOTCH", ctx.slotId);

    if (sacrificed) {
      // Robar 1 carta
      ctx.engine.draw(owner, 1);
      // 3 daño directo al oponente
      const target: "player" | "enemy" = owner === "player" ? "enemy" : "player";
      ctx.engine.dealDamage(target, 3);
      ctx.log.push(`>> ¡Sacrificio Sagrado! ${ctx.card.data.name} sacrifica a ${sacrificed}. Roba 1 carta e inflige 3 de daño directo.`);
    } else {
      ctx.log.push(`>> ${ctx.card.data.name}: No hay aliados TENOTCH para sacrificar.`);
    }
  },

  // ── EFECTO ALTAR (PASIVO): Cuando invocan un ABIS en este carril → +1 escudo ──
  onAllySummon(ctx: DuelContext, summonedCard: CardData, summonedSlot: SlotId): void {
    if (!isAltarSlot(ctx.slotId)) return;

    // La carta invocada debe ser ABIS
    if (!cardHasAttribute(summonedCard, "ABIS")) return;

    // La carta invocada debe estar en la misma columna que el altar
    const owner = ctx.card.ownerId;
    const altarCol = getAltarColumn(ctx.slotId);
    const expectedMonSlot = getMonsterSlot(owner, altarCol);
    if (summonedSlot !== expectedMonSlot) return;

    // ¡Todo se cumple! Añadir 1 escudo al monstruo invocado
    ctx.engine.addShield(summonedSlot);
    ctx.log.push(`>> ¡${ctx.card.data.name} (altar) otorga escudo a ${summonedCard.name}! Contador de escudo +1.`);
  },
};
