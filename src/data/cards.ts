// ============ GÉNESIS: EL DESPERTAR ELEMENTAL ============
// 55 cartas totales
// CELESTIAL (8) + UMBRAL (8) + ARTEFACTO BASE (4) + MECÁNICAS (3) + TENOTCH (14) + NÓRDICO (14) + ARTEFACTO EXTRA (4)
// Arquetipos: TENOTCH (tributo) · NÓRDICO (saqueo)
// Razas: GENS, ÁNIMA, FÁBULA, NECRO, CLASTO, SECAT, FERA, MARINA, SATIVA, ARTIFEX

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
  // Los artefactos NO tienen atributo, raza, ni metodo_invocacion.
  // Tienen atk: 0 (no se muestra) y solo efecto_monstruo (su unico efecto).
  // No tienen efecto_altar.

  {
    id: "ART-017",
    nombre: "Cruzada Celestial",
    atk: 0,
    es_altar: false,
    es_artefacto: true,
    artefacto_tipo: "campo",
    contador_escudo: 0,
    efecto_monstruo: [{
      trigger: "passive",
      type: "buff_atk",
      amount: 1,
      scope: "all_allies",
      condition: "none",
      desc: "Los monstruos CELESTIAL ganan +1 ATK. Los monstruos UMBRAL pierden -1 ATK.",
    }],
    efecto_altar: [],
  },

  {
    id: "ART-018",
    nombre: "Tierra Baldía",
    atk: 0,
    es_altar: false,
    es_artefacto: true,
    artefacto_tipo: "campo",
    contador_escudo: 0,
    efecto_monstruo: [{
      trigger: "passive",
      type: "debuff_atk",
      amount: 1,
      scope: "all_enemies",
      condition: "none",
      desc: "Todos los monstruos pierden 1 ATK. Los contadores de escudo no se pueden activar.",
    }],
    efecto_altar: [],
  },

  // ─── ARTEFACTO EQUIPO (Carta de Equipo: se vincula a un monstruo) ───

  {
    id: "ART-019",
    nombre: "Espada del Alba",
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
// NUEVAS MECÁNICAS — 3 CARTAS
// SUBTERRÁNEO (Boca abajo) · ESCUDO (Contadores) · CORROSIÓN (DoT+Memoria)
// ═══════════════════════════════════════════════════════════════

const NUEVAS_MECANICAS_CARDS: CartaMaestra[] = [

  // ─── SUBTERRÁNEO: FULGUR + FERA ───
  // Se juega boca abajo. Inmune a efectos selectivos.
  // Cuando el enemigo ataca su columna, se voltea y activa su efecto.

  {
    id: "FUL-021",
    nombre: "Acecho Magmático",
    raza_tipo: "FERA",
    atributo: "FULGUR",
    metodo_invocacion: "SUBTERRANEO",
    atk: 14,
    es_altar: false,
    contador_escudo: 0,
    boca_abajo: true,
    efecto_monstruo: [
      {
        trigger: "on_flip",
        type: "buff_atk",
        amount: 6,
        scope: "self",
        condition: "none",
        desc: "Al ser volteada por un ataque enemigo, gana +6 ATK y el ataque enemigo se resuelve contra su nuevo ATK.",
      },
      {
        trigger: "on_flip",
        type: "direct_damage",
        amount: 4,
        scope: "opponent_lp",
        condition: "none",
        desc: "Al ser volteada, inflige 4 daño directo al LP enemigo.",
      },
    ],
    efecto_altar: [
      {
        trigger: "passive",
        type: "buff_atk",
        amount: 2,
        scope: "self_lane",
        condition: "none",
        desc: "Los monstruos FULGUR en este carril ganan +2 ATK.",
        categoria: "PASIVO",
      },
    ],
  },

  // ─── ESCUDO: FOSO + ARTIFEX ───
  // Tiene contadores_escudo = 2. Si va a ser destruida, consume 1 contador en su lugar.

  {
    id: "FOS-022",
    nombre: "Bastión Rúnico",
    raza_tipo: "ARTIFEX",
    atributo: "FOSO",
    metodo_invocacion: "NORMAL",
    atk: 16,
    es_altar: false,
    contador_escudo: 2,
    efecto_monstruo: [
      {
        trigger: "on_summon",
        type: "add_shield",
        amount: 1,
        scope: "self",
        condition: "none",
        desc: "Al invocar, gana 1 contador de escudo adicional (máx 3).",
      },
      {
        trigger: "passive",
        type: "prevent_destroy",
        scope: "self",
        condition: "none",
        desc: "Si este monstruo va a ser destruido, consume 1 contador de escudo en su lugar.",
      },
    ],
    efecto_altar: [
      {
        trigger: "on_summon",
        type: "add_shield",
        scope: "self_lane",
        condition: "none",
        desc: "Cuando un monstruo FOSO es invocado en este carril, gana 1 contador de escudo.",
        categoria: "PASIVO",
      },
    ],
  },

  // ─── CORROSIÓN: ABIS + MARINA ───
  // Aplica contadores de corrosión a la columna enemiga. Si el monstruo muere por corrosión,
  // se marca como infectado. Al ser robado de nuevo, entra con -3 ATK.

  {
    id: "ABI-023",
    nombre: "Hidra Abisal",
    raza_tipo: "MARINA",
    atributo: "ABIS",
    metodo_invocacion: "NORMAL",
    atk: 11,
    es_altar: false,
    contador_escudo: 0,
    efecto_monstruo: [
      {
        trigger: "on_attack",
        type: "corrosion",
        amount: 1,
        scope: "enemy_lane",
        condition: "none",
        desc: "Al atacar, aplica 1 contador de corrosión al monstruo enemigo en la columna opuesta. Al inicio del turno de su controlador, recibe 2 daño por cada contador.",
      },
    ],
    efecto_altar: [
      {
        trigger: "once_per_turn",
        type: "corrosion",
        amount: 1,
        scope: "enemy_lane",
        condition: "none",
        desc: "Una vez por turno, aplica 1 contador de corrosión a un monstruo enemigo en el carril opuesto.",
        categoria: "TURNO",
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// TENOTCH — 14 CARTAS (Arquetipo: Tributo)
// Sacrifica un aliado TENOTCH para activar efectos potenciados.
// Atributos: FULGUR, ABIS, FOSO, AURA, CELESTIAL, UMBRAL
// ═══════════════════════════════════════════════════════════════

const TENOTCH_CARDS: CartaMaestra[] = [

  // ─── TENOTCH FULGUR (3: GENS GÉNESIS + FERA NORMAL + FERA ANOMALÍA) ───

  {
    id: "TEN-026",
    nombre: "Huitzilopochtli",
    raza_tipo: "GENS",
    atributo: "FULGUR",
    metodo_invocacion: "GENESIS",
    atk: 28,
    es_altar: false,
    contador_escudo: 0,
    arquetipo: "TENOTCH",
    efecto_monstruo: [
      {
        trigger: "on_summon",
        type: "tributo",
        amount: 1,
        scope: "self",
        condition: "none",
        desc: "Tributo TENOTCH: sacrifica un aliado TENOTCH → destruye 1 monstruo enemigo.",
      },
      {
        trigger: "on_attack",
        type: "direct_damage",
        amount: 3,
        scope: "opponent_lp",
        condition: "none",
        desc: "Al declarar ataque, inflige 3 de daño directo a los LP del oponente.",
      },
    ],
    efecto_altar: [
      {
        trigger: "passive",
        type: "buff_atk",
        amount: 3,
        scope: "self_lane",
        condition: "none",
        desc: "Los monstruos TENOTCH en esta columna ganan +3 ATK.",
        categoria: "PASIVO",
      },
    ],
  },

  {
    id: "TEN-027",
    nombre: "Guerrero Águila",
    raza_tipo: "FERA",
    atributo: "FULGUR",
    metodo_invocacion: "NORMAL",
    atk: 14,
    es_altar: false,
    contador_escudo: 0,
    arquetipo: "TENOTCH",
    efecto_monstruo: [
      {
        trigger: "on_attack",
        type: "tributo",
        amount: 4,
        scope: "self",
        condition: "none",
        desc: "Tributo TENOTCH: sacrifica un aliado TENOTCH → gana +4 ATK temporal.",
      },
    ],
    efecto_altar: [
      {
        trigger: "once_per_turn",
        type: "buff_atk",
        amount: 2,
        scope: "self_lane",
        condition: "none",
        desc: "Una vez por turno, los monstruos FULGUR en este carril ganan +2 ATK.",
        categoria: "TURNO",
      },
    ],
  },

  {
    id: "TEN-028",
    nombre: "Xiuhcóatl",
    raza_tipo: "FERA",
    atributo: "FULGUR",
    metodo_invocacion: "ANOMALIA",
    atk: 18,
    es_altar: false,
    contador_escudo: 0,
    arquetipo: "TENOTCH",
    efecto_monstruo: [
      {
        trigger: "on_consume",
        type: "tributo",
        amount: 6,
        scope: "opponent_lp",
        condition: "none",
        desc: "Tributo TENOTCH: sacrifica un aliado TENOTCH → inflige 6 de daño directo al oponente.",
      },
    ],
    efecto_altar: [
      {
        trigger: "on_destroy_enemy",
        type: "direct_damage",
        amount: 2,
        scope: "opponent_lp",
        condition: "none",
        desc: "Cuando un enemigo es destruido en el carril opuesto, inflige 2 de daño directo al oponente.",
        categoria: "PASIVO",
      },
    ],
  },

  // ─── TENOTCH ABIS (3: MARINA ECLIPSE + MARINA SUBTERRÁNEO + SATIVA NORMAL) ───

  {
    id: "TEN-029",
    nombre: "Tlaloc",
    raza_tipo: "MARINA",
    atributo: "ABIS",
    metodo_invocacion: "ECLIPSE",
    atk: 24,
    es_altar: false,
    contador_escudo: 0,
    arquetipo: "TENOTCH",
    efecto_monstruo: [
      {
        trigger: "on_summon",
        type: "tributo",
        amount: 1,
        scope: "all_enemies",
        condition: "none",
        desc: "Tributo TENOTCH: sacrifica un aliado TENOTCH → aplica corrosión a todos los monstruos enemigos.",
      },
      {
        trigger: "on_turn_start",
        type: "corrosion",
        amount: 2,
        scope: "enemy_lane",
        condition: "none",
        desc: "Al inicio del turno, inflige 2 de daño por cada contador de corrosión al monstruo enemigo opuesto.",
      },
    ],
    efecto_altar: [
      {
        trigger: "passive",
        type: "debuff_atk",
        amount: 2,
        scope: "enemy_lane",
        condition: "none",
        desc: "Los monstruos enemigos en el carril opuesto pierden 2 ATK.",
        categoria: "PASIVO",
      },
    ],
  },

  {
    id: "TEN-030",
    nombre: "Ahuizotl",
    raza_tipo: "MARINA",
    atributo: "ABIS",
    metodo_invocacion: "SUBTERRANEO",
    atk: 12,
    es_altar: false,
    contador_escudo: 0,
    boca_abajo: true,
    arquetipo: "TENOTCH",
    efecto_monstruo: [
      {
        trigger: "on_flip",
        type: "tributo",
        amount: 1,
        scope: "self_lp",
        condition: "none",
        desc: "Tributo TENOTCH: sacrifica un aliado TENOTCH → roba 1 carta e inflige 3 de daño directo.",
      },
    ],
    efecto_altar: [
      {
        trigger: "on_summon",
        type: "add_shield",
        amount: 1,
        scope: "self_lane",
        condition: "none",
        desc: "Cuando un monstruo ABIS es invocado en este carril, gana 1 contador de escudo.",
        categoria: "PASIVO",
      },
    ],
  },

  {
    id: "TEN-031",
    nombre: "Chalchiuhtlicue",
    raza_tipo: "SATIVA",
    atributo: "ABIS",
    metodo_invocacion: "NORMAL",
    atk: 10,
    es_altar: false,
    contador_escudo: 0,
    arquetipo: "TENOTCH",
    efecto_monstruo: [
      {
        trigger: "on_summon",
        type: "tributo",
        amount: 1,
        scope: "target",
        condition: "none",
        desc: "Tributo TENOTCH: sacrifica un aliado TENOTCH → da 1 escudo a un monstruo TENOTCH. Si no hay tributo, gana 3 LP.",
      },
    ],
    efecto_altar: [
      {
        trigger: "once_per_turn",
        type: "lp_gain",
        amount: 2,
        scope: "self_lp",
        condition: "none",
        desc: "Una vez por turno, si controlas un monstruo ABIS en este carril, ganas 2 LP.",
        categoria: "TURNO",
      },
    ],
  },

  // ─── TENOTCH FOSO (2: CLASTO CORRUPCIÓN + ARTIFEX NORMAL) ───

  {
    id: "TEN-032",
    nombre: "Cipactli",
    raza_tipo: "CLASTO",
    atributo: "FOSO",
    metodo_invocacion: "CORRUPCION",
    atk: 20,
    es_altar: false,
    contador_escudo: 0,
    arquetipo: "TENOTCH",
    efecto_monstruo: [
      {
        trigger: "on_summon",
        type: "tributo",
        amount: 1,
        scope: "enemy_lane",
        condition: "none",
        desc: "Tributo TENOTCH: sacrifica un aliado TENOTCH → aplica corrosión al monstruo enemigo opuesto.",
      },
      {
        trigger: "on_attack",
        type: "debuff_atk",
        amount: 2,
        scope: "enemy_lane",
        condition: "none",
        desc: "Al declarar ataque, el monstruo enemigo en la columna opuesta pierde 2 ATK permanentemente.",
      },
    ],
    efecto_altar: [
      {
        trigger: "passive",
        type: "debuff_atk",
        amount: 1,
        scope: "all_enemies",
        condition: "none",
        desc: "Todos los monstruos enemigos pierden 1 ATK.",
        categoria: "PASIVO",
      },
    ],
  },

  {
    id: "TEN-033",
    nombre: "Coatlicue",
    raza_tipo: "ARTIFEX",
    atributo: "FOSO",
    metodo_invocacion: "NORMAL",
    atk: 16,
    es_altar: false,
    contador_escudo: 2,
    arquetipo: "TENOTCH",
    efecto_monstruo: [
      {
        trigger: "on_summon",
        type: "add_shield",
        amount: 1,
        scope: "self",
        condition: "none",
        desc: "Al ser invocada, gana 1 contador de escudo adicional.",
      },
      {
        trigger: "passive",
        type: "prevent_destroy",
        scope: "self",
        condition: "none",
        desc: "Si tiene contadores de escudo, consume 1 escudo y previene la destrucción.",
      },
      {
        trigger: "on_summon",
        type: "tributo",
        amount: 1,
        scope: "self_lane",
        condition: "none",
        desc: "Tributo TENOTCH: sacrifica un aliado TENOTCH → da 1 escudo a todos los monstruos TENOTCH en este carril.",
      },
    ],
    efecto_altar: [
      {
        trigger: "on_summon",
        type: "add_shield",
        amount: 1,
        scope: "self_lane",
        condition: "none",
        desc: "Cuando un monstruo FOSO es invocado en este carril, gana 1 contador de escudo.",
        categoria: "PASIVO",
      },
    ],
  },

  // ─── TENOTCH AURA (3: FÁBULA GÉNESIS + FÁBULA NORMAL + ÁNIMA ANOMALÍA) ───

  {
    id: "TEN-034",
    nombre: "Quetzalcóatl",
    raza_tipo: "FABULA",
    atributo: "AURA",
    metodo_invocacion: "GENESIS",
    atk: 26,
    es_altar: false,
    contador_escudo: 0,
    arquetipo: "TENOTCH",
    efecto_monstruo: [
      {
        trigger: "on_summon",
        type: "tributo",
        amount: 2,
        scope: "self_lp",
        condition: "none",
        desc: "Tributo TENOTCH: sacrifica un aliado TENOTCH → roba 2 cartas.",
      },
      {
        trigger: "on_turn_start",
        type: "buff_atk",
        amount: 2,
        scope: "all_allies",
        condition: "none",
        desc: "Al inicio del turno, todos los monstruos TENOTCH ganan +2 ATK permanente.",
      },
    ],
    efecto_altar: [
      {
        trigger: "passive",
        type: "buff_atk",
        amount: 2,
        scope: "self_lane",
        condition: "none",
        desc: "Los monstruos AURA en esta columna ganan +2 ATK.",
        categoria: "PASIVO",
      },
    ],
  },

  {
    id: "TEN-035",
    nombre: "Ehécatl",
    raza_tipo: "FABULA",
    atributo: "AURA",
    metodo_invocacion: "NORMAL",
    atk: 12,
    es_altar: false,
    contador_escudo: 0,
    arquetipo: "TENOTCH",
    efecto_monstruo: [
      {
        trigger: "on_summon",
        type: "tributo",
        amount: 1,
        scope: "enemy_deck",
        condition: "none",
        desc: "Tributo TENOTCH: sacrifica un aliado TENOTCH → devuelve 1 monstruo enemigo a su mazo.",
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
    id: "TEN-036",
    nombre: "Tzitzimimeh",
    raza_tipo: "ANIMA",
    atributo: "AURA",
    metodo_invocacion: "ANOMALIA",
    atk: 16,
    es_altar: false,
    contador_escudo: 0,
    arquetipo: "TENOTCH",
    efecto_monstruo: [
      {
        trigger: "on_summon",
        type: "tributo",
        amount: 3,
        scope: "all_enemies",
        condition: "none",
        desc: "Tributo TENOTCH: sacrifica un aliado TENOTCH → todos los monstruos enemigos pierden 3 ATK.",
      },
    ],
    efecto_altar: [
      {
        trigger: "on_enemy_attack",
        type: "debuff_atk",
        amount: 2,
        scope: "enemy_lane",
        condition: "none",
        desc: "Cuando un enemigo ataca en este carril, ese enemigo pierde 2 ATK permanente.",
        categoria: "RESPUESTA",
        respuesta_trigger: "enemy_attack",
      },
    ],
  },

  // ─── TENOTCH CELESTIAL (2: GENS ECLIPSE + SATIVA NORMAL) ───

  {
    id: "TEN-037",
    nombre: "Tonatiuh",
    raza_tipo: "GENS",
    atributo: "CELESTIAL",
    metodo_invocacion: "ECLIPSE",
    atk: 22,
    es_altar: false,
    contador_escudo: 0,
    arquetipo: "TENOTCH",
    efecto_monstruo: [
      {
        trigger: "on_summon",
        type: "tributo",
        amount: 5,
        scope: "self",
        condition: "none",
        desc: "Tributo TENOTCH: sacrifica un aliado TENOTCH → gana +5 ATK y previene su destrucción este turno.",
      },
      {
        trigger: "on_attack",
        type: "buff_atk",
        amount: 3,
        scope: "self",
        condition: "none",
        desc: "Al atacar, gana +3 ATK.",
      },
    ],
    efecto_altar: [
      {
        trigger: "once_per_turn",
        type: "buff_atk",
        amount: 3,
        scope: "self_lane",
        condition: "none",
        desc: "Una vez por turno, un monstruo CELESTIAL en este carril gana +3 ATK.",
        categoria: "TURNO",
      },
    ],
  },

  {
    id: "TEN-038",
    nombre: "Centeotl",
    raza_tipo: "SATIVA",
    atributo: "CELESTIAL",
    metodo_invocacion: "NORMAL",
    atk: 10,
    es_altar: false,
    contador_escudo: 0,
    arquetipo: "TENOTCH",
    efecto_monstruo: [
      {
        trigger: "on_summon",
        type: "tributo",
        amount: 1,
        scope: "graveyard",
        condition: "none",
        desc: "Tributo TENOTCH: sacrifica un aliado TENOTCH → recupera 1 carta TENOTCH del mazo.",
      },
      {
        trigger: "on_destroy",
        type: "draw",
        amount: 1,
        scope: "self_lp",
        condition: "none",
        desc: "Al ser destruida, roba 1 carta.",
      },
    ],
    efecto_altar: [
      {
        trigger: "on_turn_start",
        type: "lp_gain",
        amount: 1,
        scope: "self_lp",
        condition: "none",
        desc: "Al inicio de tu turno, ganas 1 LP por cada monstruo TENOTCH en este carril.",
        categoria: "PASIVO",
      },
    ],
  },

  // ─── TENOTCH UMBRAL (1: NECRO CORRUPCIÓN) ───

  {
    id: "TEN-039",
    nombre: "Mictlantecuhtli",
    raza_tipo: "NECRO",
    atributo: "UMBRAL",
    metodo_invocacion: "CORRUPCION",
    atk: 24,
    es_altar: false,
    contador_escudo: 0,
    arquetipo: "TENOTCH",
    efecto_monstruo: [
      {
        trigger: "on_summon",
        type: "tributo",
        amount: 1,
        scope: "all_enemies",
        condition: "none",
        desc: "Tributo TENOTCH: sacrifica un aliado TENOTCH → aplica corrosión a todos los monstruos enemigos.",
      },
      {
        trigger: "on_destroy_enemy",
        type: "direct_damage",
        amount: 3,
        scope: "opponent_lp",
        condition: "none",
        desc: "Al destruir un monstruo enemigo, inflige 3 puntos de daño directo al LP del oponente.",
      },
    ],
    efecto_altar: [
      {
        trigger: "passive",
        type: "debuff_atk",
        amount: 2,
        scope: "all_enemies",
        condition: "none",
        desc: "Todos los monstruos enemigos pierden 2 ATK.",
        categoria: "PASIVO",
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// NÓRDICO — 14 CARTAS (Arquetipo: Saqueo)
// Al destruir un monstruo enemigo en batalla, activa efectos de recompensa.
// Atributos: FULGUR, ABIS, FOSO, AURA, CELESTIAL, UMBRAL
// ═══════════════════════════════════════════════════════════════

const NORDICO_CARDS: CartaMaestra[] = [

  // ─── NÓRDICO FULGUR (3: GENS GÉNESIS + FERA NORMAL + FERA ANOMALÍA) ───

  {
    id: "NOR-042",
    nombre: "Thor",
    raza_tipo: "GENS",
    atributo: "FULGUR",
    metodo_invocacion: "GENESIS",
    atk: 28,
    es_altar: false,
    contador_escudo: 0,
    arquetipo: "NORDICO",
    efecto_monstruo: [
      {
        trigger: "on_destroy_enemy",
        type: "saqueo",
        scope: "all_enemies",
        condition: "none",
        desc: "Saqueo: Al destruir un monstruo enemigo, destruye TODOS los monstruos enemigos con ATK menor al de esta carta.",
      },
      {
        trigger: "on_attack",
        type: "direct_damage",
        amount: 3,
        scope: "opponent_lp",
        condition: "none",
        desc: "Al declarar ataque, inflige 3 daño directo a los LP del oponente.",
      },
    ],
    efecto_altar: [
      {
        trigger: "passive",
        type: "buff_atk",
        amount: 3,
        scope: "self_lane",
        condition: "none",
        desc: "Los monstruos NÓRDICO en este carril ganan +3 ATK.",
        categoria: "PASIVO",
      },
    ],
  },

  {
    id: "NOR-043",
    nombre: "Berserker Ígneo",
    raza_tipo: "FERA",
    atributo: "FULGUR",
    metodo_invocacion: "NORMAL",
    atk: 14,
    es_altar: false,
    contador_escudo: 0,
    arquetipo: "NORDICO",
    efecto_monstruo: [
      {
        trigger: "on_destroy_enemy",
        type: "saqueo",
        amount: 4,
        scope: "self",
        condition: "none",
        desc: "Saqueo: Al destruir un monstruo enemigo, gana +4 ATK permanente.",
      },
    ],
    efecto_altar: [
      {
        trigger: "once_per_turn",
        type: "buff_atk",
        amount: 2,
        scope: "self_lane",
        condition: "none",
        desc: "Una vez por turno, los monstruos FULGUR en este carril ganan +2 ATK.",
        categoria: "TURNO",
      },
    ],
  },

  {
    id: "NOR-044",
    nombre: "Surtr",
    raza_tipo: "FERA",
    atributo: "FULGUR",
    metodo_invocacion: "ANOMALIA",
    atk: 18,
    es_altar: false,
    contador_escudo: 0,
    arquetipo: "NORDICO",
    efecto_monstruo: [
      {
        trigger: "on_destroy_enemy",
        type: "saqueo",
        amount: 5,
        scope: "opponent_lp",
        condition: "none",
        desc: "Saqueo: Al destruir un monstruo enemigo, inflige 5 daño directo a los LP del oponente.",
      },
    ],
    efecto_altar: [
      {
        trigger: "on_destroy_enemy",
        type: "direct_damage",
        amount: 2,
        scope: "opponent_lp",
        condition: "none",
        desc: "Cuando un enemigo es destruido en el carril opuesto, inflige 2 daño directo.",
        categoria: "PASIVO",
      },
    ],
  },

  // ─── NÓRDICO ABIS (3: MARINA ECLIPSE + MARINA SUBTERRÁNEO + SATIVA NORMAL) ───

  {
    id: "NOR-045",
    nombre: "Jormungandr",
    raza_tipo: "MARINA",
    atributo: "ABIS",
    metodo_invocacion: "ECLIPSE",
    atk: 24,
    es_altar: false,
    contador_escudo: 0,
    arquetipo: "NORDICO",
    efecto_monstruo: [
      {
        trigger: "on_destroy_enemy",
        type: "saqueo",
        amount: 1,
        scope: "all_enemies",
        condition: "none",
        desc: "Saqueo: Al destruir un monstruo enemigo, aplica corrosión a todas las columnas enemigas.",
      },
      {
        trigger: "on_turn_start",
        type: "corrosion",
        amount: 2,
        scope: "all_enemies",
        condition: "none",
        desc: "Al inicio del turno, inflige daño por corrosión a los monstruos enemigos: 2 daño por cada contador.",
      },
    ],
    efecto_altar: [
      {
        trigger: "passive",
        type: "debuff_atk",
        amount: 2,
        scope: "enemy_lane",
        condition: "none",
        desc: "Los monstruos enemigos en el carril opuesto pierden 2 ATK.",
        categoria: "PASIVO",
      },
    ],
  },

  {
    id: "NOR-046",
    nombre: "Kraken",
    raza_tipo: "MARINA",
    atributo: "ABIS",
    metodo_invocacion: "SUBTERRANEO",
    atk: 12,
    es_altar: false,
    contador_escudo: 0,
    boca_abajo: true,
    arquetipo: "NORDICO",
    efecto_monstruo: [
      {
        trigger: "on_destroy_enemy",
        type: "saqueo",
        amount: 2,
        scope: "self_lp",
        condition: "none",
        desc: "Saqueo: Al destruir un monstruo enemigo, roba 2 cartas.",
      },
      {
        trigger: "on_flip",
        type: "direct_damage",
        amount: 4,
        scope: "opponent_lp",
        condition: "none",
        desc: "Al ser volteada, inflige 4 daño directo a los LP del oponente.",
      },
    ],
    efecto_altar: [
      {
        trigger: "on_summon",
        type: "add_shield",
        amount: 1,
        scope: "self_lane",
        condition: "none",
        desc: "Cuando un monstruo ABIS es invocado en este carril, gana 1 contador de escudo.",
        categoria: "PASIVO",
      },
    ],
  },

  {
    id: "NOR-047",
    nombre: "Aegir",
    raza_tipo: "SATIVA",
    atributo: "ABIS",
    metodo_invocacion: "NORMAL",
    atk: 10,
    es_altar: false,
    contador_escudo: 0,
    arquetipo: "NORDICO",
    efecto_monstruo: [
      {
        trigger: "on_destroy_enemy",
        type: "saqueo",
        amount: 5,
        scope: "self_lp",
        condition: "none",
        desc: "Saqueo: Al destruir un monstruo enemigo, recupera 5 LP.",
      },
      {
        trigger: "on_summon",
        type: "lp_gain",
        amount: 2,
        scope: "self_lp",
        condition: "none",
        desc: "Al ser colocada, ganas 2 LP.",
      },
    ],
    efecto_altar: [
      {
        trigger: "once_per_turn",
        type: "lp_gain",
        amount: 2,
        scope: "self_lp",
        condition: "none",
        desc: "Una vez por turno, si controlas un monstruo ABIS en este carril, ganas 2 LP.",
        categoria: "TURNO",
      },
    ],
  },

  // ─── NÓRDICO FOSO (2: CLASTO CORRUPCIÓN + ARTIFEX NORMAL) ───

  {
    id: "NOR-048",
    nombre: "Ymir",
    raza_tipo: "CLASTO",
    atributo: "FOSO",
    metodo_invocacion: "CORRUPCION",
    atk: 20,
    es_altar: false,
    contador_escudo: 0,
    arquetipo: "NORDICO",
    efecto_monstruo: [
      {
        trigger: "on_destroy_enemy",
        type: "saqueo",
        amount: 1,
        scope: "self",
        condition: "none",
        desc: "Saqueo: Al destruir un monstruo enemigo, invoca 1 monstruo NÓRDICO del mazo al campo.",
      },
      {
        trigger: "on_attack",
        type: "debuff_atk",
        amount: 2,
        scope: "enemy_lane",
        condition: "none",
        desc: "Al declarar ataque, el monstruo enemigo opuesto pierde 2 ATK permanente.",
      },
    ],
    efecto_altar: [
      {
        trigger: "passive",
        type: "debuff_atk",
        amount: 1,
        scope: "all_enemies",
        condition: "none",
        desc: "Todos los monstruos enemigos pierden 1 ATK.",
        categoria: "PASIVO",
      },
    ],
  },

  {
    id: "NOR-049",
    nombre: "Enano Forjador",
    raza_tipo: "ARTIFEX",
    atributo: "FOSO",
    metodo_invocacion: "NORMAL",
    atk: 16,
    es_altar: false,
    contador_escudo: 1,
    arquetipo: "NORDICO",
    efecto_monstruo: [
      {
        trigger: "on_summon",
        type: "add_shield",
        amount: 1,
        scope: "self",
        condition: "none",
        desc: "Al ser invocado, gana 1 contador de escudo adicional.",
      },
      {
        trigger: "passive",
        type: "prevent_destroy",
        scope: "self",
        condition: "none",
        desc: "Si tiene contadores de escudo, consume 1 escudo y previene la destrucción.",
      },
      {
        trigger: "on_destroy_enemy",
        type: "saqueo",
        amount: 1,
        scope: "self_lp",
        condition: "none",
        desc: "Saqueo: Al destruir un monstruo enemigo, roba 1 carta.",
      },
    ],
    efecto_altar: [
      {
        trigger: "on_summon",
        type: "add_shield",
        amount: 1,
        scope: "self_lane",
        condition: "none",
        desc: "Cuando un monstruo FOSO es invocado en este carril, gana 1 contador de escudo.",
        categoria: "PASIVO",
      },
    ],
  },

  // ─── NÓRDICO AURA (3: FÁBULA GÉNESIS + FÁBULA NORMAL + ÁNIMA ANOMALÍA) ───

  {
    id: "NOR-050",
    nombre: "Odin",
    raza_tipo: "FABULA",
    atributo: "AURA",
    metodo_invocacion: "GENESIS",
    atk: 26,
    es_altar: false,
    contador_escudo: 0,
    arquetipo: "NORDICO",
    efecto_monstruo: [
      {
        trigger: "on_destroy_enemy",
        type: "saqueo",
        amount: 3,
        scope: "self_lp",
        condition: "none",
        desc: "Saqueo: Al destruir un monstruo enemigo, roba 3 cartas.",
      },
      {
        trigger: "on_turn_start",
        type: "buff_atk",
        amount: 2,
        scope: "all_allies",
        condition: "none",
        desc: "Al inicio del turno, todos los monstruos NÓRDICO ganan +2 ATK.",
      },
    ],
    efecto_altar: [
      {
        trigger: "passive",
        type: "buff_atk",
        amount: 2,
        scope: "self_lane",
        condition: "none",
        desc: "Los monstruos AURA en este carril ganan +2 ATK.",
        categoria: "PASIVO",
      },
    ],
  },

  {
    id: "NOR-051",
    nombre: "Valquiria",
    raza_tipo: "FABULA",
    atributo: "AURA",
    metodo_invocacion: "NORMAL",
    atk: 12,
    es_altar: false,
    contador_escudo: 0,
    arquetipo: "NORDICO",
    efecto_monstruo: [
      {
        trigger: "on_destroy_enemy",
        type: "saqueo",
        amount: 2,
        scope: "target",
        condition: "none",
        desc: "Saqueo: Al destruir un monstruo enemigo, da 2 contadores de escudo a un monstruo aliado NÓRDICO.",
      },
    ],
    efecto_altar: [
      {
        trigger: "once_per_turn",
        type: "add_shield",
        amount: 1,
        scope: "self_lane",
        condition: "none",
        desc: "Una vez por turno, 1 monstruo en este carril gana 1 contador de escudo.",
        categoria: "TURNO",
      },
    ],
  },

  {
    id: "NOR-052",
    nombre: "Huginn & Muninn",
    raza_tipo: "ANIMA",
    atributo: "AURA",
    metodo_invocacion: "ANOMALIA",
    atk: 16,
    es_altar: false,
    contador_escudo: 0,
    arquetipo: "NORDICO",
    efecto_monstruo: [
      {
        trigger: "on_destroy_enemy",
        type: "saqueo",
        scope: "enemy_lane",
        condition: "none",
        desc: "Saqueo: Al destruir un monstruo enemigo, niega el siguiente efecto enemigo este turno.",
      },
    ],
    efecto_altar: [
      {
        trigger: "on_enemy_attack",
        type: "debuff_atk",
        amount: 2,
        scope: "enemy_lane",
        condition: "none",
        desc: "Cuando un enemigo ataca en este carril, ese enemigo pierde 2 ATK permanente.",
        categoria: "RESPUESTA",
        respuesta_trigger: "enemy_attack",
      },
    ],
  },

  // ─── NÓRDICO CELESTIAL (2: GENS ECLIPSE + SATIVA NORMAL) ───

  {
    id: "NOR-053",
    nombre: "Heimdall",
    raza_tipo: "GENS",
    atributo: "CELESTIAL",
    metodo_invocacion: "ECLIPSE",
    atk: 22,
    es_altar: false,
    contador_escudo: 0,
    arquetipo: "NORDICO",
    efecto_monstruo: [
      {
        trigger: "on_destroy_enemy",
        type: "saqueo",
        scope: "all_allies",
        condition: "none",
        desc: "Saqueo: Al destruir un monstruo enemigo, previene la destrucción de todos los aliados este turno.",
      },
      {
        trigger: "on_attack",
        type: "buff_atk",
        amount: 3,
        scope: "self",
        condition: "none",
        desc: "Al atacar, gana +3 ATK.",
      },
    ],
    efecto_altar: [
      {
        trigger: "once_per_turn",
        type: "buff_atk",
        amount: 3,
        scope: "self_lane",
        condition: "none",
        desc: "Una vez por turno, un monstruo CELESTIAL en este carril gana +3 ATK.",
        categoria: "TURNO",
      },
    ],
  },

  {
    id: "NOR-054",
    nombre: "Freya",
    raza_tipo: "SATIVA",
    atributo: "CELESTIAL",
    metodo_invocacion: "NORMAL",
    atk: 10,
    es_altar: false,
    contador_escudo: 0,
    arquetipo: "NORDICO",
    efecto_monstruo: [
      {
        trigger: "on_destroy_enemy",
        type: "saqueo",
        amount: 1,
        scope: "graveyard",
        condition: "none",
        desc: "Saqueo: Al destruir un monstruo enemigo, recupera 1 carta NÓRDICO del mazo.",
      },
      {
        trigger: "on_summon",
        type: "lp_gain",
        amount: 3,
        scope: "self_lp",
        condition: "none",
        desc: "Al ser colocada, ganas 3 LP.",
      },
    ],
    efecto_altar: [
      {
        trigger: "on_turn_start",
        type: "lp_gain",
        amount: 1,
        scope: "self_lp",
        condition: "none",
        desc: "Al inicio de tu turno, ganas 1 LP por cada monstruo NÓRDICO en este carril.",
        categoria: "PASIVO",
      },
    ],
  },

  // ─── NÓRDICO UMBRAL (1: NECRO CORRUPCIÓN) ───

  {
    id: "NOR-055",
    nombre: "Hel",
    raza_tipo: "NECRO",
    atributo: "UMBRAL",
    metodo_invocacion: "CORRUPCION",
    atk: 24,
    es_altar: false,
    contador_escudo: 0,
    arquetipo: "NORDICO",
    efecto_monstruo: [
      {
        trigger: "on_destroy_enemy",
        type: "saqueo",
        amount: 3,
        scope: "opponent_lp",
        condition: "none",
        desc: "Saqueo: Al destruir un monstruo enemigo, roba el monstruo destruido a tu campo e inflige 3 daño directo.",
      },
    ],
    efecto_altar: [
      {
        trigger: "passive",
        type: "debuff_atk",
        amount: 2,
        scope: "all_enemies",
        condition: "none",
        desc: "TODOS los monstruos enemigos pierden 2 ATK.",
        categoria: "PASIVO",
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// ARTEFACTOS EXTRA — 4 CARTAS (2 TENOTCH + 2 NÓRDICO)
// ═══════════════════════════════════════════════════════════════

const ARTEFACTO_EXTRA_CARDS: CartaMaestra[] = [

  // ─── TENOTCH ARTEFACTOS ───

  {
    id: "ART-040",
    nombre: "Templo Mayor",
    atk: 0,
    es_altar: false,
    es_artefacto: true,
    artefacto_tipo: "campo",
    contador_escudo: 0,
    arquetipo: "TENOTCH",
    efecto_monstruo: [{
      trigger: "passive",
      type: "draw",
      amount: 1,
      scope: "self_lp",
      condition: "none",
      desc: "Cuando una carta TENOTCH es sacrificada por Tributo, roba 1 carta.",
    }],
    efecto_altar: [],
  },

  {
    id: "ART-041",
    nombre: "Piedra del Sol",
    atk: 0,
    es_altar: false,
    es_artefacto: true,
    artefacto_tipo: "equipo",
    contador_escudo: 0,
    arquetipo: "TENOTCH",
    efecto_monstruo: [{
      trigger: "passive",
      type: "buff_atk",
      amount: 3,
      scope: "self",
      condition: "none",
      desc: "El monstruo equipado gana +3 ATK por cada carta TENOTCH en el campo.",
    }],
    efecto_altar: [],
  },

  // ─── NÓRDICO ARTEFACTOS ───

  {
    id: "ART-056",
    nombre: "Drakkar",
    atk: 0,
    es_altar: false,
    es_artefacto: true,
    artefacto_tipo: "campo",
    contador_escudo: 0,
    arquetipo: "NORDICO",
    efecto_monstruo: [{
      trigger: "passive",
      type: "buff_atk",
      amount: 1,
      scope: "all_allies",
      condition: "none",
      desc: "Todos los monstruos NÓRDICO ganan +1 ATK.",
    }],
    efecto_altar: [],
  },

  {
    id: "ART-057",
    nombre: "Mjolnir",
    atk: 0,
    es_altar: false,
    es_artefacto: true,
    artefacto_tipo: "equipo",
    contador_escudo: 0,
    arquetipo: "NORDICO",
    efecto_monstruo: [{
      trigger: "passive",
      type: "buff_atk",
      amount: 5,
      scope: "self",
      condition: "none",
      desc: "El monstruo equipado gana +5 ATK. Si el equipado es NÓRDICO, permite doble ataque.",
    }],
    efecto_altar: [],
  },
];

// ═══════════════════════════════════════════════════════════════
// EXPORTACIONES
// ═══════════════════════════════════════════════════════════════

/** Todas las cartas del juego en formato CartaMaestra */
export const ALL_CARDS_MAESTRA: CartaMaestra[] = [
  ...CELESTIAL_CARDS,
  ...UMBRAL_CARDS,
  ...ARTEFACTO_CARDS,
  ...NUEVAS_MECANICAS_CARDS,
  ...TENOTCH_CARDS,
  ...NORDICO_CARDS,
  ...ARTEFACTO_EXTRA_CARDS,
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
