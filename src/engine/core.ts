"use client";

// ============ DUEL ENGINE — EDOPRO-STYLE CORE ============
// The main game engine that manages state transitions, ATK computation,
// card placement, attack resolution, and enemy AI.
// Designed to work with React via a setState callback pattern.

import type {
  CardData,
  CardInstance,
  CardType,
  SlotId,
  EnemyType,
  GameState,
  EffectState,
  DuelEngine as DuelEngineInterface,
} from "@/engine/types";

import { CARDS } from "@/data/cards";
import { DECKS } from "@/data/decks";
import {
  fireOnPlace, fireOnRemove,
  fireOnAttackDeclared, fireOnAttackHit, fireBeforeDestroy,
  fireOnTurnEnd, fireOnEnemySummon, fireOnAllyDestroy, fireOnEnemyDestroy,
} from "@/engine/resolver";
import { canSummon, incrementSummonCount } from "@/scripts/mechanics/summon";
import type { BattleStats } from "@/scripts/mechanics/attack";
import { drawOne } from "@/scripts/mechanics/draw";
import { discardRandom, removeFromHand } from "@/scripts/mechanics/hand";
import { dealDamage as applyDamage, heal as applyHeal, MAX_LP, MIN_LP } from "@/scripts/mechanics/lp";
import { validatePlacement } from "@/scripts/field/positioning";
import { isPlayerSlot, getColumn, getEnemyAltarForColumn } from "@/scripts/field/zones";

// ============ HELPERS ============

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Check if a monster matches an altar element (supports alsoMatches for hybrid future). */
function matchesAltar(monster: CardData, element: CardType): boolean {
  if (monster.type === element) return true;
  if (monster.alsoMatches?.includes(element)) return true;
  return false;
}

function emptyEffectState(): EffectState {
  return {
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
  };
}

function createInitialState(): GameState {
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
    enemyTurnPhase: null,
    enemyActionSlot: null,
    effects: emptyEffectState(),
    turnNumber: 0,
    attackMode: false,
    attackedThisTurn: [],
    summonedThisTurn: 0,
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
}

// ============ DUEL ENGINE CLASS ============

export class DuelEngine implements DuelEngineInterface {
  state: GameState;
  _setState: (state: GameState) => void;

  constructor(setState?: (state: GameState) => void) {
    this.state = createInitialState();
    this._setState = setState ?? (() => {});
  }

  /** Update the React commit callback. Call this after creating the hook. */
  setCommitCallback(setState: (state: GameState) => void): void {
    this._setState = setState;
  }

  /** Commit current state to React. */
  private commit(): void {
    this._setState({ ...this.state });
  }

  /** Add a log message and commit. */
  addLog(msg: string): void {
    this.state.log = [...this.state.log, msg];
  }

  // ──────────────────────────────────────────
  // DuelEngine interface implementation
  // ──────────────────────────────────────────

  getCard(id: number): CardData {
    return CARDS[id];
  }

  dealDamage(target: "player" | "enemy", amount: number): void {
    if (target === "player") {
      this.state.playerLP = applyDamage(this.state.playerLP, amount);
    } else {
      this.state.enemyLP = applyDamage(this.state.enemyLP, amount);
    }
  }

  heal(target: "player" | "enemy", amount: number): void {
    if (target === "player") {
      this.state.playerLP = applyHeal(this.state.playerLP, amount);
    } else {
      this.state.enemyLP = applyHeal(this.state.enemyLP, amount);
    }
  }

  destroyCard(slotId: SlotId, sendTo: "hand" | "deck" | "grave" = "deck"): void {
    const card = this.state.board[slotId];
    if (!card) return;

    const owner = isPlayerSlot(slotId) ? "player" : "enemy";

    // Fire onRemove
    const instance: CardInstance = { data: card, slotId, ownerId: owner, instanceFlags: {} };
    const logs = fireOnRemove(this, instance, slotId);
    this.state.log = [...this.state.log, ...logs];

    // Remove from board
    const newBoard = { ...this.state.board, [slotId]: null };

    if (sendTo === "hand") {
      if (owner === "player") {
        this.state.playerHand = [...this.state.playerHand, card];
      } else {
        this.state.enemyHand = [...this.state.enemyHand, card];
      }
    } else {
      // Send to bottom of deck
      if (owner === "player") {
        this.state.playerDeck = [card, ...this.state.playerDeck];
      } else {
        this.state.enemyDeck = [card, ...this.state.enemyDeck];
      }
    }

    this.state.board = newBoard;

    // Equipment destruction: if the destroyed monster had an artifact equipped, return it to deck
    if (owner === "player" && isPlayerSlot(slotId)) {
      const artifact = this.state.board["p-artifact"];
      if (artifact && artifact.equippedTo === slotId) {
        this.state.playerDeck = [...this.state.playerDeck, artifact];
        this.state.board = { ...this.state.board, "p-artifact": null };
        this.state.playerArtifact = null;
        this.addLog(`>> ${artifact.name} (equipo) destruido con ${card.name}, retorna al mazo.`);
      }
    }
  }

  moveToHand(slotId: SlotId): void {
    this.destroyCard(slotId, "hand");
  }

  moveToDeck(slotId: SlotId): void {
    this.destroyCard(slotId, "deck");
  }

  discard(target: "player" | "enemy", count: number): void {
    for (let i = 0; i < count; i++) {
      if (target === "player") {
        const result = discardRandom(this.state.playerHand);
        if (result.discarded) {
          this.state.playerHand = result.remaining;
          this.state.playerDeck = [result.discarded, ...this.state.playerDeck];
          this.state.effects.discardBonusAtk = (this.state.effects.discardBonusAtk || 0) + 1;
          this.addLog(`>> Descartas [${result.discarded.name}].`);
        }
      } else {
        const result = discardRandom(this.state.enemyHand);
        if (result.discarded) {
          this.state.enemyHand = result.remaining;
          this.state.enemyDeck = [result.discarded, ...this.state.enemyDeck];
          this.state.effects.discardBonusAtk = (this.state.effects.discardBonusAtk || 0) + 1;
          this.addLog(`>> El rival descarta [${result.discarded.name}].`);
        }
      }
    }
  }

  draw(target: "player" | "enemy", count: number): void {
    for (let i = 0; i < count; i++) {
      if (target === "player") {
        const result = drawOne(this.state.playerDeck);
        if (result.card) {
          this.state.playerDeck = result.remainingDeck;
          this.state.playerHand = [...this.state.playerHand, result.card];
        }
      } else {
        const result = drawOne(this.state.enemyDeck);
        if (result.card) {
          this.state.enemyDeck = result.remainingDeck;
          this.state.enemyHand = [...this.state.enemyHand, result.card];
        }
      }
    }
  }

  negateAttack(column: number): void {
    this.state.effects.playerNegateAttack = [...this.state.effects.playerNegateAttack, column];
  }

  blockColumn(column: number): void {
    this.state.effects.playerBlockColumn = [...this.state.effects.playerBlockColumn, column];
  }

  modifyAtk(slotId: SlotId, delta: number): void {
    const card = this.state.board[slotId];
    if (!card) return;
    const key = `${slotId.split("-")[0]}-${card.name}`;
    const cur = this.state.effects.atkBonus[key] || 0;
    this.state.effects.atkBonus = { ...this.state.effects.atkBonus, [key]: cur + delta };
  }

  setAtkToZero(slotId: SlotId): void {
    const card = this.state.board[slotId];
    if (!card) return;
    const key = `${slotId.split("-")[0]}-${card.name}`;
    this.state.effects.atkToZero = [...this.state.effects.atkToZero, key];
  }

  setGlobalAtkBonus(bonus: number): void {
    this.state.effects.globalAtkBonus = bonus;
  }

  setNoEffectDestroy(value: boolean): void {
    this.state.effects.noEffectDestroy = value;
  }

  addShield(slotId: SlotId): void {
    const cur = this.state.effects.shieldCounters[slotId] ?? 0;
    // Max 1 shield per card (Opción 4B)
    if (cur >= 1) return;
    this.state.effects.shieldCounters = { ...this.state.effects.shieldCounters, [slotId]: 1 };
  }

  consumeShield(slotId: SlotId): boolean {
    const cur = this.state.effects.shieldCounters[slotId] ?? 0;
    if (cur <= 0) return false;
    this.state.effects.shieldCounters = { ...this.state.effects.shieldCounters, [slotId]: 0 };
    return true;
  }

  getPlayerAtk(slotId: SlotId): number {
    return this.computePlayerMonAtk(slotId).atk;
  }

  getEnemyAtk(slotId: SlotId): number {
    return this.computeEnemyMonAtk(slotId);
  }

  // ──────────────────────────────────────────
  // GAME FLOW
  // ──────────────────────────────────────────

  /** Start a new duel. */
  startDuel(enemy: EnemyType, customPlayerDeck?: CardData[]): void {
    const playerDeckIds = customPlayerDeck ? customPlayerDeck.map(c => c.id) : DECKS.player;
    const enemyDeckIds = [...DECKS[enemy as keyof typeof DECKS]] as number[];

    const playerCards = playerDeckIds.map(id => CARDS[id]).filter(Boolean);
    const enemyCards = enemyDeckIds.map(id => CARDS[id]).filter(Boolean);

    const shuffledPlayer = shuffle(playerCards);
    const shuffledEnemy = shuffle(enemyCards);

    const playerHand = shuffledPlayer.splice(0, 4);
    const enemyHand = shuffledEnemy.splice(0, 4);

    this.state = {
      ...createInitialState(),
      phase: "playing",
      enemyType: enemy,
      turnNumber: 1,
      playerDeck: shuffledPlayer,
      enemyDeck: shuffledEnemy,
      playerHand,
      enemyHand,
      log: [
        `>> ¡Duelo iniciado contra ${enemy}!`,
        ">> Has robado 4 cartas.",
        ">> (Primer turno: no puedes atacar)",
        ">> Selecciona una carta y colócala en el tablero.",
      ],
    };

    this.commit();
  }

  /** Select a card from hand by index. */
  selectCard(idx: number): void {
    if (this.state.isEnemyTurn || this.state.attackMode) return;
    this.state.selectedCardIndex = idx;
    this.addLog(`>> Seleccionaste: ${this.state.playerHand[idx].name} [${this.state.playerHand[idx].type}].`);
    this.commit();
  }

