// ============ CARD SCRIPT RESOLVER ============
// EDOPRO-style resolver that loads and executes card scripts from the registry.

import { CARD_SCRIPTS } from "@/scripts/cards/index";
import type { CardScript, CardInstance, DuelContext, SlotId, DuelEngine } from "@/engine/types";

/**
 * Get a card script by numeric ID.
 * Returns empty object for unknown cards (no-op).
 */
export function getCardScript(cardId: number): CardScript {
  return CARD_SCRIPTS[cardId] ?? {};
}

/**
 * Build a DuelContext for a card on the board.
 * The context is passed to all card script hooks.
 */
export function buildContext(
  engine: DuelEngine,
  card: CardInstance,
  slotId: SlotId
): DuelContext {
  return {
    engine,
    card,
    slotId,
    log: [],
  };
}

/**
 * Resolve a specific event on a card script.
 * @param cardId - The numeric card ID
 * @param event - The event name (e.g., "onPlace", "onAttackHit")
 * @param ctx - The duel context
 */
export function resolveEvent(
  cardId: number,
  event: keyof CardScript,
  ctx: DuelContext,
  ...extraArgs: unknown[]
): void {
  const script = getCardScript(cardId);
  const handler = script[event];
  if (typeof handler === "function") {
    (handler as (...args: unknown[]) => void)(ctx, ...extraArgs);
  }
}

/**
 * Fire the onPlace hook for a card being placed on the board.
 */
export function fireOnPlace(
  engine: DuelEngine,
  card: CardInstance,
  slotId: SlotId
): string[] {
  const ctx = buildContext(engine, card, slotId);
  resolveEvent(card.data.id, "onPlace", ctx);
  return ctx.log;
}

/**
 * Fire the onRemove hook for a card being removed from the board.
 */
export function fireOnRemove(
  engine: DuelEngine,
  card: CardInstance,
  slotId: SlotId
): string[] {
  const ctx = buildContext(engine, card, slotId);
  resolveEvent(card.data.id, "onRemove", ctx);
  return ctx.log;
}

/**
 * Fire the onAttackDeclared hook.
 */
export function fireOnAttackDeclared(
  engine: DuelEngine,
  card: CardInstance,
  slotId: SlotId
): string[] {
  const ctx = buildContext(engine, card, slotId);
  resolveEvent(card.data.id, "onAttackDeclared", ctx);
  return ctx.log;
}

/**
 * Fire the onAttackHit hook when an attack successfully lands.
 */
export function fireOnAttackHit(
  engine: DuelEngine,
  card: CardInstance,
  slotId: SlotId
): string[] {
  const ctx = buildContext(engine, card, slotId);
  resolveEvent(card.data.id, "onAttackHit", ctx);
  return ctx.log;
}

/**
 * Fire the beforeDestroy hook. Return true to prevent destruction.
 */
export function fireBeforeDestroy(
  engine: DuelEngine,
  card: CardInstance,
  slotId: SlotId
): boolean {
  const ctx = buildContext(engine, card, slotId);
  const script = getCardScript(card.data.id);
  if (typeof script.beforeDestroy === "function") {
    return script.beforeDestroy(ctx);
  }
  return false;
}

/**
 * Fire the onTurnStart hook for all cards of a given owner.
 */
export function fireTurnStart(
  engine: DuelEngine,
  owner: "player" | "enemy"
): string[] {
  const allLogs: string[] = [];
  const board = engine.state.board;
  const slots: SlotId[] = owner === "player"
    ? ["p-mon-1", "p-mon-2", "p-mon-3", "p-altar-luz", "p-altar-sombra"]
    : ["e-mon-1", "e-mon-2", "e-mon-3", "e-altar-luz", "e-altar-sombra"];

  for (const slotId of slots) {
    const card = board[slotId];
    if (card) {
      const instance: CardInstance = { data: card, slotId, ownerId: owner, instanceFlags: {} };
      const ctx = buildContext(engine, instance, slotId);
      resolveEvent(card.id, "onTurnStart", ctx);
      allLogs.push(...ctx.log);
    }
  }
  return allLogs;
}

/**
 * Fire the onTurnEnd hook for all cards of a given owner.
 */
