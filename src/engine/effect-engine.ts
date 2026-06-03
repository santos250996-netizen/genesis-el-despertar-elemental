// ============ GENERIC EFFECT ENGINE ============
// Motor declarativo que lee EfectoDescriptor[] y ejecuta los efectos
// automáticamente según trigger, type, scope, amount y condition.
// Reemplaza la necesidad de scripts individuales por carta.

import type {
  EfectoDescriptor,
  CardData,
  SlotId,
  EffectState,
  RazaTipo,
  Atributo,
} from "./types";
import { checkCondition } from "./condition-checker";

// ═══════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════

/** Interfaz que el motor de efectos necesita del engine para operar */
export interface EffectEngineAPI {
  state: {
    board: Record<SlotId, CardData | null>;
    effects: EffectState;
    playerLP: number;
    enemyLP: number;
    playerDeck: CardData[];
    enemyDeck: CardData[];
    playerHand: CardData[];
    enemyHand: CardData[];
    playerArtifact: CardData | null;
    enemyArtifact: CardData | null;
    attackedThisTurn: string[];
    log: string[];
  };
  addLog(msg: string): void;
  dealDamage(target: "player" | "enemy", amount: number): void;
  heal(target: "player" | "enemy", amount: number): void;
  modifyAtk(slotId: SlotId, delta: number): void;
  destroyCard(slotId: SlotId, sendTo?: "hand" | "deck" | "grave"): void;
  draw(target: "player" | "enemy", count: number): void;
  addShield(slotId: SlotId): void;
  consumeShield(slotId: SlotId): boolean;
}

/** Contexto para resolución de un efecto */
export interface EffectContext {
  engine: EffectEngineAPI;
  sourceCard: CardData;
  sourceSlot: SlotId;
  owner: "player" | "enemy";
  /** Datos adicionales según el trigger */
  extra?: {
    consumedEnemy?: CardData;     // Para on_consume (Anomalía)
    sacrificedAlly?: CardData;    // Para on_sacrifice (Corrupción)
    destroyedEnemy?: CardData;    // Para on_destroy_enemy
    attackedColumn?: number;      // Para on_attack, on_enemy_attack
    flipFromAttack?: CardData;    // Para on_flip (quién atacó)
  };
}

// ═══════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════

/** Obtiene la columna numérica de un slotId */
function getCol(slotId: SlotId): number {
  return parseInt(slotId.split("-")[2]);
}

/** Obtiene el slot de monstruo enemigo opuesto */
function getOpposingMonsterSlot(sourceSlot: SlotId, owner: "player" | "enemy"): SlotId {
  const col = getCol(sourceSlot);
  const prefix = owner === "player" ? "e" : "p";
  return `${prefix}-mon-${col}` as SlotId;
}

/** Obtiene todos los slots de monstruos de un owner */
function getMonsterSlots(owner: "player" | "enemy"): SlotId[] {
  const prefix = owner === "player" ? "p" : "e";
  return [1, 2, 3].map(c => `${prefix}-mon-${c}` as SlotId);
}

/** Obtiene todos los slots del tablero de un owner */
function getAllBoardSlots(owner: "player" | "enemy"): SlotId[] {
  const prefix = owner === "player" ? "p" : "e";
  return [
    `${prefix}-mon-1`, `${prefix}-mon-2`, `${prefix}-mon-3`,
    `${prefix}-altar-luz`, `${prefix}-altar-sombra`,
  ] as SlotId[];
}

/** Comprueba si una carta pertenece a un atributo específico */
function cardMatchesAttribute(card: CardData, atributo: Atributo): boolean {
  return card.atributo === atributo || card.alsoMatches?.includes(atributo) || false;
}

/** Comprueba si una carta pertenece a un arquetipo */
function cardMatchesArquetipo(card: CardData, arquetipo: string): boolean {
  return card.arquetipo === arquetipo;
}

// ═══════════════════════════════════════════════════════════════
// MOTOR DE RESOLUCIÓN DE EFECTOS
// ═══════════════════════════════════════════════════════════════

/**
 * Resuelve una lista de efectos descriptivos contra el estado del juego.
 * Retorna los logs generados.
 */
export function resolveEffects(
  efectos: EfectoDescriptor[],
  ctx: EffectContext
): string[] {
  const logs: string[] = [];
  const board = ctx.engine.state.board;

  for (const efecto of efectos) {
    // 1. Verificar condición
    if (!checkCondition(efecto.condition, ctx.sourceCard, ctx.sourceSlot, board, ctx.owner)) {
      continue; // Condición no cumplida, saltar efecto
    }

    // 2. Resolver según tipo de efecto
    const result = resolveSingleEffect(efecto, ctx);
    if (result) logs.push(result);
  }

  return logs;
}

/**
 * Resuelve un único efecto descriptivo.
 * Retorna un mensaje de log o null si no aplica.
 */