  /** Place the selected card on the board at the given slot. */
  placeCard(slotId: SlotId): void {
    if (this.state.selectedCardIndex === null || this.state.phase !== "playing" || this.state.isEnemyTurn || this.state.attackMode) return;
    const card = this.state.playerHand[this.state.selectedCardIndex];
    if (!card) return;

    // Check Eclipse Permanente — block special summons
    const enemyArtifact = this.state.enemyArtifact;
    if (enemyArtifact?.artifactType === "global" && enemyArtifact.effects[0]?.id === "art_global_eclipse") {
      if (card.type === "ECLIPSE" || card.flags.includes("isGenesis") || card.type === "ANOMALIA") {
        this.addLog(`Error: ${enemyArtifact.name} prohíbe invocaciones especiales.`);
        this.commit();
        return;
      }
    }

    // Check summon limit
    const summonCheck = canSummon(card, slotId, this.state.summonedThisTurn);
    if (!summonCheck.allowed) {
      this.addLog(`Error: ${summonCheck.reason}`);
      this.commit();
      return;
    }

    // Validate placement rules
    const error = validatePlacement(card, slotId, this.state.board);
    if (error) {
      this.addLog(`Error: ${error}`);
      this.commit();
      return;
    }

    let newBoard = { ...this.state.board };
    let newPlayerDeck = [...this.state.playerDeck];
    let newEnemyDeck = [...this.state.enemyDeck];
    let newPlayerLP = this.state.playerLP;
    let newEnemyLP = this.state.enemyLP;
    let newPlayerHand = [...this.state.playerHand];
    let newEnemyHand = [...this.state.enemyHand];
    let newEffects = { ...this.state.effects };

    // ── ANOMALÍA: consume enemy monster (solo en slots e-mon-*) ──
    if (card.type === "ANOMALIA" && slotId.startsWith("e-mon-")) {
      const col = getColumn(slotId);
      const eAltar = getEnemyAltarForColumn(col);
      const eMon = newBoard[slotId];
      const pSlot = `p-mon-${col}` as SlotId;

      newEnemyDeck = [...newEnemyDeck, eMon!];
      newBoard = { ...newBoard, [slotId]: null };
      const anomalyCopy = { ...card, atk: (eMon as CardData).atk };
      newBoard = { ...newBoard, [pSlot]: anomalyCopy };

      this.addLog(`>> ¡Anomalía consume [${(eMon as CardData).name}]! Copia ATK:${(eMon as CardData).atk} y entra en zona ${col}.`);

      const finalHand = removeFromHand(newPlayerHand, this.state.selectedCardIndex).remaining;
      this.state.board = newBoard;
      this.state.playerHand = finalHand;
      this.state.selectedCardIndex = null;
      this.state.enemyDeck = newEnemyDeck;
      this.state.summonedThisTurn = incrementSummonCount(card, slotId, this.state.summonedThisTurn);
      this.commit();
      return;
    }
    // ── ANOMALÍA en altar: se coloca normalmente como híbrida (efecto altar) ──

    // ── CORRUPCIÓN: sacrifice monster in zone 3 (only when placed in p-mon-3) ──
    if (card.type === "CORRUPCION" && slotId === "p-mon-3") {
      const sacrifice = newBoard["p-mon-3"];
      if (sacrifice) {
        newPlayerDeck = [...newPlayerDeck, sacrifice];
        newBoard = { ...newBoard, "p-mon-3": null };
        this.addLog(`>> ¡[${sacrifice.name}] es consumido por la oscuridad y retorna al fondo del mazo!`);
      }
    }

    // ── CORRUPCIÓN: Kraken Colosal — handled by card script 86.ts (onPlace) ──

    // ── CORRUPCIÓN: Gusano del Vacío — handled by card script 43.ts (onPlace) ──

    // ── GENESIS: destroy entire board ──
    if (card.flags.includes("isGenesis")) {
      // Absorb Col 1 and 3 monsters to deck
      const mon1 = newBoard["p-mon-1"];
      const mon3 = newBoard["p-mon-3"];
      if (mon1) {
        newPlayerDeck = [...newPlayerDeck, mon1];
        newBoard = { ...newBoard, "p-mon-1": null };
        this.addLog(`>> 💀 ${mon1.name} destruido por Genesis.`);
      }
      if (mon3) {
        newPlayerDeck = [...newPlayerDeck, mon3];
        newBoard = { ...newBoard, "p-mon-3": null };
        this.addLog(`>> 💀 ${mon3.name} destruido por Genesis.`);
      }
      // Consume both altars
      if (newBoard["p-altar-luz"]) {
        newPlayerDeck = [...newPlayerDeck, newBoard["p-altar-luz"]!];
        newBoard = { ...newBoard, "p-altar-luz": null };
      }
      if (newBoard["p-altar-sombra"]) {
        newPlayerDeck = [...newPlayerDeck, newBoard["p-altar-sombra"]!];
        newBoard = { ...newBoard, "p-altar-sombra": null };
      }
      // Destroy artifact
      if (newBoard["p-artifact"]) {
        newPlayerDeck = [...newPlayerDeck, newBoard["p-artifact"]!];
        newBoard = { ...newBoard, "p-artifact": null };
        this.state.playerArtifact = null;
      }
      this.addLog(">> 💀 ¡Genesis arrasa con todo tu tablero! Solo queda el vacío.");
    }

    // ── ECLIPSE: absorb Col 1 and 3 monsters ──
    if (card.type === "ECLIPSE") {
      const mon1 = newBoard["p-mon-1"];
      const mon3 = newBoard["p-mon-3"];
      if (mon1) {
        newPlayerDeck = [...newPlayerDeck, mon1];
        newBoard = { ...newBoard, "p-mon-1": null };
        this.addLog(`>> 🌊 ${mon1.name} absorbido al fondo del mazo.`);
      }
      if (mon3) {
        newPlayerDeck = [...newPlayerDeck, mon3];
        newBoard = { ...newBoard, "p-mon-3": null };
        this.addLog(`>> 🌊 ${mon3.name} absorbido al fondo del mazo.`);
      }
      this.addLog(">> ¡Eclipse desciende al campo! Absorbe a tus aliados laterales.");
    }

    // ── CHECK BLOCKED COLUMNS ──
    if (slotId.startsWith("p-mon-")) {
      const col = getColumn(slotId);
      if (newEffects.enemyBlockColumn.includes(col)) {
        this.addLog(`Error: Columna ${col} está bloqueada por un efecto enemigo.`);
        this.commit();
        return;
      }
    }

    // ── ARTEFACTO: set playerArtifact + equipo binding ──
    if (card.type === "ARTEFACTO") {
      this.state.playerArtifact = card;
      // For equipo artifacts, auto-equip to first available monster
      if (card.artifactType === "equipo") {
        const equipTargets: SlotId[] = ["p-mon-1", "p-mon-3", "p-mon-2"];
        const targetSlot = equipTargets.find(s => this.state.board[s] !== null);
        if (targetSlot) {
          card.equippedTo = targetSlot;
        } else {
          this.addLog("Error: Necesitas un monstruo para equipar.");
          this.commit();
          return;
        }
      }
    }

    // ── PLACE CARD ON BOARD ──
    newBoard = { ...newBoard, [slotId]: card };
    const finalHand = removeFromHand(newPlayerHand, this.state.selectedCardIndex).remaining;

    // ── ENEMY ALTAR: Luz Devoradora (discard on summon) ──
    const enemyLuzAltar = newBoard["e-altar-luz"];
    if (enemyLuzAltar && card.flags.includes("isElemental") && slotId.startsWith("p-mon-")) {
      for (const ae of enemyLuzAltar.flags) {
        // Check card effects from original data
        if (card.flags.includes("isElemental")) {
          const disc = discardRandom(finalHand);
          if (disc.discarded && enemyLuzAltar.name === "Luz Devoradora") {
            newPlayerHand = disc.remaining;
            newPlayerDeck.push(disc.discarded);
            this.addLog(`>> ¡Altar enemigo ${enemyLuzAltar.name} activa! Descartas [${disc.discarded.name}] por invocar.`);
          }
        }
      }
    }

    // ── Commit partial state so card scripts can see correct board ──
    this.state.board = newBoard;
    this.state.playerDeck = newPlayerDeck;
    this.state.enemyDeck = newEnemyDeck;
    this.state.playerHand = finalHand;
    this.state.enemyHand = newEnemyHand;
    this.state.playerLP = newPlayerLP;
    this.state.enemyLP = newEnemyLP;
    this.state.effects = newEffects;

    // ── FIRE CARD SCRIPT onPlace ──
    const instance: CardInstance = { data: card, slotId, ownerId: "player", instanceFlags: {} };
    const scriptLogs = fireOnPlace(this, instance, slotId);

    // ── Re-read from engine state after card scripts fired (scripts modify state directly) ──
    newBoard = { ...this.state.board };
    newPlayerLP = this.state.playerLP;
    newEnemyLP = this.state.enemyLP;
    newPlayerHand = [...this.state.playerHand];
    newEnemyHand = [...this.state.enemyHand];
    newPlayerDeck = [...this.state.playerDeck];
    newEnemyDeck = [...this.state.enemyDeck];
    newEffects = { ...this.state.effects };

    // ── PROCESS INSTANT SUMMON EFFECTS (preserving all legacy mechanics) ──
    const summonResult = this.processSummonEffects(
      card, slotId, newBoard, newPlayerHand,
      newPlayerDeck, newEnemyDeck, newEnemyHand, newEffects
    );

    const allLogs = [...this.state.log];
    if (scriptLogs.length > 0) allLogs.push(...scriptLogs);
    if (summonResult.log.length > 0) allLogs.push(...summonResult.log);

    // Apply LP changes
    if (summonResult.lpDelta < 0) {
      newEnemyLP = Math.max(MIN_LP, newEnemyLP + summonResult.lpDelta);
    } else if (summonResult.lpDelta > 0) {
      newPlayerLP = Math.min(MAX_LP, newPlayerLP + summonResult.lpDelta);
    }

    // Apply deck/hand/board deltas
    newEnemyDeck = [...newEnemyDeck, ...summonResult.enemyDeckDelta];
    newPlayerDeck = summonResult.playerDeckDelta.length > 0 ? summonResult.playerDeckDelta : newPlayerDeck;
    newEnemyHand = summonResult.enemyHandDelta.length > 0 ? summonResult.enemyHandDelta : newEnemyHand;
    newPlayerHand = [...(newPlayerHand.length === newPlayerHand.length ? finalHand : newPlayerHand), ...summonResult.playerHandDelta];
    newBoard = { ...newBoard, ...summonResult.boardDelta };
    newEffects = { ...newEffects, ...summonResult.effectDelta };

    // Accumulate discard bonus ATK
    if (summonResult.discardBonusDelta) {
      newEffects.discardBonusAtk = (newEffects.discardBonusAtk || 0) + summonResult.discardBonusDelta;
    }

    const phase = newEnemyLP <= 0 ? "won" as const : this.state.phase;

    this.state = {
      ...this.state,
      board: newBoard,
      playerHand: newPlayerHand,
      selectedCardIndex: null,
      playerDeck: newPlayerDeck,
      enemyDeck: newEnemyDeck,
      enemyHand: newEnemyHand,
      playerLP: newPlayerLP,
      enemyLP: newEnemyLP,
      effects: newEffects,
      log: allLogs,
      phase,
      summonedThisTurn: incrementSummonCount(card, slotId, this.state.summonedThisTurn),
    };

    this.commit();
  }

  // ──────────────────────────────────────────
  // ATTACK: All monsters attack their column
  // ──────────────────────────────────────────

  attackAll(): void {
    if (this.state.phase !== "playing" || this.state.isEnemyTurn || this.state.turnNumber <= 1) return;

    let newBoard = { ...this.state.board };
    let newEnemyLP = this.state.enemyLP;
    let newPlayerLP = this.state.playerLP;
    let newPlayerDeck = [...this.state.playerDeck];
    let newEnemyDeck = [...this.state.enemyDeck];
    let newEnemyHand = [...this.state.enemyHand];
    let newPlayerHand = [...this.state.playerHand];
    const newLog = [...this.state.log, ">> — Fase de Batalla —"];
    let phase = this.state.phase as "playing" | "won" | "lost";
    const attacked: string[] = [...this.state.attackedThisTurn];

    for (let col = 1; col <= 3; col++) {
      const pSlot = `p-mon-${col}` as SlotId;
      const pMon = newBoard[pSlot];
      if (!pMon || attacked.includes(pSlot)) continue;

      const eSlot = `e-mon-${col}` as SlotId;
      const eMon = newBoard[eSlot];

      // Check if enemy negated attack on this column
      if (this.state.effects.enemyNegateAttack.includes(col)) {
        newLog.push(`>> ¡Ataque de ${pMon.name} en columna ${col} negado!`);
        attacked.push(pSlot);
        continue;
      }

      const pStats = this.computePlayerMonAtk(pSlot);
      const pAtk = pStats.atk;

      // Fire onAttackDeclared for player monster
      const pAttackInstance: CardInstance = { data: pMon, slotId: pSlot, ownerId: "player", instanceFlags: {} };
      const attackDeclLogs = fireOnAttackDeclared(this, pAttackInstance, pSlot);
      newLog.push(...attackDeclLogs);

      if (eMon) {
        const eAtk = this.computeEnemyMonAtk(eSlot);
        const eInstance: CardInstance = { data: eMon, slotId: eSlot, ownerId: "enemy", instanceFlags: {} };

        if (pAtk > eAtk) {
          const lpLoss = pStats.penetrate ? pAtk : (pAtk - eAtk);
          const prevented = fireBeforeDestroy(this, eInstance, eSlot);
          if (prevented) {
            newLog.push(`>> ¡${eMon.name} resistedió a la destrucción!`);
          } else {
            newEnemyLP -= lpLoss;
            newEnemyDeck = [eMon, ...newEnemyDeck];
            newBoard = { ...newBoard, [eSlot]: null };
            const penNote = pStats.penetrate ? " ¡Daño de penetración!" : "";
            newLog.push(`>> ¡${pMon.name} (ATK:${pAtk}) vence a ${eMon.name} (ATK:${eAtk})! -${lpLoss} LP enemigo.${penNote}`);
            const hitLogs = fireOnAttackHit(this, pAttackInstance, pSlot);
            newLog.push(...hitLogs);
            const removeLogs = fireOnRemove(this, eInstance, eSlot);
            newLog.push(...removeLogs);
            newLog.push(...fireOnAllyDestroy(this, eSlot, "enemy"));
            newLog.push(...fireOnEnemyDestroy(this, eSlot, "enemy"));
          }
        } else if (pAtk === eAtk) {
          const ePrevented = fireBeforeDestroy(this, eInstance, eSlot);
          const pPrevented = fireBeforeDestroy(this, pAttackInstance, pSlot);
          if (!ePrevented) {
            newEnemyDeck = [eMon, ...newEnemyDeck];
            newBoard = { ...newBoard, [eSlot]: null };
            const removeLogs = fireOnRemove(this, eInstance, eSlot);
            newLog.push(...removeLogs);
            newLog.push(...fireOnAllyDestroy(this, eSlot, "enemy"));
            newLog.push(...fireOnEnemyDestroy(this, eSlot, "enemy"));
          }
          if (!pPrevented) {
            newPlayerDeck = [pMon, ...newPlayerDeck];
            newBoard = { ...newBoard, [pSlot]: null };
            const removeLogs = fireOnRemove(this, pAttackInstance, pSlot);
            newLog.push(...removeLogs);
            newLog.push(...fireOnAllyDestroy(this, pSlot, "player"));
            newLog.push(...fireOnEnemyDestroy(this, pSlot, "player"));
            // Equipment destruction
            const eqArtifact = newBoard["p-artifact"];
            if (eqArtifact && eqArtifact.equippedTo === pSlot) {
              newPlayerDeck = [...newPlayerDeck, eqArtifact];
              newBoard = { ...newBoard, "p-artifact": null };
              newLog.push(`>> ${eqArtifact.name} (equipo) destruido con ${pMon.name}.`);
            }
          }
          if (ePrevented || pPrevented) {
            newLog.push(`>> ¡Empate! ${pMon.name} y ${eMon.name} (ATK:${pAtk}).`);
            if (ePrevented) newLog.push(`>> ${eMon.name} resistedió a la destrucción!`);
            if (pPrevented) newLog.push(`>> ${pMon.name} resistedió a la destrucción!`);
          } else {
            newLog.push(`>> ¡Empate! ${pMon.name} y ${eMon.name} (ATK:${pAtk}) se destruyen mutuamente.`);
          }
        } else {
          if (pStats.undestroyable) {
            newPlayerLP -= (eAtk - pAtk);
            newLog.push(`>> ${pMon.name} (ATK:${pAtk}) no puede ser destruido pero pierdes ${eAtk - pAtk} LP.`);
          } else {
            const pPrevented = fireBeforeDestroy(this, pAttackInstance, pSlot);
            if (pPrevented) {
              newPlayerLP -= (eAtk - pAtk);
              newLog.push(`>> ${pMon.name} resistedió a la destrucción! Pierdes ${eAtk - pAtk} LP.`);
            } else {
              newPlayerLP -= (eAtk - pAtk);
              newPlayerDeck = [pMon, ...newPlayerDeck];
              newBoard = { ...newBoard, [pSlot]: null };
              newLog.push(`>> ${pMon.name} (ATK:${pAtk}) es destruido por ${eMon.name} (ATK:${eAtk}). -${eAtk - pAtk} LP.`);
              const removeLogs = fireOnRemove(this, pAttackInstance, pSlot);
              newLog.push(...removeLogs);
              newLog.push(...fireOnAllyDestroy(this, pSlot, "player"));
              newLog.push(...fireOnEnemyDestroy(this, pSlot, "player"));
              // Equipment destruction
              const eqArtifact = newBoard["p-artifact"];
              if (eqArtifact && eqArtifact.equippedTo === pSlot) {
                newPlayerDeck = [...newPlayerDeck, eqArtifact];
                newBoard = { ...newBoard, "p-artifact": null };
                newLog.push(`>> ${eqArtifact.name} (equipo) destruido con ${pMon.name}.`);
              }
            }
          }
        }
      } else {
        // Direct attack
        let finalAtk = pAtk;
        // Check enemy interception artifact
        const enemyArtifact = this.state.enemyArtifact;
        if (enemyArtifact?.artifactType === "intercepcion" && this.state.board["e-artifact"]) {
          finalAtk = Math.floor(finalAtk / 2);
          newLog.push(`>> 🛡 ${enemyArtifact.name} activado: ATK reducido a la mitad (${finalAtk}).`);
          newEnemyDeck = [...newEnemyDeck, enemyArtifact];
          newBoard = { ...newBoard, "e-artifact": null };
          this.state.enemyArtifact = null;
          // Compensation: enemy draws 1
          if (newEnemyDeck.length > 0) {
            const drawn = newEnemyDeck[0];
            newEnemyDeck = newEnemyDeck.slice(1);
            newEnemyHand = [...newEnemyHand, drawn];
            newLog.push(`>> ⚡ Compensación: el rival roba 1 carta.`);
          }
        }
        // Check Zona Muerta (double direct damage)
        if (enemyArtifact?.artifactType === "global" && enemyArtifact.effects[0]?.id === "art_global_zona_muerta") {
          finalAtk *= 2;
          newLog.push(`>> ☠️ Zona Muerta: daño doble.`);
        }
        newEnemyLP -= finalAtk;
        newLog.push(`>> ¡Ataque Directo! ${pMon.name} (ATK:${finalAtk}). -${finalAtk} LP enemigo.`);
        const hitLogs = fireOnAttackHit(this, pAttackInstance, pSlot);
        newLog.push(...hitLogs);
      }

      attacked.push(pSlot);
      if (newEnemyLP <= 0) { newEnemyLP = 0; phase = "won"; break; }
      if (newPlayerLP <= 0) { newPlayerLP = 0; phase = "lost"; break; }
    }

    if (phase === "won") {
      newLog.push(">> ¡VICTORIA! Has purificado el núcleo elemental del adversario.");
    }
    if (phase === "lost") {
      newLog.push(">> ¡DERROTA! Te quedaste sin puntos de vida.");
    }

    this.state = {
      ...this.state,
      board: newBoard,
      enemyLP: Math.max(MIN_LP, newEnemyLP),
      playerLP: Math.max(MIN_LP, newPlayerLP),
      playerDeck: newPlayerDeck,
      enemyDeck: newEnemyDeck,
      enemyHand: newEnemyHand,
      playerHand: newPlayerHand,
      log: newLog,
      phase,
      attackedThisTurn: attacked,
    };

    this.commit();
  }

