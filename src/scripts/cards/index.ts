// ============ CARD SCRIPT REGISTRY (EDOPRO-style) ============
// All card scripts indexed by numeric ID and string ID.

import type { CardScript } from "@/engine/types";

// ── Numeric scripts (1–100) — default exports ──
import s1 from "./1";
import s2 from "./2";
import s3 from "./3";
import s4 from "./4";
import s5 from "./5";
import s6 from "./6";
import s7 from "./7";
import s8 from "./8";
import s9 from "./9";
import s10 from "./10";
import s11 from "./11";
import s12 from "./12";
import s13 from "./13";
import s14 from "./14";
import s15 from "./15";
import s16 from "./16";
import s17 from "./17";
import s18 from "./18";
import s19 from "./19";
import s20 from "./20";
import s21 from "./21";
import s22 from "./22";
import s23 from "./23";
import s24 from "./24";
import s25 from "./25";
import s26 from "./26";
import s27 from "./27";
import s28 from "./28";
import s29 from "./29";
import s30 from "./30";
import s31 from "./31";
import s32 from "./32";
import s33 from "./33";
import s34 from "./34";
import s35 from "./35";
import s36 from "./36";
import s37 from "./37";
import s38 from "./38";
import s39 from "./39";
import s40 from "./40";
import s41 from "./41";
import s42 from "./42";
import s43 from "./43";
import s44 from "./44";
import s45 from "./45";
import s46 from "./46";
import s47 from "./47";
import s48 from "./48";
import s49 from "./49";
import s50 from "./50";
import s51 from "./51";
import s52 from "./52";
import s53 from "./53";
import s54 from "./54";
import s55 from "./55";
import s56 from "./56";
import s57 from "./57";
import s58 from "./58";
import s59 from "./59";
import s60 from "./60";
import s61 from "./61";
import s62 from "./62";
import s63 from "./63";
import s64 from "./64";
import s65 from "./65";
import s66 from "./66";
import s67 from "./67";
import s68 from "./68";
import s69 from "./69";
import s70 from "./70";
import s71 from "./71";
import s72 from "./72";
import s73 from "./73";
import s74 from "./74";
import s75 from "./75";
import s76 from "./76";
import s77 from "./77";
import s78 from "./78";
import s79 from "./79";
import s80 from "./80";
import s81 from "./81";
import s82 from "./82";
import s83 from "./83";
import s84 from "./84";
import s85 from "./85";
import s86 from "./86";
import s87 from "./87";
import s88 from "./88";
import s89 from "./89";
import s90 from "./90";
import s91 from "./91";
import s92 from "./92";
import s93 from "./93";
import s94 from "./94";
import s95 from "./95";
import s96 from "./96";
import s97 from "./97";
import s98 from "./98";
import s99 from "./99";
import s100 from "./100";

// ── String-ID scripts — named exports ──
// CEL (Celestial)
import { CEL_001 } from "./cel-001";
import { CEL_002 } from "./cel-002";
import { CEL_003 } from "./cel-003";
import { CEL_004 } from "./cel-004";
import { CEL_005 } from "./cel-005";
import { CEL_006 } from "./cel-006";
import { CEL_007 } from "./cel-007";
import { CEL_008 } from "./cel-008";

// UMB (Umbral)
import { UMB_009 } from "./umb-009";
import { UMB_010 } from "./umb-010";
import { UMB_011 } from "./umb-011";
import { UMB_012 } from "./umb-012";
import { UMB_013 } from "./umb-013";
import { UMB_014 } from "./umb-014";
import { UMB_015 } from "./umb-015";
import { UMB_016 } from "./umb-016";

// FUL (Fulgur)
import { FUL_021 } from "./ful-021";

// FOS (Foso)
import { FOS_022 } from "./fos-022";

// ABI (Abis)
import { ABI_023 } from "./abi-023";

// ART (Artefactos)
import { ART_017 } from "./art-017";
import { ART_018 } from "./art-018";
import { ART_019 } from "./art-019";
import { ART_020 } from "./art-020";
import { ART_040 } from "./art-040";
import { ART_041 } from "./art-041";
import { ART_056 } from "./art-056";
import { ART_057 } from "./art-057";

