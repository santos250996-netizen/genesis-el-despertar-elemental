"use client";

import { useState, useRef, useCallback } from "react";
import { DuelEngine } from "@/engine/core";
import type { GameState, CardData, SlotId, EnemyType } from "@/engine/types";
import type { BattleStats } from "@/scripts/mechanics/attack";

// ============ DUEL ENGINE REACT HOOK ============
// Wraps DuelEngine with React state management.
// Exposes engine state, methods, and ATK computation helpers.

export interface UseDuelEngineReturn {
  state: GameState;
  engine: DuelEngine;
  startDuel: (enemy: EnemyType, customDeck?: CardData[]) => void;
  startGame: (enemy: EnemyType, customDeck?: CardData[]) => void;
  selectCard: (idx: number) => void;
  placeCard: (slotId: SlotId) => void;
  attackAll: () => void;
  endTurn: () => void;
  surrender: () => void;
  resetGame: () => void;
  computePlayerMonAtk: (slotId: SlotId) => BattleStats;
  computeEnemyMonAtk: (slotId: SlotId) => number;
  tagTeamSwap: (slotId: SlotId) => void;
  chainSummon: (handIndex: number, slotId: SlotId) => void;
  laneChange: (fromSlot: SlotId, toSlot: SlotId) => void;
  specialSummonFromHand: (handIndex: number, slotId: SlotId) => void;
  placeArtifact: (handIndex: number) => void;
  activateAltar: (slotId: SlotId) => void;
}

export function useDuelEngine(): UseDuelEngineReturn {
  // Initialize state with createInitialState (no engine needed)
  const [state, setState] = useState<GameState>(() => {
    // Lazy initializer — runs once. We'll wire the engine after mount.
    return {
      phase: "setup",
      playerLP: 100,
      enemyLP: 100,
      playerDeck: [],
      enemyDeck: [],
      playerHand: [],
      enemyHand: [],
      board: {
        "p-mon-1": null, "p-mon-2": null, "p-mon-3": null,
        "p-altar-luz": null, "p-altar-sombra": null,
        "p-artifact": null,
        "e-mon-1": null, "e-mon-2": null, "e-mon-3": null,
        "e-altar-luz": null, "e-altar-sombra": null,
        "e-artifact": null,
      },
      playerArtifact: null,
      enemyArtifact: null,
      selectedCardIndex: null,
      enemyType: "Ignis",
      log: [">> Elige tu adversario Elemental para comenzar el duelo."],
      isEnemyTurn: false,
      effects: {
        playerNegateAttack: [],
        playerBlockColumn: [],
        enemyNegateAttack: [],
        enemyBlockColumn: [],
        atkReduced: {},
        atkToZero: [],
        noEffectDestroy: false,
        globalAtkBonus: 0,
        discardBonusAtk: 0,
        atkBonus: {},
        compensationDrawPending: null,
        shieldCounters: {},
        negatedEffects: 0,
        corrosionCounters: {},
        faceDownSlots: [],
        tempAtkBonus: {},
        oncePerTurnUsed: [],
        preventDestroyThisTurn: [],
        negateDestroyEffectsForSlots: [],
      },
      turnNumber: 0,
      attackMode: false,
      attackedThisTurn: [],
      summonedThisTurn: 0,
      enemyTurnPhase: null,
      enemyActionSlot: null,
      playerSpecialSummonUsed: false,
      enemySpecialSummonUsed: false,
      playerLaneChangeUsed: false,
      enemyLaneChangeUsed: false,
      playerTagTeamUsed: false,
      enemyTagTeamUsed: false,
      playerChainSummonAvailable: false,
      enemyChainSummonAvailable: false,
      lastSummonSlot: null,
      altarUsedThisTurn: {},
    };
  });

  // Create engine once, wiring the REAL setState as the commit callback
  const engineRef = useRef<DuelEngine | null>(null);
  if (engineRef.current == null) {
    engineRef.current = new DuelEngine(setState);
  }
  const engine = engineRef.current;

  const startDuel = useCallback(
    (enemy: EnemyType, customDeck?: CardData[]) => {
      engine.startDuel(enemy, customDeck);
    },
    [engine]
  );

  const selectCard = useCallback(
    (idx: number) => {
      engine.selectCard(idx);
    },
    [engine]
  );

  const placeCard = useCallback(
    (slotId: SlotId) => {
      engine.placeCard(slotId);
    },
    [engine]
  );

  const attackAll = useCallback(() => {
    engine.attackAll();
  }, [engine]);

  const endTurn = useCallback(() => {
    engine.endTurn();
  }, [engine]);

  const surrender = useCallback(() => {
    engine.surrender();
  }, [engine]);

  const resetGame = useCallback(() => {
    engine.resetGame();
  }, [engine]);

  const computePlayerMonAtk = useCallback(
    (slotId: SlotId): BattleStats => {
      return engine.computePlayerMonAtk(slotId);
    },
    [engine]
  );

  const computeEnemyMonAtk = useCallback(
    (slotId: SlotId): number => {
      return engine.computeEnemyMonAtk(slotId);
    },
    [engine]
  );

  const tagTeamSwap = useCallback(
    (slotId: SlotId) => { engine.tagTeamSwap(slotId); },
    [engine]
  );

  const chainSummon = useCallback(
    (handIndex: number, slotId: SlotId) => { engine.chainSummon(handIndex, slotId); },
    [engine]
  );

  const laneChange = useCallback(
    (fromSlot: SlotId, toSlot: SlotId) => { engine.laneChange(fromSlot, toSlot); },
    [engine]
  );

  const specialSummonFromHand = useCallback(
    (handIndex: number, slotId: SlotId) => { engine.specialSummonFromHand(handIndex, slotId); },
    [engine]
  );

  const placeArtifact = useCallback(
    (handIndex: number) => { engine.placeArtifact(handIndex); },
    [engine]
  );

  const activateAltar = useCallback(
    (slotId: SlotId) => { engine.activateAltar(slotId); },
    [engine]
  );

  return {
    state,
    engine,
    startDuel,
    startGame: startDuel,
    selectCard,
    placeCard,
    attackAll,
    endTurn,
    surrender,
    resetGame,
    computePlayerMonAtk,
    computeEnemyMonAtk,
    tagTeamSwap,
    chainSummon,
    laneChange,
    specialSummonFromHand,
    placeArtifact,
    activateAltar,
  };
}