  // ──────────────────────────────────────────
  // END TURN + ENEMY AI
  // ──────────────────────────────────────────

  endTurn(): void {
    if (this.state.phase !== "playing" || this.state.isEnemyTurn) return;

    // Fire onTurnEnd for all player cards
    const turnEndLogs = fireOnTurnEnd(this, "player");
    this.state.log = [...this.state.log, ...turnEndLogs];

    // Reset turn effects
    const freshEffects: EffectState = {
      ...this.state.effects,
      atkReduced: {},
      atkToZero: [],
      playerNegateAttack: [],
      enemyNegateAttack: [],
      enemyBlockColumn: [],
      playerBlockColumn: [],
    };

    this.state = {
      ...this.state,
      isEnemyTurn: true,
      attackMode: false,
      selectedCardIndex: null,
      effects: freshEffects,
      summonedThisTurn: 0,
      playerTagTeamUsed: false,
      playerChainSummonAvailable: false,
      lastSummonSlot: null,
      altarUsedThisTurn: {},
    };
    this.addLog(">> — Turno del Oponente —");
    this.commit();

    // Step 0: Altar effects on turn start (Umbral del Olvido)
    setTimeout(() => this.enemyTurnStep0(), 100);
    // Step 1: Enemy places a card
    setTimeout(() => this.enemyTurnStep1(), 800);
    // Step 2: Enemy attacks (staggered, schedules step 3 when done)
    setTimeout(() => this.enemyTurnStep2(), 2400);
  }

  // ──────────────────────────────────────────
  // ALTAR ACTIVATION
  // ──────────────────────────────────────────

  activateAltar(slotId: SlotId): void {
    // Only player altar slots
    if (slotId !== "p-altar-luz" && slotId !== "p-altar-sombra") {
      this.addLog("Error: Solo puedes activar altares propios.");
      this.commit();
      return;
    }
    // Only during player's turn
    if (this.state.isEnemyTurn) {
      this.addLog("Error: No puedes activar altares en el turno del rival.");
      this.commit();
      return;
    }
    const card = this.state.board[slotId];
    if (!card) return;

    // Check for activatable altar effects
    const altarEffects = card.efecto_altar.filter(e => e.categoria && e.categoria !== "PASIVO");
    if (altarEffects.length === 0) {
      this.addLog("Error: Este altar no tiene efectos activables.");
      this.commit();
      return;
    }

    const effect = altarEffects[0]; // Use the first activatable effect
    const categoria = effect.categoria!;

    // For TURNO: check if already used this turn
    if (categoria === "TURNO" && this.state.altarUsedThisTurn[slotId]) {
      this.addLog("Error: Este altar ya fue activado este turno.");
      this.commit();
      return;
    }

    // Resolve the effect based on its type
    this.resolveAltarEffect(effect, slotId);

    // After resolving:
    // ACTIVABLE and RESPUESTA: return card to bottom of deck, clear altar slot
    if (categoria === "ACTIVABLE" || categoria === "RESPUESTA") {
      this.state.playerDeck = [...this.state.playerDeck, card];
      this.state.board = { ...this.state.board, [slotId]: null };
      this.addLog(`>> ${card.name} retorna al fondo del mazo tras su activación.`);
    }
    // TURNO: mark as used this turn (card stays)
    if (categoria === "TURNO") {
      this.state.altarUsedThisTurn = { ...this.state.altarUsedThisTurn, [slotId]: true };
    }

    this.commit();
  }

  private resolveAltarEffect(effect: { type: string; scope: string; amount?: number; categoria?: string }, slotId: SlotId): void {
    const card = this.state.board[slotId];
    if (!card) return;

    this.addLog(`>> ⚡ Altar ${card.name} activado (${effect.categoria})!`);

    const col = slotId === "p-altar-luz" ? 1 : 3;

    switch (effect.type) {
      case "buff_atk": {
        const amount = effect.amount ?? 2;
        if (effect.scope === "self_lane") {
          // Buff monsters in the same column
          const monSlot = `p-mon-${col}` as SlotId;
          if (this.state.board[monSlot]) {
            this.modifyAtk(monSlot, amount);
            this.addLog(`>> +${amount} ATK a ${this.state.board[monSlot]!.name} en columna ${col}.`);
          }
        } else if (effect.scope === "all_allies") {
          for (const c of [1, 2, 3]) {
            const ms = `p-mon-${c}` as SlotId;
            if (this.state.board[ms]) {
              this.modifyAtk(ms, amount);
            }
          }
          this.addLog(`>> +${amount} ATK a todos tus monstruos.`);
        } else {
          // Default: self
          const monSlot = `p-mon-${col}` as SlotId;
          if (this.state.board[monSlot]) {
            this.modifyAtk(monSlot, amount);
          }
        }
        break;
      }
      case "debuff_atk": {
        const amount = effect.amount ?? 2;
        if (effect.scope === "enemy_lane") {
          const eMonSlot = `e-mon-${col}` as SlotId;
          if (this.state.board[eMonSlot]) {
            const eCard = this.state.board[eMonSlot]!;
            const key = `e-${eCard.name}`;
            const cur = this.state.effects.atkReduced[key] || 0;
            this.state.effects.atkReduced = { ...this.state.effects.atkReduced, [key]: cur + amount };
            this.addLog(`>> -${amount} ATK a ${eCard.name} en columna ${col}.`);
          }
        } else if (effect.scope === "all_enemies") {
          for (const c of [1, 2, 3]) {
            const eMs = `e-mon-${c}` as SlotId;
            if (this.state.board[eMs]) {
              const eCard = this.state.board[eMs]!;
              const key = `e-${eCard.name}`;
              const cur = this.state.effects.atkReduced[key] || 0;
              this.state.effects.atkReduced = { ...this.state.effects.atkReduced, [key]: cur + amount };
            }
          }
          this.addLog(`>> -${amount} ATK a todos los monstruos rivales.`);
        }
        break;
      }
      case "direct_damage": {
        const amount = effect.amount ?? 3;
        this.dealDamage("enemy", amount);
        this.addLog(`>> ${amount} daño directo al rival!`);
        break;
      }
      case "lp_gain": {
        const amount = effect.amount ?? 3;
        this.heal("player", amount);
        this.addLog(`>> +${amount} LP recuperados!`);
        break;
      }
      case "draw": {
        const amount = effect.amount ?? 1;
        this.draw("player", amount);
        this.addLog(`>> Robas ${amount} carta(s).`);
        break;
      }
      case "negate": {
        this.state.effects.negatedEffects = (this.state.effects.negatedEffects || 0) + 1;
        this.addLog(`>> Efecto rival negado!`);
        break;
      }
      case "move": {
        this.addLog(`>> Elige un monstruo para mover (simplificado: efecto registrado).`);
        break;
      }
      case "add_shield": {
        if (effect.scope === "self_lane") {
          const monSlot = `p-mon-${col}` as SlotId;
          if (this.state.board[monSlot]) {
            this.addShield(monSlot);
            this.addLog(`>> Escudo añadido a ${this.state.board[monSlot]!.name}.`);
          }
        } else if (effect.scope === "all_allies") {
          for (const c of [1, 2, 3]) {
            const ms = `p-mon-${c}` as SlotId;
            if (this.state.board[ms]) this.addShield(ms);
          }
          this.addLog(`>> Escudos añadidos a tus monstruos.`);
        }
        break;
      }
      default:
        this.addLog(`>> Efecto ${effect.type} ejecutado (resolución básica).`);
        break;
    }
  }

  /** Surrender the duel. */
  surrender(): void {
    this.state.phase = "lost";
    this.addLog(">> Te has rendido. ¡DERROTA!");
    this.commit();
  }

  /** Reset to initial state. */
  resetGame(): void {
    this.state = createInitialState();
    this.commit();
  }

  // ──────────────────────────────────────────
  // ENEMY AI STEPS
  // ──────────────────────────────────────────

  private enemyTurnStep0(): void {
    if (this.state.phase !== "playing" || !this.state.isEnemyTurn) return;
    this.state.enemyTurnPhase = "altar";
    this.commit();

    // Player's Umbral del Olvido: enemy discards at start of their turn
    const playerSombraAltar = this.state.board["p-altar-sombra"];
    if (playerSombraAltar && playerSombraAltar.name === "Umbral del Olvido" && this.state.enemyHand.length > 0) {
      const disc = discardRandom(this.state.enemyHand);
      if (disc.discarded) {
        this.state.enemyHand = disc.remaining;
        this.state.enemyDeck = [disc.discarded, ...this.state.enemyDeck];
        this.addLog(`>> ¡${playerSombraAltar.name} activa! El rival descarta [${disc.discarded.name}] al inicio de su turno.`);
      }
    }

    // Enemy's Umbral del Olvido: player discards at start of enemy turn
    const enemySombraAltar = this.state.board["e-altar-sombra"];
    if (enemySombraAltar && enemySombraAltar.name === "Umbral del Olvido" && this.state.playerHand.length > 0) {
      const disc = discardRandom(this.state.playerHand);
      if (disc.discarded) {
        this.state.playerHand = disc.remaining;
        this.state.playerDeck = [disc.discarded, ...this.state.playerDeck];
        this.addLog(`>> ¡${enemySombraAltar.name} activa! Descartas [${disc.discarded.name}] al inicio del turno rival.`);
      }
    }

    this.commit();
  }