// TEN (Tenotch)
import { TEN_026 } from "./ten-026";
import { TEN_027 } from "./ten-027";
import { TEN_028 } from "./ten-028";
import { TEN_029 } from "./ten-029";
import { TEN_030 } from "./ten-030";
import { TEN_031 } from "./ten-031";
import { TEN_032 } from "./ten-032";
import { TEN_033 } from "./ten-033";
import { TEN_034 } from "./ten-034";
import { TEN_035 } from "./ten-035";
import { TEN_036 } from "./ten-036";
import { TEN_037 } from "./ten-037";
import { TEN_038 } from "./ten-038";
import { TEN_039 } from "./ten-039";

// NOR (Nórdico)
import { NOR_042 } from "./nor-042";
import { NOR_043 } from "./nor-043";
import { NOR_044 } from "./nor-044";
import { NOR_045 } from "./nor-045";
import { NOR_046 } from "./nor-046";
import { NOR_047 } from "./nor-047";
import { NOR_048 } from "./nor-048";
import { NOR_049 } from "./nor-049";
import { NOR_050 } from "./nor-050";
import { NOR_051 } from "./nor-051";
import { NOR_052 } from "./nor-052";
import { NOR_053 } from "./nor-053";
import { NOR_054 } from "./nor-054";
import { NOR_055 } from "./nor-055";

// ── idToNumber: converts a string card ID to a numeric key ──
function idToNumber(id: string): number {
  const num = parseInt(id, 10);
  return isNaN(num) ? id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) : num;
}

// ── Numeric-keyed registry (all scripts) ──
export const CARD_SCRIPTS: Record<number, CardScript> = {
  // Numeric scripts 1–100
  1: s1, 2: s2, 3: s3, 4: s4, 5: s5,
  6: s6, 7: s7, 8: s8, 9: s9, 10: s10,
  11: s11, 12: s12, 13: s13, 14: s14, 15: s15,
  16: s16, 17: s17, 18: s18, 19: s19, 20: s20,
  21: s21, 22: s22, 23: s23, 24: s24, 25: s25,
  26: s26, 27: s27, 28: s28, 29: s29, 30: s30,
  31: s31, 32: s32, 33: s33, 34: s34, 35: s35,
  36: s36, 37: s37, 38: s38, 39: s39, 40: s40,
  41: s41, 42: s42, 43: s43, 44: s44, 45: s45,
  46: s46, 47: s47, 48: s48, 49: s49, 50: s50,
  51: s51, 52: s52, 53: s53, 54: s54, 55: s55,
  56: s56, 57: s57, 58: s58, 59: s59, 60: s60,
  61: s61, 62: s62, 63: s63, 64: s64, 65: s65,
  66: s66, 67: s67, 68: s68, 69: s69, 70: s70,
  71: s71, 72: s72, 73: s73, 74: s74, 75: s75,
  76: s76, 77: s77, 78: s78, 79: s79, 80: s80,
  81: s81, 82: s82, 83: s83, 84: s84, 85: s85,
  86: s86, 87: s87, 88: s88, 89: s89, 90: s90,
  91: s91, 92: s92, 93: s93, 94: s94, 95: s95,
  96: s96, 97: s97, 98: s98, 99: s99, 100: s100,

  // String-ID scripts mapped via idToNumber
  // CEL-001 through CEL-008
  [idToNumber("CEL-001")]: CEL_001,
  [idToNumber("CEL-002")]: CEL_002,
  [idToNumber("CEL-003")]: CEL_003,
  [idToNumber("CEL-004")]: CEL_004,
  [idToNumber("CEL-005")]: CEL_005,
  [idToNumber("CEL-006")]: CEL_006,
  [idToNumber("CEL-007")]: CEL_007,
  [idToNumber("CEL-008")]: CEL_008,
  // UMB-009 through UMB-016
  [idToNumber("UMB-009")]: UMB_009,
  [idToNumber("UMB-010")]: UMB_010,
  [idToNumber("UMB-011")]: UMB_011,
  [idToNumber("UMB-012")]: UMB_012,
  [idToNumber("UMB-013")]: UMB_013,
  [idToNumber("UMB-014")]: UMB_014,
  [idToNumber("UMB-015")]: UMB_015,
  [idToNumber("UMB-016")]: UMB_016,
  // FUL-021, FOS-022, ABI-023
  [idToNumber("FUL-021")]: FUL_021,
  [idToNumber("FOS-022")]: FOS_022,
  [idToNumber("ABI-023")]: ABI_023,
  // ART-017 through ART-020, ART-040, ART-041, ART-056, ART-057
  [idToNumber("ART-017")]: ART_017,
  [idToNumber("ART-018")]: ART_018,
  [idToNumber("ART-019")]: ART_019,
  [idToNumber("ART-020")]: ART_020,
  [idToNumber("ART-040")]: ART_040,
  [idToNumber("ART-041")]: ART_041,
  [idToNumber("ART-056")]: ART_056,
  [idToNumber("ART-057")]: ART_057,
  // TEN-026 through TEN-039
  [idToNumber("TEN-026")]: TEN_026,
  [idToNumber("TEN-027")]: TEN_027,
  [idToNumber("TEN-028")]: TEN_028,
  [idToNumber("TEN-029")]: TEN_029,
  [idToNumber("TEN-030")]: TEN_030,
  [idToNumber("TEN-031")]: TEN_031,
  [idToNumber("TEN-032")]: TEN_032,
  [idToNumber("TEN-033")]: TEN_033,
  [idToNumber("TEN-034")]: TEN_034,
  [idToNumber("TEN-035")]: TEN_035,
  [idToNumber("TEN-036")]: TEN_036,
  [idToNumber("TEN-037")]: TEN_037,
  [idToNumber("TEN-038")]: TEN_038,
  [idToNumber("TEN-039")]: TEN_039,
  // NOR-042 through NOR-055
  [idToNumber("NOR-042")]: NOR_042,
  [idToNumber("NOR-043")]: NOR_043,
  [idToNumber("NOR-044")]: NOR_044,
  [idToNumber("NOR-045")]: NOR_045,
  [idToNumber("NOR-046")]: NOR_046,
  [idToNumber("NOR-047")]: NOR_047,
  [idToNumber("NOR-048")]: NOR_048,
  [idToNumber("NOR-049")]: NOR_049,
  [idToNumber("NOR-050")]: NOR_050,
  [idToNumber("NOR-051")]: NOR_051,
  [idToNumber("NOR-052")]: NOR_052,
  [idToNumber("NOR-053")]: NOR_053,
  [idToNumber("NOR-054")]: NOR_054,
  [idToNumber("NOR-055")]: NOR_055,
};

