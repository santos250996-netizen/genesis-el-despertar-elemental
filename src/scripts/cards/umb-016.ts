// ============ OBLIVION, EL FIN DE TODO — UMB-016 ============
// SECAT / UMBRAL / GÉNESIS / ATK 30
//
// EFECTO MONSTRUO: Al declarar ataque, si controlas ambos altares,
//   marca la bandera de penetración para esta columna. Además, mientras
//   esté en modo monstruo con ambos altares, no puede ser destruido.
//   → Cuando Oblivion declara ataque:
//     1. Comprobar que está en slot de monstruo (no altar)
//     2. Si controla ambos altares, la bandera penetrate se activa
//        para esta columna (getPassiveAltarFlags devuelve penetrate)
//   → getPassiveAltarFlags (modo monstruo):
//     Si Oblivion está en slot de monstruo y controla ambos altares,
//     la carta en su propio slot es indestructible (undestroyable).
//
// EFECTO ALTAR (PASIVO): Todos los aliados son indestructibles.
//   Cuando Oblivion es colocado como altar, da +1 escudo a todos
//   los monstruos aliados en el campo.
//   → getPassiveAltarFlags (modo altar):
//     Cualquier carta aliada recibe la bandera undestroyable.
//   → onPlace (modo altar):
//     Da +1 contador de escudo a todos los monstruos aliados.

import type { CardScript, DuelContext, CardData, SlotId, PassiveAltarFlags } from "@/engine/types";
import {
  isAltarSlot,
  hasBothAltars,
  getAllMonsters,
  markPreventDestroy,
} from "@/scripts/utils";

// ═══════════════════════════════════════════════════════════════
// SCRIPT DE OBLIVION, EL FIN DE TODO
// ═══════════════════════════════════════════════════════════════

export const UMB_016: CardScript = {

  // ── EFECTO MONSTRUO: Si ambos altares → penetración ──
  onAttackDeclared(ctx: DuelContext): void {
    // Solo activa si Oblivion está en modo monstruo (no en altar)
    if (isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;

    // Condición: debe controlar ambos altares
    if (!hasBothAltars(ctx.engine, owner)) {
      ctx.log.push(`>> ${ctx.card.data.name}: No controlas ambos altares, penetración no se activa.`);
      return;
    }

    // Marcar prevent_destroy para sí mismo este turno
    // (respalda getPassiveAltarFlags con un mecanismo directo)
    markPreventDestroy(ctx.engine, ctx.slotId);

    ctx.log.push(
      `>> ¡${ctx.card.data.name} desata el fin de todo! Ataque con penetración — nada puede detenerlo.`
    );
  },

  // ── EFECTO MONSTRUO: No puede ser destruido (con ambos altares) ──
  // ── EFECTO ALTAR (PASIVO): Todos los aliados son indestructibles ──
  getPassiveAltarFlags(
    ctx: DuelContext,
    targetCard: CardData,
    targetSlot: SlotId
  ): PassiveAltarFlags {
    const owner = ctx.card.ownerId;
    const allyPrefix = owner === "player" ? "p" : "e";
    const isAlly = targetSlot.startsWith(allyPrefix);

    if (!isAltarSlot(ctx.slotId)) {
      // ── MODO MONSTRUO ──
      // Si Oblivion está en slot de monstruo y tiene ambos altares,
      // es indestructible y tiene penetración
      if (!hasBothAltars(ctx.engine, owner)) return {};

      // Solo aplica a sí mismo
      if (targetSlot !== ctx.slotId) return {};

      return { undestroyable: true, penetrate: true };
    }

    // ── MODO ALTAR ──
    // Todos los aliados son indestructibles
    if (!isAlly) return {};

    // Solo aplica a slots de monstruo aliados (no a sí mismo como altar,
    // pero sí al monstruo en la columna del altar)
    if (!targetSlot.includes("mon")) return {};

    return { undestroyable: true };
  },

  // ── EFECTO ALTAR (PASIVO): Al ser colocado como altar, da +1 escudo ──
  //    a todos los monstruos aliados en el campo ──
  onPlace(ctx: DuelContext): void {
    // Solo activa si Oblivion se coloca en slot de altar
    if (!isAltarSlot(ctx.slotId)) return;

    const owner = ctx.card.ownerId;
    const allyMonsters = getAllMonsters(ctx.engine, owner);

    if (allyMonsters.length === 0) {
      ctx.log.push(`>> ${ctx.card.data.name} (altar): No hay monstruos aliados para proteger.`);
      return;
    }

    const shielded: string[] = [];
    for (const mon of allyMonsters) {
      ctx.engine.addShield(mon.slot);
      shielded.push(mon.card.name);
    }

    ctx.log.push(
      `>> ¡${ctx.card.data.name} (altar) otorga protección! ${shielded.join(", ")} ganan +1 contador de escudo.`
    );
  },

};