  private enemyTurnStep1(): void {
    if (this.state.phase !== "playing" || !this.state.isEnemyTurn) return;
    this.state.enemyTurnPhase = "summon";
    this.commit();

    let newBoard = { ...this.state.board };
    let newEnemyHand = [...this.state.enemyHand];
    let newEnemyDeck = [...this.state.enemyDeck];
    let newPlayerHand = [...this.state.playerHand];
    let newPlayerDeck = [...this.state.playerDeck];
    let newPlayerLP = this.state.playerLP;
    let newEnemyLP = this.state.enemyLP;
    let newEffects = { ...this.state.effects };
    let phase = this.state.phase as "playing" | "won" | "lost";
    const maxCardsPerTurn = 2;
    let lastPlacedSlot: SlotId | null = null;

    for (let play = 0; play < maxCardsPerTurn && newEnemyHand.length > 0; play++) {
      const playedIdx = this.aiPickBestCard(newEnemyHand, newBoard, newEnemyLP, newPlayerLP, newPlayerHand);
      if (playedIdx < 0) {
        if (play === 0) this.addLog(">> El enemigo no puede jugar cartas.");
        break;
      }

      const c = newEnemyHand.splice(playedIdx, 1)[0];
      let placedSlot: SlotId | null = null;

      placedSlot = this.aiPlaceCard(
        c, newBoard, newEnemyHand, newEnemyDeck, newPlayerHand,
        newPlayerDeck, newPlayerLP, newEnemyLP, newEffects
      );

      // Re-read from state mutations (Genesis effects modify state directly)
      // Note: newEnemyHand is NOT re-read — it is only modified locally by splice
      newPlayerHand = this.state.playerHand;
      newPlayerDeck = this.state.playerDeck;
      newEnemyDeck = this.state.enemyDeck;
      newPlayerLP = this.state.playerLP;
      newEnemyLP = this.state.enemyLP;
      newEffects = this.state.effects;
      newBoard = this.state.board;

      if (placedSlot) {
        lastPlacedSlot = placedSlot;
        // Fire onPlace for enemy card and onEnemySummon on player cards
        const enemyInstance: CardInstance = { data: c, slotId: placedSlot, ownerId: "enemy", instanceFlags: {} };
        const placeLogs = fireOnPlace(this, enemyInstance, placedSlot);
        this.state.log = [...this.state.log, ...placeLogs];
        const summonLogs = fireOnEnemySummon(this, "enemy");
        this.state.log = [...this.state.log, ...summonLogs];
        // Re-read again after hooks (player hand/deck may change from onEnemySummon)
        // Note: newEnemyHand still not re-read — card scripts don't modify enemy's own hand
        newPlayerHand = this.state.playerHand;
        newPlayerDeck = this.state.playerDeck;
        newEnemyDeck = this.state.enemyDeck;
        newPlayerLP = this.state.playerLP;
        newEnemyLP = this.state.enemyLP;
        newEffects = this.state.effects;
        newBoard = this.state.board;
      } else {
        // Card couldn't be placed, return it
        newEnemyHand.push(c);
      }
    }

    if (newPlayerLP <= 0) { newPlayerLP = 0; phase = "lost"; }
    if (newEnemyLP <= 0) { newEnemyLP = 0; phase = "won"; }

    this.state = {
      ...this.state,
      board: newBoard,
      enemyHand: newEnemyHand,
      enemyDeck: newEnemyDeck,
      playerHand: newPlayerHand,
      playerDeck: newPlayerDeck,
      playerLP: Math.max(MIN_LP, newPlayerLP),
      enemyLP: Math.max(MIN_LP, newEnemyLP),
      effects: newEffects,
      enemyActionSlot: lastPlacedSlot,
      phase,
    };

    this.commit();
  }

  // ──────────────────────────────────────────
  // AI HELPER: Score and pick the best card from hand
  // ──────────────────────────────────────────

  private aiPickBestCard(
    hand: CardData[],
    board: Record<SlotId, CardData | null>,
    enemyLP: number,
    playerLP: number,
    playerHand: CardData[],
  ): number {
    let bestIdx = -1;
    let bestScore = -1;

    for (let idx = 0; idx < hand.length; idx++) {
      const c = hand[idx];
      const score = this.aiScoreCard(c, board, enemyLP, playerLP, playerHand);
      if (score > bestScore) {
        bestScore = score;
        bestIdx = idx;
      }
    }
    return bestIdx;
  }

  private aiScoreCard(
    c: CardData,
    board: Record<SlotId, CardData | null>,
    enemyLP: number,
    playerLP: number,
    playerHand: CardData[],
  ): number {
    let score = 0;
    const hasLuzAltar = !!board["e-altar-luz"];
    const hasSombraAltar = !!board["e-altar-sombra"];
    const bothAltars = hasLuzAltar && hasSombraAltar;
    const hasMon1 = !!board["e-mon-1"];
    const hasMon3 = !!board["e-mon-3"];
    const emptySlots = (!hasMon1 ? 1 : 0) + (!hasMon3 ? 1 : 0);

    // --- Energy cards: high priority if altar slot is empty ---
    if (c.flags.includes("isEnergy")) {
      if (!hasLuzAltar || !hasSombraAltar) {
        score = 100; // Always fill altar slots first
      } else {
        score = 10; // Altars full, low priority
      }
      return score;
    }

    // --- CORRUPCION: high priority if conditions met ---
    if (c.type === "CORRUPCION") {
      if (hasSombraAltar && hasMon3) {
        // Can sacrifice for a strong upgrade
        score = 90 + c.atk;
      } else {
        score = 0; // Can't play it
      }
      return score;
    }

    // --- ANOMALIA: check if valid target exists ---
    if (c.type === "ANOMALIA") {
      for (const col of [1, 3] as const) {
        const eAltar: SlotId = col === 1 ? "e-altar-luz" : "e-altar-sombra";
        const eMonSlot: SlotId = `e-mon-${col}`;
        const pMonSlot: SlotId = `p-mon-${col}`;
        if (board[eAltar] && board[eMonSlot] && !board[pMonSlot]) {
          score = 85 + board[eMonSlot]!.atk; // Higher if target ATK is high
          break;
        }
      }
      if (score === 0) score = 5; // Low chance to hold
      return score;
    }

    // --- GENESIS: very high priority when both altars active ---
    if (c.flags.includes("isGenesis")) {
      if (bothAltars && !board["e-mon-2"]) {
        score = 95 + c.atk;
      } else {
        score = 20; // Hold for later but not urgent
      }
      return score;
    }

    // --- ECLIPSE: priority when both altars active ---
    if (c.type === "ECLIPSE") {
      if (bothAltars && !board["e-mon-2"]) {
        score = 80 + c.atk;
      } else {
        score = 10; // Can't play without both altars
      }
      return score;
    }

    // --- Regular elementals ---
    const isRegular = c.flags.includes("isElemental");
    if (!isRegular) return 0;

    if (emptySlots === 0) {
      // All monster slots full — check if this card is a significant upgrade
      // Only overwrite if ATK is significantly higher (3+ more)
      const mon1Atk = board["e-mon-1"] ? board["e-mon-1"]!.atk : 0;
      const mon3Atk = board["e-mon-3"] ? board["e-mon-3"]!.atk : 0;
      const weakestSlotAtk = Math.min(mon1Atk, mon3Atk);
      if (c.atk >= weakestSlotAtk + 5) {
        score = 40 + c.atk; // Worth upgrading
      } else {
        score = 5; // Not worth playing yet
      }
      return score;
    }

    // Prefer higher ATK when board has empty slots
    score = 50 + c.atk;

    // --- Contextual bonuses ---
    // If enemy LP is low, prefer cards that might help (defensive or healing context)
    if (enemyLP <= 30) {
      // Prefer higher ATK to win battles
      score += c.atk * 0.5;
    }

    // If player has few cards in hand, cards with discard effects are less useful
    if (playerHand.length <= 1) {
      // Slightly boost pure ATK monsters
      if (c.atk >= 11) score += 5;
    }

    // Prefer Genesis-compatible cards when both altars are nearly ready
    if (hasLuzAltar && !hasSombraAltar) {
      // One altar missing — prefer energy to complete
      // (handled by energy scoring above, but slightly boost strong elementals too)
      if (c.atk >= 12) score += 3;
    }

    // Small random factor so AI isn't perfectly predictable
    score += Math.random() * 4;

    return score;
  }

  // ──────────────────────────────────────────
  // AI HELPER: Place a card on the board (returns placedSlot or null)
  // ──────────────────────────────────────────

  private aiPlaceCard(
    c: CardData,
    newBoard: Record<SlotId, CardData | null>,
    newEnemyHand: CardData[],
    newEnemyDeck: CardData[],
    newPlayerHand: CardData[],
    newPlayerDeck: CardData[],
    newPlayerLP: number,
    newEnemyLP: number,
    newEffects: EffectState,
  ): SlotId | null {
    let placedSlot: SlotId | null = null;

    if (c.flags.includes("isEnergy")) {
      if (!newBoard["e-altar-luz"]) {
        newBoard = { ...newBoard, "e-altar-luz": c }; placedSlot = "e-altar-luz";
      } else if (!newBoard["e-altar-sombra"]) {
        newBoard = { ...newBoard, "e-altar-sombra": c }; placedSlot = "e-altar-sombra";
      }
      if (placedSlot) {
        this.state.board = newBoard;
        this.addLog(`>> El enemigo colocó [${c.name}] en su Altar.`);
      }
      return placedSlot;
    }

    if (c.type === "CORRUPCION") {
      const sacrifice = newBoard["e-mon-3"]!;
      newEnemyDeck = [...newEnemyDeck, sacrifice];
      newBoard = { ...newBoard, "e-mon-3": c };
      placedSlot = "e-mon-3";
      this.state.board = newBoard;
      this.state.enemyDeck = newEnemyDeck;
      this.addLog(`>> ¡[${sacrifice.name}] es consumido! El enemigo invoca a [${c.name}].`);
      return placedSlot;
    }

    if (c.type === "ANOMALIA") {
      for (const col of [1, 3] as const) {
        const eAltar: SlotId = col === 1 ? "e-altar-luz" : "e-altar-sombra";
        const eMonSlot: SlotId = `e-mon-${col}`;
        const pMonSlot: SlotId = `p-mon-${col}`;
        if (newBoard[eAltar] && newBoard[eMonSlot] && !newBoard[pMonSlot]) {
          const target = newBoard[eMonSlot]!;
          newEnemyDeck = [...newEnemyDeck, target];
          newBoard = { ...newBoard, [eMonSlot]: null, [pMonSlot]: { ...c, atk: target.atk } };
          placedSlot = pMonSlot;
          this.state.board = newBoard;
          this.state.enemyDeck = newEnemyDeck;
          this.addLog(`>> ¡Anomalía enemiga consume [${target.name}]! Copia ATK:${target.atk}.`);
          break;
        }
      }
      return placedSlot;
    }

    if (c.flags.includes("isGenesis")) {
      newEnemyDeck = [newBoard["e-altar-luz"]!, newBoard["e-altar-sombra"]!, ...newEnemyDeck];
      newBoard = { ...newBoard, "e-altar-luz": null, "e-altar-sombra": null, "e-mon-2": c };
      placedSlot = "e-mon-2";
      this.state.board = newBoard;
      this.state.enemyDeck = newEnemyDeck;
      this.addLog(`>> ¡El enemigo despierta a [${c.name}]! Ambos Altares consumidos.`);
      // Genesis card-specific effects are handled by card script onPlace (fired in enemyTurnStep1)
      return placedSlot;
    }

    if (c.type === "ECLIPSE") {
      newBoard = { ...newBoard, "e-mon-2": c };
      placedSlot = "e-mon-2";
      this.state.board = newBoard;
      this.addLog(`>> El enemigo invocó a [${c.name}] en la Zona Central.`);
      return placedSlot;
    }

    // --- Regular elementals: choose best slot (todas las columnas abiertas) ---
    const emptySlots: SlotId[] = [];
    if (!newBoard["e-mon-1"]) emptySlots.push("e-mon-1");
    if (!newBoard["e-mon-2"]) emptySlots.push("e-mon-2");
    if (!newBoard["e-mon-3"]) emptySlots.push("e-mon-3");

    let target: SlotId | null = null;
    if (emptySlots.length > 0) {
      // Elegir la columna más ventajosa
      const pMon1 = newBoard["p-mon-1"];
      const pMon2 = newBoard["p-mon-2"];
      const pMon3 = newBoard["p-mon-3"];

      // Priorizar columna con monstruo enemigo débil opuesto para ataque directo
      const slotScores: { slot: SlotId; score: number }[] = emptySlots.map(slot => {
        const col = parseInt(slot.split("-")[2]);
        const pOpponent = newBoard[`p-mon-${col}` as SlotId];
        let score = 0;
        if (!pOpponent) score += 10; // Columna vacía = ataque directo
        else score += Math.max(0, c.atk - (pOpponent?.atk ?? 0)); // Ventaja ATK
        // Columna central (2) tiene ligera preferencia estratégica
        if (col === 2) score += 1;
        return { slot, score };
      });
      slotScores.sort((a, b) => b.score - a.score);
      target = slotScores[0].slot;
    } else {
      // Todos los slots ocupados: intentar reemplazar el más débil si vale la pena
      const occupiedSlots: SlotId[] = ["e-mon-1", "e-mon-2", "e-mon-3"];
      const weakest = occupiedSlots.reduce((prev, curr) =>
        (newBoard[curr]?.atk ?? 999) < (newBoard[prev]?.atk ?? 999) ? curr : prev
      );
      const weakAtk = newBoard[weakest]?.atk ?? 0;
      if (c.atk >= weakAtk + 5) {
        target = weakest;
      }
    }

    if (target) {
      // If upgrading, send old card back to deck
      if (newBoard[target]) {
        const oldCard = newBoard[target]!;
        newEnemyDeck = [...newEnemyDeck, oldCard];
        this.state.enemyDeck = newEnemyDeck;
        this.addLog(`>> El enemigo reemplaza [${oldCard.name}] por [${c.name}].`);
      } else {
        this.addLog(`>> El enemigo invocó a [${c.name}].`);
      }
      newBoard = { ...newBoard, [target]: c };
      placedSlot = target;
      this.state.board = newBoard;
    }

    return placedSlot;
  }