export function fireOnTurnEnd(
  engine: DuelEngine,
  owner: "player" | "enemy"
): string[] {
  const allLogs: string[] = [];
  const board = engine.state.board;
  const slots: SlotId[] = owner === "player"
    ? ["p-mon-1", "p-mon-2", "p-mon-3", "p-altar-luz", "p-altar-sombra"]
    : ["e-mon-1", "e-mon-2", "e-mon-3", "e-altar-luz", "e-altar-sombra"];

  for (const slotId of slots) {
    const card = board[slotId];
    if (card) {
      const instance: CardInstance = { data: card, slotId, ownerId: owner, instanceFlags: {} };
      const ctx = buildContext(engine, instance, slotId);
      resolveEvent(card.id, "onTurnEnd", ctx);
      allLogs.push(...ctx.log);
    }
  }
  return allLogs;
}

/**
 * Fire onEnemySummon on all cards of the opposing side when a card is placed.
 */
export function fireOnEnemySummon(
  engine: DuelEngine,
  placedOwner: "player" | "enemy"
): string[] {
  const allLogs: string[] = [];
  const board = engine.state.board;
  const opponentOwner: "player" | "enemy" = placedOwner === "enemy" ? "player" : "enemy";
  const opponentSlots: SlotId[] = opponentOwner === "player"
    ? ["p-mon-1", "p-mon-2", "p-mon-3", "p-altar-luz", "p-altar-sombra"]
    : ["e-mon-1", "e-mon-2", "e-mon-3", "e-altar-luz", "e-altar-sombra"];

  for (const slotId of opponentSlots) {
    const card = board[slotId];
    if (card) {
      const instance: CardInstance = { data: card, slotId, ownerId: opponentOwner, instanceFlags: {} };
      const ctx = buildContext(engine, instance, slotId);
      resolveEvent(card.id, "onEnemySummon", ctx);
      allLogs.push(...ctx.log);
    }
  }
  return allLogs;
}

/**
 * Fire onAllyDestroy on all cards of the same owner when a card is destroyed.
 */
export function fireOnAllyDestroy(
  engine: DuelEngine,
  destroyedSlotId: SlotId,
  owner: "player" | "enemy"
): string[] {
  const allLogs: string[] = [];
  const board = engine.state.board;
  const slots: SlotId[] = owner === "player"
    ? ["p-mon-1", "p-mon-2", "p-mon-3", "p-altar-luz", "p-altar-sombra"]
    : ["e-mon-1", "e-mon-2", "e-mon-3", "e-altar-luz", "e-altar-sombra"];

  for (const slotId of slots) {
    if (slotId === destroyedSlotId) continue;
    const card = board[slotId];
    if (card) {
      const instance: CardInstance = { data: card, slotId, ownerId: owner, instanceFlags: {} };
      const ctx = buildContext(engine, instance, slotId);
      resolveEvent(card.id, "onAllyDestroy", ctx);
      allLogs.push(...ctx.log);
    }
  }
  return allLogs;
}

/**
 * Fire onEnemyDestroy on all cards of the opposing owner when a card is destroyed.
 */
export function fireOnEnemyDestroy(
  engine: DuelEngine,
  destroyedSlotId: SlotId,
  owner: "player" | "enemy"
): string[] {
  const allLogs: string[] = [];
  const board = engine.state.board;
  const opponentOwner: "player" | "enemy" = owner === "player" ? "enemy" : "player";
  const opponentSlots: SlotId[] = opponentOwner === "player"
    ? ["p-mon-1", "p-mon-2", "p-mon-3", "p-altar-luz", "p-altar-sombra"]
    : ["e-mon-1", "e-mon-2", "e-mon-3", "e-altar-luz", "e-altar-sombra"];

  for (const slotId of opponentSlots) {
    const card = board[slotId];
    if (card) {
      const instance: CardInstance = { data: card, slotId, ownerId: opponentOwner, instanceFlags: {} };
      const ctx = buildContext(engine, instance, slotId);
      resolveEvent(card.id, "onEnemyDestroy", ctx);
      allLogs.push(...ctx.log);
    }
  }
  return allLogs;
}