function resolveSingleEffect(
  efecto: EfectoDescriptor,
  ctx: EffectContext
): string | null {
  const { engine, sourceCard, sourceSlot, owner } = ctx;
  const board = engine.state.board;
  const amount = efecto.amount ?? 0;
  const scope = efecto.scope;
  const col = getCol(sourceSlot);

  // Prefijos según owner
  const myPrefix = owner === "player" ? "p" : "e";
  const oppPrefix = owner === "player" ? "e" : "p";
  const myTarget = owner === "player" ? "player" : "enemy" as const;
  const oppTarget = owner === "player" ? "enemy" : "player" as const;

  switch (efecto.type) {
    // ═══════════════════════════════════════════════
    // BUFF ATK — Aumentar ATK
    // ═══════════════════════════════════════════════
    case "buff_atk": {
      const targets = getScopeTargets(scope, ctx);
      for (const slot of targets) {
        engine.modifyAtk(slot, amount);
      }
      return `>> +${amount} ATK para ${scopeDescription(scope, ctx)}.`;
    }

    // ═══════════════════════════════════════════════
    // DEBUFF ATK — Reducir ATK enemigo
    // ═══════════════════════════════════════════════
    case "debuff_atk": {
      const targets = getScopeTargets(scope, ctx);
      for (const slot of targets) {
        const card = board[slot];
        if (card) {
          // ★ BUG FIX: Usar slotId como clave (no nombre de carta)
          const key = slot;
          const cur = engine.state.effects.atkReduced[key] || 0;
          engine.state.effects.atkReduced = {
            ...engine.state.effects.atkReduced,
            [key]: cur + amount,
          };
        }
      }
      return `>> -${amount} ATK a ${scopeDescription(scope, ctx)}.`;
    }

    // ═══════════════════════════════════════════════
    // DIRECT DAMAGE — Daño directo al LP
    // ═══════════════════════════════════════════════
    case "direct_damage": {
      if (scope === "opponent_lp" || scope === "self") {
        engine.dealDamage(oppTarget, amount);
        return `>> ${amount} daño directo al LP ${oppTarget === "enemy" ? "enemigo" : "propio"}.`;
      }
      if (scope === "self_lp") {
        engine.dealDamage(myTarget, amount);
        return `>> ${amount} daño a tu propio LP.`;
      }
      engine.dealDamage(oppTarget, amount);
      return `>> ${amount} daño directo.`;
    }

    // ═══════════════════════════════════════════════
    // DESTROY — Destruir carta(s)
    // ═══════════════════════════════════════════════
    case "destroy": {
      if (scope === "enemy_altar") {
        // Destruir un altar enemigo
        const eAltarLuz = board[`${oppPrefix}-altar-luz` as SlotId];
        const eAltarSombra = board[`${oppPrefix}-altar-sombra` as SlotId];
        const targetSlot: SlotId | null = eAltarLuz ? `${oppPrefix}-altar-luz` as SlotId : eAltarSombra ? `${oppPrefix}-altar-sombra` as SlotId : null;
        if (targetSlot) {
          const targetCard = board[targetSlot]!;
          engine.destroyCard(targetSlot);
          return `>> ${sourceCard.name} destruye el altar ${targetCard.name}.`;
        }
        return null;
      }
      if (scope === "enemy_lane") {
        // Destruir la carta con menor ATK en el carril enemigo
        const eSlot = `${oppPrefix}-mon-${col}` as SlotId;
        const eCard = board[eSlot];
        if (eCard) {
          engine.destroyCard(eSlot);
          return `>> ${sourceCard.name} destruye ${eCard.name} en columna ${col}.`;
        }
        return null;
      }
      if (scope === "target") {
        // Destruir un objetivo seleccionado (simplificado: enemigo más débil)
        const enemySlots = getMonsterSlots(oppTarget);
        let weakest: { slot: SlotId; atk: number } | null = null;
        for (const s of enemySlots) {
          const c = board[s];
          if (c && (!weakest || c.atk < weakest.atk)) {
            weakest = { slot: s, atk: c.atk };
          }
        }
        if (weakest) {
          const wCard = board[weakest.slot]!;
          engine.destroyCard(weakest.slot);
          return `>> ${sourceCard.name} destruye ${wCard.name}.`;
        }
        return null;
      }
      if (scope === "all_enemies") {
        // Destruir todos los monstruos enemigos con ATK menor (para Saqueo Thor)
        const enemySlots = getMonsterSlots(oppTarget);
        let destroyed = 0;
        for (const s of [...enemySlots]) {
          const c = board[s];
          if (c && c.atk < sourceCard.atk) {
            engine.destroyCard(s);
            destroyed++;
          }
        }
        return destroyed > 0
          ? `>> ${sourceCard.name} destruye ${destroyed} monstruo(s) enemigo(s) con ATK menor.`
          : null;
      }
      return null;
    }

    // ═══════════════════════════════════════════════
    // ADD SHIELD — Añadir contador de escudo
    // ═══════════════════════════════════════════════
    case "add_shield": {
      const targets = getScopeTargets(scope, ctx);
      for (const slot of targets) {
        engine.addShield(slot);
      }
      if (targets.length > 0) {
        return `>> Escudo añadido a ${targets.length} carta(s).`;
      }
      return null;
    }

    // ═══════════════════════════════════════════════
    // DRAW — Robar carta(s)
    // ═══════════════════════════════════════════════
    case "draw": {
      engine.draw(myTarget, amount);
      return `>> Robas ${amount} carta(s).`;
    }

    // ═══════════════════════════════════════════════
    // RECOVER — Recuperar del mazo/cementerio
    // ═══════════════════════════════════════════════
    case "recover": {
      // Buscar una carta del mismo atributo o arquetipo en el mazo
      const deck = owner === "player" ? engine.state.playerDeck : engine.state.enemyDeck;
      const atributo = sourceCard.atributo;
      const arquetipo = sourceCard.arquetipo;
      let foundIdx = -1;

      for (let i = deck.length - 1; i >= 0; i--) {
        const c = deck[i];
        if (
          (atributo && c.atributo === atributo) ||
          (arquetipo && c.arquetipo === arquetipo)
        ) {
          foundIdx = i;
          break;
        }
      }

      if (foundIdx >= 0) {
        const recovered = deck.splice(foundIdx, 1)[0];
        if (owner === "player") {
          engine.state.playerHand = [...engine.state.playerHand, recovered];
        } else {
          engine.state.enemyHand = [...engine.state.enemyHand, recovered];
        }
        return `>> Recuperas ${recovered.name} del mazo.`;
      }
      return null;
    }

    // ═══════════════════════════════════════════════
    // NEGATE — Negar efecto
    // ═══════════════════════════════════════════════
    case "negate": {
      engine.state.effects.negatedEffects = (engine.state.effects.negatedEffects || 0) + 1;
      return `>> Efecto negado por ${sourceCard.name}.`;
    }

    // ═══════════════════════════════════════════════
    // MOVE — Mover monstruo entre carriles
    // ═══════════════════════════════════════════════
    case "move": {
      // Simplificado: mueve el primer monstruo aliado de col 1→3 o 3→1
      const mySlots = getMonsterSlots(myTarget);
      for (const fromSlot of mySlots) {
        const fromCard = board[fromSlot];
        if (!fromCard) continue;
        const fromCol = getCol(fromSlot);
        const toCol = fromCol === 1 ? 3 : fromCol === 3 ? 1 : null;
        if (toCol === null) continue; // Columna 2 no se mueve
        const toSlot = `${myPrefix}-mon-${toCol}` as SlotId;
        if (board[toSlot]) continue; // Destino ocupado
        // Realizar movimiento
        board[toSlot] = fromCard;
        board[fromSlot] = null;
        return `>> ${fromCard.name} se mueve de columna ${fromCol} a ${toCol}.`;
      }
      return null;
    }

    // ═══════════════════════════════════════════════
    // SWITCH_MODE — Cambiar modo altar ↔ monstruo
    // ═══════════════════════════════════════════════
    case "switch_mode": {
      // Simplificado: cambia el primer aliado entre altar y monstruo
      const allMySlots = getAllBoardSlots(myTarget);
      for (const s of allMySlots) {
        const c = board[s];
        if (!c || s === sourceSlot) continue;
        if (s.includes("altar")) {
          // Mover de altar a monstruo (primera columna libre)
          for (const mc of [1, 2, 3] as const) {
            const mSlot = `${myPrefix}-mon-${mc}` as SlotId;
            if (!board[mSlot]) {
              board[mSlot] = c;
              board[s] = null;
              return `>> ${c.name} cambia de altar a columna ${mc}.`;
            }
          }
        } else if (s.includes("mon")) {
          // Mover de monstruo a altar (primero libre)
          for (const aSlot of [`${myPrefix}-altar-luz`, `${myPrefix}-altar-sombra`] as SlotId[]) {
            if (!board[aSlot]) {
              board[aSlot] = c;
              board[s] = null;
              return `>> ${c.name} cambia a modo altar.`;
            }
          }
        }
      }
      return null;
    }

    // ═══════════════════════════════════════════════
    // LP GAIN — Ganar LP
    // ═══════════════════════════════════════════════
    case "lp_gain": {
      engine.heal(myTarget, amount);
      const targetLabel = myTarget === "player" ? "jugador" : "rival";
      return `>> +${amount} LP para ${targetLabel} (por ${sourceCard.name}).`;
    }

    // ═══════════════════════════════════════════════
    // INHERIT ATK — Heredar ATK del monstruo consumido
    // ═══════════════════════════════════════════════
    case "inherit_atk": {
      const consumed = ctx.extra?.consumedEnemy;
      if (consumed && consumed.atk > sourceCard.atk) {
        // El ATK base se mantiene, pero se añade la diferencia como bonus
        const diff = consumed.atk - sourceCard.atk;
        engine.modifyAtk(sourceSlot, diff);
        return `>> ${sourceCard.name} hereda ATK de ${consumed.name} (+${diff}).`;
      }
      return null;
    }

    // ═══════════════════════════════════════════════
    // PREVENT DESTROY — Prevenir destrucción (escudo)
    // ═══════════════════════════════════════════════
    case "prevent_destroy": {
      if (scope === "self") {
        engine.addShield(sourceSlot);
        return `>> ${sourceCard.name} no puede ser destruido (inmunidad).`;
      }
      if (scope === "self_lane" || scope === "all_allies") {
        const targets = getScopeTargets(scope, ctx);
        for (const slot of targets) {
          engine.addShield(slot);
        }
        return `>> Inmunidad de destrucción para ${targets.length} carta(s).`;
      }
      return null;
    }

    // ═══════════════════════════════════════════════
    // ATK DIFF DAMAGE — Daño = diferencia de ATK
    // ═══════════════════════════════════════════════
    case "atk_diff_damage": {
      const eSlot = getOpposingMonsterSlot(sourceSlot, owner);
      const eCard = board[eSlot];
      if (eCard && sourceCard.atk > eCard.atk) {
        const diff = sourceCard.atk - eCard.atk;
        engine.dealDamage(oppTarget, diff);
        return `>> Daño por diferencia ATK: ${diff} al LP enemigo.`;
      }
      return null;
    }

    // ═══════════════════════════════════════════════
    // PENETRATE — Daño penetrante (ignora monstruo)
    // ═══════════════════════════════════════════════
    case "penetrate": {
      engine.dealDamage(oppTarget, sourceCard.atk);
      return `>> ${sourceCard.name} inflige daño penetrante: ${sourceCard.atk}.`;
    }

    // ═══════════════════════════════════════════════
    // DESTROY COLUMN — Destruir toda una columna
    // ═══════════════════════════════════════════════
    case "destroy_column": {
      const targetCol = ctx.extra?.attackedColumn ?? col;
      // Destruir monstruos enemigos en la columna
      const eMonSlot = `${oppPrefix}-mon-${targetCol}` as SlotId;
      if (board[eMonSlot]) {
        engine.destroyCard(eMonSlot);
      }
      // Destruir altar enemigo de la columna
      const eAltarSlot = targetCol === 1
        ? `${oppPrefix}-altar-luz` as SlotId
        : `${oppPrefix}-altar-sombra` as SlotId;
      if (board[eAltarSlot]) {
        engine.destroyCard(eAltarSlot);
      }
      return `>> Columna ${targetCol} destruida por ${sourceCard.name}.`;
    }

    // ═══════════════════════════════════════════════
    // CORROSION — Aplicar contador de corrosión
    // ═══════════════════════════════════════════════
    case "corrosion": {
      if (scope === "enemy_lane") {
        const eSlot = `${oppPrefix}-mon-${col}` as SlotId;
        if (board[eSlot]) {
          const cur = engine.state.effects.corrosionCounters[eSlot] ?? 0;
          engine.state.effects.corrosionCounters = {
            ...engine.state.effects.corrosionCounters,
            [eSlot]: cur + amount,
          };
          return `>> Corrosión +${amount} en columna ${col} enemiga.`;
        }
      } else if (scope === "all_enemies" || scope === "all_allies") {
        // Aplicar corrosión a todos los monstruos enemigos
        const enemySlots = getMonsterSlots(oppTarget);
        let applied = 0;
        for (const s of enemySlots) {
          if (board[s]) {
            const cur = engine.state.effects.corrosionCounters[s] ?? 0;
            engine.state.effects.corrosionCounters = {
              ...engine.state.effects.corrosionCounters,
              [s]: cur + amount,
            };
            applied++;
          }
        }
        return applied > 0
          ? `>> Corrosión +${amount} aplicada a ${applied} monstruo(s) enemigo(s).`
          : null;
      }
      return null;
    }

    // ═══════════════════════════════════════════════
    // TRIBUTO — Sacrificar aliado del mismo arquetipo
    // ═══════════════════════════════════════════════
    case "tributo": {
      const arquetipo = sourceCard.arquetipo;
      if (!arquetipo) return null;

      // Buscar un aliado del mismo arquetipo para sacrificar
      const mySlots = [...getMonsterSlots(myTarget), ...([`${myPrefix}-altar-luz`, `${myPrefix}-altar-sombra`] as SlotId[])];
      let tributeSlot: SlotId | null = null;
      for (const s of mySlots) {
        if (s === sourceSlot) continue;
        const c = board[s];
        if (c && c.arquetipo === arquetipo) {
          tributeSlot = s;
          break;
        }
      }

      if (tributeSlot) {
        const tributeCard = board[tributeSlot]!;
        engine.destroyCard(tributeSlot);
        engine.addLog(`>> Tributo: ${tributeCard.name} sacrificado por ${sourceCard.name}.`);

        // ★ BUG 6 FIX: Re-read board after destroyCard modified it
        const currentBoard = engine.state.board;
        const artifactSlot = `${myPrefix}-artifact` as SlotId;
        const artifact = currentBoard[artifactSlot];
        if (artifact && artifact.arquetipo === arquetipo && artifact.es_artefacto) {
          // Check if this artifact has a passive draw effect for tribute (e.g., Templo Mayor)
          const hasTributeDraw = artifact.efecto_monstruo.some(
            e => e.trigger === "passive" && e.type === "draw"
          );
          if (hasTributeDraw) {
            engine.draw(myTarget, 1);
            engine.addLog(`>> ${artifact.name} activa: robas 1 carta por tributo ${arquetipo}.`);
          }
        }

        // ★ BUG 6 FIX: Also check playerArtifact/enemyArtifact state as fallback
        if (!artifact) {
          const stateAny = engine.state as any;
          const artifactState = myTarget === "player" ? stateAny.playerArtifact : stateAny.enemyArtifact;
          if (artifactState && artifactState.arquetipo === arquetipo && artifactState.es_artefacto) {
            const hasTributeDraw = artifactState.efecto_monstruo.some(
              (e: any) => e.trigger === "passive" && e.type === "draw"
            );
            if (hasTributeDraw) {
              engine.draw(myTarget, 1);
              engine.addLog(`>> ${artifactState.name} activa: robas 1 carta por tributo ${arquetipo}.`);
            }
          }
        }

        // Ejecutar recompensa del tributo según scope y amount
        return resolveTributoReward(efecto, ctx);
      }
      return `>> Tributo: no hay carta ${arquetipo} para sacrificar.`;
    }

    // ═══════════════════════════════════════════════
    // SAQUEO — Recompensa al destruir enemigo en batalla
    // ═══════════════════════════════════════════════
    case "saqueo": {
      // El saqueo ya se activó porque destruimos un enemigo en batalla
      // Ejecutar recompensa según scope y amount
      return resolveSaqueoReward(efecto, ctx);
    }

    default:
      return `>> Efecto "${efecto.type}" registrado (resolución pendiente).`;
  }
}