  private enemyTurnStep2(): void {
    if (this.state.phase !== "playing" || !this.state.isEnemyTurn) return;
    this.state.enemyTurnPhase = "attack";
    this.commit();

    let newBoard = { ...this.state.board };
    const newLog = [...this.state.log, ">> — Fase de Batalla Enemiga —"];
    let phase = this.state.phase as "playing" | "won" | "lost";

    // Pre-compute attack decisions using strategic evaluation
    const columnsToAttack: number[] = [];
    const columnsToSkip: number[] = [];

    for (let col = 1; col <= 3; col++) {
      const eSlot = `e-mon-${col}` as SlotId;
      const eMon = newBoard[eSlot];
      if (!eMon) continue;

      const pSlot = `p-mon-${col}` as SlotId;
      const pMon = newBoard[pSlot];
      const eAtk = this.computeEnemyMonAtk(eSlot);

      if (this.state.effects.playerNegateAttack.includes(col)) {
        newLog.push(`>> ¡Ataque de ${eMon.name} en columna ${col} negado por Ciclón Ancestral!`);
        continue;
      }

      if (this.state.effects.playerBlockColumn.includes(col)) {
        newLog.push(`>> ¡Columna ${col} bloqueada! ${eMon.name} no puede atacar.`);
        continue;
      }

      if (pMon) {
        const pStats = this.computePlayerMonAtk(pSlot);
        const pAtk = pStats.atk;

        if (eAtk < pAtk) {
          if (pStats.undestroyable) {
            if (this.state.enemyLP - (pAtk - eAtk) <= 0) { columnsToSkip.push(col); continue; }
            if ((pAtk - eAtk) >= 5) { columnsToSkip.push(col); continue; }
          } else if (this.state.effects.noEffectDestroy) {
            if ((pAtk - eAtk) >= 4) { columnsToSkip.push(col); continue; }
          } else {
            if ((pAtk - eAtk) >= 3) { columnsToSkip.push(col); continue; }
          }
        } else if (eAtk === pAtk) {
          const eMonCount = [newBoard["e-mon-1"], newBoard["e-mon-2"], newBoard["e-mon-3"]].filter(Boolean).length;
          const pMonCount = [newBoard["p-mon-1"], newBoard["p-mon-2"], newBoard["p-mon-3"]].filter(Boolean).length;
          if (eMonCount <= pMonCount && this.state.enemyLP <= 30) { columnsToSkip.push(col); continue; }
        }
      }

      columnsToAttack.push(col);
    }

    // Log skipped attacks
    for (const col of columnsToSkip) {
      const eSlot = `e-mon-${col}` as SlotId;
      const eMon = newBoard[eSlot];
      if (eMon) {
        const pSlot = `p-mon-${col}` as SlotId;
        const pMon = newBoard[pSlot];
        const pAtk = this.computePlayerMonAtk(pSlot).atk;
        newLog.push(`>> ${eMon.name} (ATK:${this.computeEnemyMonAtk(eSlot)}) decide no atacar a ${pMon?.name || "la columna"} ${pMon ? `(ATK:${pAtk})` : ""}.`);
      }
    }

    // Order: direct attacks first, then combat
    const directAttacks = columnsToAttack.filter(col => !newBoard[`p-mon-${col}` as SlotId]);
    const combatAttacks = columnsToAttack.filter(col => !!newBoard[`p-mon-${col}` as SlotId]);
    const orderedColumns = [...directAttacks, ...combatAttacks];

    if (orderedColumns.length === 0) {
      newLog.push(">> El enemigo no tiene monstruos para atacar.");
      this.state = { ...this.state, log: newLog, phase, enemyActionSlot: null };
      this.commit();
      setTimeout(() => this.enemyTurnStep3(), 500);
      return;
    }

    // Execute attacks with staggered timing
    const ATTACK_DELAY = 500;
    let attackIdx = 0;

    const executeNextAttack = () => {
      if (attackIdx >= orderedColumns.length) {
        // All attacks done — final state update
        this.state = {
          ...this.state,
          board: newBoard,
          playerLP: Math.max(MIN_LP, this.state.playerLP),
          enemyLP: Math.max(MIN_LP, this.state.enemyLP),
          playerDeck: this.state.playerDeck,
          enemyDeck: this.state.enemyDeck,
          playerHand: this.state.playerHand,
          enemyHand: this.state.enemyHand,
          log: newLog,
          phase,
          enemyActionSlot: null,
        };
        this.commit();
        setTimeout(() => this.enemyTurnStep3(), 500);
        return;
      }

      const col = orderedColumns[attackIdx];
      attackIdx++;

      const eSlot = `e-mon-${col}` as SlotId;
      const eMon = newBoard[eSlot];
      if (!eMon) { executeNextAttack(); return; }

      const pSlot = `p-mon-${col}` as SlotId;
      const pMon = newBoard[pSlot];
      const eAtk = this.computeEnemyMonAtk(eSlot);

      if (this.state.effects.playerNegateAttack.includes(col)) { executeNextAttack(); return; }
      if (this.state.effects.playerBlockColumn.includes(col)) { executeNextAttack(); return; }

      // Highlight attacking column
      this.state.enemyActionSlot = eSlot;

      const eAttackInstance: CardInstance = { data: eMon, slotId: eSlot, ownerId: "enemy", instanceFlags: {} };
      const eAttackDeclLogs = fireOnAttackDeclared(this, eAttackInstance, eSlot);
      newLog.push(...eAttackDeclLogs);

      if (pMon) {
        const pStats = this.computePlayerMonAtk(pSlot);
        const pAtk = pStats.atk;
        const pInstance: CardInstance = { data: pMon, slotId: pSlot, ownerId: "player", instanceFlags: {} };

        if (eAtk > pAtk) {
          if (pStats.undestroyable) {
            this.state.playerLP -= (eAtk - pAtk);
            newLog.push(`>> ${eMon.name} (ATK:${eAtk}) ataca pero ${pMon.name} (ATK:${pAtk}) es indestructible. -${eAtk - pAtk} LP.`);
          } else if (this.state.effects.noEffectDestroy) {
            this.state.playerLP -= (eAtk - pAtk);
            newLog.push(`>> ${eMon.name} (ATK:${eAtk}) vence a ${pMon.name} (ATK:${pAtk}) pero es protegido por Gaia. -${eAtk - pAtk} LP.`);
          } else {
            const pPrevented = fireBeforeDestroy(this, pInstance, pSlot);
            if (pPrevented) {
              this.state.playerLP -= (eAtk - pAtk);
              newLog.push(`>> ${pMon.name} resistió a la destrucción! -${eAtk - pAtk} LP.`);
            } else {
              this.state.playerLP -= (eAtk - pAtk);
              this.state.playerDeck = [pMon, ...this.state.playerDeck];
              newBoard = { ...newBoard, [pSlot]: null };
              newLog.push(`>> ${eMon.name} (ATK:${eAtk}) destruye ${pMon.name} (ATK:${pAtk}). -${eAtk - pAtk} LP.`);
              const hitLogs = fireOnAttackHit(this, eAttackInstance, eSlot);
              newLog.push(...hitLogs);
              const removeLogs = fireOnRemove(this, pInstance, pSlot);
              newLog.push(...removeLogs);
              newLog.push(...fireOnAllyDestroy(this, pSlot, "player"));
              newLog.push(...fireOnEnemyDestroy(this, pSlot, "player"));
            }
          }
        } else if (eAtk === pAtk) {
          if (this.state.effects.noEffectDestroy) {
            newLog.push(`>> ¡Empate! ${eMon.name} y ${pMon.name} (ATK:${pAtk}) pero Gaia los protege.`);
          } else {
            const ePrevented = fireBeforeDestroy(this, eAttackInstance, eSlot);
            const pPrevented = fireBeforeDestroy(this, pInstance, pSlot);
            if (!ePrevented) {
              this.state.enemyDeck = [eMon, ...this.state.enemyDeck];
              newBoard = { ...newBoard, [eSlot]: null };
              const removeLogs = fireOnRemove(this, eAttackInstance, eSlot);
              newLog.push(...removeLogs);
              newLog.push(...fireOnAllyDestroy(this, eSlot, "enemy"));
              newLog.push(...fireOnEnemyDestroy(this, eSlot, "enemy"));
            }
            if (!pPrevented) {
              this.state.playerDeck = [pMon, ...this.state.playerDeck];
              newBoard = { ...newBoard, [pSlot]: null };
              const removeLogs = fireOnRemove(this, pInstance, pSlot);
              newLog.push(...removeLogs);
              newLog.push(...fireOnAllyDestroy(this, pSlot, "player"));
              newLog.push(...fireOnEnemyDestroy(this, pSlot, "player"));
            }
            if (ePrevented || pPrevented) {
              newLog.push(`>> ¡Empate! ${eMon.name} y ${pMon.name} (ATK:${pAtk}).`);
              if (ePrevented) newLog.push(`>> ${eMon.name} resistió a la destrucción!`);
              if (pPrevented) newLog.push(`>> ${pMon.name} resistió a la destrucción!`);
            } else {
              newLog.push(`>> ¡Empate! ${eMon.name} y ${pMon.name} se destruyen mutuamente.`);
            }
          }
        } else {
          if (this.state.effects.noEffectDestroy) {
            this.state.enemyLP -= (pAtk - eAtk);
            newLog.push(`>> ${eMon.name} (ATK:${eAtk}) vencido por ${pMon.name} (ATK:${pAtk}). Protegido por Gaia. Enemigo -${pAtk - eAtk} LP.`);
          } else {
            const ePrevented = fireBeforeDestroy(this, eAttackInstance, eSlot);
            if (ePrevented) {
              this.state.enemyLP -= (pAtk - eAtk);
              newLog.push(`>> ${eMon.name} resistió a la destrucción! Enemigo -${pAtk - eAtk} LP.`);
            } else {
              this.state.enemyLP -= (pAtk - eAtk);
              this.state.enemyDeck = [eMon, ...this.state.enemyDeck];
              newBoard = { ...newBoard, [eSlot]: null };
              newLog.push(`>> ${eMon.name} (ATK:${eAtk}) es destruido por ${pMon.name} (ATK:${pAtk}). Enemigo -${pAtk - eAtk} LP.`);
              const removeLogs = fireOnRemove(this, eAttackInstance, eSlot);
              newLog.push(...removeLogs);
              newLog.push(...fireOnAllyDestroy(this, eSlot, "enemy"));
              newLog.push(...fireOnEnemyDestroy(this, eSlot, "enemy"));
            }
          }
        }
      } else {
        // Direct attack
        let finalAtk = eAtk;
        const playerArtifact = this.state.playerArtifact;
        if (playerArtifact?.artifactType === "intercepcion" && this.state.board["p-artifact"]) {
          finalAtk = Math.floor(finalAtk / 2);
          newLog.push(`>> 🛡 ${playerArtifact.name} activado: ATK reducido a la mitad (${finalAtk}).`);
          this.state.playerDeck = [...this.state.playerDeck, playerArtifact];
          newBoard = { ...newBoard, "p-artifact": null };
          this.state.playerArtifact = null;
          if (this.state.playerDeck.length > 0) {
            const drawn = this.state.playerDeck[0];
            this.state.playerDeck = this.state.playerDeck.slice(1);
            this.state.playerHand = [...this.state.playerHand, drawn];
            newLog.push(`>> ⚡ Compensación: robas 1 carta.`);
          }
        }
        const enemyArt = this.state.enemyArtifact;
        if (enemyArt?.artifactType === "global" && enemyArt.effects[0]?.id === "art_global_zona_muerta") {
          finalAtk *= 2;
          newLog.push(`>> ☠️ Zona Muerta: daño doble.`);
        }
        this.state.playerLP -= finalAtk;
        newLog.push(`>> ¡Ataque Directo! ${eMon.name} (ATK:${finalAtk}). -${finalAtk} LP.`);
        const hitLogs = fireOnAttackHit(this, eAttackInstance, eSlot);
        newLog.push(...hitLogs);
      }

      // Commit intermediate state so UI shows this attack
      this.state = {
        ...this.state,
        board: { ...newBoard },
        playerLP: Math.max(MIN_LP, this.state.playerLP),
        enemyLP: Math.max(MIN_LP, this.state.enemyLP),
        log: [...newLog],
        enemyActionSlot: eSlot,
      };
      this.commit();

      // Check win/lose
      if (this.state.playerLP <= 0) {
        this.state.playerLP = 0;
        this.state.phase = "lost";
        this.state.log = [...newLog, ">> ¡DERROTA! Te quedaste sin puntos de vida."];
        this.state.enemyActionSlot = null;
        this.commit();
        return;
      }
      if (this.state.enemyLP <= 0) {
        this.state.enemyLP = 0;
        this.state.phase = "won";
        this.state.log = [...newLog, ">> ¡VICTORIA! Has derrotado al rival."];
        this.state.enemyActionSlot = null;
        this.commit();
        return;
      }

      setTimeout(executeNextAttack, ATTACK_DELAY);
    };

    executeNextAttack();
  }

  private enemyTurnStep3(): void {
    if (this.state.phase !== "playing") return;
    this.state.enemyTurnPhase = "draw";
    this.commit();

    // Fire onTurnEnd for all enemy cards (end of enemy turn)
    const eTurnEndLogs = fireOnTurnEnd(this, "enemy");
    this.state.log = [...this.state.log, ...eTurnEndLogs];

    // Draw phase
    let newPlayerHand = [...this.state.playerHand];
    let newPlayerDeck = [...this.state.playerDeck];
    let newEnemyHand = [...this.state.enemyHand];
    let newEnemyDeck = [...this.state.enemyDeck];

    if (newPlayerDeck.length > 0) {
      const result = drawOne(newPlayerDeck);
      if (result.card) {
        newPlayerHand = [...newPlayerHand, result.card];
        newPlayerDeck = result.remainingDeck;
      }
    }
    if (newEnemyDeck.length > 0) {
      const result = drawOne(newEnemyDeck);
      if (result.card) {
        newEnemyHand = [...newEnemyHand, result.card];
        newEnemyDeck = result.remainingDeck;
      }
    }

    const newTurnNum = this.state.turnNumber + 1;
    const canAttack = newTurnNum > 1;
    this.addLog(`>> Tu Turno (${newTurnNum}). Has robado 1 carta.${canAttack ? "" : " (No puedes atacar este turno)."}`);

    let phase = this.state.phase as "playing" | "won" | "lost";
    if (this.state.playerLP <= 0) {
      phase = "lost";
      this.addLog(">> ¡DERROTA! Te quedaste sin puntos de vida.");
    }

    this.state = {
      ...this.state,
      playerHand: newPlayerHand,
      playerDeck: newPlayerDeck,
      enemyHand: newEnemyHand,
      enemyDeck: newEnemyDeck,
      isEnemyTurn: false,
      enemyTurnPhase: null,
      enemyActionSlot: null,
      turnNumber: newTurnNum,
      attackedThisTurn: [],
      summonedThisTurn: 0,
      attackMode: false,
      phase,
      enemyTagTeamUsed: false,
      enemyChainSummonAvailable: false,
      lastSummonSlot: null,
      altarUsedThisTurn: {},
    };

    this.commit();
  }

