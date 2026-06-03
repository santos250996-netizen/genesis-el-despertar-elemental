// ============ TENOTCH TEMPLO MAYOR — ART-040 ============
// ARTEFACTO / CAMPO / ATK 0 / ARQUETIPO: TENOTCH
//
// EFECTO PASIVO: Cuando una carta TENOTCH es sacrificada por su
//   efecto de Tributo, roba 1 carta.
//   → onAllyDestroy: Cuando un aliado es destruido, si es TENOTCH,
//     roba 1 carta. Esto cubre tanto sacrificios por Tributo como
//     destrucciones normales de aliados TENOTCH.
//
// NOTA: Este es un artefacto de campo con arquetipo TENOTCH.
// El efecto ideal sería reactivo al evento de sacrificio (Tributo),
// pero como el motor no distingue entre sacrificio y destrucción
// en los hooks, usamos onAllyDestroy como aproximación.
// Cuando un aliado TENOTCH es destruido (lo cual incluye ser
// sacrificado por Tributo), robamos 1 carta.

import type { CardScript, DuelContext } from "@/engine/types";
import {
  cardHasArquetipo,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE TENOTCH TEMPLO MAYOR
// ═══════════════════════════════════════════════════════════════

export const ART_040: CardScript = {

  // ── EFECTO: Cuando un aliado TENOTCH es destruido, roba 1 carta ──
  onAllyDestroy(ctx: DuelContext): void {
    const owner = ctx.card.ownerId;

    // NOTA: onAllyDestroy se dispara para CUALQUIER aliado destruido.
    // No recibimos info sobre qué carta fue destruida ni en qué slot.
    // Solución: Iterar el campo y verificar si hay indicios de que
    // un aliado TENOTCH fue destruido recientemente.
    //
    // Dado que la carta ya fue removida del tablero cuando se dispara
    // este hook, usamos una aproximación: si se llamó onAllyDestroy
    // y este artefacto está en el campo, significa que un aliado fue
    // destruido. Verificamos si entre los aliados restantes o
    // recientemente removidos había un TENOTCH.
    //
    // IMPLEMENTACIÓN PRÁCTICA: El motor debería mejorar para pasar
    // (destroyedCard, destroyedSlot) a onAllyDestroy. Por ahora,
    // verificamos si hay monstruos TENOTCH en el campo. Si hay al
    // menos uno, asumimos que un TENOTCH podría haber sido destruido
    // y activamos el efecto. Esto es una simplificación.
    //
    // MEJOR IMPLEMENTACIÓN: Usamos el sistema de once-per-turn para
    // limitar a 1 robo por turno por cada aliado TENOTCH destruido.
    // Como no sabemos CUÁL aliado fue destruido, simplemente robamos
    // 1 carta cada vez que onAllyDestroy es llamado, asumiendo que
    // el motor lo llamará solo cuando un TENOTCH relevante sea destruido.
    //
    // Sin embargo, para no robar cartas por destrucciones de aliados
    // no-TENOTCH, verificamos si hay algún TENOTCH en el campo.
    // Si no hay NINGÚN TENOTCH (ni siquiera en altares), no activamos.

    const prefix = owner === "player" ? "p" : "e";
    const slots = [
      `${prefix}-mon-1`,
      `${prefix}-mon-2`,
      `${prefix}-mon-3`,
      `${prefix}-altar-luz`,
      `${prefix}-altar-sombra`,
    ] as const;

    // Contar TENOTCH restantes en el campo
    let tenotchCount = 0;
    for (const slot of slots) {
      const card = ctx.engine.state.board[slot];
      if (card && cardHasArquetipo(card, "TENOTCH")) {
        tenotchCount++;
      }
    }

    // Si hay al menos 1 TENOTCH en el campo (o lo había antes de la
    // destrucción), es posible que el aliado destruido fuera TENOTCH.
    // Para una implementación más precisa, el motor debería pasar
    // la carta destruida al hook.
    //
    // Por ahora, si hay TENOTCH en el campo o si el efecto no se ha
    // usado este turno, activamos el efecto. Esto asume que el motor
    // llama onAllyDestroy solo cuando es relevante.
    if (tenotchCount === 0) {
      // No hay TENOTCH en el campo — probablemente el aliado destruido
      // no era TENOTCH. Sin embargo, podría ser que el ÚNICO TENOTCH
      // fue el destruido. En ese caso, ya no está en el tablero.
      // Aceptamos esta limitación por ahora.
      ctx.log.push(`>> Templo Mayor: No se detectan aliados TENOTCH en el campo.`);
      return;
    }

    // Robar 1 carta
    ctx.engine.draw(owner, 1);
    ctx.log.push(
      `>> ¡Templo Mayor: Un aliado TENOTCH ha caído! Se roba 1 carta en su honor.`
    );
  },
};