// ═══════════════════════════════════════════════════════════════
// RESOLUCIÓN DE TRIBUTO (recompensa tras sacrificar aliado)
// ═══════════════════════════════════════════════════════════════

function resolveTributoReward(efecto: EfectoDescriptor, ctx: EffectContext): string | null {
  const { engine, sourceCard, sourceSlot, owner } = ctx;
  const amount = efecto.amount ?? 0;
  const scope = efecto.scope;
  const myTarget = owner === "player" ? "player" : "enemy" as const;
  const oppTarget = owner === "player" ? "enemy" : "player" as const;
  const myPrefix = owner === "player" ? "p" : "e";
  const oppPrefix = owner === "player" ? "e" : "p";
  const board = engine.state.board;

  switch (scope) {
    case "self":
      // Bonus ATK a sí mismo
      if (amount > 0) {
        engine.modifyAtk(sourceSlot, amount);
        return `>> Tributo: ${sourceCard.name} gana +${amount} ATK.`;
      }
      // Si amount es 1 y trigger on_flip → robar
      if (amount === 1 && efecto.trigger === "on_flip") {
        engine.draw(myTarget, 1);
        return `>> Tributo: robas 1 carta.`;
      }
      return `>> Tributo activado.`;

    case "opponent_lp":
      // Daño directo
      engine.dealDamage(oppTarget, amount);
      return `>> Tributo: ${amount} daño directo al LP enemigo.`;

    case "all_enemies": {
      // Reducir ATK o aplicar corrosión a todos los enemigos
      const enemySlots = getMonsterSlots(oppTarget);
      if (amount > 0) {
        for (const s of enemySlots) {
          const c = board[s];
          if (c) {
            const key = s;  // ★ BUG FIX: slotId como clave
            const cur = engine.state.effects.atkReduced[key] || 0;
            engine.state.effects.atkReduced = {
              ...engine.state.effects.atkReduced,
              [key]: cur + amount,
            };
          }
        }
        return `>> Tributo: -${amount} ATK a todos los monstruos enemigos.`;
      }
      // amount=0 con all_enemies = destruir monstruo enemigo más débil
      const weakest = findWeakestEnemy(ctx);
      if (weakest) {
        engine.destroyCard(weakest);
        return `>> Tributo: destruye ${board[weakest]!.name || "monstruo enemigo"}.`;
      }
      return null;
    }

    case "enemy_lane": {
      // Aplicar corrosión o debuff al carril enemigo
      const col = getCol(sourceSlot);
      const eSlot = `${oppPrefix}-mon-${col}` as SlotId;
      if (board[eSlot]) {
        const cur = engine.state.effects.corrosionCounters[eSlot] ?? 0;
        engine.state.effects.corrosionCounters = {
          ...engine.state.effects.corrosionCounters,
          [eSlot]: cur + 1,
        };
        // Marcar como infectado
        const eCard = board[eSlot]!;
        if (eCard._cartaMaestra) {
          eCard.infectado = true;
        }
        return `>> Tributo: corrosión aplicada a columna ${col} enemiga.`;
      }
      return null;
    }

    case "self_lane": {
      // Otorgar escudos al carril propio
      const col = getCol(sourceSlot);
      const mSlot = `${myPrefix}-mon-${col}` as SlotId;
      if (board[mSlot]) {
        engine.addShield(mSlot);
        return `>> Tributo: escudo añadido al carril.`;
      }
      return null;
    }

    case "target": {
      // Otorgar escudo a un aliado del mismo arquetipo
      const mySlots = [...getMonsterSlots(myTarget), ...([`${myPrefix}-altar-luz`, `${myPrefix}-altar-sombra`] as SlotId[])];
      for (const s of mySlots) {
        if (s === sourceSlot) continue;
        const c = board[s];
        if (c && c.arquetipo === sourceCard.arquetipo) {
          engine.addShield(s);
          return `>> Tributo: escudo otorgado a ${c.name}.`;
        }
      }
      return null;
    }

    case "enemy_deck": {
      // Bug 5 Fix: Return weakest enemy monster to its deck (Ehécatl)
      const weakest = findWeakestEnemy(ctx);
      if (weakest) {
        const wCard = board[weakest];
        if (wCard) {
          // Return to enemy deck
          const enemyDeck = oppTarget === "player" ? engine.state.playerDeck : engine.state.enemyDeck;
          enemyDeck.push(wCard);
          if (oppTarget === "player") {
            engine.state.playerDeck = enemyDeck;
          } else {
            engine.state.enemyDeck = enemyDeck;
          }
          board[weakest] = null;
          return `>> Tributo: ${wCard.name} devuelto al mazo del rival.`;
        }
      }
      return null;
    }

    case "graveyard": {
      // Recuperar carta del mazo/cementerio del mismo arquetipo
      const deck = owner === "player" ? engine.state.playerDeck : engine.state.enemyDeck;
      const arquetipo = sourceCard.arquetipo;
      let foundIdx = -1;
      for (let i = deck.length - 1; i >= 0; i--) {
        if (deck[i].arquetipo === arquetipo) {
          foundIdx = i;
          break;
        }
      }
      if (foundIdx >= 0) {
        const recovered = deck.splice(foundIdx, 1)[0];
        if (owner === "player") {
          engine.state.playerHand = [...engine.state.playerHand, recovered];
        } else {
          engine.state.enemyHand = [...engine.state.enemyHand, recovered];
        }
        return `>> Tributo: recuperas ${recovered.name} del mazo.`;
      }
      return null;
    }

    default:
      return `>> Tributo activado (${scope}).`;
  }
}

