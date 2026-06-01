// ============ MAZO BASE: LUZ Y OSCURIDAD ============
// 16 cartas de monstruos + 4 artefactos = 20 cartas
// Atributos CELESTIAL y UMBRAL
// Distribución: 10 NORMAL, 3 ANOMALÍA, 1 CORRUPCIÓN, 1 ECLIPSE, 1 GÉNESIS + 4 ARTEFACTOS
// Razas: CELESTIAL → GENS, ÁNIMA, FÁBULA | UMBRAL → NECRO, CLASTO, SECAT

import type { CartaMaestra, CardData } from "@/engine/types";
import { cartaToCardData } from "@/engine/types";

// ═══════════════════════════════════════════════════════════════
// CELESTIAL — 8 CARTAS
// ═══════════════════════════════════════════════════════════════

const CELESTIAL_CARDS: CartaMaestra[] = [

  // ─── GENS (3 NORMAL) ───

  {
    id: "CEL-001",
    nombre: "Aethel, Portador del Alba",
    raza_tipo: "GENS",
    atributo: "CELESTIAL",
    metodo_invocacion: "NORMAL",
    atk: 10,
    es_altar: false,
    contador_escudo: 0,
    efecto_monstruo: [
      {
        trigger: "on_attack",
        type: "buff_atk",
        amount: 2,
        scope: "self",
        condition: "has_celestial_altar",
        desc: "Al atacar, si tienes un altar CELESTIAL activo, gana +2 ATK.",
      },
    ],
    efecto_altar: [
      {
        trigger: "passive",
        type: "buff_atk",
        amount: 2,
        scope: "self_lane",
        condition: "none",
        desc: "Las cartas CELESTIAL en tu carril ganan +2 ATK.",
        categoria: "PASIVO",
      },
    ],
  },

  {
    id: "CEL-002",
    nombre: "Lumina, Voz del Firmamento",
    raza_tipo: "GENS",
    atributo: "CELESTIAL",
    metodo_invocacion: "NORMAL",
    atk: 8,
    es_altar: false,
    contador_escudo: 0,
    efecto_monstruo: [
      {
        trigger: "on_summon",
        type: "draw",
        amount: 1,
        scope: "self_lp",
        condition: "controls_altar",
        desc: "Al invocar, si controlas un altar, roba 1 carta.",
      },
    ],
    efecto_altar: [
      {
        trigger: "once_per_turn",
        type: "lp_gain",
        amount: 3,
        scope: "self_lp",
        condition: "none",
        desc: "Una vez por turno, si invocas un CELESTIAL, ganas 3 LP.",
        categoria: "TURNO",
      },
    ],
  },

  {
    id: "CEL-003",
    nombre: "Seraphel, Centinela Radiante",
    raza_tipo: "GENS",
    atributo: "CELESTIAL",
    metodo_invocacion: "NORMAL",
    atk: 12,
    es_altar: false,
    contador_escudo: 0,
    efecto_monstruo: [
      {
        trigger: "on_attack",
        type: "direct_damage",
        amount: 2,
        scope: "opponent_lp",
        condition: "none",
        desc: "Al atacar, inflige 2 de daño directo al LP enemigo.",
      },
    ],
    efecto_altar: [
      {
        trigger: "passive",
        type: "prevent_destroy",
        scope: "self_lane",
        condition: "none",
        desc: "Los monstruos en este carril no pueden ser destruidos por efectos.",
        categoria: "PASIVO",
      },
    ],
  },

  // ─── ÁNIMA (2 NORMAL + 1 ANOMALÍA) ───

  {
    id: "CEL-004",
    nombre: "Eos, Eco del Alba",
    raza_tipo: "ANIMA",
    atributo: "CELESTIAL",
    metodo_invocacion: "NORMAL",
    atk: 7,
    es_altar: false,
    contador_escudo: 0,
    efecto_monstruo: [
      {
        trigger: "on_destroy",
        type: "recover",
        amount: 1,
        scope: "graveyard",
        condition: "none",
        desc: "Al ser destruida, añade 1 carta CELESTIAL de tu mazo a tu mano.",
      },
    ],
    efecto_altar: [
      {
        trigger: "on_summon",
        type: "add_shield",
        scope: "self_lane",
        condition: "none",
        desc: "Cuando un monstruo CELESTIAL es invocado en este carril, gana 1 contador_escudo.",
        categoria: "PASIVO",
      },
    ],
  },

  {
    id: "CEL-005",
    nombre: "Valeria, Ánima del Refugio",
    raza_tipo: "ANIMA",
    atributo: "CELESTIAL",
    metodo_invocacion: "NORMAL",
    atk: 9,
    es_altar: false,
    contador_escudo: 0,
    efecto_monstruo: [
      {
        trigger: "on_summon",
        type: "add_shield",
        scope: "target",
        condition: "none",
        desc: "Al invocar, otorga 1 contador_escudo a un monstruo aliado en tu carril.",
      },
    ],
    efecto_altar: [
      {
        trigger: "on_turn_start",
        type: "buff_atk",
        amount: 2,
        scope: "self_lane",
        condition: "none",
        desc: "Al inicio de tu turno, los monstruos en este carril ganan +2 ATK.",
        categoria: "PASIVO",
      },
    ],
  },

  {
    id: "CEL-006",
    nombre: "Sombra de Espejo",
    raza_tipo: "ANIMA",
    atributo: "CELESTIAL",
    metodo_invocacion: "ANOMALIA",
    atk: 15,
    es_altar: false,
    contador_escudo: 0,
    efecto_monstruo: [
      {
        trigger: "on_consume",
        type: "inherit_atk",
        scope: "self",
        condition: "none",
        desc: "Se invoca consumiendo un monstruo enemigo. Hereda el ATK del consumido si es mayor.",
      },
    ],
    efecto_altar: [
      {
        trigger: "once_per_turn",
        type: "negate",
        scope: "enemy_lane",
        condition: "none",
        desc: "Niega el primer efecto que active el oponente en este carril cada turno.",
        categoria: "TURNO",
      },
    ],
  },

  // ─── FÁBULA (1 NORMAL + 1 CORRUPCIÓN) ───

  {
    id: "CEL-007",
    nombre: "Hada del Crepúsculo",
    raza_tipo: "FABULA",
    atributo: "CELESTIAL",
    metodo_invocacion: "NORMAL",
    atk: 7,
    es_altar: false,
    contador_escudo: 0,
    efecto_monstruo: [
      {
        trigger: "on_summon",
        type: "switch_mode",
        scope: "target",
        condition: "none",
        desc: "Al invocar, puedes cambiar un monstruo aliado entre modo altar y modo monstruo.",
      },
    ],
    efecto_altar: [
      {
        trigger: "once_per_turn",
        type: "move",
        scope: "self_lane",
        condition: "none",
        desc: "Una vez por turno, puedes mover un monstruo entre carriles.",
        categoria: "TURNO",
      },
    ],
  },

  {
    id: "CEL-008",
    nombre: "Quimera de Luz",
    raza_tipo: "FABULA",
    atributo: "CELESTIAL",
    metodo_invocacion: "CORRUPCION",
    atk: 20,
    es_altar: false,
    contador_escudo: 0,
    efecto_monstruo: [
      {
        trigger: "on_attack",
        type: "destroy",
        scope: "enemy_lane",
        condition: "has_umbral_altar",
        desc: "Se invoca sacrificando un monstruo en Zona 3 + Altar Sombra activo. Al atacar, destruye la carta con menor ATK del carril enemigo.",
      },
    ],
    efecto_altar: [
      {
        trigger: "passive",
        type: "debuff_atk",
        amount: 3,
        scope: "enemy_lane",
        condition: "none",
        desc: "Reduce el ATK de los monstruos enemigos en el carril opuesto en 3.",
        categoria: "PASIVO",
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// UMBRAL — 8 CARTAS
// ═══════════════════════════════════════════════════════════════

const UMBRAL_CARDS: CartaMaestra[] = [

  // ─── NECRO (2 NORMAL + 1 ANOMALÍA) ───

  {
    id: "UMB-009",
    nombre: "Malakor, Susurro Final",
    raza_tipo: "NECRO",
    atributo: "UMBRAL",
    metodo_invocacion: "NORMAL",
    atk: 11,
    es_altar: false,
    contador_escudo: 0,
    efecto_monstruo: [
      {
        trigger: "on_destroy_enemy",
        type: "direct_damage",
        amount: 3,
        scope: "opponent_lp",
        condition: "none",
        desc: "Al destruir un monstruo enemigo, inflige 3 daño directo al LP enemigo.",
      },
    ],
    efecto_altar: [
      {
        trigger: "passive",
        type: "negate",
        scope: "enemy_lane",
        condition: "none",
        desc: "Los monstruos enemigos destruidos en este carril no activan sus efectos al morir.",
        categoria: "PASIVO",
      },
    ],
  },

  {
    id: "UMB-010",
    nombre: "Espectro del Abismo",
    raza_tipo: "NECRO",
    atributo: "UMBRAL",
    metodo_invocacion: "NORMAL",
    atk: 9,
    es_altar: false,
    contador_escudo: 0,
    efecto_monstruo: [
      {
        trigger: "on_summon",
        type: "destroy",
        scope: "enemy_altar",
        condition: "has_umbral_altar",
        desc: "Al invocar, si hay un altar UMBRAL activo, destruye 1 carta en el altar enemigo.",
      },
    ],
    efecto_altar: [
      {
        trigger: "on_enemy_attack",
        type: "debuff_atk",
        amount: 2,
        scope: "enemy_lane",
        condition: "none",
        desc: "Cuando un monstruo enemigo ataca en este carril, pierde 2 ATK.",
        categoria: "RESPUESTA",
        respuesta_trigger: "enemy_attack",
      },
    ],
  },

  {
    id: "UMB-011",
    nombre: "Nigromante Sin Rostro",
    raza_tipo: "NECRO",
    atributo: "UMBRAL",
    metodo_invocacion: "ANOMALIA",
    atk: 15,
    es_altar: false,
    contador_escudo: 0,
    efecto_monstruo: [
      {
        trigger: "on_consume",
        type: "recover",
        amount: 1,
        scope: "graveyard",
        condition: "none",
        desc: "Se invoca consumiendo un monstruo enemigo. Al invocar, recupera 1 carta de tu cementerio a tu mano.",
      },
    ],
    efecto_altar: [
      {
        trigger: "once_per_turn",
        type: "direct_damage",
        amount: 3,
        scope: "opponent_lp",
        condition: "none",
        desc: "Una vez por turno, si un monstruo UMBRAL es destruido en este carril, inflige 3 daño directo.",
        categoria: "TURNO",
      },
    ],
  },

  // ─── CLASTO (2 NORMAL + 1 ANOMALÍA + 1 ECLIPSE) ───

  {
    id: "UMB-012",
    nombre: "Kaél, Fragmentador",
    raza_tipo: "CLASTO",
    atributo: "UMBRAL",
    metodo_invocacion: "NORMAL",
    atk: 11,
    es_altar: false,
    contador_escudo: 0,
    efecto_monstruo: [
      {
        trigger: "on_attack",
        type: "atk_diff_damage",
        scope: "opponent_lp",
        condition: "enemy_lower_atk",
        desc: "Al atacar, si el enemigo en la misma columna tiene menos ATK, inflige la diferencia como daño directo.",
      },
    ],
    efecto_altar: [
      {
        trigger: "on_attack",
        type: "buff_atk",
        amount: 2,
        scope: "self_lane",
        condition: "none",
        desc: "Los monstruos en este carril ganan +2 ATK al atacar.",
        categoria: "PASIVO",
      },
    ],
  },

  {
    id: "UMB-013",
    nombre: "Vórtice Devorador",
    raza_tipo: "CLASTO",
    atributo: "UMBRAL",
    metodo_invocacion: "ANOMALIA",
    atk: 16,
    es_altar: false,
    contador_escudo: 0,
    efecto_monstruo: [
      {
        trigger: "on_destroy_enemy",
        type: "buff_atk",
        amount: 3,
        scope: "self",
        condition: "none",
        desc: "Se invoca consumiendo un monstruo enemigo. Al destruir un monstruo, gana +3 ATK permanentemente.",
      },
    ],
    efecto_altar: [
      {
        trigger: "on_turn_start",
        type: "debuff_atk",
        amount: 3,
        scope: "enemy_lane",
        condition: "none",
        desc: "Al inicio de tu turno, el monstruo enemigo con menor ATK en el carril opuesto pierde 3 ATK.",
        categoria: "PASIVO",
      },
    ],
  },

  {
    id: "UMB-014",
    nombre: "Eclipse Permanente",
    raza_tipo: "CLASTO",
    atributo: "UMBRAL",
    metodo_invocacion: "ECLIPSE",
    atk: 25,
    es_altar: false,
    contador_escudo: 0,
    efecto_monstruo: [
      {
        trigger: "on_attack",
        type: "destroy_column",
        scope: "column",
        condition: "has_both_altars",
        desc: "Se invoca requiriendo ambos altares. Al atacar, destruye todas las cartas en la columna atacada.",
      },
    ],
    efecto_altar: [
      {
        trigger: "passive",
        type: "debuff_atk",
        amount: 2,
        scope: "all_enemies",
        condition: "none",
        desc: "Ambos altares otorgan sus efectos simultáneamente. Los monstruos enemigos pierden 2 ATK.",
        categoria: "PASIVO",
      },
    ],
  },

  // ─── SECAT (1 NORMAL + 1 GÉNESIS) ───

  {
    id: "UMB-015",
    nombre: "Desierto Viviente",
    raza_tipo: "SECAT",
    atributo: "UMBRAL",
    metodo_invocacion: "NORMAL",
    atk: 6,
    es_altar: false,
    contador_escudo: 0,
    efecto_monstruo: [
      {
        trigger: "on_summon",
        type: "add_shield",
        scope: "self",
        condition: "has_umbral_altar",
        desc: "Al invocar, si controlas un altar UMBRAL, gana 1 contador_escudo.",
      },
    ],
    efecto_altar: [
      {
        trigger: "once_per_turn",
        type: "buff_atk",
        amount: 3,
        scope: "self_lane",
        condition: "none",
        desc: "Una vez por turno, si un monstruo UMBRAL ataca en este carril, gana +3 ATK.",
        categoria: "TURNO",
      },
    ],
  },

  {
    id: "UMB-016",
    nombre: "Oblivion, El Fin de Todo",
    raza_tipo: "SECAT",
    atributo: "UMBRAL",
    metodo_invocacion: "GENESIS",
    atk: 30,
    es_altar: false,
    contador_escudo: 0,
    efecto_monstruo: [
      {
        trigger: "on_attack",
        type: "penetrate",
        scope: "opponent_lp",
        condition: "has_both_altars",
        desc: "Se invoca consumiendo ambos altares. Al atacar, inflige daño penetrante igual a su ATK completo.",
      },
      {
        trigger: "passive",
        type: "prevent_destroy",
        scope: "self",
        condition: "none",
        desc: "No puede ser destruido por efectos de cartas.",
      },
    ],
    efecto_altar: [
      {
        trigger: "passive",
        type: "prevent_destroy",
        scope: "all_allies",
        condition: "none",
        desc: "Si Oblivion fuera altar, otorga inmunidad de destrucción a todos los monstruos de tu campo.",
        categoria: "PASIVO",
      },
      {
        trigger: "on_summon",
        type: "add_shield",
        scope: "self_lane",
        condition: "none",
        desc: "Al colocarse como altar, todos los monstruos del carril ganan 1 contador_escudo.",
        categoria: "PASIVO",
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// ARTEFACTOS — 4 CARTAS (2 campo + 2 equipo)
// ═══════════════════════════════════════════════════════════════

const ARTEFACTO_CARDS: CartaMaestra[] = [

  // ─── ARTEFACTO CAMPO (Magia de Campo: efecto global permanente) ───

  {
    id: "ART-017",
    nombre: "Cruzada Celestial",
    raza_tipo: "GENS" as const,
    atributo: "CELESTIAL",
    metodo_invocacion: "NORMAL",
    atk: 0,
    es_altar: false,
    es_artefacto: true,
    artefacto_tipo: "campo",
    contador_escudo: 0,
    efecto_monstruo: [],
    efecto_altar: [{
      trigger: "passive",
      type: "buff_atk",
      amount: 1,
      scope: "all_allies",
      condition: "none",
      desc: "Los monstruos CELESTIAL ganan +1 ATK. Los monstruos UMBRAL pierden -1 ATK.",
      categoria: "PASIVO",
    }],
  },

  {
    id: "ART-018",
    nombre: "Tierra Baldía",
    raza_tipo: "SECAT" as const,
    atributo: "UMBRAL",
    metodo_invocacion: "NORMAL",
    atk: 0,
    es_altar: false,
    es_artefacto: true,
    artefacto_tipo: "campo",
    contador_escudo: 0,
    efecto_monstruo: [],
    efecto_altar: [{
      trigger: "passive",
      type: "debuff_atk",
      amount: 1,
      scope: "all_enemies",
      condition: "none",
      desc: "Todos los monstruos pierden 1 ATK. Los contadores de escudo no se pueden activar.",
      categoria: "PASIVO",
    }],
  },

  // ─── ARTEFACTO EQUIPO (Carta de Equipo: se vincula a un monstruo) ───

  {
    id: "ART-019",
    nombre: "Espada del Alba",
    raza_tipo: "GENS" as const,
    atributo: "CELESTIAL",
    metodo_invocacion: "NORMAL",
    atk: 0,
    es_altar: false,
    es_artefacto: true,
    artefacto_tipo: "equipo",
    contador_escudo: 0,
    efecto_monstruo: [{
      trigger: "passive",
      type: "buff_atk",
      amount: 4,
      scope: "self",
      condition: "none",
      desc: "El monstruo equipado gana +4 ATK.",
    }],
    efecto_altar: [],
  },

  {
    id: "ART-020",
    nombre: "Escudo Umbral",
    raza_tipo: "NECRO" as const,
    atributo: "UMBRAL",
    metodo_invocacion: "NORMAL",
    atk: 0,
    es_altar: false,
    es_artefacto: true,
    artefacto_tipo: "equipo",
    contador_escudo: 0,
    efecto_monstruo: [{
      trigger: "passive",
      type: "prevent_destroy",
      scope: "self",
      condition: "none",
      desc: "El monstruo equipado no puede ser destruido en combate (solo pierdes la diferencia de LP).",
    }],
    efecto_altar: [],
  },
];

// ═══════════════════════════════════════════════════════════════
// EXPORTACIONES
// ═══════════════════════════════════════════════════════════════

/** Todas las cartas del mazo base en formato CartaMaestra */
export const ALL_CARDS_MAESTRA: CartaMaestra[] = [
  ...CELESTIAL_CARDS,
  ...UMBRAL_CARDS,
  ...ARTEFACTO_CARDS,
];

/** Mapa de id → CartaMaestra */
export const CARTAS: Record<string, CartaMaestra> = Object.fromEntries(
  ALL_CARDS_MAESTRA.map(c => [c.id, c])
);

/** Todas las cartas en formato CardData (compatibilidad con motor actual) */
export const ALL_CARDS_ARRAY: CardData[] = ALL_CARDS_MAESTRA.map(cartaToCardData);

/** Mapa de id numérico → CardData (compatibilidad con CARDS legacy) */
export const CARDS: Record<number, CardData> = Object.fromEntries(
  ALL_CARDS_ARRAY.map(c => [c.id, c])
);
