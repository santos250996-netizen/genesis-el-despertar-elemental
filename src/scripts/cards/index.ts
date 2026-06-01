// ============ CARD SCRIPT REGISTRY (EDOPRO-style) ============
// All 88 card scripts indexed by numeric ID

import type { CardScript } from "@/engine/types";

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

export const CARD_SCRIPTS: Record<number, CardScript> = {
  1: s1,
  2: s2,
  3: s3,
  4: s4,
  5: s5,
  6: s6,
  7: s7,
  8: s8,
  9: s9,
  10: s10,
  11: s11,
  12: s12,
  13: s13,
  14: s14,
  15: s15,
  16: s16,
  17: s17,
  18: s18,
  19: s19,
  20: s20,
  21: s21,
  22: s22,
  23: s23,
  24: s24,
  25: s25,
  26: s26,
  27: s27,
  28: s28,
  29: s29,
  30: s30,
  31: s31,
  32: s32,
  33: s33,
  34: s34,
  35: s35,
  36: s36,
  37: s37,
  38: s38,
  39: s39,
  40: s40,
  41: s41,
  42: s42,
  43: s43,
  44: s44,
  45: s45,
  46: s46,
  47: s47,
  48: s48,
  49: s49,
  50: s50,
  51: s51,
  52: s52,
  53: s53,
  54: s54,
  55: s55,
  56: s56,
  57: s57,
  58: s58,
  59: s59,
  60: s60,
  61: s61,
  62: s62,
  63: s63,
  64: s64,
  65: s65,
  66: s66,
  67: s67,
  68: s68,
  69: s69,
  70: s70,
  71: s71,
  72: s72,
  73: s73,
  74: s74,
  75: s75,
  76: s76,
  77: s77,
  78: s78,
  79: s79,
  80: s80,
  81: s81,
  82: s82,
  83: s83,
  84: s84,
  85: s85,
  86: s86,
  87: s87,
  88: s88,
  89: s89,
  90: s90,
  91: s91,
  92: s92,
  93: s93,
  94: s94,
  95: s95,
  96: s96,
  97: s97,
  98: s98,
  99: s99,
  100: s100,
};

/**
 * Get a card script by numeric ID. Returns empty object for unknown IDs.
 */
export function getCardScript(id: number): CardScript {
  return CARD_SCRIPTS[id] ?? {};
}