// ═══════════════════════════════════════════════════════════════
// RESOLUCIÓN DE SAQUEO (recompensa al destruir en batalla)
// ═══════════════════════════════════════════════════════════════

function resolveSaqueoReward(efecto: EfectoDescriptor, ctx: EffectContext): string | null {
  const { engine, sourceCard, sourceSlot, owner } = ctx;
  const amount = efecto.amount ?? 0;
  const scope = efecto.scope;
  const myTarget = owner === "player" ? "player" : "enemy" as const;
  const oppTarget = owner === "player" ? "enemy" : "player" as const;
  const oppPrefix = owner === "player" ? "e" : "p";
  const board = engine.state.board;

  switch (scope) {
    case "all_enemies": {
      // Destruir todos los monstruos enemigos con ATK menor (Thor)
      const enemySlots = getMonsterSlots(oppTarget);
      let destroyed = 0;
      for (const s of [...enemySlots]) {
        const c = board[s];
        if (c && c.atk < sourceCard.atk) {
          engine.destroyCard(s);
          destroyed++;
        }
      }
      return destroyed > 0
        ? `>> Saqueo: destruidos ${destroyed} monstruo(s) enemigo(s) con ATK menor.`
        : null;
    }

    case "self":
      // Bonus ATK por saqueo
      if (amount > 0) {
        engine.modifyAtk(sourceSlot, amount);
        return `>> Saqueo: ${sourceCard.name} gana +${amount} ATK.`;
      }
      return `>> Saqueo activado.`;

    case "opponent_lp":
      engine.dealDamage(oppTarget, amount);
      return `>> Saqueo: ${amount} daño directo.`;

    case "graveyard": {
      // Robar del mazo como recompensa
      engine.draw(myTarget, 1);
      return `>> Saqueo: robas 1 carta como botín.`;
    }

    default:
      return `>> Saqueo activado (${scope}).`;
  }
}

