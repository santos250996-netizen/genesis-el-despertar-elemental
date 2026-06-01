// ============ ENGINE TYPES — GÉNESIS: EL DESPERTAR ELEMENTAL ============
// Arquitectura definitiva v2 — Sin DEF, efectos duales, sistema declarativo

// ═══════════════════════════════════════════════════════════════
// ENUMS PRIMARIOS
// ═══════════════════════════════════════════════════════════════

/** Razas del juego — define la familia biológica/mítica de la criatura */
export type RazaTipo =
  | "GENS"      // Primigenios, seres luminosos
  | "VOLATUS"   // Alados, criaturas del cielo
  | "MARINA"    // Acuáticos, seres del abismo
  | "FERA"      // Bestias, depredadores
  | "NECRO"     // No-muertos, señores de la muerte
  | "ANIMA"     // Espíritus, almas errantes
  | "SECAT"     // Desertores, renegados del vacío
  | "CLASTO"    // Destructores, fuerzas brutas
  | "SATIVA"    // Naturaleza viva, criaturas vegetales
  | "ARTIFEX"   // Constructores, artífices
  | "FABULA";   // Criaturas míticas, leyendas

/** Atributos — tipo de energía que define combinaciones en el tablero */
export type Atributo =
  | "FULGUR"     // Fuego
  | "ABIS"       // Agua profunda
  | "FOSO"       // Tierra
  | "AURA"       // Viento
  | "CELESTIAL"  // Luz
  | "UMBRAL";    // Oscuridad

/** Método de invocación — CÓMO entra la carta al campo */
export type MetodoInvocacion =
  | "NORMAL"      // Invocación directa a zona de monstruo
  | "ANOMALIA"    // Consume un monstruo enemigo
  | "CORRUPCION"  // Sacrifica un aliado + requiere altar sombra
  | "ECLIPSE"     // Requiere ambos altares activos
  | "GENESIS";    // Requiere ambos altares, los consume al invocar

// ═══════════════════════════════════════════════════════════════
// SISTEMA DE EFECTOS DECLARATIVOS (Opción 1C — Híbrida)
// ═══════════════════════════════════════════════════════════════

/** Momento en que se activa el efecto */
export type TriggerType =
  | "on_attack"         // Al declarar ataque
  | "on_summon"         // Al ser invocada al campo
  | "on_destroy"        // Al ser destruida
  | "on_destroy_enemy"  // Al destruir un monstruo enemigo
  | "on_enemy_attack"   // Cuando un enemigo ataca en tu carril
  | "on_turn_start"     // Al inicio del turno
  | "on_turn_end"       // Al final del turno
  | "once_per_turn"     // Una vez por turno (activación manual)
  | "on_consume"        // Al consumir un enemigo (Anomalía)
  | "on_sacrifice"      // Al ser sacrificada (Corrupción)
  | "passive";          // Pasivo: siempre activo mientras está en campo

/** Qué hace el efecto */
export type EfectoType =
  | "buff_atk"           // Aumentar ATK propio o de aliados
  | "debuff_atk"         // Reducir ATK enemigo
  | "direct_damage"      // Daño directo al LP enemigo
  | "destroy"            // Destruir una carta
  | "add_shield"         // Añadir contador_escudo (inmunidad 1 ataque)
  | "draw"               // Robar carta(s)
  | "recover"            // Recuperar carta del cementerio/mazo
  | "negate"             // Negar un efecto
  | "move"               // Mover carta entre carriles
  | "switch_mode"        // Cambiar modo altar ↔ monstruo
  | "lp_gain"            // Ganar LP
  | "inherit_atk"        // Heredar ATK de otra carta
  | "prevent_destroy"    // Prevenir destrucción
  | "atk_diff_damage"    // Daño = diferencia de ATK
  | "penetrate"          // Daño penetrante (ignora monstruo enemigo)
  | "destroy_column";    // Destruir toda una columna

/** Quién/es son afectados por el efecto */
export type ScopeType =
  | "self"              // La carta misma
  | "self_lane"         // Todas las cartas del carril propio
  | "all_allies"        // Todos los aliados en el campo
  | "enemy_lane"        // Carril enemigo opuesto
  | "all_enemies"       // Todos los monstruos enemigos
  | "target"            // Un objetivo seleccionado
  | "opponent_lp"       // LP del oponente
  | "self_lp"           // LP propio
  | "enemy_altar"       // Altar enemigo
  | "column"            // Toda una columna (ambos lados)
  | "graveyard";        // Cementerio / fondo del mazo

