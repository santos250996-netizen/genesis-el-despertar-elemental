// ============ NIGROMANTE SIN ROSTRO — UMB-011 ============
// NECRO / UMBRAL / ANOMALÍA / ATK 15
//
// EFECTO MONSTRUO: Se invoca consumiendo un monstruo enemigo.
//   Al consumir, recupera 1 carta del cementerio (fondo del mazo).
//   → Cuando Nigromante consume un enemigo (invocación Anomalía):
//     1. Comprobar que está en slot de monstruo
//     2. Recuperar la última carta del mazo (fondo = cementerio)
//     3. Añadirla a la mano
//
// EFECTO ALTAR (TURNO): Una vez por turno, si un monstruo UMBRAL es
//   destruido en este carril, inflige 3 de daño directo al oponente.
//   → Cuando Nigromante está en slot de altar y un aliado UMBRAL es
//     destruido en la misma columna:
//     1. Comprobar que no se usó este turno (once/turn)
//     2. Comprobar que la carta destruida es UMBRAL
//     3. Comprobar que está en la columna del altar
//     4. Infligir 3 daño directo

import type { CardScript, DuelContext, CardData } from "@/engine/types";
import {
  isAltarSlot,
  getAltarColumn,
  getMonsterSlot,
  isOncePerTurnUsed,
  markOncePerTurnUsed,
  recoverAnyFromDeck,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE NIGROMANTE SIN ROSTRO
// ═══════════════════════════════════════════════════════════════

export const UMB_011: CardScript = {

  // ── EFECTO MONSTRUO: Al consumir, recupera carta del cementerio ──
  onConsume(ctx: DuelContext, consumedEnemy: CardData): void {
    // Solo activa si está en modo monstruo (no en altar)
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // Recuperar la última carta del fondo del mazo (= cementerio)
    const recoveredName = recoverAnyFromDeck(ctx.engine, owner);
    if (recoveredName) {
      ctx.log.push(
        `>> ¡${ctx.card.data.name} absorbe el poder de ${consumedEnemy.name} y recupera ${recoveredName} del cementerio!`
      );
    } else {
      ctx.log.push(
        `>> ${ctx.card.data.name}: No hay cartas en el cementerio para recuperar.`
      );
    }
  },

  // ── EFECTO ALTAR (TURNO): Si UMBRAL destruido en carril → 3 daño ──
  // Este efecto se dispara cuando un aliado es destruido en la columna
  // del altar. Usamos onAllyDestroy para detectar la destrucción.
  onAllyDestroy(ctx: DuelContext): void {
    // Solo activa si Nigromante está en slot de altar
    if (!isAltarSlot(ctx.slotId)) return;

    // Comprobar si ya se usó este turno
    if (isOncePerTurnUsed(ctx.engine, ctx.slotId)) {
      ctx.log.push(`>> ${ctx.card.data.name} (altar): Efecto ya usado este turno.`);
      return;
    }

    // WORKAROUND: onAllyDestroy no recibe información sobre qué carta
    // fue destruida ni en qué slot. Para verificar que la destrucción
    // ocurrió en la columna del altar, comprobamos si el slot de monstruo
    // en la columna del altar está vacío (indicando que una carta fue
    // destruida ahí recientemente). Esto asume que el motor llama
    // onAllyDestroy después de remover la carta del tablero.
    //
    // Limitación conocida: no podemos verificar que la carta destruida
    // fuera UMBRAL, ya que ya fue removida del tablero. Idealmente el
    // motor debería pasar (destroyedCard, destroyedSlot) a onAllyDestroy.
    const owner = ctx.card.ownerId;
    const altarCol = getAltarColumn(ctx.slotId);
    const monSlot = getMonsterSlot(owner, altarCol);

    // Si el slot de monstruo en la columna del altar está vacío,
    // asumimos que un aliado fue destruido ahí recientemente
    const monCard = ctx.engine.state.board[monSlot];
    if (monCard !== null && monCard !== undefined) {
      // Todavía hay carta en la columna, no fue destruida ahí
      return;
    }

    // ¡Un aliado fue destruido en la columna del altar!
    // Infligir 3 daño directo al oponente
    const target: "player" | "enemy" = owner === "player" ? "enemy" : "player";
    ctx.engine.dealDamage(target, 3);
    markOncePerTurnUsed(ctx.engine, ctx.slotId);
    ctx.log.push(
      `>> ¡${ctx.card.data.name} (altar) siente la muerte en su carril! 3 de daño directo al oponente.`
    );
  },
};