// ═══════════════════════════════════════════════════════════════
// SCOPE RESOLUTION — Obtener slots objetivo según scope
// ═══════════════════════════════════════════════════════════════

function getScopeTargets(scope: string, ctx: EffectContext): SlotId[] {
  const { sourceSlot, owner, engine } = ctx;
  const board = engine.state.board;
  const col = getCol(sourceSlot);
  const myPrefix = owner === "player" ? "p" : "e";
  const oppPrefix = owner === "player" ? "e" : "p";
  const myTarget = owner === "player" ? "player" : "enemy" as const;
  const oppTarget = owner === "player" ? "enemy" : "player" as const;

  switch (scope) {
    case "self":
      return [sourceSlot];

    case "self_lane": {
      const monSlot = `${myPrefix}-mon-${col}` as SlotId;
      return board[monSlot] ? [monSlot] : [];
    }

    case "all_allies": {
      const slots: SlotId[] = [];
      for (const c of [1, 2, 3] as const) {
        const ms = `${myPrefix}-mon-${c}` as SlotId;
        if (board[ms]) slots.push(ms);
      }
      return slots;
    }

    case "enemy_lane": {
      const eSlot = `${oppPrefix}-mon-${col}` as SlotId;
      return board[eSlot] ? [eSlot] : [];
    }

    case "all_enemies": {
      const slots: SlotId[] = [];
      for (const c of [1, 2, 3] as const) {
        const ms = `${oppPrefix}-mon-${c}` as SlotId;
        if (board[ms]) slots.push(ms);
      }
      return slots;
    }

    case "target":
      // Simplificado: primer aliado disponible
      for (const c of [1, 2, 3] as const) {
        const ms = `${myPrefix}-mon-${c}` as SlotId;
        if (board[ms] && ms !== sourceSlot) return [ms];
      }
      return [];

    case "column": {
      const slots: SlotId[] = [];
      const pMon = `p-mon-${col}` as SlotId;
      const eMon = `e-mon-${col}` as SlotId;
      if (board[pMon]) slots.push(pMon);
      if (board[eMon]) slots.push(eMon);
      return slots;
    }

    default:
      return [];
  }
}