// ── String-keyed registry (for direct lookup by string ID) ──
export const CARD_SCRIPTS_BY_STRING_ID: Record<string, CardScript> = {
  // CEL (Celestial)
  "CEL-001": CEL_001,
  "CEL-002": CEL_002,
  "CEL-003": CEL_003,
  "CEL-004": CEL_004,
  "CEL-005": CEL_005,
  "CEL-006": CEL_006,
  "CEL-007": CEL_007,
  "CEL-008": CEL_008,
  // UMB (Umbral)
  "UMB-009": UMB_009,
  "UMB-010": UMB_010,
  "UMB-011": UMB_011,
  "UMB-012": UMB_012,
  "UMB-013": UMB_013,
  "UMB-014": UMB_014,
  "UMB-015": UMB_015,
  "UMB-016": UMB_016,
  // FUL (Fulgur)
  "FUL-021": FUL_021,
  // FOS (Foso)
  "FOS-022": FOS_022,
  // ABI (Abis)
  "ABI-023": ABI_023,
  // ART (Artefactos)
  "ART-017": ART_017,
  "ART-018": ART_018,
  "ART-019": ART_019,
  "ART-020": ART_020,
  "ART-040": ART_040,
  "ART-041": ART_041,
  "ART-056": ART_056,
  "ART-057": ART_057,
  // TEN (Tenotch)
  "TEN-026": TEN_026,
  "TEN-027": TEN_027,
  "TEN-028": TEN_028,
  "TEN-029": TEN_029,
  "TEN-030": TEN_030,
  "TEN-031": TEN_031,
  "TEN-032": TEN_032,
  "TEN-033": TEN_033,
  "TEN-034": TEN_034,
  "TEN-035": TEN_035,
  "TEN-036": TEN_036,
  "TEN-037": TEN_037,
  "TEN-038": TEN_038,
  "TEN-039": TEN_039,
  // NOR (Nórdico)
  "NOR-042": NOR_042,
  "NOR-043": NOR_043,
  "NOR-044": NOR_044,
  "NOR-045": NOR_045,
  "NOR-046": NOR_046,
  "NOR-047": NOR_047,
  "NOR-048": NOR_048,
  "NOR-049": NOR_049,
  "NOR-050": NOR_050,
  "NOR-051": NOR_051,
  "NOR-052": NOR_052,
  "NOR-053": NOR_053,
  "NOR-054": NOR_054,
  "NOR-055": NOR_055,
};
