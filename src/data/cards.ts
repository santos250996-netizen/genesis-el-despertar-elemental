import type { CardData } from "@/engine/types";

// ============ ALL 88 CARDS (EDOPRO-style by ID) ============
// Data extracted exactly from game-types.ts

export const CARDS: Record<number, CardData> = {
  // ──────────────────────────────────────────
  // CELESTIAL (Energía de Luz) — IDs 1-5
  // ──────────────────────────────────────────
  1: {
    id: 1,
    name: "Serafín del Ala Rota",
    type: "CELESTIAL",
    atk: 10,
    flags: ["isEnergy"],
    desc: "No puede ser destruido por batalla.",
    effects: [
      { trigger: "altar", id: "altar_prevent_destroy", desc: "No puede ser destruido por batalla." },
    ],
  },
  2: {
    id: 2,
    name: "Guardián del Alba",
    type: "CELESTIAL",
    atk: 8,
    flags: ["isEnergy"],
    desc: "Todos tus monstruos ganan +2 ATK.",
    effects: [
      { trigger: "altar", id: "altar_all_atk_200", desc: "Todos tus monstruos ganan +2 ATK." },
    ],
  },
  3: {
    id: 3,
    name: "Valeria, Portadora del Amanecer",
    type: "CELESTIAL",
    atk: 11,
    flags: ["isEnergy"],
    desc: "Gana +4 ATK.",
    effects: [
      { trigger: "altar", id: "altar_atk_400", desc: "Gana +4 ATK." },
    ],
  },
  4: {
    id: 4,
    name: "Destello Primordial",
    type: "CELESTIAL",
    atk: 5,
    flags: ["isEnergy"],
    desc: "El rival no puede activar efectos en tu fase de robo.",
    effects: [
      { trigger: "altar", id: "altar_no_draw_effects", desc: "El rival no puede activar efectos en tu fase de robo." },
    ],
  },
  5: {
    id: 5,
    name: "Luz Devoradora",
    type: "CELESTIAL",
    atk: 7,
    flags: ["isEnergy"],
    desc: "Cada vez que el rival invoca un monstruo de modo normal, descarta 1 carta.",
    effects: [
      { trigger: "altar", id: "altar_discard_on_summon", desc: "Cada vez que el rival invoca un monstruo de modo normal, descarta 1 carta." },
    ],
  },

  // ──────────────────────────────────────────
  // UMBRAL (Energía de Sombra) — IDs 6-10
  // ──────────────────────────────────────────
  6: {
    id: 6,
    name: "Malakor, Susurro del Abismo",
    type: "UMBRAL",
    atk: 12,
    flags: ["isEnergy"],
    desc: "Gana +3 ATK.",
    effects: [
      { trigger: "altar", id: "altar_corrupt_atk_300", desc: "Gana +3 ATK." },
    ],
  },
  7: {
    id: 7,
    name: "Vórtice Oscuro",
    type: "UMBRAL",
    atk: 9,
    flags: ["isEnergy"],
    desc: "Al atacar, el rival no activa efectos.",
    effects: [
      { trigger: "altar", id: "altar_no_attack_effects", desc: "Al atacar, el rival no activa efectos." },
    ],
  },
  8: {
    id: 8,
    name: "Kaelen, la Sombra Fugaz",
    type: "UMBRAL",
    atk: 13,
    flags: ["isEnergy"],
    desc: "Si el rival invoca de modo normal, pierde 1 LP.",
    effects: [
      { trigger: "altar", id: "altar_enemy_summon_lp_loss", desc: "Si el rival invoca de modo normal, pierde 1 LP." },
    ],
  },
  9: {
    id: 9,
    name: "Espectro del Vacío",
    type: "UMBRAL",
    atk: 6,
    flags: ["isEnergy"],
    desc: "Los monstruos enemigos en esta columna pierden 3 ATK.",
    effects: [
      { trigger: "altar", id: "altar_enemy_col_atk_300", desc: "Los monstruos enemigos en esta columna pierden 3 ATK." },
    ],
  },
  10: {
    id: 10,
    name: "Umbral del Olvido",
    type: "UMBRAL",
    atk: 8,
    flags: ["isEnergy"],
    desc: "El rival descarta 1 carta al inicio de cada uno de sus turnos.",
    effects: [
      { trigger: "altar", id: "altar_discard_turn_start", desc: "El rival descarta 1 carta al inicio de cada uno de sus turnos." },
    ],
  },

  // ──────────────────────────────────────────
  // FULGUR (Elemental) — IDs 11-16
  // ──────────────────────────────────────────
  11: {
    id: 11,
    name: "Pyros, Coloso de Ceniza",
    type: "FULGUR",
    atk: 14,
    flags: ["isElemental"],
    desc: "Celestial: Inflige 4 de daño directo al rival. Umbral: Gana +4 ATK.",
    effects: [
      { trigger: "celestial", id: "cel_direct_damage", desc: "Inflige 4 de daño directo al rival." },
      { trigger: "umbral", id: "umb_atk_400", desc: "Gana +4 ATK." },
    ],
  },
  12: {
    id: 12,
    name: "Chispa Errante",
    type: "FULGUR",
    atk: 11,
    flags: ["isElemental"],
    desc: "Celestial: Tus otros monstruos ganan +2 ATK. Umbral: Destruye el Altar enemigo de esta columna.",
    effects: [
      { trigger: "celestial", id: "cel_all_atk_200", desc: "Tus otros monstruos ganan +2 ATK." },
      { trigger: "umbral", id: "umb_destroy_enemy_altar", desc: "Destruye el Altar enemigo de esta columna." },
    ],
  },
  13: {
    id: 13,
    name: "Brasa Eterna",
    type: "FULGUR",
    atk: 12,
    flags: ["isElemental"],
    desc: "Celestial: Si hay un monstruo al frente, gana +3 ATK. Umbral: Cambia la posición de combate de un enemigo.",
    effects: [
      { trigger: "celestial", id: "cel_cond_atk_300", desc: "Si hay un monstruo al frente, gana +3 ATK." },
      { trigger: "umbral", id: "umb_change_position", desc: "Cambia la posición de combate de un enemigo." },
    ],
  },
  14: {
    id: 14,
    name: "Núcleo Volcánico",
    type: "FULGUR",
    atk: 15,
    flags: ["isElemental"],
    desc: "Celestial: Inmune a reducciones de ATK. Umbral: Sus ataques infligen daño de penetración.",
    effects: [
      { trigger: "celestial", id: "cel_immune_atk_reduction", desc: "Inmune a reducciones de ATK." },
      { trigger: "umbral", id: "umb_penetration", desc: "Sus ataques infligen daño de penetración." },
    ],
  },
  15: {
    id: 15,
    name: "Llamarada Voraz",
    type: "FULGUR",
    atk: 12,
    flags: ["isElemental"],
    desc: "Celestial: El rival descarta 1 carta al azar de su mano. Umbral: Gana +3 ATK por cada carta menos que el rival.",
    effects: [
      { trigger: "celestial", id: "cel_discard_random", desc: "El rival descarta 1 carta al azar de su mano." },
      { trigger: "umbral", id: "umb_atk_by_hand_diff", desc: "Gana +3 ATK por cada carta menos que el rival." },
    ],
  },
  16: {
    id: 16,
    name: "Ceniza del Vacío",
    type: "FULGUR",
    atk: 10,
    flags: ["isElemental"],
    desc: "Celestial: Destruye 1 carta de la mano del rival (va al fondo del mazo). Umbral: Daño de penetración.",
    effects: [
      { trigger: "celestial", id: "cel_send_card_to_deck", desc: "Destruye 1 carta de la mano del rival (va al fondo del mazo)." },
      { trigger: "umbral", id: "umb_penetration", desc: "Daño de penetración (sus ataques no se bloquean)." },
    ],
  },

  // ──────────────────────────────────────────
  // AURA (Elemental) — IDs 17-22
  // ──────────────────────────────────────────
  17: {
    id: 17,
    name: "Zephyr, Halcón de Tormenta",
    type: "AURA",
    atk: 12,
    flags: ["isElemental"],
    desc: "Celestial: Regresa un monstruo enemigo a la mano. Umbral: Destruye el Altar enemigo de esta columna.",
    effects: [
      { trigger: "celestial", id: "cel_return_enemy_hand", desc: "Regresa un monstruo enemigo a la mano." },
      { trigger: "umbral", id: "umb_destroy_enemy_altar", desc: "Destruye el Altar enemigo de esta columna." },
    ],
  },
  18: {
    id: 18,
    name: "Hada del Mistral",
    type: "AURA",
    atk: 10,
    flags: ["isElemental"],
    desc: "Celestial: Baraja 1 carta de tu mano para robar 1 nueva. Umbral: Obliga al oponente a descartar 1 carta.",
    effects: [
      { trigger: "celestial", id: "cel_shuffle_draw", desc: "Baraja 1 carta de tu mano para robar 1 nueva." },
      { trigger: "umbral", id: "umb_force_discard", desc: "Obliga al oponente a descartar 1 carta." },
    ],
  },
  19: {
    id: 19,
    name: "Brisa Cortante",
    type: "AURA",
    atk: 13,
    flags: ["isElemental"],
    desc: "Celestial: Gana +1 ATK por cada carta en tu mano. Umbral: Puede cambiar entre Columna 1 y Columna 3.",
    effects: [
      { trigger: "celestial", id: "cel_hand_atk", desc: "Gana +1 ATK por cada carta en tu mano." },
      { trigger: "umbral", id: "umb_change_column", desc: "Puede cambiar entre Columna 1 y Columna 3." },
    ],
  },
  20: {
    id: 20,
    name: "Ciclón Ancestral",
    type: "AURA",
    atk: 14,
    flags: ["isElemental"],
    desc: "Celestial: Limpia las reducciones de ATK de tus monstruos. Umbral: Niega el próximo ataque enemigo en esta columna.",
    effects: [
      { trigger: "celestial", id: "cel_clean_reductions", desc: "Limpia las reducciones de ATK de tus monstruos." },
      { trigger: "umbral", id: "umb_negate_attack", desc: "Niega el próximo ataque enemigo en esta columna." },
    ],
  },
  21: {
    id: 21,
    name: "Tormento Silencioso",
    type: "AURA",
    atk: 11,
    flags: ["isElemental"],
    desc: "Celestial: El rival elige y descarta 1 carta de su mano. Umbral: Gana +2 ATK si el rival tiene 3 o menos cartas.",
    effects: [
      { trigger: "celestial", id: "cel_discard_choose", desc: "El rival elige y descarta 1 carta de su mano." },
      { trigger: "umbral", id: "umb_atk_low_hand", desc: "Gana +2 ATK si el rival tiene 3 o menos cartas." },
    ],
  },
  22: {
    id: 22,
    name: "Viento del Destierro",
    type: "AURA",
    atk: 13,
    flags: ["isElemental"],
    desc: "Celestial: Roba 1 carta de la mano del rival y la manda al fondo de su mazo. Umbral: Niega el próximo ataque enemigo en esta columna.",
    effects: [
      { trigger: "celestial", id: "cel_steal_to_deck", desc: "Roba 1 carta de la mano del rival y la manda al fondo de su mazo." },
      { trigger: "umbral", id: "umb_negate_attack", desc: "Niega el próximo ataque enemigo en esta columna." },
    ],
  },

  // ──────────────────────────────────────────
  // ABIS (Elemental) — IDs 23-28
  // ──────────────────────────────────────────
  23: {
    id: 23,
    name: "Leviatán Menor",
    type: "ABIS",
    atk: 13,
    flags: ["isElemental"],
    desc: "Celestial: Recuperas 5 LP. Umbral: Reduce el ATK de un enemigo en 3 puntos.",
    effects: [
      { trigger: "celestial", id: "cel_lp_500", desc: "Recuperas 5 LP." },
      { trigger: "umbral", id: "umb_reduce_atk_300", desc: "Reduce el ATK de un enemigo en 3 puntos." },
    ],
  },
  24: {
    id: 24,
    name: "Gota del Océano",
    type: "ABIS",
    atk: 9,
    flags: ["isElemental"],
    desc: "Celestial: Gana +5 ATK. Umbral: Al morir, regresa al atacante al fondo del mazo.",
    effects: [
      { trigger: "celestial", id: "cel_atk_500", desc: "Gana +5 ATK." },
      { trigger: "umbral", id: "umb_death_return", desc: "Al morir, regresa al atacante al fondo del mazo." },
    ],
  },
  25: {
    id: 25,
    name: "Coral de Espinas",
    type: "ABIS",
    atk: 11,
    flags: ["isElemental"],
    desc: "Celestial: Cada vez que robas una carta, gana +1 ATK. Umbral: Bloquea esta columna para el rival el próximo turno.",
    effects: [
      { trigger: "celestial", id: "cel_draw_atk_100", desc: "Cada vez que robas una carta, gana +1 ATK." },
      { trigger: "umbral", id: "umb_block_column", desc: "Bloquea esta columna para el rival el próximo turno." },
    ],
  },
  26: {
    id: 26,
    name: "Sirena de las Mareas",
    type: "ABIS",
    atk: 12,
    flags: ["isElemental"],
    desc: "Celestial: Mira las 2 cartas superiores del mazo rival. Umbral: Reduce a 0 el ATK de un enemigo este turno.",
    effects: [
      { trigger: "celestial", id: "cel_view_top_deck", desc: "Mira las 2 cartas superiores del mazo rival." },
      { trigger: "umbral", id: "umb_reduce_atk_0", desc: "Reduce a 0 el ATK de un enemigo este turno." },
    ],
  },
  27: {
    id: 27,
    name: "Abismo del Silencio",
    type: "ABIS",
    atk: 12,
    flags: ["isElemental"],
    desc: "Celestial: El rival no puede tener más de 4 cartas. Si tiene más, descarta hasta 4. Umbral: Al destruir un enemigo por batalla, el rival descarta 1 carta extra.",
    effects: [
      { trigger: "celestial", id: "cel_hand_cap", desc: "El rival no puede tener más de 4 cartas. Si tiene más, descarta hasta 4." },
      { trigger: "umbral", id: "umb_discard_on_kill", desc: "Al destruir un enemigo por batalla, el rival descarta 1 carta extra." },
    ],
  },
  28: {
    id: 28,
    name: "Tsunami Aniquilador",
    type: "ABIS",
    atk: 14,
    flags: ["isElemental"],
    desc: "Celestial: Mira la mano del rival y elige 1 carta para mandarla al fondo del mazo. Umbral: Gana +4 ATK si el rival tiene 0 cartas en mano.",
    effects: [
      { trigger: "celestial", id: "cel_choose_discard_deck", desc: "Mira la mano del rival y elige 1 carta para mandarla al fondo del mazo." },
      { trigger: "umbral", id: "umb_atk_empty_hand", desc: "Gana +4 ATK si el rival tiene 0 cartas en mano." },
    ],
  },

  // ──────────────────────────────────────────
  // FOSO (Elemental) — IDs 29-34
  // ──────────────────────────────────────────
  29: {
    id: 29,
    name: "Guardián de Jade",
    type: "FOSO",
    atk: 8,
    flags: ["isElemental"],
    desc: "Celestial: Gana +3 ATK de forma continua. Umbral: Reduce el ATK de los monstruos enemigos en -2.",
    effects: [
      { trigger: "celestial", id: "cel_atk_300", desc: "Gana +3 ATK de forma continua." },
      { trigger: "umbral", id: "umb_reduce_enemy_atk", desc: "Reduce el ATK de los monstruos enemigos en -2." },
    ],
  },
  30: {
    id: 30,
    name: "Gólem de Obsidiana",
    type: "FOSO",
    atk: 15,
    flags: ["isElemental"],
    desc: "Celestial: Inmune a ser destruido por efectos de monstruos. Umbral: Indestructible en combate (si pierde, no es destruido pero el dueño pierde LP).",
    effects: [
      { trigger: "celestial", id: "cel_immune_effect_destroy", desc: "Inmune a ser destruido por efectos de monstruos." },
      { trigger: "umbral", id: "umb_undestroyable_combat", desc: "Indestructible en combate (si pierde, no es destruido pero el dueño pierde LP)." },
    ],
  },
  31: {
    id: 31,
    name: "Brote Telúrico",
    type: "FOSO",
    atk: 10,
    flags: ["isElemental"],
    desc: "Celestial: Añade un Celestial desde tu mazo a tu mano. Umbral: Añade un Umbral desde tu mazo a tu mano.",
    effects: [
      { trigger: "celestial", id: "cel_add_celestial_hand", desc: "Añade un Celestial desde tu mazo a tu mano." },
      { trigger: "umbral", id: "umb_add_umbral_hand", desc: "Añade un Umbral desde tu mazo a tu mano." },
    ],
  },
  32: {
    id: 32,
    name: "Fisura Viviente",
    type: "FOSO",
    atk: 12,
    flags: ["isElemental"],
    desc: "Celestial: Si el rival tiene más monstruos, gana +2 ATK. Umbral: Gana +6 ATK.",
    effects: [
      { trigger: "celestial", id: "cel_cond_atk_200", desc: "Si el rival tiene más monstruos, gana +2 ATK." },
      { trigger: "umbral", id: "umb_atk_600", desc: "Gana +6 ATK." },
    ],
  },
  33: {
    id: 33,
    name: "Guja del Destierro",
    type: "FOSO",
    atk: 10,
    flags: ["isElemental"],
    desc: "Celestial: Cada vez que el rival descarta una carta por cualquier motivo, gana +1 ATK. Umbral: Si el rival tiene 0 cartas en mano, es indestructible por batalla.",
    effects: [
      { trigger: "celestial", id: "cel_atk_on_discard", desc: "Cada vez que el rival descarta una carta por cualquier motivo, gana +1 ATK." },
      { trigger: "umbral", id: "umb_undestroyable_empty_hand", desc: "Si el rival tiene 0 cartas en mano, es indestructible por batalla." },
    ],
  },
  34: {
    id: 34,
    name: "Fosa Mental",
    type: "FOSO",
    atk: 12,
    flags: ["isElemental"],
    desc: "Celestial: Si el rival tiene más cartas que tú, gana +4 ATK. Umbral: Bloquea esta columna para el rival el próximo turno.",
    effects: [
      { trigger: "celestial", id: "cel_atk_more_cards", desc: "Si el rival tiene más cartas que tú, gana +4 ATK." },
      { trigger: "umbral", id: "umb_block_column", desc: "Bloquea esta columna para el rival el próximo turno." },
    ],
  },

  // ──────────────────────────────────────────
  // ECLIPSE (Columna 2 / Sin efectos) — IDs 35-38
  // ──────────────────────────────────────────
  35: {
    id: 35,
    name: "Aethelgard, el Cruzado",
    type: "ECLIPSE",
    atk: 16,
    flags: ["isSpecial"],
    desc: "Sin efectos impresos. Requiere ambos Altares activos para invocar.",
    effects: [],
  },
  36: {
    id: 36,
    name: "Solsticio de Invierno",
    type: "ECLIPSE",
    atk: 15,
    flags: ["isSpecial"],
    desc: "Sin efectos impresos. Requiere ambos Altares activos para invocar.",
    effects: [],
  },
  37: {
    id: 37,
    name: "Marea de Penumbra",
    type: "ECLIPSE",
    atk: 14,
    flags: ["isSpecial"],
    desc: "Sin efectos impresos. Requiere ambos Altares activos para invocar.",
    effects: [],
  },
  38: {
    id: 38,
    name: "Estrato de Crepúsculo",
    type: "ECLIPSE",
    atk: 13,
    flags: ["isSpecial"],
    desc: "Sin efectos impresos. Requiere ambos Altares activos para invocar.",
    effects: [],
  },

  // ──────────────────────────────────────────
  // CORRUPCION (Columna 3 / Sin efectos) — IDs 39-43
  // ──────────────────────────────────────────
  39: {
    id: 39,
    name: "Xenomorph, Plaga Viviente",
    type: "CORRUPCION",
    atk: 19,
    flags: ["isSpecial"],
    desc: "Sin efectos impresos. Requiere Altar de Sombra y sacrificar un monstruo en Zona 3.",
    effects: [],
  },
  40: {
    id: 40,
    name: "Heraldo de la Podredumbre",
    type: "CORRUPCION",
    atk: 18,
    flags: ["isSpecial"],
    desc: "Sin efectos impresos. Requiere Altar de Sombra y sacrificar un monstruo en Zona 3.",
    effects: [],
  },
  41: {
    id: 41,
    name: "Parásito de las Profundidades",
    type: "CORRUPCION",
    atk: 17,
    flags: ["isSpecial"],
    desc: "Sin efectos impresos. Requiere Altar de Sombra y sacrificar un monstruo en Zona 3.",
    effects: [],
  },
  42: {
    id: 42,
    name: "Abominación de Fango",
    type: "CORRUPCION",
    atk: 16,
    flags: ["isSpecial"],
    desc: "Sin efectos impresos. Requiere Altar de Sombra y sacrificar un monstruo en Zona 3.",
    effects: [],
  },
  43: {
    id: 43,
    name: "Gusano del Vacío",
    type: "CORRUPCION",
    atk: 18,
    flags: ["isSpecial"],
    desc: "Sin efectos impresos. Requiere Altar de Sombra y sacrificar un monstruo en Zona 3.",
    effects: [],
  },

  // ──────────────────────────────────────────
  // ANOMALIA (Columna 1 o 3 / Sin efectos) — IDs 44-47
  // ──────────────────────────────────────────
  44: {
    id: 44,
    name: "Quimera Inestable",
    type: "ANOMALIA",
    atk: 16,
    flags: ["isSpecial"],
    desc: "Sin efectos impresos. Consume un monstruo enemigo sintonizado y copia su ATK.",
    effects: [],
  },
  45: {
    id: 45,
    name: "Espejismo del Vacío",
    type: "ANOMALIA",
    atk: 14,
    flags: ["isSpecial"],
    desc: "Sin efectos impresos. Consume un monstruo enemigo sintonizado y copia su ATK.",
    effects: [],
  },
  46: {
    id: 46,
    name: "Singularidad Líquida",
    type: "ANOMALIA",
    atk: 15,
    flags: ["isSpecial"],
    desc: "Sin efectos impresos. Consume un monstruo enemigo sintonizado y copia su ATK.",
    effects: [],
  },
  47: {
    id: 47,
    name: "Paradoja de Cristal",
    type: "ANOMALIA",
    atk: 12,
    flags: ["isSpecial"],
    desc: "Sin efectos impresos. Consume un monstruo enemigo sintonizado y copia su ATK.",
    effects: [],
  },

  // ──────────────────────────────────────────
  // GENESIS (Columna 2) — IDs 48-52
  // ──────────────────────────────────────────
  48: {
    id: 48,
    name: "Aethel, el Núcleo Primigenio",
    type: "GENESIS",
    atk: 24,
    flags: ["isGenesis"],
    desc: "Inflige 8 de daño directo al rival. Tus otros monstruos ganan +2 ATK.",
    effects: [
      { trigger: "genesis", id: "gen_aethel", desc: "Inflige 8 de daño directo al rival. Tus otros monstruos ganan +2 ATK." },
    ],
  },
  49: {
    id: 49,
    name: "Érebo, el Fin de los Tiempos",
    type: "GENESIS",
    atk: 23,
    flags: ["isGenesis"],
    desc: "Regresa un monstruo enemigo a la mano. Atacar directo le cuesta al rival 2 LP.",
    effects: [
      { trigger: "genesis", id: "gen_erebo", desc: "Regresa un monstruo enemigo a la mano. Atacar directo le cuesta al rival 2 LP." },
    ],
  },
  50: {
    id: 50,
    name: "Poseidón, la Furia Abisal",
    type: "GENESIS",
    atk: 22,
    flags: ["isGenesis"],
    desc: "Recuperas 8 LP. Tus otros monstruos ganan +2 ATK.",
    effects: [
      { trigger: "genesis", id: "gen_poseidon", desc: "Recuperas 8 LP. Tus otros monstruos ganan +2 ATK." },
    ],
  },
  51: {
    id: 51,
    name: "Gaia, el Titán de la Tierra",
    type: "GENESIS",
    atk: 20,
    flags: ["isGenesis"],
    desc: "Tus monstruos no pueden ser destruidos por efectos.",
    effects: [
      { trigger: "genesis", id: "gen_gaia", desc: "Tus monstruos no pueden ser destruidos por efectos." },
    ],
  },
  52: {
    id: 52,
    name: "Oblivion, el Vacío Definitivo",
    type: "GENESIS",
    atk: 22,
    flags: ["isGenesis"],
    desc: "Destruye TODA la mano del rival (van al fondo del mazo). El rival pierde 2 LP por cada carta destruida.",
    effects: [
      { trigger: "genesis", id: "gen_oblivion", desc: "Destruye TODA la mano del rival (van al fondo del mazo). El rival pierde 2 LP por cada carta destruida." },
    ],
  },

  // ──────────────────────────────────────────
  // PIROCLASMA: Altares Celestiales — IDs 53-54
  // ──────────────────────────────────────────
  53: {
    id: 53,
    name: "Hoguera Ancestral",
    type: "CELESTIAL",
    atk: 6,
    flags: ["isEnergy"],
    desc: "Gana +3 ATK. Al atacar, inflige 2 LP extra al rival.",
    effects: [
      { trigger: "altar_fulgur", id: "alt_fulg_atk_300_burn", desc: "Gana +3 ATK. Al atacar, inflige 2 LP extra al rival." },
    ],
  },
  54: {
    id: 54,
    name: "Llama Primordial",
    type: "CELESTIAL",
    atk: 5,
    flags: ["isEnergy"],
    desc: "Todos tus monstruos en campo ganan +1 ATK.",
    effects: [
      { trigger: "altar_fulgur", id: "alt_fulg_all_fulg_100", desc: "Todos tus monstruos en campo ganan +1 ATK." },
    ],
  },

  // ──────────────────────────────────────────
  // PIROCLASMA: Altares Umbrales — IDs 55-56
  // ──────────────────────────────────────────
  55: {
    id: 55,
    name: "Brasas del Inframundo",
    type: "UMBRAL",
    atk: 7,
    flags: ["isEnergy"],
    desc: "Gana +4 ATK. Al invocar, 2 LP daño directo al rival.",
    effects: [
      { trigger: "altar_fulgur", id: "alt_fulg_atk_400_200lp", desc: "Gana +4 ATK. Al invocar, 2 LP daño directo al rival." },
    ],
  },
  56: {
    id: 56,
    name: "Ceniza Eterna",
    type: "UMBRAL",
    atk: 5,
    flags: ["isEnergy"],
    desc: "Al destruir enemigo por batalla, rival pierde 2 LP extra.",
    effects: [
      { trigger: "altar_fulgur", id: "alt_fulg_kill_200lp", desc: "Al destruir enemigo por batalla, rival pierde 2 LP extra." },
    ],
  },

  // ──────────────────────────────────────────
  // PIROCLASMA: Elementales FULGUR — IDs 57-60
  // ──────────────────────────────────────────
  57: {
    id: 57,
    name: "Ignis, Corazón Ígneo",
    type: "FULGUR",
    atk: 12,
    flags: ["isElemental"],
    desc: "Celestial: Cada FULGUR en campo gana +1 ATK. Umbral: Al destruir enemigo por batalla, 2 LP daño al rival.",
    effects: [
      { trigger: "celestial", id: "cel_all_fulg_atk_100", desc: "Cada FULGUR en campo gana +1 ATK." },
      { trigger: "umbral", id: "umb_kill_200lp", desc: "Al destruir enemigo por batalla, 2 LP daño al rival." },
    ],
  },
  58: {
    id: 58,
    name: "Incendio Salvaje",
    type: "FULGUR",
    atk: 11,
    flags: ["isElemental"],
    desc: "Celestial: 3 LP daño directo al rival. Umbral: Si hay otro FULGUR en campo, gana +3 ATK.",
    effects: [
      { trigger: "celestial", id: "cel_fulg_direct_300", desc: "3 LP daño directo al rival." },
      { trigger: "umbral", id: "umb_atk_other_fulg", desc: "Si hay otro FULGUR en campo, gana +3 ATK." },
    ],
  },
  59: {
    id: 59,
    name: "Volcán de Obsidiana",
    type: "FULGUR",
    atk: 14,
    flags: ["isElemental"],
    desc: "Celestial: Inmune a reducciones de ATK. Umbral: Penetración (daño no se bloquea).",
    effects: [
      { trigger: "celestial", id: "cel_immune_atk_reduction", desc: "Inmune a reducciones de ATK." },
      { trigger: "umbral", id: "umb_penetration", desc: "Penetración (daño no se bloquea)." },
    ],
  },
  60: {
    id: 60,
    name: "Tormenta Ígnea",
    type: "FULGUR",
    atk: 10,
    flags: ["isElemental"],
    desc: "Celestial: Al invocar, todos tus FULGUR ganan +2 ATK este turno. Umbral: Si tienes 2 o más FULGUR en campo, gana +4 ATK.",
    effects: [
      { trigger: "celestial", id: "cel_all_fulg_burst_200", desc: "Al invocar, todos tus FULGUR ganan +2 ATK este turno." },
      { trigger: "umbral", id: "umb_atk_2fulg_400", desc: "Si tienes 2 o más FULGUR en campo, gana +4 ATK." },
    ],
  },

  // ──────────────────────────────────────────
  // PIROCLASMA: Especiales — IDs 61-63
  // ──────────────────────────────────────────
  61: {
    id: 61,
    name: "Nova Ardiente",
    type: "ECLIPSE",
    atk: 16,
    flags: ["isSpecial"],
    desc: "Sin efectos impresos. Requiere ambos Altares activos para invocar.",
    effects: [],
  },
  62: {
    id: 62,
    name: "Fénix de la Destrucción",
    type: "CORRUPCION",
    atk: 18,
    flags: ["isSpecial"],
    desc: "Sin efectos impresos. Requiere Altar de Sombra y sacrificar un monstruo en Zona 3.",
    effects: [],
  },
  63: {
    id: 63,
    name: "Espejo Ígneo",
    type: "ANOMALIA",
    atk: 15,
    flags: ["isSpecial"],
    desc: "Sin efectos impresos. Consume un monstruo enemigo sintonizado y copia su ATK.",
    effects: [],
  },

  // ──────────────────────────────────────────
  // PIROCLASMA: Genesis — ID 64
  // ──────────────────────────────────────────
  64: {
    id: 64,
    name: "Pyraxis, el Devorador Solar",
    type: "GENESIS",
    atk: 23,
    flags: ["isGenesis"],
    desc: "Destruye TODOS los monstruos enemigos con ATK menor al suyo. 2 LP daño por cada uno destruido.",
    effects: [
      { trigger: "genesis", id: "gen_pyraxis", desc: "Destruye TODOS los monstruos enemigos con ATK menor al suyo. 2 LP daño por cada uno destruido." },
    ],
  },

  // ──────────────────────────────────────────
  // AETHÉRIA: Altares Celestiales — IDs 65-66
  // ──────────────────────────────────────────
  65: {
    id: 65,
    name: "Nido del Vórtice",
    type: "CELESTIAL",
    atk: 6,
    flags: ["isEnergy"],
    desc: "Gana +3 ATK. Al atacar, roba 1 carta.",
    effects: [
      { trigger: "altar_aura", id: "alt_aura_atk_300_draw", desc: "Gana +3 ATK. Al atacar, roba 1 carta." },
    ],
  },
  66: {
    id: 66,
    name: "Brisa del Alba",
    type: "CELESTIAL",
    atk: 5,
    flags: ["isEnergy"],
    desc: "Todos tus monstruos en campo +1 ATK. Al destruir por batalla, oponente descarta 1.",
    effects: [
      { trigger: "altar_aura", id: "alt_aura_all_aura_100_discard", desc: "Todos tus monstruos en campo +1 ATK. Al destruir por batalla, oponente descarta 1." },
    ],
  },

  // ──────────────────────────────────────────
  // AETHÉRIA: Altares Umbrales — IDs 67-68
  // ──────────────────────────────────────────
  67: {
    id: 67,
    name: "Refugio de la Tormenta",
    type: "UMBRAL",
    atk: 7,
    flags: ["isEnergy"],
    desc: "Gana +4 ATK. Si es atacado, devuelve el atacante enemigo a la mano.",
    effects: [
      { trigger: "altar_aura", id: "alt_aura_atk_400_return", desc: "Gana +4 ATK. Si es atacado, devuelve el atacante enemigo a la mano." },
    ],
  },
  68: {
    id: 68,
    name: "Ojo del Huracán",
    type: "UMBRAL",
    atk: 5,
    flags: ["isEnergy"],
    desc: "Al destruir por batalla, roba 1 carta. Si está en Col 3, -2 ATK al monstruo enfrente.",
    effects: [
      { trigger: "altar_aura", id: "alt_aura_kill_draw_reduce", desc: "Al destruir por batalla, roba 1 carta. Si está en Col 3, -2 ATK al monstruo enfrente." },
    ],
  },

  // ──────────────────────────────────────────
  // AETHÉRIA: Elementales AURA — IDs 69-72
  // ──────────────────────────────────────────
  69: {
    id: 69,
    name: "Zéfir, Señor de los Vientos",
    type: "AURA",
    atk: 12,
    flags: ["isElemental"],
    desc: "Celestial: Gana +1 ATK por cada carta en tu mano. Umbral: Al destruir por batalla, devuelve 1 enemigo a la mano.",
    effects: [
      { trigger: "celestial", id: "cel_hand_atk", desc: "Gana +1 ATK por cada carta en tu mano." },
      { trigger: "umbral", id: "umb_return_kill", desc: "Al destruir por batalla, devuelve 1 enemigo a la mano." },
    ],
  },
  70: {
    id: 70,
    name: "Tornado Voraz",
    type: "AURA",
    atk: 11,
    flags: ["isElemental"],
    desc: "Celestial: 2 LP daño directo al rival. Umbral: Si hay otro AURA en campo, gana +3 ATK.",
    effects: [
      { trigger: "celestial", id: "cel_direct_damage_200", desc: "2 LP daño directo al rival." },
      { trigger: "umbral", id: "umb_atk_other_aura", desc: "Si hay otro AURA en campo, gana +3 ATK." },
    ],
  },
  71: {
    id: 71,
    name: "Muro de Aire",
    type: "AURA",
    atk: 14,
    flags: ["isElemental"],
    desc: "Celestial: Inmune a reducciones de ATK. Umbral: Niega el primer ataque enemigo en su columna.",
    effects: [
      { trigger: "celestial", id: "cel_immune_atk_reduction", desc: "Inmune a reducciones de ATK." },
      { trigger: "umbral", id: "umb_negate_attack", desc: "Niega el primer ataque enemigo en su columna." },
    ],
  },
  72: {
    id: 72,
    name: "Ventisca Dominante",
    type: "AURA",
    atk: 10,
    flags: ["isElemental"],
    desc: "Celestial: Al invocar, todos tus AURA ganan +2 ATK este turno. Umbral: Si tienes 2 o más AURA en campo, gana +4 ATK.",
    effects: [
      { trigger: "celestial", id: "cel_all_aura_burst_200", desc: "Al invocar, todos tus AURA ganan +2 ATK este turno." },
      { trigger: "umbral", id: "umb_atk_2aura_400", desc: "Si tienes 2 o más AURA en campo, gana +4 ATK." },
    ],
  },

  // ──────────────────────────────────────────
  // AETHÉRIA: Especiales — IDs 73-75
  // ──────────────────────────────────────────
  73: {
    id: 73,
    name: "Aurora Boreal",
    type: "ECLIPSE",
    atk: 16,
    flags: ["isSpecial"],
    desc: "Sin efectos impresos. Requiere ambos Altares activos para invocar.",
    effects: [],
  },
  74: {
    id: 74,
    name: "Huracán Devastador",
    type: "CORRUPCION",
    atk: 18,
    flags: ["isSpecial"],
    desc: "Sin efectos impresos. Requiere Altar de Sombra y sacrificar un monstruo en Zona 3.",
    effects: [],
  },
  75: {
    id: 75,
    name: "Eco del Vacío",
    type: "ANOMALIA",
    atk: 15,
    flags: ["isSpecial"],
    desc: "Sin efectos impresos. Consume un monstruo enemigo sintonizado y copia su ATK.",
    effects: [],
  },

  // ──────────────────────────────────────────
  // AETHÉRIA: Genesis — ID 76
  // ──────────────────────────────────────────
  76: {
    id: 76,
    name: "Aetheria, la Tempestad Suprema",
    type: "GENESIS",
    atk: 23,
    flags: ["isGenesis"],
    desc: "Devuelve TODOS los enemigos con menos ATK que ella a la mano del rival. 2 LP por cada devuelto.",
    effects: [
      { trigger: "genesis", id: "gen_aetheria", desc: "Devuelve TODOS los enemigos con menos ATK que ella a la mano del rival. 2 LP por cada devuelto." },
    ],
  },

  // ──────────────────────────────────────────
  // ABISMA: Altares Celestiales — IDs 77-78
  // ──────────────────────────────────────────
  77: {
    id: 77,
    name: "Arrecife Bioluminiscente",
    type: "CELESTIAL",
    atk: 6,
    flags: ["isEnergy"],
    desc: "+3 ATK. Al atacar, absorbe 2 LP (roba 2 del rival y cura 2).",
    effects: [
      { trigger: "altar_abis", id: "alt_abis_drain_300", desc: "+3 ATK. Al atacar, absorbe 2 LP (roba 2 del rival y cura 2)." },
    ],
  },
  78: {
    id: 78,
    name: "Manantial Primordial",
    type: "CELESTIAL",
    atk: 5,
    flags: ["isEnergy"],
    desc: "+2 ATK por cada 5 LP que te falten (max +8). Al destruir por batalla, roba 1 carta.",
    effects: [
      { trigger: "altar_abis", id: "alt_abis_lp_scale", desc: "+2 ATK por cada 5 LP que te falten (max +8). Al destruir por batalla, roba 1 carta." },
    ],
  },

  // ──────────────────────────────────────────
  // ABISMA: Altares Umbrales — IDs 79-80
  // ──────────────────────────────────────────
  79: {
    id: 79,
    name: "Fosa Abisal",
    type: "UMBRAL",
    atk: 7,
    flags: ["isEnergy"],
    desc: "+4 ATK. El enemigo enfrente pierde 2 ATK.",
    effects: [
      { trigger: "altar_abis", id: "alt_abis_sink_400", desc: "+4 ATK. El enemigo enfrente pierde 2 ATK." },
    ],
  },
  80: {
    id: 80,
    name: "Trinchera Oscura",
    type: "UMBRAL",
    atk: 5,
    flags: ["isEnergy"],
    desc: "Al destruir por batalla, rival descarta 1. Si el rival invoca en esa columna, pierde 2 LP.",
    effects: [
      { trigger: "altar_abis", id: "alt_abis_kill_discard_trap", desc: "Al destruir por batalla, rival descarta 1. Si el rival invoca en esa columna, pierde 2 LP." },
    ],
  },

  // ──────────────────────────────────────────
  // ABISMA: Elementales ABIS — IDs 81-84
  // ──────────────────────────────────────────
  81: {
    id: 81,
    name: "Tiburón de las Profundidades",
    type: "ABIS",
    atk: 12,
    flags: ["isElemental"],
    desc: "Celestial: Roba ATK: Reduce 3 ATK del enemigo enfrente y los suma a su propio ATK. Umbral: Gana +2 ATK por cada 5 LP que el rival tenga más que tú.",
    effects: [
      { trigger: "celestial", id: "cel_steal_atk_300", desc: "Roba ATK: Reduce 3 ATK del enemigo enfrente y los suma a su propio ATK." },
      { trigger: "umbral", id: "umb_atk_lp_lead", desc: "Gana +2 ATK por cada 5 LP que el rival tenga más que tú." },
    ],
  },
  82: {
    id: 82,
    name: "Medusa Petrificante",
    type: "ABIS",
    atk: 11,
    flags: ["isElemental"],
    desc: "Celestial: Al invocar, el enemigo con menor ATK queda con 0 ATK este turno. Umbral: Si destruye por batalla, el enemigo va al FONDO del mazo.",
    effects: [
      { trigger: "celestial", id: "cel_petrify_weakest", desc: "Al invocar, el enemigo con menor ATK queda con 0 ATK este turno." },
      { trigger: "umbral", id: "umb_sink_bottom", desc: "Si destruye por batalla, el enemigo va al FONDO del mazo (no vuelve a la mano)." },
    ],
  },
  83: {
    id: 83,
    name: "Coral Espejeado",
    type: "ABIS",
    atk: 13,
    flags: ["isElemental"],
    desc: "Celestial: Mimetismo: Gana ATK bonus igual al del monstruo enemigo más fuerte del rival. Umbral: Si el rival tiene más LP que tú: +3 ATK e indestructible por batalla.",
    effects: [
      { trigger: "celestial", id: "cel_mirror_strongest", desc: "Mimetismo: Gana ATK bonus igual al del monstruo enemigo más fuerte del rival." },
      { trigger: "umbral", id: "umb_harden_300", desc: "Si el rival tiene más LP que tú: +3 ATK e indestructible por batalla." },
    ],
  },
  84: {
    id: 84,
    name: "Anguila de las Corrientes",
    type: "ABIS",
    atk: 10,
    flags: ["isElemental"],
    desc: "Celestial: Al invocar, TODOS los monstruos enemigos pierden 2 ATK. Umbral: Gana +3 ATK por CADA monstruo enemigo en el campo.",
    effects: [
      { trigger: "celestial", id: "cel_tsunami_200", desc: "Al invocar, TODOS los monstruos enemigos pierden 2 ATK." },
      { trigger: "umbral", id: "umb_atk_per_enemy", desc: "Gana +3 ATK por CADA monstruo enemigo en el campo." },
    ],
  },

  // ──────────────────────────────────────────
  // ABISMA: Especiales — IDs 85-87
  // ──────────────────────────────────────────
  85: {
    id: 85,
    name: "Marea de Fondo",
    type: "ECLIPSE",
    atk: 16,
    flags: ["isSpecial"],
    desc: "Sin efectos impresos. Requiere ambos Altares activos para invocar.",
    effects: [],
  },
  86: {
    id: 86,
    name: "Kraken Colosal",
    type: "CORRUPCION",
    atk: 18,
    flags: ["isSpecial"],
    desc: "Sin efectos impresos. Al invocar, destruye todos los altares enemigos.",
    effects: [],
  },
  87: {
    id: 87,
    name: "Abismo Reflejado",
    type: "ANOMALIA",
    atk: 15,
    flags: ["isSpecial"],
    desc: "Sin efectos impresos. Consume un monstruo enemigo sintonizado y copia su ATK.",
    effects: [],
  },

  // ──────────────────────────────────────────
  // ABISMA: Genesis — ID 88
  // ──────────────────────────────────────────
  88: {
    id: 88,
    name: "Océano, el Devorador de Mundos",
    type: "GENESIS",
    atk: 23,
    flags: ["isGenesis"],
    desc: "Devuelve TODOS los enemigos al FONDO del mazo (se hunden para siempre). +3 LP por cada uno devuelto.",
    effects: [
      { trigger: "genesis", id: "gen_oceano", desc: "Devuelve TODOS los enemigos al FONDO del mazo (se hunden para siempre). +3 LP por cada uno devuelto." },
    ],
  },

  // ──────────────────────────────────────────
  // ARTEFACTOS — IDs 89-96
  // ──────────────────────────────────────────

  89: {
    id: 89,
    name: "Escudo del Alba",
    type: "ARTEFACTO",
    atk: 0,
    flags: ["isArtifact"],
    artifactType: "intercepcion",
    desc: "Cuando el rival ataca directo por Columna 2 vacía, reduce su ATK a la mitad. El rival roba 1 carta.",
    effects: [
      { trigger: "artifact", id: "art_intercept_alba", desc: "Reduce ATK del atacante a la mitad. Rival roba 1." },
    ],
  },
  90: {
    id: 90,
    name: "Sello del Vacío",
    type: "ARTEFACTO",
    atk: 0,
    flags: ["isArtifact"],
    artifactType: "intercepcion",
    desc: "Cuando el rival ataca directo por Columna 2 vacía, reduce su ATK a la mitad. El rival roba 1 carta.",
    effects: [
      { trigger: "artifact", id: "art_intercept_vacio", desc: "Reduce ATK del atacante a la mitad. Rival roba 1." },
    ],
  },
  91: {
    id: 91,
    name: "Faro de la Llama",
    type: "ARTEFACTO",
    atk: 0,
    flags: ["isArtifact"],
    artifactType: "aceleracion",
    desc: "Al inicio de tu turno, paga 1 LP para robar 1 carta adicional. (Máx 1 vez por turno)",
    effects: [
      { trigger: "artifact", id: "art_accel_llama", desc: "Paga 1 LP → roba 1 carta." },
    ],
  },
  92: {
    id: 92,
    name: "Viento del Ocaso",
    type: "ARTEFACTO",
    atk: 0,
    flags: ["isArtifact"],
    artifactType: "aceleracion",
    desc: "Al inicio de tu turno, paga 1 LP para robar 1 carta adicional. (Máx 1 vez por turno)",
    effects: [
      { trigger: "artifact", id: "art_accel_viento", desc: "Paga 1 LP → roba 1 carta." },
    ],
  },
  93: {
    id: 93,
    name: "Corriente Profunda",
    type: "ARTEFACTO",
    atk: 0,
    flags: ["isArtifact"],
    artifactType: "aceleracion",
    desc: "Al inicio de tu turno, paga 1 LP para robar 1 carta adicional. (Máx 1 vez por turno)",
    effects: [
      { trigger: "artifact", id: "art_accel_corriente", desc: "Paga 1 LP → roba 1 carta." },
    ],
  },
  94: {
    id: 94,
    name: "Terremoto Ancestral",
    type: "ARTEFACTO",
    atk: 0,
    flags: ["isArtifact"],
    artifactType: "global",
    desc: "Mientras esté en juego: todos los monstruos en campo tienen -1 ATK.",
    effects: [
      { trigger: "artifact", id: "art_global_terremoto", desc: "Todos los monstruos en campo -1 ATK." },
    ],
  },
  95: {
    id: 95,
    name: "Eclipse Permanente",
    type: "ARTEFACTO",
    atk: 0,
    flags: ["isArtifact"],
    artifactType: "global",
    desc: "Mientras esté en juego: las invocaciones especiales están prohibidas para ambos jugadores.",
    effects: [
      { trigger: "artifact", id: "art_global_eclipse", desc: "Prohíbe invocaciones especiales." },
    ],
  },
  96: {
    id: 96,
    name: "Zona Muerta",
    type: "ARTEFACTO",
    atk: 0,
    flags: ["isArtifact"],
    artifactType: "global",
    desc: "Mientras esté en juego: los ataques directos causan daño doble.",
    effects: [
      { trigger: "artifact", id: "art_global_zona_muerta", desc: "Ataques directos causan daño doble." },
    ],
  },

  // ──────────────────────────────────────────
  // HÍBRIDOS — IDs 97-100
  // ──────────────────────────────────────────

  97: {
    id: 97,
    name: "Tempestad de Ceniza",
    type: "FULGUR",
    atk: 7,
    alsoMatches: ["AURA"],
    flags: ["isElemental"],
    desc: "Monstruo híbrido FULGUR/AURA. Enciende altares de Fuego y Viento. Celestial: +2 ATK a todos tus FULGUR. Umbral: todos los enemigos -1 ATK.",
    effects: [
      { trigger: "celestial", id: "cel_hyb_fulg_aura_atk", desc: "+2 ATK a todos tus FULGUR." },
      { trigger: "umbral", id: "umb_hyb_fulg_aura_reduce", desc: "Todos los enemigos -1 ATK." },
    ],
  },
  98: {
    id: 98,
    name: "Raíz Abisal",
    type: "ABIS",
    atk: 6,
    alsoMatches: ["FOSO"],
    flags: ["isElemental"],
    desc: "Monstruo híbrido ABIS/FOSO. Enciende altares de Agua y Tierra. Celestial: roba 1 carta. Umbral: +3 ATK si ambos altares activos.",
    effects: [
      { trigger: "celestial", id: "cel_hyb_abis_foso_draw", desc: "Roba 1 carta." },
      { trigger: "umbral", id: "umb_hyb_abis_foso_atk", desc: "+3 ATK si ambos altares activos." },
    ],
  },
  99: {
    id: 99,
    name: "Sombra Ardiente",
    type: "UMBRAL",
    atk: 5,
    alsoMatches: ["FULGUR"],
    flags: ["isElemental"],
    desc: "Monstruo híbrido UMBRAL/FULGUR. Enciende altares de Sombra y Fuego. Celestial: +2 ATK. Umbral: el rival descarta 1 carta aleatoria.",
    effects: [
      { trigger: "celestial", id: "cel_hyb_umbral_fulg_atk", desc: "+2 ATK." },
      { trigger: "umbral", id: "umb_hyb_umbral_fulg_discard", desc: "El rival descarta 1 carta." },
    ],
  },
  100: {
    id: 100,
    name: "Viento Helado",
    type: "AURA",
    atk: 5,
    alsoMatches: ["ABIS"],
    flags: ["isElemental"],
    desc: "Monstruo híbrido AURA/ABIS. Enciende altares de Viento y Agua. Celestial: roba 1 carta. Umbral: -2 ATK a 1 enemigo.",
    effects: [
      { trigger: "celestial", id: "cel_hyb_aura_abis_draw", desc: "Roba 1 carta." },
      { trigger: "umbral", id: "umb_hyb_aura_abis_reduce", desc: "-2 ATK a 1 enemigo." },
    ],
  },
};

// ============ UTILITY: Look up card by ID ============

export function getCard(id: number): CardData | undefined {
  return CARDS[id];
}

export function getCardByName(name: string): CardData | undefined {
  return Object.values(CARDS).find((c) => c.name === name);
}

// ============ ALL CARDS ARRAY (sorted by ID) ============
export const ALL_CARDS_ARRAY: CardData[] = Object.values(CARDS).sort((a, b) => a.id - b.id);