function findWeakestEnemy(ctx: EffectContext): SlotId | null {
  const { owner, engine } = ctx;
  const board = engine.state.board;
  const oppPrefix = owner === "player" ? "e" : "p";
  const oppTarget = owner === "player" ? "enemy" : "player" as const;
  const enemySlots = getMonsterSlots(oppTarget);

  let weakest: { slot: SlotId; atk: number } | null = null;
  for (const s of enemySlots) {
    const c = board[s];
    if (c && (!weakest || c.atk < weakest.atk)) {
      weakest = { slot: s, atk: c.atk };
    }
  }
  return weakest?.slot ?? null;
}

function scopeDescription(scope: string, ctx: EffectContext): string {
  switch (scope) {
    case "self": return ctx.sourceCard.name;
    case "self_lane": return `carril de ${ctx.sourceCard.name}`;
    case "all_allies": return "todos los aliados";
    case "enemy_lane": return "carril enemigo";
    case "all_enemies": return "todos los enemigos";
    case "target": return "objetivo";
    case "enemy_deck": return "mazo enemigo";
    case "column": return "columna";
    default: return scope;
  }
}

// ═══════════════════════════════════════════════════════════════
// TRIGGER DISPATCHER — Dispara efectos por tipo de trigger
// ═══════════════════════════════════════════════════════════════