/** Condición que debe cumplirse para que el efecto se active */
export type ConditionType =
  | "has_celestial_altar"   // Hay altar CELESTIAL activo propio
  | "has_umbral_altar"      // Hay altar UMBRAL activo propio
  | "has_both_altars"       // Ambos altares propios activos
  | "has_matching_altar"    // Hay altar del mismo atributo
  | "enemy_lower_atk"       // Enemigo en la misma columna tiene menos ATK
  | "controls_altar"        // Controlas al menos un altar
  | "self_is_altar"         // La carta está en modo altar
  | "self_is_monster"       // La carta está en modo monstruo
  | "none";                 // Sin condición (siempre activo)

// ═══════════════════════════════════════════════════════════════
// EFECTO DESCRIPTOR — Unidad atómica de efecto
// ═══════════════════════════════════════════════════════════════

export interface EfectoDescriptor {
  /** Cuándo se dispara */
  trigger: TriggerType;
  /** Qué hace */
  type: EfectoType;
  /** Magnitud del efecto (+300 ATK, -400 ATK, 200 daño, etc.) */
  amount?: number;
  /** Quién recibe el efecto */
  scope: ScopeType;
  /** Condición para activarse */
  condition?: ConditionType;
  /** Descripción legible para la UI */
  desc: string;
}

// ═══════════════════════════════════════════════════════════════
// CARTA MAESTRA — Objeto unificado (Opción 5A)
// ═══════════════════════════════════════════════════════════════

export interface CartaMaestra {
  /** Identificador único de la carta */
  id: string;
  /** Nombre de la carta */
  nombre: string;
  /** Raza / tipo de criatura */
  raza_tipo: RazaTipo;
  /** Atributo de energía */
  atributo: Atributo;
  /** Método de invocación */
  metodo_invocacion: MetodoInvocacion;
  /** Única estadística de combate — NO existe DEF */
  atk: number;
  /** Si la carta está en modo altar (Columna 1 o 3, pasiva) */
  es_altar: boolean;
  /** Escudo: bloquea 1 ataque completo, luego se gasta (máx 1 por carta) */
  contador_escudo: number;
  /** Efecto que se activa cuando la carta lucha en el campo (es_altar = false) */
  efecto_monstruo: EfectoDescriptor[];
  /** Efecto que se activa cuando la carta está en modo altar (es_altar = true) */
  efecto_altar: EfectoDescriptor[];
}

// ═══════════════════════════════════════════════════════════════
// SLOTS DEL TABLERO 3×3
// ═══════════════════════════════════════════════════════════════

export type SlotId =
  | "p-mon-1"        // Player monstruo columna 1
  | "p-mon-2"        // Player monstruo columna 2 (central)
  | "p-mon-3"        // Player monstruo columna 3
  | "p-altar-luz"    // Player altar de luz
  | "p-altar-sombra" // Player altar de sombra
  | "p-artifact"     // Player artefacto
  | "e-mon-1"        // Enemy monstruo columna 1
  | "e-mon-2"        // Enemy monstruo columna 2
  | "e-mon-3"        // Enemy monstruo columna 3
  | "e-altar-luz"    // Enemy altar de luz
  | "e-altar-sombra" // Enemy altar de sombra
  | "e-artifact";    // Enemy artefacto

// ═══════════════════════════════════════════════════════════════
// ENEMIGOS
// ═══════════════════════════════════════════════════════════════

export type EnemyType = "Ignis" | "Zephyr" | "Hydra" | "Terran";

// ═══════════════════════════════════════════════════════════════
// INFO VISUAL — Atributos
// ═══════════════════════════════════════════════════════════════

