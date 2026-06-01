// ============ ATTACK MECHANICS ============
// Handles attack resolution, battle damage, destruction, and special battle effects.

import type { SlotId, CardData } from "@/engine/types";

export interface BattleStats {
  atk: number;
  penetrate: boolean;
  undestroyable: boolean;
  immuneEffectDestroy: boolean;
}

export interface BattleResult {
  log: string[];
  playerLPDelta: number;   // positive = heal, negative = damage to player
  enemyLPDelta: number;    // positive = heal, negative = damage to enemy
  boardChanges: Partial<Record<SlotId, CardData | null>>;
  playerDeckAdditions: CardData[];
  enemyDeckAdditions: CardData[];
  phase?: "won" | "lost";
}

/**
 * Resolve a single attack between an attacker and defender.
 * @param attackerSlot - Slot of the attacking monster
 * @param defenderSlot - Slot of the defending monster (null for direct attacks)
 * @param attackerStats - Computed battle stats of attacker
 * @param defenderAtk - Computed ATK of defender (0 if no defender)
 * @param attackerName - Name of attacker (for logging)
 * @param defenderName - Name of defender (for logging)
 * @param isEnemyAttacking - Whether the enemy is the attacker
 * @param noEffectDestroy - Whether Gaia's protection is active (immune to effect destruction)
 * @param defenderUndestroyable - Whether the defender is undestroyable by battle
 */
export function resolveAttack(params: {
  attackerSlot: SlotId;
  defenderSlot: SlotId | null;
  attackerStats: BattleStats;
  defenderAtk: number;
  attackerName: string;
  defenderName: string | null;
  attackerCard: CardData;
  defenderCard: CardData | null;
  isEnemyAttacking: boolean;
  noEffectDestroy: boolean;
  defenderUndestroyable: boolean;
}): BattleResult {
  const {
    attackerSlot, defenderSlot, attackerStats, defenderAtk,
    attackerName, defenderName, attackerCard, defenderCard,
    isEnemyAttacking, noEffectDestroy, defenderUndestroyable,
  } = params;

  const result: BattleResult = {
    log: [],
    playerLPDelta: 0,
    enemyLPDelta: 0,
    boardChanges: {},
    playerDeckAdditions: [],
    enemyDeckAdditions: [],
  };

  const aAtk = attackerStats.atk;
  const dAtk = defenderAtk;

  if (defenderCard && defenderSlot) {
    // ── With defender present ──
    if (aAtk > dAtk) {
      // Attacker wins
      if (isEnemyAttacking) {
        // Enemy attacking player's monster
        if (defenderUndestroyable || noEffectDestroy) {
          const lpLoss = aAtk - dAtk;
          result.playerLPDelta = -lpLoss;
          const reason = defenderUndestroyable ? "indestructible" : "protegido por Gaia";
          result.log.push(
            `>> ${attackerName} (ATK:${aAtk}) ataca pero ${defenderName} (ATK:${dAtk}) es ${reason}. -${lpLoss} LP.`
          );
        } else {
          const lpLoss = aAtk - dAtk;
          result.playerLPDelta = -lpLoss;
          result.playerDeckAdditions.push(defenderCard);
          result.boardChanges[defenderSlot] = null;
          result.log.push(
            `>> ${attackerName} (ATK:${aAtk}) destruye ${defenderName} (ATK:${dAtk}). -${lpLoss} LP.`
          );
        }
      } else {
        // Player attacking enemy's monster
        const lpLoss = attackerStats.penetrate ? aAtk : (aAtk - dAtk);
        result.enemyLPDelta = -lpLoss;
        result.enemyDeckAdditions.push(defenderCard);
        result.boardChanges[defenderSlot] = null;
        const penNote = attackerStats.penetrate ? " ¡Daño de penetración!" : "";
        result.log.push(
          `>> ¡${attackerName} (ATK:${aAtk}) vence a ${defenderName} (ATK:${dAtk})! -${lpLoss} LP enemigo.${penNote}`
        );
      }
    } else if (aAtk === dAtk) {
      // Tie — both destroyed (unless Gaia protects)
      if (noEffectDestroy) {
        result.log.push(
          `>> ¡Empate! ${attackerName} y ${defenderName} (ATK:${aAtk}) pero Gaia los protege.`
        );
      } else {
        result.playerDeckAdditions.push(defenderCard);
        result.enemyDeckAdditions.push(attackerCard);
        result.boardChanges[defenderSlot] = null;
        result.boardChanges[attackerSlot] = null;
        result.log.push(
          `>> ¡Empate! ${attackerName} y ${defenderName} (ATK:${aAtk}) se destruyen mutuamente.`
        );
      }
    } else {
      // Defender wins
      if (isEnemyAttacking) {
        // Enemy loses
        if (noEffectDestroy) {
          const lpLoss = dAtk - aAtk;
          result.enemyLPDelta = -lpLoss;
          result.log.push(
            `>> ${attackerName} (ATK:${aAtk}) vencido por ${defenderName} (ATK:${dAtk}). Protegido por Gaia. Enemigo -${lpLoss} LP.`
          );
        } else {
          const lpLoss = dAtk - aAtk;
          result.enemyLPDelta = -lpLoss;
          result.enemyDeckAdditions.push(attackerCard);
          result.boardChanges[attackerSlot] = null;
          result.log.push(
            `>> ${attackerName} (ATK:${aAtk}) es destruido por ${defenderName} (ATK:${dAtk}). Enemigo -${lpLoss} LP.`
          );
        }
      } else {
        // Player attacking, loses
        if (defenderUndestroyable) {
          // This shouldn't happen when player attacks (undestroyable is for player's monsters), but just in case
          const lpLoss = dAtk - aAtk;
          result.playerLPDelta = -lpLoss;
          result.log.push(
            `>> ${attackerName} (ATK:${aAtk}) no puede ser destruido pero pierdes ${lpLoss} LP.`
          );
        } else {
          const lpLoss = dAtk - aAtk;
          result.playerLPDelta = -lpLoss;
          result.playerDeckAdditions.push(attackerCard);
          result.boardChanges[attackerSlot] = null;
          result.log.push(
            `>> ${attackerName} (ATK:${aAtk}) es destruido por ${defenderName} (ATK:${dAtk}). -${lpLoss} LP.`
          );
        }
      }
    }
  } else {
    // ── Direct attack ──
    if (isEnemyAttacking) {
      result.playerLPDelta = -aAtk;
      result.log.push(`>> ¡Ataque Directo! ${attackerName} (ATK:${aAtk}). -${aAtk} LP.`);
    } else {
      result.enemyLPDelta = -aAtk;
      result.log.push(`>> ¡Ataque Directo! ${attackerName} (ATK:${aAtk}). -${aAtk} LP enemigo.`);
    }
  }

  return result;
}
