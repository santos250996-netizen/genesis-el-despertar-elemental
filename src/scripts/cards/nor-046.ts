// ============ NÓRDICO KRAKEN — NOR-046 ============
// MARINA / ABIS / SUBTERRANEO / ATK 12
//
// EFECTO MONSTRUO 1 (on_destroy_enemy + SAQUEO): Al destruir un
//   monstruo enemigo, roba 2 cartas.
//   → draw(owner, 2)
//
// EFECTO MONSTRUO 2 (on_flip): Al ser volteada, inflige 4 daño
//   directo a los LP del oponente.
//   → dealDamage(opponent, 4)
//
// EFECTO ALTAR (PASIVO): Cuando un monstruo ABIS es invocado en
//   este carril, gana 1 contador de escudo.
//   → onAllySummon: Si summonedCard tiene atributo ABIS y está
//     en la columna del altar, addShield(summonedSlot)

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  cardHasAttribute,
  getAltarColumn,
  getMonsterSlot,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE NÓRDICO KRAKEN
// ═══════════════════════════════════════════════════════════════

export const NOR_046: CardScript = {

  // ── EFECTO MONSTRUO 1: Saqueo NÓRDICO — robar 2 cartas ──
  onDestroyEnemy(ctx: DuelContext, destroyedEnemy: CardData): void {
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    ctx.engine.draw(owner, 2);
    ctx.log.push(`>> ¡Saqueo Nórdico! ${ctx.card.data.name} saquea a ${destroyedEnemy.name}. ¡Roba 2 cartas!`);
  },

  // ── EFECTO MONSTRUO 2: Al ser volteada, 4 daño directo al oponente ──
  onFlip(ctx: DuelContext): void {
    if (isAltarSlot(ctx.slotId)) return;

    const opponent = ctx.card.ownerId === "player" ? "enemy" : "player";
    ctx.engine.dealDamage(opponent, 4);
    ctx.log.push(`>> ¡${ctx.card.data.name} emerge de las profundidades! 4 daño directo al oponente.`);
  },

  // ── EFECTO ALTAR (PASIVO): ABIS invocado en este carril gana 1 escudo ──
  onAllySummon(ctx: DuelContext, summonedCard: CardData, summonedSlot: SlotId): void {
    if (!isAltarSlot(ctx.slotId)) return;

    // Verificar que la carta invocada tiene atributo ABIS
    if (!cardHasAttribute(summonedCard, "ABIS")) return;

    // Verificar que está en la columna del altar
    const owner = ctx.card.ownerId;
    const altarCol = getAltarColumn(ctx.slotId);
    const expectedMonSlot = getMonsterSlot(owner, altarCol);
    if (summonedSlot !== expectedMonSlot) return;

    // Dar 1 contador de escudo
    ctx.engine.addShield(summonedSlot);
    ctx.log.push(`>> ¡${ctx.card.data.name} (altar) protege a ${summonedCard.name}! +1 contador de escudo.`);
  },
};