export const ATRIBUTO_INFO: Record<Atributo, {
  label: string;
  border: string;
  gradient: string;
  textColor: string;
  emoji: string;
}> = {
  FULGUR: {
    label: "Fulgur",
    border: "border-red-500",
    gradient: "from-red-800 to-orange-900",
    textColor: "text-red-300",
    emoji: "🔥",
  },
  ABIS: {
    label: "Abis",
    border: "border-blue-500",
    gradient: "from-blue-800 to-cyan-950",
    textColor: "text-blue-300",
    emoji: "🌊",
  },
  FOSO: {
    label: "Foso",
    border: "border-amber-600",
    gradient: "from-amber-700 to-yellow-950",
    textColor: "text-amber-300",
    emoji: "⛰️",
  },
  AURA: {
    label: "Aura",
    border: "border-emerald-500",
    gradient: "from-emerald-800 to-teal-950",
    textColor: "text-emerald-300",
    emoji: "🌪️",
  },
  CELESTIAL: {
    label: "Celestial",
    border: "border-amber-400",
    gradient: "from-amber-500 via-yellow-600 to-amber-800",
    textColor: "text-amber-200",
    emoji: "☀️",
  },
  UMBRAL: {
    label: "Umbral",
    border: "border-violet-500",
    gradient: "from-violet-800 via-indigo-900 to-purple-950",
    textColor: "text-violet-300",
    emoji: "🌑",
  },
};

// ═══════════════════════════════════════════════════════════════
// INFO VISUAL — Razas
// ═══════════════════════════════════════════════════════════════

export const RAZA_INFO: Record<RazaTipo, { label: string; emoji: string; concepto: string; ejemplos: string }> = {
  GENS:     { label: "Gens",     emoji: "✨", concepto: "Los Mortales / Las Civilizaciones", ejemplos: "Guerreros, caballeros, chamanes, sabios, reyes" },
  VOLATUS:  { label: "Volatus",  emoji: "🪶", concepto: "Los Alados / Dominio Aéreo", ejemplos: "Ángeles, valquirias, grifos, pegasos, arpías" },
  MARINA:   { label: "Marina",   emoji: "🐚", concepto: "Las Aguas / Fuerzas Náuticas", ejemplos: "Tritones, sirenas, leviatanes, serpientes de mar" },
  FERA:     { label: "Fera",     emoji: "🐾", concepto: "Las Bestias Salvajes", ejemplos: "Lobos, osos gigantes, leones prehistóricos, quimeras" },
  NECRO:    { label: "Necro",    emoji: "💀", concepto: "Los No-Muertos / Reanimados", ejemplos: "Esqueletos, zombis, momias, liches" },
  ANIMA:    { label: "Ánima",    emoji: "👻", concepto: "Los Espíritus / Energías Incorpóreas", ejemplos: "Fantasmas, fuegos fatuos, poltergeist, sombras andantes" },
  SECAT:    { label: "Secat",    emoji: "🕳️", concepto: "El Enjambre / Los Insectos", ejemplos: "Escarabajos, avispas, mantis, arañas, escorpiones" },
  CLASTO:   { label: "Clasto",   emoji: "💥", concepto: "Las Rocas / Los Minerales", ejemplos: "Golems, gigantes de piedra, monolitos rúnicos, gárgolas" },
  SATIVA:   { label: "Sativa",   emoji: "🌿", concepto: "La Botánica / Las Plantas", ejemplos: "Ents, plantas carnívoras, hongos caminantes, zarzas" },
  ARTIFEX:  { label: "Artifex",  emoji: "⚙️", concepto: "Lo Fabricado / Las Máquinas", ejemplos: "Autómatas, robots rúnicos, goliats de metal" },
  FABULA:   { label: "Fábula",  emoji: "📖", concepto: "La Mitología / Los Dioses", ejemplos: "Dioses ancestrales, titanes, avatares divinos" },
};

// ═══════════════════════════════════════════════════════════════
// INFO VISUAL — Métodos de Invocación
// ═══════════════════════════════════════════════════════════════

export const METODO_INFO: Record<MetodoInvocacion, {
  label: string;
  border: string;
  gradient: string;
  textColor: string;
  badge: string;
  emoji: string;
}> = {
  NORMAL: {
    label: "Normal",
    border: "border-zinc-400",
    gradient: "from-zinc-700 to-zinc-900",
    textColor: "text-zinc-300",
    badge: "bg-zinc-700/80 text-zinc-300 border border-zinc-500/50",
    emoji: "⚔️",
  },
  ANOMALIA: {
    label: "Anomalía",
    border: "border-purple-500",
    gradient: "from-purple-800 to-purple-950",
    textColor: "text-purple-200",
    badge: "bg-purple-900/80 text-purple-200 border border-purple-500/50",
    emoji: "🌀",
  },
  CORRUPCION: {
    label: "Corrupción",
    border: "border-red-500",
    gradient: "from-red-800 to-red-950",
    textColor: "text-red-200",
    badge: "bg-red-900/80 text-red-200 border border-red-500/50",
    emoji: "☣",
  },
  ECLIPSE: {
    label: "Eclipse",
    border: "border-indigo-400",
    gradient: "from-indigo-800 to-indigo-950",
    textColor: "text-indigo-200",
    badge: "bg-indigo-900/80 text-indigo-200 border border-indigo-500/50",
    emoji: "🌗",
  },
  GENESIS: {
    label: "Génesis",
    border: "border-fuchsia-400",
    gradient: "from-fuchsia-800 via-purple-900 to-fuchsia-950",
    textColor: "text-fuchsia-100",
    badge: "bg-fuchsia-900/80 text-fuchsia-100 border border-fuchsia-500/50",
    emoji: "💎",
  },
};