  // ──────────────────────────────────────────
  // ATK COMPUTATION (complex, from use-genesis-game.ts)
  // ──────────────────────────────────────────

  computePlayerMonAtk(
    slotId: SlotId
  ): BattleStats {
    const card = this.state.board[slotId];
    if (!card) return { atk: 0, penetrate: false, undestroyable: false, immuneEffectDestroy: false };

    const colNum = getColumn(slotId);
    const board = this.state.board;
    const effects = this.state.effects;
    let atk = card.atk;
    let penetrate = false;
    let undestroyable = false;
    let immuneEffectDestroy = false;

    // Global bonuses (from Genesis)
    atk += effects.globalAtkBonus;

    // Enemy global artifact effects
    const enemyArtifact = this.state.enemyArtifact;
    if (enemyArtifact?.artifactType === "global" && enemyArtifact.effects[0]?.id === "art_global_terremoto") {
      atk = Math.max(0, atk - 1);
    }

    // Check if ATK was reduced to 0 this turn
    const zeroKey = `p-${card.name}`;
    if (effects.atkToZero.includes(zeroKey)) atk = 0;

    // Check ATK reductions (skip if immune)
    let immuneAtkReduction = false;
    if (card.flags.includes("isElemental")) {
      // Cards 14, 59, 71 (Núcleo Volcánico, Volcán de Obsidiana, Muro de Aire) are immune
      if ([14, 59, 71].includes(card.id)) immuneAtkReduction = true;
    }
    if (!immuneAtkReduction) {
      const redKey = `p-${card.name}`;
      if (effects.atkReduced[redKey]) atk = Math.max(0, atk - effects.atkReduced[redKey]);
    }

    // Per-card ATK bonus
    const bonusKey = `p-${card.name}`;
    if (effects.atkBonus[bonusKey]) atk += effects.atkBonus[bonusKey];

    // ALTAR EFFECTS
    const luzAltar = board["p-altar-luz"];
    const sombraAltar = board["p-altar-sombra"];

    // Column 1 + Light Altar
    if (colNum === 1 && luzAltar) {
      for (const effectId of getAltarEffectIds(luzAltar)) {
        switch (effectId) {
          case "altar_atk_400": atk += 4; break;
          case "altar_prevent_destroy": undestroyable = true; break;
          // FULGUR altar boosts
          case "alt_fulg_atk_300_burn": if (card.type === "FULGUR") atk += 3; break;
          case "alt_fulg_all_fulg_100": if (card.type === "FULGUR") atk += 1; break;
          // AURA altar boosts
          case "alt_aura_atk_300_draw": if (card.type === "AURA") atk += 3; break;
          case "alt_aura_all_aura_100_discard": if (card.type === "AURA") atk += 1; break;
          // ABIS altar boosts
          case "alt_abis_drain_300": if (card.type === "ABIS") atk += 3; break;
          case "alt_abis_lp_scale": {
            if (card.type === "ABIS") {
              const missing = Math.max(0, 100 - this.state.playerLP);
              atk += Math.min(8, Math.floor(missing / 5) * 2);
            }
            break;
          }
        }
      }
    }

    // Column 3 + Shadow Altar
    if (colNum === 3 && sombraAltar) {
      for (const effectId of getAltarEffectIds(sombraAltar)) {
        switch (effectId) {
          case "altar_corrupt_atk_300": atk += 3; break;
          case "alt_fulg_atk_400_200lp": if (card.type === "FULGUR") atk += 4; break;
          case "alt_aura_atk_400_return": if (card.type === "AURA") atk += 4; break;
          case "alt_abis_sink_400": if (card.type === "ABIS") atk += 4; break;
        }
      }
    }

    // Global altar effects (apply to ALL monsters)
    if (luzAltar) {
      for (const effectId of getAltarEffectIds(luzAltar)) {
        if (effectId === "altar_all_atk_200") atk += 2;
      }
    }

    // Discard bonus (Guja del Destierro)
    atk += effects.discardBonusAtk;

    // Enemy's Guardián de Jade (Umbral): player monsters lose 2 ATK
    for (const checkCol of [1, 3]) {
      const jadeSlot = `e-mon-${checkCol}` as SlotId;
      if (board[jadeSlot] && board[jadeSlot]!.name === "Guardián de Jade" && board["e-altar-sombra"]) {
        atk -= 2;
        if (atk < 0) atk = 0;
        break;
      }
    }

    // ELEMENTAL CELESTIAL EFFECTS (col 1 + luz altar)
    if (colNum === 1 && luzAltar && card.flags.includes("isElemental")) {
      atk += this.computeCelestialAtk(card, slotId, board);
    }

    // ELEMENTAL UMBRAL EFFECTS (col 3 + sombra altar)
    if (colNum === 3 && sombraAltar && card.flags.includes("isElemental")) {
      const umbralResult = this.computeUmbralAtk(card, slotId, board);
      atk += umbralResult.atkBonus;
      if (umbralResult.penetrate) penetrate = true;
      if (umbralResult.undestroyable) undestroyable = true;
    }

    // ECLIPSE dual-altar bonus
    if (colNum === 2 && card.type === "ECLIPSE" && luzAltar && sombraAltar) {
      atk += 4;
    }

    // Equipment artifact ATK bonus
    const pArtifact = board["p-artifact"];
    if (pArtifact && pArtifact.artifactType === "equipo" && pArtifact.equippedTo === slotId) {
      atk += pArtifact.atk; // The artifact's ATK value serves as the buff amount
    }

    return { atk, penetrate, undestroyable, immuneEffectDestroy };
  }

  computeEnemyMonAtk(slotId: SlotId): number {
    const card = this.state.board[slotId];
    if (!card) return 0;

    const colNum = getColumn(slotId);
    const board = this.state.board;
    let atk = card.atk;

    // Player global artifact effects
    const playerArtifact = this.state.playerArtifact;
    if (playerArtifact?.artifactType === "global" && playerArtifact.effects[0]?.id === "art_global_terremoto") {
      atk = Math.max(0, atk - 1);
    }

    const luzAltar = board["e-altar-luz"];
    const sombraAltar = board["e-altar-sombra"];

    // Enemy light altar bonuses (col 1 specific)
    if (colNum === 1 && luzAltar) {
      for (const effectId of getAltarEffectIds(luzAltar)) {
        if (effectId === "altar_atk_400") atk += 4;
      }
    }

    // Enemy shadow altar bonuses (col 3 specific)
    if (colNum === 3 && sombraAltar) {
      for (const effectId of getAltarEffectIds(sombraAltar)) {
        if (effectId === "altar_corrupt_atk_300") atk += 3;
      }
    }

    // Global altar effects
    if (luzAltar) {
      for (const effectId of getAltarEffectIds(luzAltar)) {
        if (effectId === "altar_all_atk_200") atk += 2;
      }
    }
    if (sombraAltar) {
      for (const effectId of getAltarEffectIds(sombraAltar)) {
        if (effectId === "altar_all_atk_200") atk += 2;
      }
    }

    // Player's Espectro: enemy monsters in column 3 lose 3 ATK
    if (colNum === 3 && board["p-altar-sombra"]) {
      if (board["p-altar-sombra"]!.name === "Espectro del Vacío") {
        atk -= 3;
        if (atk < 0) atk = 0;
      }
    }

    // Player's Guardián de Jade (Umbral): all enemy monsters lose 2 ATK
    for (const checkCol of [1, 3]) {
      const jadeSlot = `p-mon-${checkCol}` as SlotId;
      if (board[jadeSlot] && board[jadeSlot]!.name === "Guardián de Jade" && board["p-altar-sombra"]) {
        atk -= 2;
        if (atk < 0) atk = 0;
        break;
      }
    }

    // Eclipse dual-altar
    if (colNum === 2 && card.type === "ECLIPSE" && luzAltar && sombraAltar) {
      atk += 4;
    }

    return atk;
  }

  // ──────────────────────────────────────────
  // CELESTIAL ATK BONUSES (passive, col 1 + luz)
  // ──────────────────────────────────────────

  private computeCelestialAtk(card: CardData, slotId: SlotId, board: Record<SlotId, CardData | null>): number {
    let bonus = 0;
    const cardId = card.id;
    const handSize = this.state.playerHand.length;
    const enemyHandSize = this.state.enemyHand.length;

    switch (cardId) {
      case 11: break; // Pyros: instant damage, no passive ATK
      case 12: break; // Chispa: global +2 handled by globalAtkBonus
      case 13: if (board["e-mon-1"]) bonus += 3; break; // Brasa Eterna: +3 if enemy in col 1
      case 15: // Llamarada Voraz: no passive ATK bonus
      case 16: break; // Ceniza: penetration, no ATK bonus
      // AURA
      case 17: break; // Zephyr: instant return
      case 18: break; // Hada: instant shuffle/draw
      case 19: bonus += handSize * 1; break; // Brisa Cortante: +1 per card in hand
      case 20: break; // Ciclón: instant clean
      case 21: break; // Tormento: conditional
      case 22: break; // Viento: negate attack
      // ABIS
      case 23: break; // Leviatán: instant heal
      case 24: bonus += 5; break; // Gota: +5 ATK
      case 25: break; // Coral: +1 on draw
      case 26: break; // Sirena: instant view
      case 27: break; // Abismo: hand cap
      case 28: break; // Tsunami: choose discard
      // FOSO
      case 29: bonus += 3; break; // Guardián de Jade: +3 ATK (Celestial)
      case 30: break; // Gólem: immune to effect destroy
      case 31: break; // Brote: add card
      case 32: { // Fisura: +2 if more enemy monsters
        const pCount = [board["p-mon-1"], board["p-mon-2"], board["p-mon-3"]].filter(Boolean).length;
        const eCount = [board["e-mon-1"], board["e-mon-2"], board["e-mon-3"]].filter(Boolean).length;
        if (eCount > pCount) bonus += 2;
        break;
      }
      case 33: break; // Guja: ATK on discard
      case 34: { // Fosa Mental: +4 if enemy has more cards
        if (enemyHandSize > handSize) bonus += 4;
        break;
      }
      // PIROCLASMA FULGUR
      case 57: { // Ignis: +1 per FULGUR on field
        const fCount = [board["p-mon-1"], board["p-mon-2"], board["p-mon-3"]].filter(c => c?.type === "FULGUR").length;
        bonus += fCount * 1;
        break;
      }
      case 58: break; // Incendio: instant damage
      case 59: break; // Volcán: immune to reduction
      case 60: break; // Tormenta Ígnea: instant burst
      // AETHÉRIA AURA
      case 69: bonus += handSize * 1; break; // Zéfir: +1 per card in hand
      case 70: break; // Tornado: instant damage
      case 71: break; // Muro de Aire: immune
      case 72: break; // Ventisca: instant burst
      // ABISMA ABIS
      case 81: bonus += 3; break; // Tiburón: steal 3 ATK
      case 82: break; // Medusa: instant petrify
      case 83: { // Coral Espejeado: mirror strongest enemy
        let maxEnemyAtk = 0;
        for (let i = 1; i <= 3; i++) {
          const eSlot = `e-mon-${i}` as SlotId;
          if (board[eSlot]) {
            const eAtk = this.computeEnemyMonAtk(eSlot);
            if (eAtk > maxEnemyAtk) maxEnemyAtk = eAtk;
          }
        }
        bonus += maxEnemyAtk;
        break;
      }
      case 84: break; // Anguila: instant tsunami
    }

    return bonus;
  }

  // ──────────────────────────────────────────
  // UMBRAL ATK BONUSES (passive, col 3 + sombra)
  // ──────────────────────────────────────────

