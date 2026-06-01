// ============ ENGINE TYPES (EDOPRO-style modular system) ============

// --- Card Categories (Yu-Gi-Oh style) ---
export type CardCategory = "monster" | "artifact";

// --- Card Races (monster types) ---
export type CardRace =
  | "GENS"      // Genesis-related, primordial beings
  | "VOLATUS"   // Flying creatures
  | "MARINA"    // Sea creatures
  | "FERA"      // Beasts
  | "NECRO"     // Undead
  | "ANIMA"     // Spirit beings
  | "SECAT"     // Dark/void creatures
  | "CLASTO"    // Stone/earth creatures
  | "SATIVA"    // Plant/nature creatures
  | "ARTIFEX"   // Artifice/mechanical
  | "FABULA";   // Mythical creatures

// --- Card Subtypes (summoning methods) ---
export type CardSubtype = "normal" | "eclipse" | "genesis" | "corruption" | "anomaly";

// --- Card Elements (attributes, all equal) ---
export type CardElement =
  | "FULGUR"    // Fire
  | "ABIS"      // Water/abyss
  | "FOSO"      // Earth
  | "AURA"      // Wind
  | "CELESTIAL" // Light
  | "UMBRAL";   // Dark

// --- Card Flags ---
export type CardFlag =
  | "isAltar"      // Can go to altar slot AND monster slot
  | "isGenesis"    // Can only go to column 2
  | "isEclipse"    // Can only go to column 2
  | "isCorruption" // Column 3, requires sacrifice
  | "isAnomaly";   // Targets enemy monster

// --- Card Effect ---
export interface CardEffect {
  trigger: "altar" | "summon" | "field" | "artifact";
  id: string;
  desc: string;
}

// --- Card Data (static definition) ---
export interface CardData {
  id: number;
  name: string;
  category: CardCategory;
  race: CardRace;
  element: CardElement;
  subtype?: CardSubtype; // only for monsters
  atk: number;
  flags: CardFlag[];
  effects: CardEffect[];
  desc: string;
  artifactType?: "intercepcion" | "aceleracion" | "global";
}

// --- Backward Compatibility (deprecated) ---
/** @deprecated Use CardElement instead */
export type CardType =
  | "CELESTIAL"
  | "UMBRAL"
  | "FULGUR"
  | "AURA"
  | "ABIS"
  | "FOSO"
  | "ECLIPSE"
  | "CORRUPCION"
  | "ANOMALIA"
  | "GENESIS"
  | "ARTEFACTO";

// --- Slot IDs ---
export type SlotId =
  | "p-mon-1" | "p-mon-2" | "p-mon-3"
  | "p-altar-luz" | "p-altar-sombra"
  | "p-artifact"
  | "e-mon-1" | "e-mon-2" | "e-mon-3"
  | "e-altar-luz" | "e-altar-sombra"
  | "e-artifact";

// --- Enemy Types ---
export type EnemyType = "Ignis" | "Zephyr" | "Hydra" | "Terran";

// --- UI Info Maps ---

export const CARD_ELEMENT_INFO: Record<
  CardElement,
  { label: string; gradient: string; border: string; textColor: string }
> = {
  CELESTIAL: { label: "Celestial", gradient: "from-slate-200 to-slate-400", border: "border-slate-300", textColor: "text-white" },
  UMBRAL: { label: "Umbral", gradient: "from-indigo-800 to-indigo-950", border: "border-indigo-600", textColor: "text-white" },
  FULGUR: { label: "Fulgur", gradient: "from-red-700 to-red-900", border: "border-red-500", textColor: "text-white" },
  AURA: { label: "Aura", gradient: "from-emerald-700 to-emerald-900", border: "border-emerald-500", textColor: "text-white" },
  ABIS: { label: "Abis", gradient: "from-blue-700 to-blue-950", border: "border-blue-500", textColor: "text-white" },
  FOSO: { label: "Foso", gradient: "from-amber-700 to-amber-950", border: "border-amber-500", textColor: "text-white" },
};

export const CARD_RACE_INFO: Record<
  CardRace,
  { label: string }
> = {
  GENS: { label: "Gens" },
  VOLATUS: { label: "Volatus" },
  MARINA: { label: "Marina" },
  FERA: { label: "Fera" },
  NECRO: { label: "Necro" },
  ANIMA: { label: "Anima" },
  SECAT: { label: "Secat" },
  CLASTO: { label: "Clasto" },
  SATIVA: { label: "Sativa" },
  ARTIFEX: { label: "Artifex" },
  FABULA: { label: "Fabula" },
};

export const CARD_SUBTYPE_INFO: Record<
  CardSubtype,
  { label: string; gradient: string; border: string }
> = {
  normal: { label: "Normal", gradient: "from-zinc-600 to-zinc-800", border: "border-zinc-400" },
  eclipse: { label: "Eclipse", gradient: "from-fuchsia-700 to-fuchsia-950", border: "border-fuchsia-400" },
  genesis: { label: "Génesis", gradient: "from-black via-purple-800 to-black", border: "border-purple-400" },
  corruption: { label: "Corrupción", gradient: "from-green-700 to-green-950", border: "border-green-400" },
  anomaly: { label: "Anomalía", gradient: "from-zinc-500 to-zinc-900", border: "border-zinc-400" },
};

// --- Legacy CARD_TYPE_INFO (deprecated, kept for migration) ---
/** @deprecated Use CARD_ELEMENT_INFO instead */
export const CARD_TYPE_INFO: Record<
  CardType,
  { label: string; gradient: string; border: string; textColor: string }
