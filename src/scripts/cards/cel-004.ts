// ============ EOS, ECO DEL ALBA — CEL-004 ============
// ÁNIMA / CELESTIAL / NORMAL / ATK 7
//
// EFECTO MONSTRUO: Al ser destruida, añade 1 carta CELESTIAL de tu
//   mazo a tu mano.
//   → Cuando Eos es destruida estando en slot de monstruo:
//     1. Comprobar que está en slot de monstruo (no altar)
//     2. Buscar una carta CELESTIAL en el mazo del owner
//     3. Añadirla a la mano
//
// EFECTO ALTAR (PASIVO): Cuando un monstruo CELESTIAL es invocado en
//   este carril, gana 1 contador_escudo.
//   → Cuando Eos está en slot de altar y un aliado CELESTIAL es
//     invocado en la misma columna:
//     1. Verificar columna y atributo
//     2. Añadir 1 escudo al monstruo invocado

import type { CardScript, DuelContext, CardData, SlotId } from "@/engine/types";
import {
  isAltarSlot,
  isCelestial,
  getAltarColumn,
  getMonsterSlot,
  recoverFromDeck,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE EOS
// ═══════════════════════════════════════════════════════════════

export const CEL_004: CardScript = {

  // ── EFECTO MONSTRUO: Al ser destruida, recupera 1 CELESTIAL del mazo ──
  onDestroy(ctx: DuelContext): void {
    // Solo activa si Eos está en modo monstruo (no en altar)
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // Buscar y recuperar 1 carta CELESTIAL del mazo
    const recoveredName = recoverFromDeck(ctx.engine, owner, "CELESTIAL");
    if (recoveredName) {
      ctx.log.push(`>> ¡${ctx.card.data.name} activa su efecto al ser destruida! Recupera ${recoveredName} del mazo.`);
    } else {
      ctx.log.push(`>> ${ctx.card.data.name}: No hay cartas CELESTIAL en el mazo para recuperar.`);
    }
  },

  // ── EFECTO ALTAR (PASIVO): Cuando invocan un CELESTIAL en este
  //    carril, gana 1 contador_escudo ──
  onAllySummon(ctx: DuelContext, summonedCard: CardData, summonedSlot: SlotId): void {
    // Solo activa si Eos está en slot de altar
    if (!isAltarSlot(ctx.slotId)) return;

    // La carta invocada debe ser CELESTIAL
    if (!isCelestial(summonedCard)) return;

    const owner = ctx.card.ownerId;
    const altarCol = getAltarColumn(ctx.slotId);
    const expectedMonSlot = getMonsterSlot(owner, altarCol);

    // La carta invocada debe estar en la misma columna que el altar
    if (summonedSlot !== expectedMonSlot) return;

    // ¡Todo se cumple! Añadir 1 escudo al monstruo invocado
    ctx.engine.addShield(summonedSlot);
    ctx.log.push(`>> ¡${ctx.card.data.name} (altar) otorga escudo a ${summonedCard.name}! Contador de escudo +1.`);
  },
};