  private computeUmbralAtk(card: CardData, slotId: SlotId, board: Record<SlotId, CardData | null>): {
    atkBonus: number;
    penetrate: boolean;
    undestroyable: boolean;
  } {
    let atkBonus = 0;
    let penetrate = false;
    let undestroyable = false;
    const cardId = card.id;
    const handSize = this.state.playerHand.length;
    const enemyHandSize = this.state.enemyHand.length;
    const playerLP = this.state.playerLP;
    const enemyLP = this.state.enemyLP;

    switch (cardId) {
      case 11: atkBonus += 4; break; // Pyros: +4 ATK (Umbral)
      case 12: break; // Chispa: destroy altar (instant)
      case 13: break; // Brasa: change position
      case 14: penetrate = true; break; // Núcleo: penetration
      case 15: { // Llamarada: +3 per fewer card
        const diff = handSize - enemyHandSize;
        if (diff < 0) atkBonus += Math.abs(diff) * 3;
        break;
      }
      case 16: penetrate = true; break; // Ceniza: penetration
      // AURA
      case 17: break; // Zephyr: destroy altar
      case 18: break; // Hada: force discard
      case 19: break; // Brisa: change column
      case 20: break; // Ciclón: negate attack
      case 21: if (enemyHandSize <= 3) atkBonus += 2; break; // Tormento
      case 22: break; // Viento: negate attack
      // ABIS
      case 23: break; // Leviatán: reduce ATK (instant)
      case 24: break; // Gota: death return
      case 25: break; // Coral: block column
      case 26: break; // Sirena: reduce to 0
      case 27: break; // Abismo: discard on kill
      case 28: if (enemyHandSize === 0) atkBonus += 4; break; // Tsunami
      // FOSO
      case 29: break; // Guardián de Jade: reduce enemy ATK (handled in computeEnemyMonAtk)
      case 30: undestroyable = true; break; // Gólem: indestructible en combate
      case 31: break; // Brote: add Umbral
      case 32: atkBonus += 6; break; // Fisura: +6 ATK
      case 33: if (enemyHandSize === 0) undestroyable = true; break; // Guja: undestroyable empty hand
      case 34: break; // Fosa Mental: block column
      // PIROCLASMA FULGUR
      case 57: break; // Ignis: kill 2 LP
      case 58: { // Incendio: +3 if other FULGUR
        const otherFulgur = [board["p-mon-1"], board["p-mon-2"], board["p-mon-3"]].filter(
          c => c && c.type === "FULGUR" && c.name !== card.name
        ).length;
        if (otherFulgur > 0) atkBonus += 3;
        break;
      }
      case 59: penetrate = true; break; // Volcán: penetration
      case 60: { // Tormenta Ígnea: +4 if 2+ FULGUR
        const fCount = [board["p-mon-1"], board["p-mon-2"], board["p-mon-3"]].filter(c => c?.type === "FULGUR").length;
        if (fCount >= 2) atkBonus += 4;
        break;
      }
      // AETHÉRIA AURA
      case 69: break; // Zéfir: return on kill
      case 70: { // Tornado: +3 if other AURA
        const otherAura = [board["p-mon-1"], board["p-mon-2"], board["p-mon-3"]].filter(
          c => c && c.type === "AURA" && c.name !== card.name
        ).length;
        if (otherAura > 0) atkBonus += 3;
        break;
      }
      case 71: break; // Muro: negate attack
      case 72: { // Ventisca: +4 if 2+ AURA
        const aCount = [board["p-mon-1"], board["p-mon-2"], board["p-mon-3"]].filter(c => c?.type === "AURA").length;
        if (aCount >= 2) atkBonus += 4;
        break;
      }
      // ABISMA ABIS
      case 81: { // Tiburón: +2 per 5 LP lead
        const lpDiff = enemyLP - playerLP;
        if (lpDiff > 0) atkBonus += Math.floor(lpDiff / 5) * 2;
        break;
      }
      case 82: break; // Medusa: sink on kill
      case 83: { // Coral Espejeado: +3 ATK + undestroyable if enemy more LP
        if (enemyLP > playerLP) {
          atkBonus += 3;
          undestroyable = true;
        }
        break;
      }
      case 84: { // Anguila: +3 per enemy monster
        const eCount = [board["e-mon-1"], board["e-mon-2"], board["e-mon-3"]].filter(Boolean).length;
        atkBonus += eCount * 3;
        break;
      }
    }

    return { atkBonus, penetrate, undestroyable };
  }

  // ──────────────────────────────────────────
  // INSTANT SUMMON EFFECTS (from use-genesis-game.ts)
  // ──────────────────────────────────────────

  private processSummonEffects(
    card: CardData,
    slotId: SlotId,
    board: Record<SlotId, CardData | null>,
    playerHand: CardData[],
    playerDeck: CardData[],
    enemyDeck: CardData[],
    enemyHand: CardData[],
    effects: EffectState
  ): {
    log: string[];
    lpDelta: number;
    enemyDeckDelta: CardData[];
    playerDeckDelta: CardData[];
    enemyHandDelta: CardData[];
    playerHandDelta: CardData[];
    boardDelta: Partial<Record<SlotId, CardData | null>>;
    effectDelta: Partial<EffectState>;
    discardBonusDelta?: number;
  } {
    const r = {
      log: [] as string[],
      lpDelta: 0,
      enemyDeckDelta: [] as CardData[],
      playerDeckDelta: [] as CardData[],
      enemyHandDelta: [] as CardData[],
      playerHandDelta: [] as CardData[],
      boardDelta: {} as Partial<Record<SlotId, CardData | null>>,
      effectDelta: {} as Partial<EffectState>,
    };

    const colNum = getColumn(slotId);
    const luzAltar = board["p-altar-luz"];
    const sombraAltar = board["p-altar-sombra"];

    // ── GENESIS EFFECTS: handled by card scripts (onPlace) per card ──
    // Cards 48,49,50,51,52,64,76,88 all have onPlace hooks in their card scripts.
    if (card.flags.includes("isGenesis")) {
      return r; // No-op: card script onPlace already fired and mutated engine state
    }

    // ── CELESTIAL SUMMON EFFECTS (col 1 + luz) ──
    if (colNum === 1 && luzAltar && card.flags.includes("isElemental")) {
      this.processCelestialEffects(card, board, playerHand, playerDeck, enemyDeck, enemyHand, effects, r);
    }

    // ── UMBRAL SUMMON EFFECTS (col 3 + sombra) ──
    if (colNum === 3 && sombraAltar && card.flags.includes("isElemental")) {
      this.processUmbralEffects(card, colNum, board, playerHand, playerDeck, enemyHand, effects, r);
    }

    return r;
  }

  // ── processGenesisEffects removed ──
  // Genesis card-specific effects (48,49,50,51,52,64,76,88) are now handled by
  // their respective card scripts via onPlace hooks. See:
  //   src/scripts/cards/48.ts (Aethel)
  //   src/scripts/cards/49.ts (Érebo)
  //   src/scripts/cards/50.ts (Poseidón)
  //   src/scripts/cards/51.ts (Gaia)
  //   src/scripts/cards/52.ts (Oblivion)
  //   src/scripts/cards/64.ts (Pyraxis)
  //   src/scripts/cards/76.ts (Aetheria)
  //   src/scripts/cards/88.ts (Océano)

  private processCelestialEffects(
    card: CardData,
    board: Record<SlotId, CardData | null>,
    playerHand: CardData[],
    playerDeck: CardData[],
    enemyDeck: CardData[],
    enemyHand: CardData[],
    effects: EffectState,
    r: { log: string[]; lpDelta: number; enemyDeckDelta: CardData[]; playerDeckDelta: CardData[]; enemyHandDelta: CardData[]; playerHandDelta: CardData[]; boardDelta: Partial<Record<SlotId, CardData | null>>; effectDelta: Partial<EffectState>; discardBonusDelta?: number }
  ): void {
    const cardId = card.id;

    switch (cardId) {
      case 11: // Pyros: direct damage 4
        r.lpDelta -= 4;
        r.log.push(`>> ¡Efecto Celestial de ${card.name}! Inflige 4 daño directo.`);
        break;
      case 12: // Chispa: all +2 ATK
        r.effectDelta.globalAtkBonus = (effects.globalAtkBonus || 0) + 2;
        r.log.push(`>> ¡Efecto Celestial de ${card.name}! Todos tus monstruos ganan +2 ATK.`);
        break;
      case 17: // Zephyr: return enemy to hand
        if (board["e-mon-1"]) {
          r.enemyHandDelta.push(board["e-mon-1"]!);
          r.boardDelta["e-mon-1"] = null;
          r.log.push(`>> ¡Efecto Celestial de ${card.name}! Regresa [${board["e-mon-1"]!.name}] a la mano rival.`);
        }
        break;
      case 18: // Hada: shuffle 1, draw 1
        if (playerHand.length > 1) {
          const removed = playerHand.slice(0, 1);
          r.playerDeckDelta.push(...removed);
          r.log.push(`>> ¡Efecto Celestial de ${card.name}! Baraja 1 carta al mazo y robarás 1 extra.`);
        }
        break;
      case 20: // Ciclón: clean reductions
        r.effectDelta.atkReduced = {};
        r.effectDelta.atkToZero = [];
        r.log.push(`>> ¡Efecto Celestial de ${card.name}! Limpia todas las reducciones de ATK de tus monstruos.`);
        break;
      case 23: // Leviatán: heal 5
        r.lpDelta += 5;
        r.log.push(`>> ¡Efecto Celestial de ${card.name}! Recuperas 5 LP.`);
        break;
      case 26: // Sirena: view top 2 of enemy deck
        if (enemyDeck.length > 0) {
          const top2 = enemyDeck.slice(-2).reverse();
          const names = top2.map(c => c.name).join(", ");
          r.log.push(`>> ¡Efecto Celestial de ${card.name}! Cartas superiores del rival: ${names}.`);
        }
        break;
      case 31: // Brote: add Celestial from deck
        {
          const idx = playerDeck.findIndex(c => c.type === "CELESTIAL");
          if (idx >= 0) {
            const found = playerDeck[idx];
            r.playerDeckDelta = [...playerDeck.slice(0, idx), ...playerDeck.slice(idx + 1)];
            r.playerHandDelta.push(found);
            r.log.push(`>> ¡Efecto Celestial de ${card.name}! Añade [${found.name}] a tu mano desde el mazo.`);
          }
        }
        break;
      case 15: // Llamarada: discard random
        {
          const disc = discardRandom(enemyHand);
          if (disc.discarded) {
            r.enemyHandDelta = disc.remaining;
            r.enemyDeckDelta.push(disc.discarded);
            r.log.push(`>> ¡Efecto Celestial de ${card.name}! El rival descarta [${disc.discarded.name}] al azar.`);
            r.discardBonusDelta = (r.discardBonusDelta || 0) + 1;
          } else {
            r.log.push(`>> ¡Efecto Celestial de ${card.name}! El rival no tiene cartas para descartar.`);
          }
        }
        break;
      case 21: // Tormento: choose discard
        {
          const disc = discardRandom(enemyHand);
          if (disc.discarded) {
            r.enemyHandDelta = disc.remaining;
            r.enemyDeckDelta.push(disc.discarded);
            r.log.push(`>> ¡Efecto Celestial de ${card.name}! El rival descarta [${disc.discarded.name}].`);
            r.discardBonusDelta = (r.discardBonusDelta || 0) + 1;
          }
        }
        break;
      case 16: // Ceniza: send card to deck
        if (enemyHand.length > 0) {
          const target = enemyHand[0];
          r.enemyHandDelta = enemyHand.slice(1);
          r.enemyDeckDelta.push(target);
          r.log.push(`>> ¡Efecto Celestial de ${card.name}! [${target.name}] va al fondo del mazo rival.`);
        }
        break;
      case 22: // Viento: steal to deck
        if (enemyHand.length > 0) {
          const stolen = enemyHand[0];
          r.enemyHandDelta = enemyHand.slice(1);
          r.enemyDeckDelta.push(stolen);
          r.log.push(`>> ¡Efecto Celestial de ${card.name}! Roba [${stolen.name}] de la mano rival al fondo del mazo.`);
        }
        break;
      case 28: // Tsunami: choose discard to deck
        if (enemyHand.length > 0) {
          const chosen = enemyHand[0];
          r.enemyHandDelta = enemyHand.slice(1);
          r.enemyDeckDelta.push(chosen);
          r.log.push(`>> ¡Efecto Celestial de ${card.name}! Elige [${chosen.name}] para mandarla al fondo del mazo.`);
        }
        break;
      case 27: // Abismo: hand cap
        if (enemyHand.length > 4) {
          const toDiscard = enemyHand.length - 4;
          const excess = enemyHand.slice(0, toDiscard);
          r.enemyHandDelta = enemyHand.slice(toDiscard);
          r.enemyDeckDelta.push(...excess);
          const names = excess.map(c => c.name).join(", ");
          r.log.push(`>> ¡Efecto Celestial de ${card.name}! Rival tiene ${enemyHand.length} cartas. Descarta ${names} hasta quedar con 4.`);
          r.discardBonusDelta = (r.discardBonusDelta || 0) + toDiscard;
        } else {
          r.log.push(`>> ¡Efecto Celestial de ${card.name}! La mano rival está en límite (≤4).`);
        }
        break;
      // PIROCLASMA
      case 58: // Incendio: 3 LP direct
        r.lpDelta -= 3;
        r.log.push(`>> ¡Efecto Celestial de ${card.name}! 3 LP daño directo al rival.`);
        break;
      case 60: // Tormenta Ígnea: all FULGUR +2 burst
        r.effectDelta.globalAtkBonus = (effects.globalAtkBonus || 0) + 2;
        r.log.push(`>> ¡Efecto Celestial de ${card.name}! Todos tus FULGUR ganan +2 ATK.`);
        break;
      // AETHÉRIA
      case 70: // Tornado: 2 LP direct
        r.lpDelta -= 2;
        r.log.push(`>> ¡Efecto Celestial de ${card.name}! 2 LP daño directo al rival.`);
        break;
      case 72: // Ventisca: all AURA +2 burst
        r.effectDelta.globalAtkBonus = (effects.globalAtkBonus || 0) + 2;
        r.log.push(`>> ¡Efecto Celestial de ${card.name}! Todos tus AURA ganan +2 ATK.`);
        break;
      // ABISMA
      case 82: // Medusa: petrify weakest
        {
          let weakest: string | null = null;
          let weakestAtk = Infinity;
          for (let i = 1; i <= 3; i++) {
            const eSlot = `e-mon-${i}` as SlotId;
            if (board[eSlot]) {
              const eAtk = this.computeEnemyMonAtk(eSlot);
              if (eAtk < weakestAtk) {
                weakestAtk = eAtk;
                weakest = board[eSlot]!.name;
              }
            }
          }
          if (weakest) {
            r.effectDelta.atkToZero = [...effects.atkToZero, `e-${weakest}`];
            r.log.push(`>> ¡Efecto Celestial de ${card.name}! [${weakest}] queda petrificado con 0 ATK.`);
          } else {
            r.log.push(`>> ¡Efecto Celestial de ${card.name}! No hay enemigos para petrificar.`);
          }
        }
        break;
      case 84: // Anguila: tsunami -2 to all enemies
        {
          let reduced = false;
          for (let i = 1; i <= 3; i++) {
            const eSlot = `e-mon-${i}` as SlotId;
            if (board[eSlot]) {
              const key = `e-${board[eSlot]!.name}`;
              const cur = effects.atkReduced[key] || 0;
              r.effectDelta.atkReduced = { ...r.effectDelta.atkReduced, [key]: cur + 2 };
              reduced = true;
            }
          }
          if (reduced) r.log.push(`>> ¡Efecto Celestial de ${card.name}! Tsunami: todos los enemigos pierden 2 ATK.`);
        }
        break;
    }
  }