/**
 * Dispara efectos on_summon para una carta recién colocada.
 */
export function fireOnSummonEffects(ctx: EffectContext): string[] {
  const efectos = getActiveEffects(ctx.sourceCard, ctx.sourceSlot);
  const summonEffects = efectos.filter(e => e.trigger === "on_summon");
  return resolveEffects(summonEffects, ctx);
}

/**
 * Dispara efectos on_attack para una carta que ataca.
 */
export function fireOnAttackEffects(ctx: EffectContext, attackColumn: number): string[] {
  const efectos = getActiveEffects(ctx.sourceCard, ctx.sourceSlot);
  const attackEffects = efectos.filter(e => e.trigger === "on_attack");
  const enrichedCtx = { ...ctx, extra: { ...ctx.extra, attackedColumn: attackColumn } };
  return resolveEffects(attackEffects, enrichedCtx);
}

/**
 * Dispara efectos on_destroy para una carta destruida.
 */
export function fireOnDestroyEffects(ctx: EffectContext): string[] {
  const efectos = getActiveEffects(ctx.sourceCard, ctx.sourceSlot);
  const destroyEffects = efectos.filter(e => e.trigger === "on_destroy");
  return resolveEffects(destroyEffects, ctx);
}

/**
 * Dispara efectos on_destroy_enemy cuando un aliado destruye un enemigo.
 */
export function fireOnDestroyEnemyEffects(
  ctx: EffectContext,
  destroyedEnemy: CardData
): string[] {
  const efectos = getActiveEffects(ctx.sourceCard, ctx.sourceSlot);
  const destroyEnemyEffects = efectos.filter(e => e.trigger === "on_destroy_enemy");
  const enrichedCtx = { ...ctx, extra: { ...ctx.extra, destroyedEnemy } };
  return resolveEffects(destroyEnemyEffects, enrichedCtx);
}

/**
 * Dispara efectos on_consume (Anomalía) cuando se consume un enemigo.
 */
export function fireOnConsumeEffects(
  ctx: EffectContext,
  consumedEnemy: CardData
): string[] {
  const efectos = getActiveEffects(ctx.sourceCard, ctx.sourceSlot);
  const consumeEffects = efectos.filter(e => e.trigger === "on_consume");
  const enrichedCtx = { ...ctx, extra: { ...ctx.extra, consumedEnemy } };
  return resolveEffects(consumeEffects, enrichedCtx);
}

/**
 * Dispara efectos on_flip (Subterráneo) cuando se voltea.
 */
export function fireOnFlipEffects(ctx: EffectContext): string[] {
  const efectos = getActiveEffects(ctx.sourceCard, ctx.sourceSlot);
  const flipEffects = efectos.filter(e => e.trigger === "on_flip");
  return resolveEffects(flipEffects, ctx);
}

/**
 * Dispara efectos on_enemy_attack (RESPUESTA) cuando un enemigo ataca.
 */
export function fireOnEnemyAttackEffects(ctx: EffectContext, attackColumn: number): string[] {
  const efectos = getActiveEffects(ctx.sourceCard, ctx.sourceSlot);
  const responseEffects = efectos.filter(e =>
    e.trigger === "on_enemy_attack" ||
    (e.trigger === "once_per_turn" && e.categoria === "RESPUESTA")
  );
  const enrichedCtx = { ...ctx, extra: { ...ctx.extra, attackedColumn: attackColumn } };
  return resolveEffects(responseEffects, enrichedCtx);
}

/**
 * Dispara efectos on_turn_start para todas las cartas de un owner.
 */