> = {
  CELESTIAL: { label: "Celestial", gradient: "from-slate-200 to-slate-400", border: "border-slate-300", textColor: "text-white" },
  UMBRAL: { label: "Umbral", gradient: "from-indigo-800 to-indigo-950", border: "border-indigo-600", textColor: "text-white" },
  FULGUR: { label: "Fulgur", gradient: "from-red-700 to-red-900", border: "border-red-500", textColor: "text-white" },
  AURA: { label: "Aura", gradient: "from-emerald-700 to-emerald-900", border: "border-emerald-500", textColor: "text-white" },
  ABIS: { label: "Abis", gradient: "from-blue-700 to-blue-950", border: "border-blue-500", textColor: "text-white" },
  FOSO: { label: "Foso", gradient: "from-amber-700 to-amber-950", border: "border-amber-500", textColor: "text-white" },
  ECLIPSE: { label: "Eclipse", gradient: "from-fuchsia-700 to-fuchsia-950", border: "border-fuchsia-400", textColor: "text-white" },
  CORRUPCION: { label: "Corrupcion", gradient: "from-green-700 to-green-950", border: "border-green-400", textColor: "text-white" },
  ANOMALIA: { label: "Anomalia", gradient: "from-zinc-500 to-zinc-900", border: "border-zinc-400", textColor: "text-white" },
  GENESIS: { label: "Genesis", gradient: "from-black via-purple-800 to-black", border: "border-purple-400", textColor: "text-white" },
  ARTEFACTO: { label: "Artefacto", gradient: "from-zinc-600 to-zinc-800", border: "border-zinc-400", textColor: "text-zinc-200" },
};

// --- Card Script (per-card hooks, EDOPRO-style) ---
export interface CardScript {
  onPlace?: (ctx: DuelContext) => void;
  onRemove?: (ctx: DuelContext) => void;
  onAttackDeclared?: (ctx: DuelContext) => void;
  onAttackHit?: (ctx: DuelContext) => void;
  beforeDestroy?: (ctx: DuelContext) => boolean; // return true to prevent
  onEnemySummon?: (ctx: DuelContext) => void;
  onEnemyDestroy?: (ctx: DuelContext) => void;
  onAllyDestroy?: (ctx: DuelContext) => void;
  onTurnStart?: (ctx: DuelContext) => void;
  onTurnEnd?: (ctx: DuelContext) => void;
  onDraw?: (ctx: DuelContext) => void;
}

// --- Card Instance (runtime card on the board) ---
export interface CardInstance {
  data: CardData;
  slotId: SlotId;
  ownerId: "player" | "enemy";
  instanceFlags: Record<string, boolean>;
}

// --- Effect State ---
export interface EffectState {
  playerNegateAttack: number[];
  playerBlockColumn: number[];
  enemyNegateAttack: number[];
  enemyBlockColumn: number[];
  atkReduced: Record<string, number>;
  atkToZero: string[];
  noEffectDestroy: boolean;
  globalAtkBonus: number;
  discardBonusAtk: number;
  atkBonus: Record<string, number>;
  compensationDrawPending: "player" | "enemy" | null;
}

// --- Game State ---
export interface GameState {
  phase: "setup" | "playing" | "won" | "lost";
  playerLP: number;
  enemyLP: number;
  playerDeck: CardData[];
  enemyDeck: CardData[];
  playerHand: CardData[];
  enemyHand: CardData[];
  board: Record<SlotId, CardData | null>;
  playerArtifact: CardData | null;
  enemyArtifact: CardData | null;
  selectedCardIndex: number | null;
  enemyType: EnemyType;
  log: string[];
  isEnemyTurn: boolean;
  enemyTurnPhase: "altar" | "summon" | "attack" | "draw" | null;
  enemyActionSlot: SlotId | null;
  effects: EffectState;
  turnNumber: number;
  attackMode: boolean;
  attackedThisTurn: string[];
  summonedThisTurn: number;
  playerSpecialSummonUsed: boolean;
  enemySpecialSummonUsed: boolean;
  playerLaneChangeUsed: boolean;
  enemyLaneChangeUsed: boolean;
  playerTagTeamUsed: boolean;
  enemyTagTeamUsed: boolean;
  playerChainSummonAvailable: boolean;
  enemyChainSummonAvailable: boolean;
  lastSummonSlot: SlotId | null;
}

// --- Duel Context (passed to card scripts) ---
export interface DuelContext {
  engine: DuelEngine;
  card: CardInstance;
  slotId: SlotId;
  log: string[];
}

// --- Duel Engine (core engine reference) ---
export interface DuelEngine {
  state: GameState;
  getCard(id: number): CardData;
  getPlayerAtk(slotId: SlotId): number;
  getEnemyAtk(slotId: SlotId): number;
  dealDamage(target: "player" | "enemy", amount: number): void;
  heal(target: "player" | "enemy", amount: number): void;
  destroyCard(slotId: SlotId, sendTo?: "hand" | "deck" | "grave"): void;
  moveToHand(slotId: SlotId): void;
  moveToDeck(slotId: SlotId): void;
  discard(target: "player" | "enemy", count: number): void;
  draw(target: "player" | "enemy", count: number): void;
  addLog(msg: string): void;
  negateAttack(column: number): void;
  blockColumn(column: number): void;
  modifyAtk(slotId: SlotId, delta: number): void;
  setAtkToZero(slotId: SlotId): void;
  setGlobalAtkBonus(bonus: number): void;
  setNoEffectDestroy(value: boolean): void;
  tagTeamSwap(slotId: SlotId): void;
  chainSummon(handIndex: number, slotId: SlotId): void;
  laneChange(fromSlot: SlotId, toSlot: SlotId): void;
  specialSummonFromHand(handIndex: number, slotId: SlotId): void;
  specialSummonFromDeck(slotId: SlotId, element: CardElement): void;
  placeArtifact(handIndex: number): void;
  compensationDraw(target: "player" | "enemy"): void;
}