  private processUmbralEffects(
    card: CardData,
    colNum: number,
    board: Record<SlotId, CardData | null>,
    playerHand: CardData[],
    playerDeck: CardData[],
    enemyHand: CardData[],
    effects: EffectState,
    r: { log: string[]; lpDelta: number; enemyDeckDelta: CardData[]; playerDeckDelta: CardData[]; enemyHandDelta: CardData[]; playerHandDelta: CardData[]; boardDelta: Partial<Record<SlotId, CardData | null>>; effectDelta: Partial<EffectState>; discardBonusDelta?: number }
  ): void {
    const cardId = card.id;

    switch (cardId) {
      case 11: break; // Pyros: no umbral instant
      case 12: // Chispa: destroy enemy altar
        {
          const eAltar: SlotId = "e-altar-sombra";
          if (board[eAltar]) {
            r.enemyDeckDelta.push(board[eAltar]!);
            r.boardDelta[eAltar] = null;
            r.log.push(`>> ¡Efecto Umbral de ${card.name}! Destruye el Altar enemigo de esta columna.`);
          }
        }
        break;
      case 17: // Zephyr: destroy enemy altar
        {
          const eAltar: SlotId = "e-altar-sombra";
          if (board[eAltar]) {
            r.enemyDeckDelta.push(board[eAltar]!);
            r.boardDelta[eAltar] = null;
            r.log.push(`>> ¡Efecto Umbral de ${card.name}! Destruye el Altar enemigo de esta columna.`);
          }
        }
        break;
      case 18: // Hada: force discard
        if (enemyHand.length > 0) {
          const discarded = enemyHand[0];
          r.enemyHandDelta = enemyHand.slice(1);
          r.enemyDeckDelta.push(discarded);
          r.log.push(`>> ¡Efecto Umbral de ${card.name}! El rival descarta [${discarded.name}].`);
        }
        break;
      case 20: // Ciclón: negate attack
        r.effectDelta.playerNegateAttack = [...effects.playerNegateAttack, 3];
        r.log.push(`>> ¡Efecto Umbral de ${card.name}! El próximo ataque enemigo en columna 3 será negado.`);
        break;
      case 22: // Viento: negate attack
        r.effectDelta.playerNegateAttack = [...effects.playerNegateAttack, 3];
        r.log.push(`>> ¡Efecto Umbral de ${card.name}! El próximo ataque enemigo en columna 3 será negado.`);
        break;
      case 23: // Leviatán: reduce ATK 3
        {
          const eSlot: SlotId = "e-mon-3";
          if (board[eSlot]) {
            const key = `e-${board[eSlot]!.name}`;
            r.effectDelta.atkReduced = { ...effects.atkReduced, [key]: (effects.atkReduced[key] || 0) + 3 };
            r.log.push(`>> ¡Efecto Umbral de ${card.name}! [${board[eSlot]!.name}] pierde 3 ATK.`);
          }
        }
        break;
      case 25: // Coral: block column
        r.effectDelta.playerBlockColumn = [...effects.playerBlockColumn, 3];
        r.log.push(`>> ¡Efecto Umbral de ${card.name}! Columna 3 bloqueada para el rival el próximo turno.`);
        break;
      case 26: // Sirena: reduce ATK to 0
        {
          const eSlot: SlotId = "e-mon-3";
          if (board[eSlot]) {
            r.effectDelta.atkToZero = [...effects.atkToZero, `e-${board[eSlot]!.name}`];
            r.log.push(`>> ¡Efecto Umbral de ${card.name}! [${board[eSlot]!.name}] queda con 0 ATK este turno.`);
          }
        }
        break;
      case 31: // Brote: add Umbral from deck
        {
          const uIdx = playerDeck.findIndex(c => c.type === "UMBRAL");
          if (uIdx >= 0) {
            const found = playerDeck[uIdx];
            r.playerDeckDelta = [...playerDeck.slice(0, uIdx), ...playerDeck.slice(uIdx + 1)];
            r.playerHandDelta.push(found);
            r.log.push(`>> ¡Efecto Umbral de ${card.name}! Añade [${found.name}] a tu mano desde el mazo.`);
          }
        }
        break;
      case 34: // Fosa Mental: block column
        r.effectDelta.playerBlockColumn = [...effects.playerBlockColumn, 3];
        r.log.push(`>> ¡Efecto Umbral de ${card.name}! Columna 3 bloqueada para el rival el próximo turno.`);
        break;
    }
  }

  // ──────────────────────────────────────────
  // NEW MECHANICS: Tag-Team, Chain Summon, Lane Change
  // ──────────────────────────────────────────

  tagTeamSwap(slotId: SlotId): void {
    const isPlayer = slotId.startsWith("p-");
    if (isPlayer && this.state.isEnemyTurn) return;
    if (!isPlayer && !this.state.isEnemyTurn) return;
    if (this.state.phase !== "playing") return;

    const card = this.state.board[slotId];
    if (!card) return;
    if (card.flags.includes("isEnergy") || card.flags.includes("isArtifact")) return;

    if (isPlayer && this.state.playerTagTeamUsed) return;
    if (!isPlayer && this.state.enemyTagTeamUsed) return;

    // Return monster to deck bottom
    this.moveToDeck(slotId);

    if (isPlayer) {
      this.state.playerTagTeamUsed = true;
      this.addLog(`>> Relevo: ${card.name} regresa al fondo del mazo.`);
    } else {
      this.state.enemyTagTeamUsed = true;
      this.addLog(`>> Relevo enemigo: ${card.name} regresa al fondo del mazo.`);
    }
    this.commit();
  }

  chainSummon(handIndex: number, slotId: SlotId): void {
    if (this.state.phase !== "playing") return;
    if (this.state.isEnemyTurn) return;
    if (!this.state.playerChainSummonAvailable) return;
    if (this.state.lastSummonSlot === slotId) return;
    if (handIndex < 0 || handIndex >= this.state.playerHand.length) return;

    const card = this.state.playerHand[handIndex];
    if (!card) return;
    if (card.flags.includes("isEnergy") || card.flags.includes("isArtifact")) return;

    // Place card on board
    this.state.playerHand = [...this.state.playerHand.slice(0, handIndex), ...this.state.playerHand.slice(handIndex + 1)];
    this.state.board = { ...this.state.board, [slotId]: card };
    this.state.summonedThisTurn++;
    this.state.playerChainSummonAvailable = false;

    this.addLog(`>> Chain Summon: ${card.name} invocado en ${slotId}.`);
    this.commit();

    // Fire onPlace hook
    const instance: CardInstance = { data: card, slotId, ownerId: "player", instanceFlags: {} };
    const logs = fireOnPlace(this, instance, slotId);
    this.state.log = [...this.state.log, ...logs];
    this.commit();
  }

  laneChange(fromSlot: SlotId, toSlot: SlotId): void {
    if (this.state.phase !== "playing") return;
    if (this.state.isEnemyTurn) return;

    const isPlayer = fromSlot.startsWith("p-");
    if (isPlayer && this.state.playerLaneChangeUsed) return;
    if (!isPlayer && this.state.enemyLaneChangeUsed) return;

    const card = this.state.board[fromSlot];
    if (!card) return;
    if (this.state.board[toSlot] !== null) return;

    // Move monster
    this.state.board = { ...this.state.board, [fromSlot]: null, [toSlot]: card };

    if (isPlayer) {
      this.state.playerLaneChangeUsed = true;
      this.addLog(`>> Asalto Lateral: ${card.name} se mueve de ${fromSlot} a ${toSlot}.`);
    } else {
      this.state.enemyLaneChangeUsed = true;
      this.addLog(`>> Asalto Lateral enemigo: ${card.name} se mueve de ${fromSlot} a ${toSlot}.`);
    }
    this.commit();
  }

  specialSummonFromHand(handIndex: number, slotId: SlotId): void {
    if (this.state.phase !== "playing") return;
    if (this.state.isEnemyTurn) return;
    if (this.state.playerSpecialSummonUsed) return;
    if (handIndex < 0 || handIndex >= this.state.playerHand.length) return;

    const card = this.state.playerHand[handIndex];
    if (!card) return;

    this.state.playerHand = [...this.state.playerHand.slice(0, handIndex), ...this.state.playerHand.slice(handIndex + 1)];
    this.state.board = { ...this.state.board, [slotId]: card };
    this.state.playerSpecialSummonUsed = true;

    this.addLog(`>> Invocación Especial: ${card.name} invocado en ${slotId}.`);
    this.commit();

    const instance: CardInstance = { data: card, slotId, ownerId: "player", instanceFlags: {} };
    const logs = fireOnPlace(this, instance, slotId);
    this.state.log = [...this.state.log, ...logs];
    this.commit();
  }

  specialSummonFromDeck(slotId: SlotId, _element: CardType): void {
    if (this.state.phase !== "playing") return;
    if (this.state.playerSpecialSummonUsed) return;

    // Find a suitable card in deck (simplified: take first card)
    const deck = this.state.playerDeck;
    if (deck.length === 0) return;

    const card = deck[0];
    this.state.playerDeck = deck.slice(1);
    this.state.board = { ...this.state.board, [slotId]: card };
    this.state.playerSpecialSummonUsed = true;

    this.addLog(`>> Cobertura Cruzada: ${card.name} invocado desde el mazo en ${slotId}.`);
    this.commit();

    const instance: CardInstance = { data: card, slotId, ownerId: "player", instanceFlags: {} };
    const logs = fireOnPlace(this, instance, slotId);
    this.state.log = [...this.state.log, ...logs];
    this.commit();
  }

  placeArtifact(handIndex: number): void {
    if (this.state.phase !== "playing") return;
    if (this.state.isEnemyTurn) return;
    if (handIndex < 0 || handIndex >= this.state.playerHand.length) return;

    const card = this.state.playerHand[handIndex];
    if (!card || card.type !== "ARTEFACTO") return;
    if (this.state.board["p-artifact"] !== null) return;

    this.state.playerHand = [...this.state.playerHand.slice(0, handIndex), ...this.state.playerHand.slice(handIndex + 1)];
    this.state.board = { ...this.state.board, "p-artifact": card };
    this.state.playerArtifact = card;

    this.addLog(`>> Artefacto: ${card.name} activado en el campo.`);
    this.commit();

    const instance: CardInstance = { data: card, slotId: "p-artifact", ownerId: "player", instanceFlags: {} };
    const logs = fireOnPlace(this, instance, "p-artifact");
    this.state.log = [...this.state.log, ...logs];
    this.commit();
  }

  compensationDraw(target: "player" | "enemy"): void {
    if (target === "enemy") {
      this.draw("enemy", 1);
      this.addLog(`>> ⚡ Compensación de Flujo: el rival roba 1 carta.`);
    } else {
      // For player draw, we need to manually draw since draw() defaults to enemy
      if (this.state.playerDeck.length > 0) {
        const drawn = this.state.playerDeck[0];
        this.state.playerDeck = this.state.playerDeck.slice(1);
        this.state.playerHand = [...this.state.playerHand, drawn];
        this.addLog(`>> ⚡ Compensación de Flujo: robras 1 carta (${drawn.name}).`);
      }
    }
    this.commit();
  }

  // ──────────────────────────────────────────
  // ENEMY GENESIS EFFECTS — removed
  // ──────────────────────────────────────────
  // applyEnemyGenesisEffect has been removed. All Genesis card-specific effects
  // (48,49,50,51,52) are now handled by their card scripts via onPlace hooks,
  // fired in enemyTurnStep1 after aiPlaceCard returns. See:
  //   src/scripts/cards/48.ts (Aethel)
  //   src/scripts/cards/49.ts (Érebo)
  //   src/scripts/cards/50.ts (Poseidón)
  //   src/scripts/cards/51.ts (Gaia)
  //   src/scripts/cards/52.ts (Oblivion)
}

// ──────────────────────────────────────────
// HELPER: get altar effect IDs from card data
// ──────────────────────────────────────────

function getAltarEffectIds(altar: CardData): string[] {
  // Map card names to their effect IDs based on card data
  const nameToEffectId: Record<string, string[]> = {
    "Serafín del Ala Rota": ["altar_prevent_destroy"],
    "Guardián del Alba": ["altar_all_atk_200"],
    "Valeria, Portadora del Amanecer": ["altar_atk_400"],
    "Destello Primordial": ["altar_no_draw_effects"],
    "Luz Devoradora": ["altar_discard_on_summon"],
    "Malakor, Susurro del Abismo": ["altar_corrupt_atk_300"],
    "Vórtice Oscuro": ["altar_no_attack_effects"],
    "Kaelen, la Sombra Fugaz": ["altar_enemy_summon_lp_loss"],
    "Espectro del Vacío": ["altar_enemy_col_atk_300"],
    "Umbral del Olvido": ["altar_discard_turn_start"],
    "Hoguera Ancestral": ["alt_fulg_atk_300_burn"],
    "Llama Primordial": ["alt_fulg_all_fulg_100"],
    "Brasas del Inframundo": ["alt_fulg_atk_400_200lp"],
    "Ceniza Eterna": ["alt_fulg_kill_200lp"],
    "Nido del Vórtice": ["alt_aura_atk_300_draw"],
    "Brisa del Alba": ["alt_aura_all_aura_100_discard"],
    "Refugio de la Tormenta": ["alt_aura_atk_400_return"],
    "Ojo del Huracán": ["alt_aura_kill_draw_reduce"],
    "Arrecife Bioluminiscente": ["alt_abis_drain_300"],
    "Manantial Primordial": ["alt_abis_lp_scale"],
    "Fosa Abisal": ["alt_abis_sink_400"],
    "Trinchera Oscura": ["alt_abis_kill_discard_trap"],
  };
  return nameToEffectId[altar.name] || [];
}
