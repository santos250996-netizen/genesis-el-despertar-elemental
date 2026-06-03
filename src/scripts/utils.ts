// ============ SHARED SCRIPT UTILITIES ============
// Funciones helper reutilizables para todos los card scripts.
// Cada carta importa lo que necesita y llama a la lógica del motor.

import type { CardData, SlotId, Atributo, DuelEngine } from "@/engine/types";

// ═══════════════════════════════════════════════════════════════
// ALTAR CHECKS
// ═══════════════════════════════════════════════════════════════

/**
 * Comprueba si el owner tiene un altar con una carta del atributo dado.
 * Un "altar CELESTIAL activo" = slot de altar con carta atributo CELESTIAL.
 */
export function hasAltarWithAttribute(
  engine: DuelEngine,
  owner: "player" | "enemy",
  atributo: Atributo
): boolean {
  const prefix = owner === "player" ? "p" : "e";
  const luzSlot = `${prefix}-altar-luz` as SlotId;
  const sombraSlot = `${prefix}-altar-sombra` as SlotId;
  const board = engine.state.board;

  const luzCard = board[luzSlot];
  const sombraCard = board[sombraSlot];

  return luzCard?.atributo === atributo || sombraCard?.atributo === atributo;
}

/** Shortcut: ¿hay altar CELESTIAL activo? */
export function hasCelestialAltar(engine: DuelEngine, owner: "player" | "enemy"): boolean {
  return hasAltarWithAttribute(engine, owner, "CELESTIAL");
}

/** Shortcut: ¿hay altar UMBRAL activo? */
export function hasUmbralAltar(engine: DuelEngine, owner: "player" | "enemy"): boolean {
  return hasAltarWithAttribute(engine, owner, "UMBRAL");
}

/** ¿Tiene ambos altares activos (con cartas)? */
export function hasBothAltars(engine: DuelEngine, owner: "player" | "enemy"): boolean {
  const prefix = owner === "player" ? "p" : "e";
  const board = engine.state.board;
  return board[`${prefix}-altar-luz`] !== null && board[`${prefix}-altar-sombra`] !== null;
}

/** ¿Tiene algún altar activo? */
export function hasAnyAltar(engine: DuelEngine, owner: "player" | "enemy"): boolean {
  const prefix = owner === "player" ? "p" : "e";
  const board = engine.state.board;
  return board[`${prefix}-altar-luz`] !== null || board[`${prefix}-altar-sombra`] !== null;
}

// ═══════════════════════════════════════════════════════════════
// COLUMN / SLOT HELPERS
// ═══════════════════════════════════════════════════════════════

/** Obtiene la columna (1, 2, 3) de un slotId */
export function getColumn(slotId: SlotId): number {
  return parseInt(slotId.split("-")[2]);
}

/** Obtiene la columna de un slot de altar (luz=1, sombra=3) */
export function getAltarColumn(slotId: SlotId): number {
  if (slotId.includes("luz")) return 1;
  if (slotId.includes("sombra")) return 3;
  return 0;
}

/** Obtiene el slot de monstruo para un owner y columna */
export function getMonsterSlot(owner: "player" | "enemy", col: number): SlotId {
  const prefix = owner === "player" ? "p" : "e";
  return `${prefix}-mon-${col}` as SlotId;
}

/** Obtiene el slot de altar para un owner y tipo (luz/sombra) */
export function getAltarSlot(owner: "player" | "enemy", type: "luz" | "sombra"): SlotId {
  const prefix = owner === "player" ? "p" : "e";
  return `${prefix}-altar-${type}` as SlotId;
}

/** ¿Es un slot de altar? */
export function isAltarSlot(slotId: SlotId): boolean {
  return slotId.includes("altar");
}

/** ¿Es un slot de monstruo? */
export function isMonsterSlot(slotId: SlotId): boolean {
  return slotId.includes("mon");
}

// ═══════════════════════════════════════════════════════════════
// CARD ATTRIBUTE CHECKS
// ═══════════════════════════════════════════════════════════════

/** ¿La carta tiene este atributo? */
export function cardHasAttribute(card: CardData, atributo: Atributo): boolean {
  return card.atributo === atributo;
}