// ═══════════════════════════════════════════════════════════════
// COMPATIBILIDAD HACIA ATRÁS — CardData para el motor existente
// El motor y la UI se actualizarán en un paso posterior.
// Por ahora, CartaMaestra se adapta a la interfaz CardData
// que el engine/core.ts y page.tsx esperan.
// ═══════════════════════════════════════════════════════════════

/** @deprecated Usar CartaMaestra directamente tras migrar el motor */
export type CardType =
  | "CELESTIAL" | "UMBRAL" | "FULGUR" | "AURA" | "ABIS" | "FOSO"
  | "ECLIPSE" | "CORRUPCION" | "ANOMALIA" | "GENESIS"
  | "ARTEFACTO";

/** @deprecated Migrar a ATRIBUTO_INFO + METODO_INFO */
export const CARD_TYPE_INFO: Record<CardType, {
  label: string;
  border: string;
  gradient: string;
  textColor: string;
}> = {
  CELESTIAL: ATRIBUTO_INFO.CELESTIAL,
  UMBRAL:    ATRIBUTO_INFO.UMBRAL,
  FULGUR:    ATRIBUTO_INFO.FULGUR,
  AURA:      ATRIBUTO_INFO.AURA,
  ABIS:      ATRIBUTO_INFO.ABIS,
  FOSO:      ATRIBUTO_INFO.FOSO,
  ECLIPSE:   { label: "Eclipse",    border: "border-indigo-400",   gradient: "from-indigo-800 to-indigo-950",   textColor: "text-indigo-200" },
  CORRUPCION:{ label: "Corrupción", border: "border-red-500",      gradient: "from-red-800 to-red-950",         textColor: "text-red-200" },
  ANOMALIA:  { label: "Anomalía",   border: "border-purple-500",   gradient: "from-purple-800 to-purple-950",   textColor: "text-purple-200" },
  GENESIS:   { label: "Génesis",    border: "border-fuchsia-400",  gradient: "from-fuchsia-800 via-purple-900 to-fuchsia-950", textColor: "text-fuchsia-100" },
  ARTEFACTO: { label: "Artefacto",  border: "border-zinc-500",     gradient: "from-zinc-600 to-zinc-800",       textColor: "text-zinc-400" },
};

// ═══════════════════════════════════════════════════════════════
// CARD DATA — Interfaz de compatibilidad para el motor actual
// Se construye a partir de CartaMaestra via cartaToCardData()
// ═══════════════════════════════════════════════════════════════

export interface CardData {
  id: number;
  name: string;
  type: CardType;
  atk: number;
  effects: { trigger: string; desc: string; id?: string }[];
  flags: string[];
  alsoMatches?: string[];
  /** @deprecated Legacy ARTEFACTO field */
  artifactType?: "global" | "intercepcion";
  // ── Campos nuevos de CartaMaestra ──
  _cartaMaestra: CartaMaestra;
  raza_tipo: RazaTipo;
  atributo: Atributo;
  metodo_invocacion: MetodoInvocacion;
  es_altar: boolean;
  contador_escudo: number;
  efecto_monstruo: EfectoDescriptor[];
  efecto_altar: EfectoDescriptor[];
}

// ═══════════════════════════════════════════════════════════════
// ADAPTADOR: CartaMaestra → CardData
// ═══════════════════════════════════════════════════════════════

/** Convierte un id string numérico a número para compatibilidad */
function idToNumber(id: string): number {
  const num = parseInt(id, 10);
  return isNaN(num) ? id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) : num;
}

