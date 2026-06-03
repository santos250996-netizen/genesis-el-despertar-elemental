// ============ CARD ART MAPPING ============
// Maps card IDs to their art file paths.
// Los IDs son strings en el nuevo sistema (ej: "CEL-001", "UMB-016").
// 55 cartas totales: 23 base + 14 TENOTCH + 14 NÓRDICO + 4 ARTEFACTOS EXTRA

export const ART_MAP: Record<string, string> = {
  // ─── CELESTIAL ───
  "CEL-001": "/cards/aethel_portador_alba.png",
  "CEL-002": "/cards/lumina_voz_firmamento.png",
  "CEL-003": "/cards/seraphel_centinela_radiante.png",
  "CEL-004": "/cards/eos_eco_alba.png",
  "CEL-005": "/cards/valeria_anima_refugio.png",
  "CEL-006": "/cards/sombra_espejo.png",
  "CEL-007": "/cards/hada_crepusculo.png",
  "CEL-008": "/cards/quimera_luz.png",

  // ─── UMBRAL ───
  "UMB-009": "/cards/malakor_susurro_final.png",
  "UMB-010": "/cards/espectro_abismo.png",
  "UMB-011": "/cards/nigromante_sin_rostro.png",
  "UMB-012": "/cards/kael_fragmentador.png",
  "UMB-013": "/cards/vortice_devorador.png",
  "UMB-014": "/cards/eclipse_permanente.png",
  "UMB-015": "/cards/desierto_viviente.png",
  "UMB-016": "/cards/oblivion_fin_todo.png",

  // ─── ARTEFACTOS BASE ───
  "ART-017": "/cards/cruzada_celestial.png",
  "ART-018": "/cards/tierra_baldia.png",
  "ART-019": "/cards/espada_alba.png",
  "ART-020": "/cards/escudo_umbral.png",

  // ─── NUEVAS MECÁNICAS ───
  "FUL-021": "/cards/acecho_magmatico.png",
  "FOS-022": "/cards/bastion_runico.png",
  "ABI-023": "/cards/hidra_abisal.png",

  // ─── TENOTCH (14 cartas) ───
  "TEN-026": "/cards/huitzilopochtli.png",
  "TEN-027": "/cards/guerrero_aguila.png",
  "TEN-028": "/cards/xiuhcoatll.png",
  "TEN-029": "/cards/tlaloc.png",
  "TEN-030": "/cards/ahuizotl.png",
  "TEN-031": "/cards/chalchiuhtlicue.png",
  "TEN-032": "/cards/cipactli.png",
  "TEN-033": "/cards/coatlicue.png",
  "TEN-034": "/cards/quetzalcoatl.png",
  "TEN-035": "/cards/ehecatl.png",
  "TEN-036": "/cards/tzitzimimeh.png",
  "TEN-037": "/cards/tonatiuh.png",
  "TEN-038": "/cards/centeotl.png",
  "TEN-039": "/cards/mictlantecuhtli.png",

  // ─── NÓRDICO (14 cartas) ───
  "NOR-042": "/cards/thor.png",
  "NOR-043": "/cards/berserker_igneo.png",
  "NOR-044": "/cards/surtr.png",
  "NOR-045": "/cards/jormungandr.png",
  "NOR-046": "/cards/kraken.png",
  "NOR-047": "/cards/aegir.png",
  "NOR-048": "/cards/ymir.png",
  "NOR-049": "/cards/enano_forjador.png",
  "NOR-050": "/cards/odin.png",
  "NOR-051": "/cards/valquiria.png",
  "NOR-052": "/cards/huginn_muninn.png",
  "NOR-053": "/cards/heimdall.png",
  "NOR-054": "/cards/freya.png",
  "NOR-055": "/cards/hel.png",

  // ─── ARTEFACTOS EXTRA ───
  "ART-040": "/cards/templo_mayor.png",
  "ART-041": "/cards/piedra_del_sol.png",
  "ART-056": "/cards/drakkar.png",
  "ART-057": "/cards/mjolnir.png",
};