/** ¿La carta pertenece a este arquetipo? */
export function cardHasArquetipo(card: CardData, arquetipo: string): boolean {
  return card.arquetipo === arquetipo;
}

/** Shortcut: ¿es CELESTIAL? */
export function isCelestial(card: CardData): boolean {
  return cardHasAttribute(card, "CELESTIAL");
}

/** Shortcut: ¿es UMBRAL? */
export function isUmbral(card: CardData): boolean {
  return cardHasAttribute(card, "UMBRAL");
}

// ═══════════════════════════════════════════════════════════════
// ATK MODIFICATION (TEMPORARY vs PERMANENT)
// ═══════════════════════════════════════════════════════════════

/**
 * Modifica ATK temporalmente (solo dura la fase de batalla actual).
 * Usa el sistema tempAtkBonus de EffectState.
 * Se resetea automáticamente al final de attackAll().
 */
export function modifyTempAtk(
  engine: DuelEngine,
  slotId: SlotId,
  delta: number
): void {
  const cur = engine.state.effects.tempAtkBonus[slotId] ?? 0;
  engine.state.effects.tempAtkBonus = {
    ...engine.state.effects.tempAtkBonus,
    [slotId]: cur + delta,
  };
}

/**
 * Modifica ATK permanentemente (persiste hasta fin de turno o más).
 * Usa el sistema atkBonus de EffectState.
 */
export function modifyPermanentAtk(
  engine: DuelEngine,
  slotId: SlotId,
  delta: number
): void {
  engine.modifyAtk(slotId, delta);
}

// ═══════════════════════════════════════════════════════════════
// ALTAR PASSIVE BONUS HELPER
// ═══════════════════════════════════════════════════════════════

/**
 * Helper para implementar getPassiveAtkBonus en scripts de altar.
 * Verifica si el altar está en la columna correcta y si la carta objetivo
 * cumple con el atributo requerido.
 *
 * @param altarSlot - El slot del altar
 * @param owner - Quién controla el altar
 * @param targetCard - La carta cuyo ATK se está computando
 * @param targetSlot - El slot de la carta objetivo
 * @param requiredAttribute - El atributo que debe tener la carta objetivo
 * @param bonusAmount - Cuánto ATK bonus otorgar
 * @returns El bonus de ATK
 */
export function altarBonusForColumn(
  altarSlot: SlotId,
  owner: "player" | "enemy",
  targetCard: CardData,
  targetSlot: SlotId,
  requiredAttribute: Atributo,
  bonusAmount: number
): number {
  // La carta objetivo debe tener el atributo requerido
  if (targetCard.atributo !== requiredAttribute) return 0;

  // La carta objetivo debe estar en la misma columna que el altar
  const altarCol = getAltarColumn(altarSlot);
  const expectedMonSlot = getMonsterSlot(owner, altarCol);

  if (targetSlot !== expectedMonSlot) return 0;

  return bonusAmount;
}

/**
 * Variante de altarBonusForColumn que aplica a TODOS los aliados
 * del mismo dueño (no solo la columna del altar).
 */
export function altarBonusForAllAllies(
  targetCard: CardData,
  requiredAttribute: Atributo | null,
  bonusAmount: number
): number {
  if (requiredAttribute && targetCard.atributo !== requiredAttribute) return 0;
  return bonusAmount;
}

// ═══════════════════════════════════════════════════════════════
// BOARD ITERATION
// ═══════════════════════════════════════════════════════════════

/** Obtiene todas las cartas de monstruo de un owner */
export function getAllMonsters(
  engine: DuelEngine,
  owner: "player" | "enemy"
): { card: CardData; slot: SlotId }[] {
  const prefix = owner === "player" ? "p" : "e";
  const result: { card: CardData; slot: SlotId }[] = [];
  for (const col of [1, 2, 3] as const) {
    const slot = `${prefix}-mon-${col}` as SlotId;
    const card = engine.state.board[slot];
    if (card) result.push({ card, slot });
  }
  return result;
}