/** Mapea MetodoInvocacion + Atributo al CardType legacy.
 *  NORMAL → usa el atributo (CELESTIAL/UMBRAL) como tipo visual.
 *  Los métodos especiales (ANOMALIA, CORRUPCION, ECLIPSE, GENESIS)
 *  usan su método como tipo para estilizado propio.
 */
function metodoToCardType(m: MetodoInvocacion, atributo: Atributo): CardType {
  if (m === "NORMAL") return atributo as CardType;
  return m as CardType;
}

/** Genera flags legacy a partir de CartaMaestra */
function generarFlags(carta: CartaMaestra): string[] {
  const flags: string[] = [];
  if (carta.metodo_invocacion === "GENESIS") flags.push("isGenesis");
  if (carta.metodo_invocacion === "ECLIPSE") flags.push("isEclipse");
  if (carta.metodo_invocacion === "CORRUPCION") flags.push("isCorruption");
  if (carta.metodo_invocacion === "ANOMALIA") flags.push("isAnomaly");
  if (carta.es_altar) flags.push("isAltar");
  // Las cartas normales que pueden ir a altar también son elementales
  flags.push("isElemental");
  return flags;
}

/** Convierte EfectoDescriptor[] al formato legacy de effects */
function efectosToLegacy(efectos: EfectoDescriptor[]): { trigger: string; desc: string }[] {
  return efectos.map(e => ({
    trigger: e.trigger,
    desc: e.desc,
  }));
}

/** Convierte CartaMaestra a CardData para compatibilidad con el motor actual */
export function cartaToCardData(carta: CartaMaestra): CardData {
  return {
    id: idToNumber(carta.id),
    name: carta.nombre,
    type: metodoToCardType(carta.metodo_invocacion, carta.atributo),
    atk: carta.atk,
    effects: efectosToLegacy([...carta.efecto_monstruo, ...carta.efecto_altar]),
    flags: generarFlags(carta),
    // Campos nuevos
    _cartaMaestra: carta,
    raza_tipo: carta.raza_tipo,
    atributo: carta.atributo,
    metodo_invocacion: carta.metodo_invocacion,
    es_altar: carta.es_altar,
    contador_escudo: carta.contador_escudo,
    efecto_monstruo: carta.efecto_monstruo,
    efecto_altar: carta.efecto_altar,
  };
}

// ═══════════════════════════════════════════════════════════════
// EFFECT STATE (runtime)
// ═══════════════════════════════════════════════════════════════

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
  /** Contadores de escudo activos por slotId */
  shieldCounters: Record<string, number>;
  /** Efectos negados este turno por altar */
  negatedEffects: number;
}

// ═══════════════════════════════════════════════════════════════
// CARD INSTANCE (runtime)
// ═══════════════════════════════════════════════════════════════

export interface CardInstance {
  data: CardData;
  slotId: SlotId;
  ownerId: "player" | "enemy";
  instanceFlags: Record<string, boolean>;
}

// ═══════════════════════════════════════════════════════════════
// CARD SCRIPT (hooks por carta, estilo EDOPRO)
// ═══════════════════════════════════════════════════════════════

export interface CardScript {
  onPlace?: (ctx: DuelContext) => void;
  onRemove?: (ctx: DuelContext) => void;
  onAttackDeclared?: (ctx: DuelContext) => void;
  onAttackHit?: (ctx: DuelContext) => void;
  beforeDestroy?: (ctx: DuelContext) => boolean;
  onEnemySummon?: (ctx: DuelContext) => void;
  onEnemyDestroy?: (ctx: DuelContext) => void;
  onAllyDestroy?: (ctx: DuelContext) => void;
  onTurnStart?: (ctx: DuelContext) => void;
  onTurnEnd?: (ctx: DuelContext) => void;
  onDraw?: (ctx: DuelContext) => void;
}

// ═══════════════════════════════════════════════════════════════
// GAME STATE
// ═══════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════
// DUEL CONTEXT & ENGINE INTERFACE
// ═══════════════════════════════════════════════════════════════

export interface DuelContext {
  engine: DuelEngine;
  card: CardInstance;
  slotId: SlotId;
  log: string[];
}

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
  specialSummonFromDeck(slotId: SlotId, element: Atributo): void;
  placeArtifact(handIndex: number): void;
  compensationDraw(target: "player" | "enemy"): void;
  addShield(slotId: SlotId): void;
  consumeShield(slotId: SlotId): boolean;
}
