// ============ CONDITION CHECKER ============
// Verifica si las condiciones declaradas en EfectoDescriptor se cumplen.
// Todas las condiciones son evaluadas contra el estado actual del tablero.

import type { ConditionType, SlotId, CardData, RazaTipo, Atributo } from "./types";

/**
 * Verifica si una condición se cumple dado el estado del tablero y la carta fuente.
 * @param condition - La condición a evaluar (del EfectoDescriptor)
 * @param sourceCard - La carta que genera el efecto
 * @param sourceSlot - El slot donde está la carta fuente
 * @param board - El estado actual del tablero
 * @param owner - "player" o "enemy" (quién controla la carta fuente)
 */
export function checkCondition(
  condition: ConditionType | undefined,
  sourceCard: CardData,
  sourceSlot: SlotId,
  board: Record<SlotId, CardData | null>,
  owner: "player" | "enemy"
): boolean {
  if (!condition || condition === "none") return true;

  const prefix = owner === "player" ? "p" : "e";
  const altarLuz = `${prefix}-altar-luz` as SlotId;
  const altarSombra = `${prefix}-altar-sombra` as SlotId;

  switch (condition) {
    case "has_celestial_altar": {
      // Verifica si hay un altar con carta atributo CELESTIAL activo
      // NO basta con que el slot tenga carta — la carta debe ser CELESTIAL
      const luzCard = board[altarLuz];
      const sombraCard = board[altarSombra];
      return luzCard?.atributo === "CELESTIAL" || sombraCard?.atributo === "CELESTIAL";
    }

    case "has_umbral_altar": {
      // Verifica si hay un altar con carta atributo UMBRAL activo
      // NO basta con que el slot tenga carta — la carta debe ser UMBRAL
      const luzCard2 = board[altarLuz];
      const sombraCard2 = board[altarSombra];
      return luzCard2?.atributo === "UMBRAL" || sombraCard2?.atributo === "UMBRAL";
    }

    case "has_both_altars": {
      // Verifica si ambos altares están activos
      return board[altarLuz] !== null && board[altarSombra] !== null;
    }

    case "has_matching_altar": {
      // Verifica si hay un altar con el mismo atributo que la carta fuente
      const atributo = sourceCard.atributo;
      if (!atributo) return false;
      const luzCard = board[altarLuz];
      const sombraCard = board[altarSombra];
      if (luzCard && luzCard.atributo === atributo) return true;
      if (sombraCard && sombraCard.atributo === atributo) return true;
      // También verificar por raza_tipo del altar
      const raza = sourceCard.raza_tipo;
      if (luzCard && luzCard.raza_tipo === raza) return true;
      if (sombraCard && sombraCard.raza_tipo === raza) return true;
      return false;
    }

    case "enemy_lower_atk": {
      // Verifica si el monstruo enemigo en la columna opuesta tiene menos ATK
      const col = parseInt(sourceSlot.split("-")[2]);
      const enemyPrefix = owner === "player" ? "e" : "p";
      const enemySlot = `${enemyPrefix}-mon-${col}` as SlotId;
      const enemyCard = board[enemySlot];
      if (!enemyCard) return false;
      return sourceCard.atk > enemyCard.atk;
    }

    case "controls_altar": {
      // Verifica si el controlador tiene al menos un altar activo
      return board[altarLuz] !== null || board[altarSombra] !== null;
    }

    case "self_is_altar": {
      // Verifica si la carta está en un slot de altar
      return sourceSlot.includes("altar");
    }

    case "self_is_monster": {
      // Verifica si la carta está en un slot de monstruo
      return sourceSlot.includes("mon");
    }

    default:
      return true;
  }
}

/**
 * Verifica restricción de raza para ANOMALÍA:
 * El monstruo enemigo a consumir debe ser de la misma raza que la carta invocada.
 */
export function checkAnomaliaRazaRestriction(
  cardToSummon: CardData,
  enemyMonster: CardData
): boolean {
  const requiredRaza = cardToSummon.raza_tipo;
  if (!requiredRaza) return true; // Si no tiene raza, no hay restricción
  return enemyMonster.raza_tipo === requiredRaza;
}

/**
 * Verifica restricción de raza para CORRUPCIÓN:
 * El monstruo sacrificado en columna 3 debe ser de la misma raza que la carta invocada.
 */
export function checkCorrupcionRazaRestriction(
  cardToSummon: CardData,
  sacrificeMonster: CardData
): boolean {
  const requiredRaza = cardToSummon.raza_tipo;
  if (!requiredRaza) return true;
  return sacrificeMonster.raza_tipo === requiredRaza;
}

/**
 * Verifica restricción de raza para ECLIPSE:
 * Al menos uno de los altares debe contener una carta de la misma raza que la carta invocada.
 */
export function checkEclipseRazaRestriction(
  cardToSummon: CardData,
  board: Record<SlotId, CardData | null>,
  owner: "player" | "enemy"
): boolean {
  const requiredRaza = cardToSummon.raza_tipo;
  if (!requiredRaza) return true;
  const prefix = owner === "player" ? "p" : "e";
  const altarLuz = board[`${prefix}-altar-luz` as SlotId];
  const altarSombra = board[`${prefix}-altar-sombra` as SlotId];
  if (altarLuz && altarLuz.raza_tipo === requiredRaza) return true;
  if (altarSombra && altarSombra.raza_tipo === requiredRaza) return true;
  return false;
}

/**
 * Verifica restricción de raza para GÉNESIS:
 * Al menos uno de los altares debe contener una carta de la misma raza que la carta invocada.
 */
export function checkGenesisRazaRestriction(
  cardToSummon: CardData,
  board: Record<SlotId, CardData | null>,
  owner: "player" | "enemy"
): boolean {
  const requiredRaza = cardToSummon.raza_tipo;
  if (!requiredRaza) return true;
  const prefix = owner === "player" ? "p" : "e";
  const altarLuz = board[`${prefix}-altar-luz` as SlotId];
  const altarSombra = board[`${prefix}-altar-sombra` as SlotId];
  if (altarLuz && altarLuz.raza_tipo === requiredRaza) return true;
  if (altarSombra && altarSombra.raza_tipo === requiredRaza) return true;
  return false;
}