/** Obtiene el monstruo en la columna opuesta */
export function getOpposingMonster(
  engine: DuelEngine,
  sourceSlot: SlotId,
  sourceOwner: "player" | "enemy"
): { card: CardData; slot: SlotId } | null {
  const col = getColumn(sourceSlot);
  const oppPrefix = sourceOwner === "player" ? "e" : "p";
  const oppSlot = `${oppPrefix}-mon-${col}` as SlotId;
  const oppCard = engine.state.board[oppSlot];
  if (oppCard) return { card: oppCard, slot: oppSlot };
  return null;
}

// ═══════════════════════════════════════════════════════════════
// ONCE PER TURN
// ═══════════════════════════════════════════════════════════════

/**
 * Comprueba si un slot ya usó su efecto "una vez por turno" este turno.
 */
export function isOncePerTurnUsed(engine: DuelEngine, slotId: SlotId): boolean {
  return engine.state.effects.oncePerTurnUsed.includes(slotId);
}

/**
 * Marca un slot como "ya usó su efecto este turno".
 */
export function markOncePerTurnUsed(engine: DuelEngine, slotId: SlotId): void {
  if (!isOncePerTurnUsed(engine, slotId)) {
    engine.state.effects.oncePerTurnUsed = [
      ...engine.state.effects.oncePerTurnUsed,
      slotId,
    ];
  }
}

// ═══════════════════════════════════════════════════════════════
// PREVENT DESTROY THIS TURN (Tributo / Saqueo)
// ═══════════════════════════════════════════════════════════════

/**
 * Marca un slot como "no puede ser destruido este turno".
 * Usado por efectos de Tributo (Tonatiuh) y Saqueo (Heimdall).
 */
export function markPreventDestroy(engine: DuelEngine, slotId: SlotId): void {
  const arr = engine.state.effects.preventDestroyThisTurn;
  if (!arr.includes(slotId)) {
    engine.state.effects.preventDestroyThisTurn = [...arr, slotId];
  }
}

/**
 * Comprueba si un slot está protegido contra destrucción este turno.
 */
export function isPreventDestroy(engine: DuelEngine, slotId: SlotId): boolean {
  return engine.state.effects.preventDestroyThisTurn.includes(slotId);
}

/**
 * Marca TODOS los monstruos de un owner como protegidos contra
 * destrucción este turno. Usado por Heimdall (Saqueo NÓRDICO).
 */