export function fireTurnStartEffects(
  engine: EffectEngineAPI,
  owner: "player" | "enemy"
): string[] {
  const allLogs: string[] = [];
  const board = engine.state.board;
  const prefix = owner === "player" ? "p" : "e";
  const slots: SlotId[] = [
    `${prefix}-mon-1`, `${prefix}-mon-2`, `${prefix}-mon-3`,
    `${prefix}-altar-luz`, `${prefix}-altar-sombra`,
  ] as SlotId[];

  for (const slotId of slots) {
    const card = board[slotId];
    if (!card) continue;

    const efectos = getActiveEffects(card, slotId);
    const turnStartEffects = efectos.filter(e => e.trigger === "on_turn_start");
    if (turnStartEffects.length === 0) continue;

    const ctx: EffectContext = {
      engine,
      sourceCard: card,
      sourceSlot: slotId,
      owner,
    };
    const logs = resolveEffects(turnStartEffects, ctx);
    allLogs.push(...logs);
  }

  // Procesar corrosión al inicio del turno
  const corrosionLogs = processCorrosionDamage(engine, owner);
  allLogs.push(...corrosionLogs);

  return allLogs;
}

/**
 * Procesa el daño de corrosión al inicio del turno.
 */
function processCorrosionDamage(
  engine: EffectEngineAPI,
  owner: "player" | "enemy"
): string[] {
  const logs: string[] = [];
  const board = engine.state.board;
  const counters = engine.state.effects.corrosionCounters;

  // Aplicar daño a las cartas del owner que tienen corrosión
  const prefix = owner === "player" ? "p" : "e";
  const target = owner;

  for (const [slotId, count] of Object.entries(counters)) {
    if (count <= 0) continue;
    if (!slotId.startsWith(prefix)) continue;

    const card = board[slotId as SlotId];
    if (!card) continue;

    // Cada contador de corrosión hace 2 daño al LP del controlador
    const dmg = count * 2;
    engine.dealDamage(target, dmg);
    logs.push(`>> Corrosión: ${card.name} recibe ${dmg} daño (${count} contador/es).`);

    // Si el ATK llega a 0 por corrosión, destruir
    const currentAtk = card.atk;
    if (currentAtk <= 0) {
      // Marcar como infectado antes de destruir
      card.infectado = true;
      engine.destroyCard(slotId as SlotId);
      logs.push(`>> ${card.name} destruido por corrosión. Marca como infectado.`);
    }
  }

  return logs;
}

/**
 * Calcula los efectos pasivos de todas las cartas en el tablero.
 * Se debe llamar antes de calcular ATK final.
 */
export function computePassiveEffects(
  engine: EffectEngineAPI,
  owner: "player" | "enemy"
): string[] {
  const allLogs: string[] = [];
  const board = engine.state.board;
  const prefix = owner === "player" ? "p" : "e";
  const slots: SlotId[] = [
    `${prefix}-mon-1`, `${prefix}-mon-2`, `${prefix}-mon-3`,
    `${prefix}-altar-luz`, `${prefix}-altar-sombra`,
  ] as SlotId[];

  for (const slotId of slots) {
    const card = board[slotId];
    if (!card) continue;

    const efectos = getActiveEffects(card, slotId);
    const passiveEffects = efectos.filter(e => e.trigger === "passive");

    // Los efectos pasivos ya se aplican continuamente, no necesitan ser "disparados"
    // Pero registramos su existencia para ATK computation
  }

  return allLogs;
}

// ═══════════════════════════════════════════════════════════════
// HELPER — Obtener efectos activos según si la carta es altar o monstruo
// ═══════════════════════════════════════════════════════════════

export function getActiveEffects(card: CardData, slotId: SlotId): EfectoDescriptor[] {
  if (card.es_artefacto) {
    // Artefactos solo tienen efecto_monstruo (su único efecto)
    return card.efecto_monstruo;
  }

  // Si está en slot de altar → efecto_altar; si está en slot de monstruo → efecto_monstruo
  if (slotId.includes("altar")) {
    return card.efecto_altar;
  }

  return card.efecto_monstruo;
}

/**
 * Comprueba si una carta tiene efecto de tributo (para validar sacrificio).
 */
export function hasTributoEffect(card: CardData, slotId: SlotId): boolean {
  const efectos = getActiveEffects(card, slotId);
  return efectos.some(e => e.type === "tributo");
}

/**
 * Comprueba si una carta tiene efecto de saqueo (para validar recompensa).
 */
export function hasSaqueoEffect(card: CardData, slotId: SlotId): boolean {
  const efectos = getActiveEffects(card, slotId);
  return efectos.some(e => e.type === "saqueo");
}

/**
 * Comprueba si una carta tiene inmunidad a destrucción (prevent_destroy pasivo).
 */
export function hasPreventDestroy(card: CardData, slotId: SlotId): boolean {
  const efectos = getActiveEffects(card, slotId);
  return efectos.some(e => e.type === "prevent_destroy" && e.trigger === "passive");
}

/**
 * Comprueba si una carta tiene efecto de penetración.
 */
export function hasPenetrateEffect(card: CardData, slotId: SlotId): boolean {
  const efectos = getActiveEffects(card, slotId);
  return efectos.some(e => e.type === "penetrate");
}