export function markAllAlliesPreventDestroy(engine: DuelEngine, owner: "player" | "enemy"): void {
  const prefix = owner === "player" ? "p" : "e";
  const slots: SlotId[] = [
    `${prefix}-mon-1` as SlotId,
    `${prefix}-mon-2` as SlotId,
    `${prefix}-mon-3` as SlotId,
    `${prefix}-altar-luz` as SlotId,
    `${prefix}-altar-sombra` as SlotId,
  ];
  for (const slot of slots) {
    if (engine.state.board[slot]) {
      markPreventDestroy(engine, slot);
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// DECK RECOVERY
// ═══════════════════════════════════════════════════════════════

/**
 * Busca una carta del atributo dado en el mazo del owner,
 * la remueve y la añade a la mano.
 * @returns El nombre de la carta recuperada, o null si no se encontró
 */
export function recoverFromDeck(
  engine: DuelEngine,
  owner: "player" | "enemy",
  atributo: Atributo
): string | null {
  const deck = owner === "player"
    ? [...engine.state.playerDeck]
    : [...engine.state.enemyDeck];

  let foundIdx = -1;
  for (let i = deck.length - 1; i >= 0; i--) {
    if (deck[i].atributo === atributo) {
      foundIdx = i;
      break;
    }
  }

  if (foundIdx < 0) return null;

  const recovered = deck.splice(foundIdx, 1)[0];

  if (owner === "player") {
    engine.state.playerDeck = deck;
    engine.state.playerHand = [...engine.state.playerHand, recovered];
  } else {
    engine.state.enemyDeck = deck;
    engine.state.enemyHand = [...engine.state.enemyHand, recovered];
  }

  return recovered.name;
}

/**
 * Busca una carta del arquetipo dado en el mazo del owner,
 * la remueve y la añade a la mano.
 * Usado por Centeotl (recuperar TENOTCH) y Freya (recuperar NÓRDICO).
 * @returns El nombre de la carta recuperada, o null si no se encontró
 */
export function recoverFromDeckByArquetipo(
  engine: DuelEngine,
  owner: "player" | "enemy",
  arquetipo: string
): string | null {
  const deck = owner === "player"
    ? [...engine.state.playerDeck]
    : [...engine.state.enemyDeck];

  let foundIdx = -1;
  for (let i = deck.length - 1; i >= 0; i--) {
    if (deck[i].arquetipo === arquetipo) {
      foundIdx = i;
      break;
    }
  }

  if (foundIdx < 0) return null;

  const recovered = deck.splice(foundIdx, 1)[0];

  if (owner === "player") {
    engine.state.playerDeck = deck;
    engine.state.playerHand = [...engine.state.playerHand, recovered];
  } else {
    engine.state.enemyDeck = deck;
    engine.state.enemyHand = [...engine.state.enemyHand, recovered];
  }

  return recovered.name;
}

/**
 * Busca un aliado del arquetipo dado en el campo del owner
 * y lo sacrifica (remueve al fondo del mazo).
 * Usado por el sistema de Tributo TENOTCH.
 * @returns El nombre del aliado sacrificado, o null si no hay candidato
 */
export function sacrificeAllyByArquetipo(
  engine: DuelEngine,
  owner: "player" | "enemy",
  arquetipo: string,
  excludeSlot: SlotId
): string | null {
  const prefix = owner === "player" ? "p" : "e";
  const slots: SlotId[] = [
    `${prefix}-mon-1` as SlotId,
    `${prefix}-mon-2` as SlotId,
    `${prefix}-mon-3` as SlotId,
    `${prefix}-altar-luz` as SlotId,
    `${prefix}-altar-sombra` as SlotId,
  ];

  for (const slot of slots) {
    if (slot === excludeSlot) continue;
    const card = engine.state.board[slot];
    if (card && card.arquetipo === arquetipo) {
      // Sacrificar: mandar al fondo del mazo
      if (owner === "player") {
        engine.state.playerDeck = [card, ...engine.state.playerDeck];
      } else {
        engine.state.enemyDeck = [card, ...engine.state.enemyDeck];
      }
      engine.state.board = { ...engine.state.board, [slot]: null };
      return card.name;
    }
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════
// CORROSION (DoT con memoria)
// ═══════════════════════════════════════════════════════════════

/**
 * Añade contadores de corrosión a un slot.
 * La corrosión hace daño por turno y marca la carta como infectada.
 */
export function addCorrosion(
  engine: DuelEngine,
  slotId: SlotId,
  amount: number
): void {
  const cur = engine.state.effects.corrosionCounters[slotId] ?? 0;
  engine.state.effects.corrosionCounters = {
    ...engine.state.effects.corrosionCounters,
    [slotId]: cur + amount,
  };
  // Marcar la carta como infectada
  const card = engine.state.board[slotId];
  if (card) {
    engine.state.board = {
      ...engine.state.board,
      [slotId]: { ...card, infectado: true },
    };
  }
}

/**
 * Aplica corrosión a todos los monstruos enemigos.
 * Usado por Mictlantecuhtli (TENOTCH tributo).
 */
export function addCorrosionToAllEnemies(
  engine: DuelEngine,
  owner: "player" | "enemy",
  amount: number
): string[] {
  const oppPrefix = owner === "player" ? "e" : "p";
  const affected: string[] = [];
  for (const col of [1, 2, 3] as const) {
    const slot = `${oppPrefix}-mon-${col}` as SlotId;
    const card = engine.state.board[slot];
    if (card) {
      addCorrosion(engine, slot, amount);
      affected.push(card.name);
    }
  }
  return affected;
}

// ═══════════════════════════════════════════════════════════════
// GRAVEYARD RECOVERY (recuperar del "cementerio" = fondo del mazo)
// ═══════════════════════════════════════════════════════════════

/**
 * Recupera la última carta del mazo (fondo = "cementerio")
 * y la añade a la mano. Usado por Nigromante Sin Rostro.
 * @returns El nombre de la carta recuperada, o null si no hay
 */
export function recoverAnyFromDeck(
  engine: DuelEngine,
  owner: "player" | "enemy"
): string | null {
  if (owner === "player") {
    const deck = [...engine.state.playerDeck];
    if (deck.length === 0) return null;
    // La última carta del array = fondo del mazo = cementerio
    const recovered = deck.pop()!;
    engine.state.playerDeck = deck;
    engine.state.playerHand = [...engine.state.playerHand, recovered];
    return recovered.name;
  } else {
    const deck = [...engine.state.enemyDeck];
    if (deck.length === 0) return null;
    const recovered = deck.pop()!;
    engine.state.enemyDeck = deck;
    engine.state.enemyHand = [...engine.state.enemyHand, recovered];
    return recovered.name;
  }
}

// ═══════════════════════════════════════════════════════════════
// FIELD MANIPULATION (Saqueo NÓRDICO)
// ═══════════════════════════════════════════════════════════════

/**
 * Encuentra un slot de monstruo vacío para un owner.
 * @returns El slotId vacío, o null si no hay
 */
export function findEmptyMonsterSlot(
  engine: DuelEngine,
  owner: "player" | "enemy"
): SlotId | null {
  const prefix = owner === "player" ? "p" : "e";
  for (const col of [1, 2, 3] as const) {
    const slot = `${prefix}-mon-${col}` as SlotId;
    if (!engine.state.board[slot]) return slot;
  }
  return null;
}

/**
 * Roba un monstruo enemigo destruido y lo coloca en tu campo.
 * Implementa el efecto Saqueo NÓRDICO de Hel.
 * Busca la carta en el mazo enemigo (fue enviada ahí al destruirse)
 * y la coloca en un slot vacío del owner.
 *
 * @returns El nombre de la carta robada, o null si no se pudo
 */
export function stealEnemyToField(
  engine: DuelEngine,
  destroyedEnemy: CardData,
  owner: "player" | "enemy"
): string | null {
  // Encontrar slot vacío
  const emptySlot = findEmptyMonsterSlot(engine, owner);
  if (!emptySlot) return null;

  // Buscar la carta en el mazo enemigo (fue añadida al fondo al destruirse)
  const oppPrefix = owner === "player" ? "e" : "p";
  const enemyDeck = oppPrefix === "e"
    ? [...engine.state.enemyDeck]
    : [...engine.state.playerDeck];

  // Buscar por nombre (la carta destruida fue al fondo del mazo enemigo)
  let foundIdx = -1;
  for (let i = 0; i < enemyDeck.length; i++) {
    if (enemyDeck[i].name === destroyedEnemy.name) {
      foundIdx = i;
      break;
    }
  }

  if (foundIdx < 0) return null;

  // Remover del mazo enemigo
  const stolen = enemyDeck.splice(foundIdx, 1)[0];

  if (oppPrefix === "e") {
    engine.state.enemyDeck = enemyDeck;
  } else {
    engine.state.playerDeck = enemyDeck;
  }

  // Colocar en el campo del owner (resetear a modo monstruo)
  const placedCard = { ...stolen, es_altar: false };
  engine.state.board = { ...engine.state.board, [emptySlot]: placedCard };

  return stolen.name;
}

// ═══════════════════════════════════════════════════════════════
// NEGATE DESTROY EFFECTS (Malakor altar)
// ═══════════════════════════════════════════════════════════════

/**
 * Marca un slot enemigo como "sus efectos al morir son negados".
 * Usado por Malakor altar (UMBRAL PASIVO).
 */
export function markNegateDestroyEffects(engine: DuelEngine, slotId: SlotId): void {
  const arr = engine.state.effects.negateDestroyEffectsForSlots;
  if (!arr.includes(slotId)) {
    engine.state.effects.negateDestroyEffectsForSlots = [...arr, slotId];
  }
}

/**
 * Comprueba si los efectos al morir de un slot están negados.
 */
export function isNegateDestroyEffects(engine: DuelEngine, slotId: SlotId): boolean {
  return engine.state.effects.negateDestroyEffectsForSlots.includes(slotId);
}
