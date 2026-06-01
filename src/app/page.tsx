"use client";

import { useRef, useEffect, useState } from "react";
import { useDuelEngine } from "@/hooks/use-duel-engine";
import { CARD_TYPE_INFO, ATRIBUTO_INFO, RAZA_INFO, METODO_INFO, type CardType, type CardData, type SlotId, type GameState, type MetodoInvocacion } from "@/engine/types";
import { ALL_CARDS_ARRAY, CARDS } from "@/data/cards";
import { ART_MAP } from "@/data/art-map";
import { DECKS } from "@/data/decks";
import { Button } from "@/components/ui/button";

// ============ HELPERS ============

function buildDefaultDeck(): CardData[] {
  return DECKS.player.map(id => CARDS[id]).filter(Boolean) as CardData[];
}

/** Resolve art source for a CardData — uses CartaMaestra string ID for ART_MAP lookup */
function getArtSrc(card: CardData): string | null {
  const key = card._cartaMaestra?.id ?? card.id;
  return ART_MAP[key] || null;
}

/** Compute card frame classes based on atributo + metodo_invocacion */
function getCardFrameClasses(card: CardData): {
  border: string;
  gradient: string;
  badge: string;
  extraClass: string;
} {
  const metodo = card.metodo_invocacion;
  const atributoInfo = ATRIBUTO_INFO[card.atributo];
  const metodoInfo = METODO_INFO[metodo];

  switch (metodo) {
    case "NORMAL":
      return {
        border: atributoInfo.border,
        gradient: atributoInfo.gradient,
        badge: `bg-black/50 ${atributoInfo.textColor} border ${atributoInfo.border}`,
        extraClass: "",
      };
    case "ANOMALIA":
      return {
        border: atributoInfo.border,
        gradient: atributoInfo.gradient,
        badge: metodoInfo.badge,
        extraClass: "ring-2 ring-purple-500/50 shadow-[0_0_8px_rgba(168,85,247,0.3)]",
      };
    case "CORRUPCION":
      return {
        border: atributoInfo.border,
        gradient: atributoInfo.gradient,
        badge: metodoInfo.badge,
        extraClass: "ring-2 ring-red-600/40 shadow-[inset_0_0_10px_rgba(220,38,38,0.3),0_0_8px_rgba(220,38,38,0.2)]",
      };
    case "ECLIPSE":
      return {
        border: "border-indigo-400",
        gradient: "from-amber-500 via-indigo-800 to-violet-900",
        badge: metodoInfo.badge,
        extraClass: "shadow-[0_0_10px_rgba(99,102,241,0.3)]",
      };
    case "GENESIS":
      return {
        border: "border-fuchsia-400",
        gradient: "from-fuchsia-800 via-purple-900 to-fuchsia-950",
        badge: metodoInfo.badge,
        extraClass: "animate-[pulseGlow_2s_ease-in-out_infinite_alternate] shadow-[0_0_14px_rgba(217,70,239,0.4)]",
      };
    default:
      return {
        border: "border-zinc-500",
        gradient: "from-zinc-600 to-zinc-800",
        badge: "bg-zinc-700 text-zinc-300",
        extraClass: "",
      };
  }
}

/** Build type line string: "Atributo/Raza/Metodo" e.g. "Umbral/Clasto/Normal" */
function getTypeLine(card: CardData): string {
  const atributoLabel = ATRIBUTO_INFO[card.atributo].label;
  const razaLabel = RAZA_INFO[card.raza_tipo].label;
  const metodoLabel = METODO_INFO[card.metodo_invocacion].label;
  return `${atributoLabel}/${razaLabel}/${metodoLabel}`;
}

// ============ TARGETING ============

type TargetInfo = { valid: boolean; type: "place" | "sacrifice" | "consume" | "artifact" };

function getTargetInfo(slotId: SlotId, card: CardData | null, board: Record<SlotId, CardData | null>, summonedThisTurn: number = 0): TargetInfo {
  if (!card) return { valid: false, type: "place" };
  const isSpecialSummon = card.type === "ECLIPSE" || card.flags.includes("isGenesis");

  // ARTEFACTO — solo va al slot de artefacto
  if (card.type === "ARTEFACTO") {
    if (slotId !== "p-artifact") return { valid: false, type: "artifact" };
    if (board["p-artifact"]) return { valid: false, type: "artifact" };
    return { valid: true, type: "artifact" };
  }

  if (card.type === "ANOMALIA") {
    if (!slotId.startsWith("e-mon-")) return { valid: false, type: "consume" };
    const col = slotId.split("-")[2];
    if (col === "2") return { valid: false, type: "consume" };
    const eAltar: SlotId = col === "1" ? "e-altar-luz" : "e-altar-sombra";
    if (!board[eAltar] || !board[slotId]) return { valid: false, type: "consume" };
    if (board[`p-mon-${col}` as SlotId]) return { valid: false, type: "consume" };
    if (!isSpecialSummon && summonedThisTurn >= 1) return { valid: false, type: "consume" };
    return { valid: true, type: "consume" };
  }
  if (card.type === "CORRUPCION") {
    if (slotId !== "p-mon-3") return { valid: false, type: "sacrifice" };
    if (!board["p-altar-sombra"] || !board["p-mon-3"]) return { valid: false, type: "sacrifice" };
    if (summonedThisTurn >= 1) return { valid: false, type: "sacrifice" };
    return { valid: true, type: "sacrifice" };
  }
  if (card.type === "ECLIPSE") {
    if (slotId !== "p-mon-2") return { valid: false, type: "place" };
    if (!board["p-altar-luz"] || !board["p-altar-sombra"]) return { valid: false, type: "place" };
    return { valid: true, type: "place" };
  }
  if (card.flags.includes("isGenesis")) {
    if (slotId !== "p-mon-2") return { valid: false, type: "place" };
    if (!board["p-altar-luz"] || !board["p-altar-sombra"]) return { valid: false, type: "place" };
    return { valid: true, type: "place" };
  }
  // Column 2: SOLO Eclipse y Genesis — ningún otro tipo puede ir ahí
  if (slotId === "p-mon-2") return { valid: false, type: "place" };
  if (!slotId.startsWith("p-")) return { valid: false, type: "place" };
  // Normal summon limit only for monster zones M1 and M3 (NOT altars)
  if (slotId.startsWith("p-mon-") && !isSpecialSummon && summonedThisTurn >= 1) return { valid: false, type: "place" };
  return { valid: true, type: "place" };
}

// ============ CARD VIEW ============

function CardView({
  card,
  selected = false,
  onClick,
  size = "normal",
  showInfo = false,
  overrideAtk,
  immuneEffectDestroy,
}: {
  card: CardData;
  selected?: boolean;
  onClick?: () => void;
  size?: "small" | "normal" | "tiny";
  showInfo?: boolean;
  overrideAtk?: number;
  immuneEffectDestroy?: boolean;
}) {
  const frame = getCardFrameClasses(card);
  const isGenesis = card.metodo_invocacion === "GENESIS";
  const artSrc = getArtSrc(card);
  const hasEffects = card.efecto_monstruo.length > 0 || card.efecto_altar.length > 0;
  const typeLine = getTypeLine(card);
  const metodoInfo = METODO_INFO[card.metodo_invocacion];

  if (size === "tiny") {
    return (
      <div
        onClick={onClick}
        className={`
          relative rounded overflow-hidden cursor-pointer w-full h-full touch-manipulation
          border ${frame.border} ${frame.extraClass}
          ${selected ? "ring-2 ring-amber-400" : ""}
        `}
      >
        {artSrc ? (
          <img src={artSrc} alt={card.name} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${frame.gradient}`} />
        )}
        <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 right-0 text-[0.35rem] font-bold text-amber-400 bg-black/60 px-0.5 rounded-tl">⚔{card.atk}</div>
        {hasEffects && (
          <div className="absolute bottom-0 left-0 text-[0.35rem] text-amber-300 bg-black/60 px-0.5 rounded-tr">✦</div>
        )}
        {immuneEffectDestroy && (
          <div className="absolute top-0 left-0 text-[0.35rem] bg-emerald-600/90 text-white px-0.5 rounded-br font-bold z-10">🛡</div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-md overflow-hidden cursor-pointer touch-manipulation
        ${size === "small" ? "w-full h-full" : isGenesis ? "w-[68px] sm:w-[78px] aspect-[3/4]" : "w-[68px] sm:w-[78px]"}
        border-2 ${frame.border} ${frame.extraClass}
        shadow-[0_2px_8px_rgba(0,0,0,0.5)]
        transition-all duration-150
        ${onClick ? "hover:scale-105 active:scale-95" : ""}
        ${selected ? "scale-105 ring-2 ring-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]" : ""}
      `}
    >
      {/* Genesis cards: FULL BLEED art covering entire card */}
      {isGenesis ? (
        <div className="relative w-full h-full bg-zinc-900 overflow-hidden">
          {artSrc ? (
            <img src={artSrc} alt={card.name} className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${frame.gradient}`} />
          )}
          {/* Top gradient for name readability */}
          <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/70 to-transparent" />
          {/* Bottom gradient for info readability */}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          {/* Method badge */}
          <div className={`absolute top-0.5 left-0.5 text-[0.35rem] font-bold px-0.5 rounded-sm ${metodoInfo.badge} backdrop-blur-sm`}>
            {metodoInfo.label}
          </div>
          {/* Name overlay */}
          <div className={`absolute inset-x-0 top-0.5 text-center font-bold truncate px-5 ${size === "small" ? "text-[0.35rem]" : "text-[0.45rem]"} text-purple-100 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]`}>
            {card.name}
          </div>
          {/* Effect indicator */}
          {hasEffects && (
            <div className="absolute bottom-1 left-0.5 text-[0.4rem] bg-purple-900/70 text-amber-300 px-0.5 rounded-sm backdrop-blur-sm">
              ✦
            </div>
          )}
          {/* ATK + Effect desc overlaid on art bottom */}
          {size === "normal" && (
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-1 py-0.5">
              <div className="text-[0.28rem] text-purple-200/80 italic truncate flex-1 mr-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                {card.efecto_monstruo[0]?.desc || ""}
              </div>
              <div className="font-bold text-amber-400 shrink-0 text-[0.55rem] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                ⚔ {overrideAtk ?? card.atk}
              </div>
            </div>
          )}
          {/* ATK overlay for board cards (small) */}
          {size === "small" && (
            <div className="absolute bottom-0.5 right-0.5 font-bold text-amber-400 text-[0.5rem] bg-purple-900/70 px-1 rounded-sm backdrop-blur-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              ⚔{overrideAtk ?? card.atk}
            </div>
          )}
          {/* Info button */}
          {showInfo && hasEffects && (
            <div className="absolute top-0.5 right-0.5 text-[0.4rem] bg-purple-900/70 text-purple-200 w-3 h-3 flex items-center justify-center rounded-full backdrop-blur-sm border border-purple-500/30">
              i
            </div>
          )}
        </div>
      ) : (
      <>
      {/* Non-Genesis cards: Art 75% + Footer 25% */}
      <div className={`relative ${size === "small" ? "h-full" : "h-[75%]"} bg-zinc-900 overflow-hidden`}>
        {artSrc ? (
          <img src={artSrc} alt={card.name} className={`w-full h-full object-cover${size === "small" ? " object-top" : ""}`} />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${frame.gradient}`} />
        )}
        {/* Gradient overlays for readability */}
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/60 to-transparent" />
        {size === "small" && <div className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-black/70 to-transparent" />}
        {/* Atributo badge */}
        <div className="absolute top-0.5 left-0.5 text-[0.35rem] font-bold px-0.5 rounded-sm bg-black/50 text-white/80 backdrop-blur-sm">
          {ATRIBUTO_INFO[card.atributo].label}
        </div>
        {/* Name overlay */}
        <div className={`absolute inset-x-0 top-0.5 text-center font-bold truncate px-5 ${size === "small" ? "text-[0.35rem]" : "text-[0.45rem]"} text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]`}>
          {card.name}
        </div>
        {/* Effect indicator */}
        {hasEffects && (
          <div className="absolute bottom-0.5 left-0.5 text-[0.4rem] bg-black/50 text-amber-300 px-0.5 rounded-sm backdrop-blur-sm">
            ✦
          </div>
        )}
        {/* ATK overlay for board cards (small) */}
        {size === "small" && (
          <div className="absolute bottom-0.5 right-0.5 font-bold text-amber-400 text-[0.5rem] bg-black/50 px-1 rounded-sm backdrop-blur-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            ⚔{overrideAtk ?? card.atk}
          </div>
        )}
        {/* Info button */}
        {showInfo && hasEffects && (
          <div className="absolute top-0.5 right-0.5 text-[0.4rem] bg-zinc-800/80 text-zinc-300 w-3 h-3 flex items-center justify-center rounded-full backdrop-blur-sm border border-zinc-600">
            i
          </div>
        )}
      </div>
      {/* Footer — only for hand cards (normal size): type line + ATK + effect */}
      {size === "normal" && (
        <div className="flex flex-col bg-black/70 px-1 py-0.5 h-[25%]">
          <div className="text-[0.28rem] font-bold text-zinc-300 truncate">
            {typeLine}
          </div>
          <div className="font-bold text-amber-400 text-[0.45rem] leading-tight">
            ⚔ {overrideAtk ?? card.atk}
          </div>
          <div className="text-[0.25rem] text-zinc-500 italic truncate flex-1">
            {card.efecto_monstruo[0]?.desc || card.efecto_altar[0]?.desc || ""}
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
}

// ============ CARD DETAIL SHEET ============

function CardDetailSheet({ card, onClose }: { card: CardData; onClose: () => void }) {
  const frame = getCardFrameClasses(card);
  const artSrc = getArtSrc(card);
  const isGenesis = card.metodo_invocacion === "GENESIS";
  const typeLine = getTypeLine(card);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center safe-bottom" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80" />
      <div
        className="relative w-[85vw] max-w-[360px] animate-[slideScale_0.25s_ease-out] cursor-pointer"
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.preventDefault()}
        style={{ aspectRatio: '768/1344', maxHeight: '88vh' }}
      >
        {/* Card art - full card */}
        <div className={`absolute inset-0 rounded-xl overflow-hidden shadow-2xl ring-1 ring-zinc-600/50 border-2 ${frame.border} ${frame.extraClass}`}>
          {artSrc ? (
            <img src={artSrc} alt={card.name} className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${frame.gradient}`} />
          )}
        </div>

        {/* Top overlay - name + type line + ATK */}
        <div className={`absolute inset-x-0 top-0 ${isGenesis ? 'h-24' : 'h-20'} bg-gradient-to-b from-black/85 via-black/50 to-transparent flex flex-col justify-end pb-2 px-4 rounded-t-xl`}>
          <h3 className={`font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] leading-tight ${isGenesis ? 'text-xl text-purple-100' : 'text-lg'}`}>{card.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-zinc-100 font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] bg-black/40 px-1.5 py-0.5 rounded">{typeLine}</span>
            <span className="text-sm font-bold text-amber-400 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] bg-black/40 px-1.5 py-0.5 rounded">⚔ {card.atk}</span>
          </div>
        </div>

        {/* Bottom overlay - effects split into Monstruo / Altar */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent rounded-b-xl">
          <div className="px-4 pb-5 pt-8">
            {/* Efecto Monstruo */}
            {card.efecto_monstruo.length > 0 && (
              <div className="mb-2">
                <div className="text-[0.6rem] font-bold text-amber-400 mb-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  ⚔ Efecto Monstruo
                </div>
                {card.efecto_monstruo.map((eff, i) => (
                  <div key={`m-${i}`} className="text-[0.65rem] text-zinc-200 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {eff.desc}
                  </div>
                ))}
              </div>
            )}
            {/* Efecto Altar */}
            {card.efecto_altar.length > 0 && (
              <div>
                <div className="text-[0.6rem] font-bold text-cyan-400 mb-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  ♨ Efecto Altar
                </div>
                {card.efecto_altar.map((eff, i) => (
                  <div key={`a-${i}`} className="text-[0.65rem] text-zinc-200 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {eff.desc}
                  </div>
                ))}
              </div>
            )}
            {card.efecto_monstruo.length === 0 && card.efecto_altar.length === 0 && (
              <p className="text-[0.7rem] text-zinc-400 italic drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Sin efectos impresos.</p>
            )}
          </div>
        </div>

        {/* Close hint */}
        <div className="absolute top-2 right-3">
          <button onClick={onClose} aria-label="Cerrar" className="w-11 h-11 rounded-full bg-black/60 flex items-center justify-center text-zinc-300 text-sm font-bold active:bg-black/80 transition-colors cursor-pointer">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ BOARD SLOT ============

function BoardSlot({
  card,
  label,
  slotId,
  targetInfo,
  isPlayerSlot,
  hasAltarBonus,
  attackedSlots,
  computedAtk,
  noEffectDestroy,
  onClick,
  onDetail,
  justPlaced,
  artifactActive,
  enemyHighlight,
}: {
  card: CardData | null;
  label: string;
  slotId: SlotId;
  targetInfo: TargetInfo;
  isPlayerSlot: boolean;
  hasAltarBonus: boolean;
  attackedSlots?: string[];
  computedAtk?: number;
  noEffectDestroy?: boolean;
  onClick?: () => void;
  onDetail?: () => void;
  justPlaced?: boolean;
  artifactActive?: boolean;
  enemyHighlight?: "summon" | "attack" | "action" | null;
}) {
  const isSacrifice = targetInfo.type === "sacrifice" && targetInfo.valid;
  const isConsume = targetInfo.type === "consume" && targetInfo.valid;
  const hasAttacked = isPlayerSlot && card && attackedSlots?.includes(slotId);

  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-lg border-2 border-dashed
        flex flex-col items-center justify-center
        overflow-hidden transition-all duration-200 touch-manipulation
        ${card && !isSacrifice && !isConsume ? "border-solid p-0.5" : "border-zinc-600 bg-zinc-800/50 min-h-[3.5rem]"}
        ${isSacrifice ? "border-red-500 bg-red-950/30 shadow-[0_0_12px_rgba(239,68,68,0.3)] cursor-pointer animate-pulse" : ""}
        ${isConsume ? "border-purple-500 bg-purple-950/30 shadow-[0_0_12px_rgba(168,85,247,0.3)] cursor-pointer animate-pulse" : ""}

        ${targetInfo.valid && targetInfo.type === "place" ? "border-amber-500/70 bg-amber-950/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]" : ""}
        ${hasAltarBonus ? "!border-amber-500 !bg-amber-900/20 shadow-[0_0_8px_rgba(245,158,11,0.2)]" : ""}
        ${hasAttacked ? "opacity-60" : ""}
        ${justPlaced ? "animate-place-card" : ""}
        ${artifactActive ? "artifact-active" : ""}
        ${enemyHighlight === "summon" ? "animate-enemy-summon" : ""}
        ${enemyHighlight === "attack" ? "animate-enemy-attack" : ""}
        ${enemyHighlight === "action" ? "animate-enemy-action" : ""}
        ${onClick && !card && targetInfo.type === "place" && targetInfo.valid ? "active:border-amber-400 cursor-pointer" : ""}
      `}
    >
      {isSacrifice && (
        <div className="absolute top-0 right-0 text-[0.35rem] bg-red-600/90 text-white px-0.5 rounded-bl font-bold z-10">☣</div>
      )}
      {isConsume && (
        <div className="absolute top-0 right-0 text-[0.35rem] bg-purple-600/90 text-white px-0.5 rounded-bl font-bold z-10">🌀</div>
      )}
      {hasAttacked && (
        <div className="absolute top-0 left-0 text-[0.35rem] bg-zinc-600/90 text-white px-0.5 rounded-br font-bold z-10">✓</div>
      )}
      {card ? (
        <div
          className="w-full h-full relative"
          onClick={(e) => {
            // Show detail only when no game action is needed on this slot
            if (onDetail && !targetInfo.valid) { e.stopPropagation(); onDetail(); }
          }}
        >
          <CardView card={card} size="small" overrideAtk={computedAtk} immuneEffectDestroy={noEffectDestroy} />
          {/* Tap hint on mobile — always slightly visible on touch */}
          {!targetInfo.valid && (
            <div className="absolute inset-0 rounded-md opacity-[0.04] active:opacity-20 transition-opacity bg-white pointer-events-none" />
          )}
        </div>
      ) : (
        targetInfo.valid && onClick ? (
          <span className="text-amber-400 text-lg font-bold select-none animate-pulse">+</span>
        ) : (
          <span className="text-zinc-500 text-[0.55rem] font-bold text-center px-1 select-none">{label}</span>
        )
      )}
    </div>
  );
}

// ============ DECK SLOT ============

function DeckSlot({ count, isPlayer }: { count: number; isPlayer: boolean }) {
  return (
    <div className={`relative rounded-lg border-2 border-solid flex flex-col items-center justify-center overflow-hidden h-full ${
      isPlayer ? "border-amber-700/60 bg-gradient-to-b from-amber-900/30 to-zinc-900/60" : "border-red-800/50 bg-gradient-to-b from-red-900/20 to-zinc-900/60"
    }`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-[85%] h-[85%] rounded border flex flex-col items-center justify-center ${isPlayer ? "border-amber-700/70 bg-gradient-to-br from-amber-900 to-zinc-800" : "border-red-700/60 bg-gradient-to-br from-red-900 to-zinc-800"}`}>
          <span className={`text-sm ${isPlayer ? "text-amber-400" : "text-red-400"}`}>🂠</span>
          <span className={`text-[0.45rem] font-bold ${isPlayer ? "text-amber-300" : "text-red-300"}`}>{count}</span>
        </div>
      </div>
    </div>
  );
}

// ============ GAME LOG (compact) ============

function GameLog({ log }: { log: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [log]);

  const lastMsg = log[log.length - 1] || "";

  if (!expanded) {
    return (
      <div
        className="w-full cursor-pointer bg-zinc-950/90 border border-zinc-800 rounded px-2 py-1 flex items-center gap-2 safe-bottom"
        onClick={() => setExpanded(true)}
      >
        <span className="text-[0.55rem] text-zinc-500 font-mono shrink-0">📜</span>
        <span className={`text-[0.55rem] font-mono truncate ${
          lastMsg.startsWith("Error:") ? "text-red-400" :
          lastMsg.includes("VICTORIA") ? "text-amber-400 font-bold" :
          lastMsg.includes("DERROTA") ? "text-red-500 font-bold" : "text-emerald-400"
        }`}>
          {lastMsg}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="w-full bg-zinc-950/90 border border-zinc-800 rounded px-2 py-1 h-20 overflow-y-auto text-[0.55rem] font-mono text-emerald-400 cursor-pointer safe-bottom"
      onClick={() => setExpanded(false)}
    >
      {log.slice(-50).map((msg, i) => (
        <div key={i} className={`leading-snug ${
          msg.startsWith("Error:") ? "text-red-400" :
          msg.includes("VICTORIA") ? "text-amber-400 font-bold" :
          msg.includes("DERROTA") ? "text-red-500 font-bold" : ""
        }`}>
          {msg}
        </div>
      ))}
    </div>
  );
}

// ============ DECK EDITOR ============

const DECK_MIN = 16;
const DECK_MAX = 16;
const MAX_COPIES = 2;

function loadDeckFromStorage(): CardData[] {
  if (typeof window === "undefined") return buildDefaultDeck();
  try {
    const saved = localStorage.getItem("genesis-custom-deck");
    if (saved) {
      const names: string[] = JSON.parse(saved);
      const cards = names.map((n) => ALL_CARDS_ARRAY.find((c) => c.name === n)).filter(Boolean) as CardData[];
      if (cards.length >= DECK_MIN) return cards;
    }
  } catch {}
  return buildDefaultDeck();
}

function saveDeckToStorage(deck: CardData[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("genesis-custom-deck", JSON.stringify(deck.map((c) => c.name)));
}

const ALL_TYPE_KEYS: ("ALL" | CardType)[] = ["ALL", "CELESTIAL", "UMBRAL", "FULGUR", "AURA", "ABIS", "FOSO", "ECLIPSE", "CORRUPCION", "ANOMALIA", "GENESIS"];

function DeckEditor({ onDone }: { onDone: (deck: CardData[]) => void }) {
  const [deck, setDeck] = useState<CardData[]>(loadDeckFromStorage);
  const [filter, setFilter] = useState<string>("ALL");
  const [detailCard, setDetailCard] = useState<CardData | null>(null);

  const filtered = filter === "ALL" ? ALL_CARDS_ARRAY : ALL_CARDS_ARRAY.filter((c) => c.type === filter);
  const copyCount = (name: string) => deck.filter((c) => c.name === name).length;
  const canAdd = deck.length < DECK_MAX;
  const canStart = deck.length >= DECK_MIN && deck.length <= DECK_MAX;

  const addCard = (card: CardData) => {
    if (!canAdd || copyCount(card.name) >= MAX_COPIES) return;
    const newDeck = [...deck, card];
    setDeck(newDeck);
    saveDeckToStorage(newDeck);
  };

  const removeCard = (idx: number) => {
    const newDeck = deck.filter((_, i) => i !== idx);
    setDeck(newDeck);
    saveDeckToStorage(newDeck);
  };

  const clearDeck = () => {
    setDeck([]);
    saveDeckToStorage([]);
  };

  // Detail overlay
  if (detailCard) {
    return <CardDetailSheet card={detailCard} onClose={() => setDetailCard(null)} />;
  }

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-md mx-auto bg-zinc-950 overflow-hidden safe-top">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-zinc-800 shrink-0">
        <button onClick={() => onDone(deck)} className="text-zinc-400 text-xs font-semibold active:text-white transition-colors py-2 px-1">
          ← Volver
        </button>
        <div className="text-center">
          <div className="text-sm font-bold text-amber-400">Editor de Deck</div>
          <div className={`text-[0.6rem] font-bold ${canStart ? "text-emerald-400" : "text-red-400"}`}>
            {deck.length}/{DECK_MAX}{deck.length < DECK_MIN ? ` (mín ${DECK_MIN})` : ""}
          </div>
        </div>
        <button
          onClick={() => canStart && onDone(deck)}
          disabled={!canStart}
          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
            canStart ? "bg-amber-600 hover:bg-amber-500 text-white cursor-pointer" : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
          }`}
        >
          Listo
        </button>
      </div>

      {/* ── Type filters ── */}
      <div className="flex flex-wrap gap-1 px-2 py-1.5 shrink-0">
        {ALL_TYPE_KEYS.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-2 py-0.5 rounded-full text-[0.55rem] font-bold border transition-colors cursor-pointer ${
              filter === type
                ? "bg-amber-600/90 border-amber-500 text-white"
                : "bg-zinc-800 border-zinc-700 text-zinc-400 active:border-zinc-500"
            }`}
          >
            {type === "ALL" ? "Todos" : CARD_TYPE_INFO[type as CardType].label}
          </button>
        ))}
      </div>

      {/* ── Card pool grid ── */}
      <div className="flex-1 overflow-y-auto px-2 py-1 min-h-0">
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
          {filtered.map((card, i) => {
            const copies = copyCount(card.name);
            const frame = getCardFrameClasses(card);
            const artSrc = getArtSrc(card);
            const full = copies >= MAX_COPIES;
            const deckFull = !canAdd;
            return (
              <div
                key={`${card.name}-${i}`}
                onClick={() => {
                  if (full || deckFull) { setDetailCard(card); return; }
                  addCard(card);
                }}
                className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${frame.border} ${frame.extraClass} ${
                  copies > 0 ? "ring-1 ring-amber-400/70" : ""
                } ${
                  full && deckFull ? "opacity-40" : full ? "opacity-60" : "hover:scale-[1.06] active:scale-95"
                }`}
              >
                {/* Art */}
                <div className="aspect-[3/4] bg-zinc-900 relative overflow-hidden">
                  {artSrc ? (
                    <img src={artSrc} alt={card.name} className="w-full h-full object-cover object-top" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${frame.gradient}`} />
                  )}
                  {/* Copy count badge */}
                  {copies > 0 && (
                    <div className="absolute top-0.5 right-0.5 bg-amber-500 text-black text-[0.45rem] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow">
                      {copies}
                    </div>
                  )}
                  {/* Maxed overlay */}
                  {full && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="text-[0.5rem] font-bold text-zinc-300">MAX</span>
                    </div>
                  )}
                </div>
                {/* Info footer */}
                <div className="bg-zinc-800/90 px-1 py-0.5">
                  <div className="text-[0.38rem] font-bold text-white truncate leading-tight">{card.name}</div>
                  <div className="text-[0.38rem] font-bold text-amber-400 leading-tight">⚔{card.atk}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Current deck strip ── */}
      <div className="border-t border-zinc-700 bg-zinc-900/80 shrink-0">
        <div className="flex items-center justify-between px-3 pt-1.5 pb-1">
          <span className="text-[0.55rem] text-zinc-400 font-semibold">
            Tu Deck ({deck.length})
          </span>
          <div className="flex gap-2">
            <button onClick={clearDeck} className="text-[0.6rem] text-red-400/70 active:text-red-400 transition-colors cursor-pointer py-1 px-1">
              Limpiar
            </button>
            {deck.length < DECK_MIN && (
              <span className="text-[0.5rem] text-zinc-600">Necesitas {DECK_MIN}</span>
            )}
          </div>
        </div>
        <div className="flex gap-1 px-2 pb-3 overflow-x-auto scrollbar-hide min-h-[72px] safe-bottom">
          {deck.length === 0 ? (
            <span className="text-zinc-600 text-[0.55rem] self-center mx-auto">
              Toca cartas arriba para añadir
            </span>
          ) : (
            deck.map((card, idx) => {
              const frame = getCardFrameClasses(card);
              const artSrc = getArtSrc(card);
              return (
                <div
                  key={`${card.name}-${idx}`}
                  onClick={() => removeCard(idx)}
                  className={`relative w-12 h-[68px] shrink-0 rounded border-2 ${frame.border} overflow-hidden cursor-pointer group transition-all active:border-red-500 active:opacity-80`}
                >
                  {artSrc ? (
                    <img src={artSrc} alt={card.name} className="w-full h-full object-cover object-top" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${frame.gradient}`} />
                  )}
                  {/* Remove indicator — always visible on touch */}
                  <div className="absolute inset-0 bg-red-600/10 group-active:bg-red-600/40 transition-colors flex items-center justify-center">
                    <span className="text-white/30 text-lg font-bold group-active:text-white group-active:opacity-100 transition-opacity">×</span>
                  </div>
                  <div className="absolute bottom-0 right-0 text-[0.35rem] font-bold text-amber-400 bg-black/80 px-0.5">
                    ⚔{card.atk}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ============ SETUP SCREEN ============

function SetupScreen({ onSelect, onEditDeck, onTutorial, deckSize }: { onSelect: (enemy: "Ignis" | "Zephyr" | "Hydra" | "Terran") => void; onEditDeck: () => void; onTutorial: () => void; deckSize: number }) {
  const enemies = [
    { id: "Ignis" as const, name: "Ignis", sub: "Fuego / Fulgur", emoji: "🔥", gradient: "from-red-600 to-orange-700" },
    { id: "Zephyr" as const, name: "Zephyr", sub: "Viento / Aura", emoji: "🌪️", gradient: "from-emerald-600 to-teal-700" },
    { id: "Hydra" as const, name: "Hydra", sub: "Agua / Abis", emoji: "🌊", gradient: "from-blue-600 to-cyan-700" },
    { id: "Terran" as const, name: "Terran", sub: "Tierra / Foso", emoji: "⛰️", gradient: "from-amber-600 to-yellow-700" },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] px-4 safe-top">
      <h1 className="text-3xl sm:text-4xl font-bold text-amber-400 mb-2" style={{ textShadow: "0 2px 8px rgba(245,158,11,0.3)" }}>
        Génesis: El Despertar
      </h1>
      <p className="text-zinc-400 mb-1 text-sm text-center">Elige tu adversario Elemental</p>
      <div className="flex gap-4 mb-6">
        <button onClick={onEditDeck} className="text-amber-500/70 hover:text-amber-400 text-xs font-semibold transition-colors cursor-pointer">
          ✎ Editar Deck ({deckSize} cartas)
        </button>
        <button onClick={onTutorial} className="text-zinc-500 hover:text-zinc-300 text-xs font-semibold transition-colors cursor-pointer">
          ? Reglas
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md w-full">
        {enemies.map((e) => (
          <button key={e.id} onClick={() => onSelect(e.id)} className={`bg-gradient-to-br ${e.gradient} rounded-xl p-4 sm:p-6 text-left border border-white/10 shadow-lg hover:scale-105 hover:shadow-xl active:scale-95 transition-all cursor-pointer`}>
            <div className="text-2xl mb-2">{e.emoji}</div>
            <div className="font-bold text-white text-lg">{e.name}</div>
            <div className="text-white/70 text-xs">{e.sub}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ GAME SCREEN ============

function GameScreen({ state, onSelectCard, onPlaceCard, onAttackAll, onEndTurn, onSurrender, onReset, computePlayerMonAtk, computeEnemyMonAtk, onTagTeam, onChainSummon, onLaneChange, onPlaceArtifact }: {
  state: GameState;
  onSelectCard: (idx: number) => void;
  onPlaceCard: (slotId: SlotId) => void;
  onAttackAll: () => void;
  onEndTurn: () => void;
  onSurrender: () => void;
  onReset: () => void;
  computePlayerMonAtk: (slotId: SlotId) => { atk: number; penetrate: boolean; undestroyable: boolean; immuneEffectDestroy: boolean };
  computeEnemyMonAtk: (slotId: SlotId) => number;
  onTagTeam: (slotId: SlotId) => void;
  onChainSummon: (handIndex: number, slotId: SlotId) => void;
  onLaneChange: (fromSlot: SlotId, toSlot: SlotId) => void;
  onPlaceArtifact: (handIndex: number) => void;
}) {
  const [detailCard, setDetailCard] = useState<CardData | null>(null);
  const [playerLpFlash, setPlayerLpFlash] = useState<"damage" | "heal" | null>(null);
  const [enemyLpFlash, setEnemyLpFlash] = useState<"damage" | "heal" | null>(null);
  const [justPlacedSlots, setJustPlacedSlots] = useState<Set<string>>(new Set());
  const prevPlayerLp = useRef(state.playerLP);
  const prevEnemyLp = useRef(state.enemyLP);
  const prevBoard = useRef(state.board);

  // Detect LP changes for flash animations
  useEffect(() => {
    if (state.playerLP < prevPlayerLp.current) {
      setPlayerLpFlash("damage");
      const t = setTimeout(() => setPlayerLpFlash(null), 400);
      prevPlayerLp.current = state.playerLP;
      return () => clearTimeout(t);
    } else if (state.playerLP > prevPlayerLp.current) {
      setPlayerLpFlash("heal");
      const t = setTimeout(() => setPlayerLpFlash(null), 400);
      prevPlayerLp.current = state.playerLP;
      return () => clearTimeout(t);
    }
    prevPlayerLp.current = state.playerLP;
  }, [state.playerLP]);

  useEffect(() => {
    if (state.enemyLP < prevEnemyLp.current) {
      setEnemyLpFlash("damage");
      const t = setTimeout(() => setEnemyLpFlash(null), 400);
      prevEnemyLp.current = state.enemyLP;
      return () => clearTimeout(t);
    } else if (state.enemyLP > prevEnemyLp.current) {
      setEnemyLpFlash("heal");
      const t = setTimeout(() => setEnemyLpFlash(null), 400);
      prevEnemyLp.current = state.enemyLP;
      return () => clearTimeout(t);
    }
    prevEnemyLp.current = state.enemyLP;
  }, [state.enemyLP]);

  // Detect newly placed cards for animation
  useEffect(() => {
    const newSlots = new Set<string>();
    for (const slotId of Object.keys(state.board) as SlotId[]) {
      if (state.board[slotId] && !prevBoard.current[slotId]) {
        newSlots.add(slotId);
      }
    }
    if (newSlots.size > 0) {
      setJustPlacedSlots(prev => new Set([...prev, ...newSlots]));
      const t = setTimeout(() => {
        setJustPlacedSlots(prev => {
          const next = new Set(prev);
          for (const s of newSlots) next.delete(s);
          return next;
        });
      }, 300);
      prevBoard.current = state.board;
      return () => clearTimeout(t);
    }
    prevBoard.current = state.board;
  }, [state.board]);

  const b = state.board;
  const selectedCard = state.selectedCardIndex !== null ? state.playerHand[state.selectedCardIndex] : null;
  const luzActive = !!b["p-altar-luz"];
  const sombraActive = !!b["p-altar-sombra"];

  // Compute real ATK for each board slot
  const pAtk = (slot: SlotId) => b[slot] ? computePlayerMonAtk(slot).atk : undefined;
  const eAtk = (slot: SlotId) => b[slot] ? computeEnemyMonAtk(slot) : undefined;

  const allAttacked = ["p-mon-1", "p-mon-2", "p-mon-3"].every(
    (s) => !state.board[s as SlotId] || state.attackedThisTurn.includes(s)
  );

  const getHint = () => {
    if (state.isEnemyTurn) {
      if (state.enemyTurnPhase === "altar") return "Altar del rival se activa...";
      if (state.enemyTurnPhase === "summon") return "Rival invoca un monstruo...";
      if (state.enemyTurnPhase === "attack") return "Rival ataca...";
      if (state.enemyTurnPhase === "draw") return "Rival roba carta...";
      return "Turno del rival...";
    }
    if (allAttacked && state.attackedThisTurn.length > 0) return "Todos atacaron. Coloca cartas o pasa turno.";
    if (!selectedCard) {
      if (state.turnNumber <= 1) return "Primer turno: no puedes atacar. Coloca cartas.";
      return "Toca una carta de tu mano o pulsa ⚔ para atacar con todos.";
    }
    const c = selectedCard;
    if (c.type === "ANOMALIA") return "🌀 Toca un monstruo enemigo para consumir";
    if (c.type === "CORRUPCION") return !b["p-altar-sombra"] || !b["p-mon-3"] ? "Necesitas Altar Sombra + monstruo en Z3" : "☣ Toca Zona 3 para sacrificar";
    if (c.type === "ECLIPSE") return !b["p-altar-luz"] || !b["p-altar-sombra"] ? "Necesitas ambos Altares" : "Toca la Zona Central";
    if (c.flags.includes("isGenesis")) return !b["p-altar-luz"] || !b["p-altar-sombra"] ? "Necesitas ambos Altares" : "Toca M2 — consume ambos Altares";
    if (c.type === "ARTEFACTO") return "🛡 Toca la ranura de Artefacto";
    return "Toca una zona del tablero";
  };

  const getEnemyHighlight = (slotId: SlotId): "summon" | "attack" | "action" | null => {
    if (!state.isEnemyTurn) return null;
    if (state.enemyTurnPhase === "summon" && state.enemyActionSlot === slotId) return "summon";
    if (state.enemyTurnPhase === "attack" && slotId.startsWith("e-mon-") && b[slotId]) return "attack";
    return null;
  };

  const phaseLabel = state.isEnemyTurn
    ? state.enemyTurnPhase === "altar" ? "Fase de Altar"
      : state.enemyTurnPhase === "summon" ? "Fase de Invocación"
      : state.enemyTurnPhase === "attack" ? "Fase de Batalla"
      : state.enemyTurnPhase === "draw" ? "Fase de Descarte"
      : "Turno Enemigo"
    : null;

  if (state.phase === "won" || state.phase === "lost") {
    return (
      <div className="screen-fade-in">
        <div className="flex flex-col items-center justify-center h-[100dvh] px-4 gap-4">
          <div className={`text-4xl sm:text-5xl font-bold ${state.phase === "won" ? "text-amber-400" : "text-red-500"}`} style={{ textShadow: "0 2px 12px " + (state.phase === "won" ? "rgba(245,158,11,0.4)" : "rgba(239,68,68,0.4)") }}>
            {state.phase === "won" ? "¡VICTORIA!" : "¡DERROTA!"}
          </div>
          <p className="text-zinc-400 text-sm text-center max-w-xs">
            {state.phase === "won" ? "Has purificado el núcleo elemental del adversario." : "Te quedaste sin puntos de vida."}
          </p>
          <Button onClick={onReset} className="mt-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold px-8">
            Jugar de Nuevo
          </Button>
        </div>
      </div>
    );
  }

  const handleSlotClick = (slotId: SlotId) => {
    if (state.isEnemyTurn) return;
    if (selectedCard && onPlaceCard) {
      onPlaceCard(slotId);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-md mx-auto gap-0.5 overflow-hidden bg-zinc-950 safe-top">

      {/* ── Top HUD bar (enemy) ── */}
      <div className={`flex justify-between items-center bg-zinc-800/90 px-2.5 py-1.5 rounded-lg border border-zinc-700 shrink-0 transition-all ${enemyLpFlash === "damage" ? "animate-damage" : enemyLpFlash === "heal" ? "animate-heal" : ""}`}>
        <span className="font-bold text-red-400 text-xs">
          {state.enemyType}: <span className="text-white">{state.enemyLP}</span> LP
          <span className="text-zinc-500 text-[0.6rem] ml-1">({state.enemyDeck.length})</span>
          <span className="text-zinc-500 text-[0.6rem] ml-1">🃏 {state.enemyHand.length}</span>
        </span>
        <span className="text-amber-400 text-[0.6rem] font-semibold">
          {state.isEnemyTurn ? "Turno Enemigo..." : `Turno ${state.turnNumber}`}
        </span>
      </div>

      {/* ── PHASE BANNER (during enemy turn) ── */}
      {state.isEnemyTurn && phaseLabel && (
        <div className="animate-phase-banner bg-red-950/80 border border-red-700/60 rounded-lg px-3 py-1.5 text-center">
          <span className="text-red-300 text-xs font-bold tracking-wide">{phaseLabel}</span>
        </div>
      )}

      {/* ── BOARD ── */}
      <div className="w-full bg-zinc-900/60 px-0.5 py-0.5 rounded-lg border border-zinc-700/50 grid grid-cols-3 grid-rows-[0.6fr_1.6fr_auto_1.6fr_0.6fr] gap-0.5 flex-1 min-h-0">
        {/* Row 1: Enemy Altars + Artifact */}
        <BoardSlot card={b["e-altar-luz"]} slotId="e-altar-luz" label="Altar Celestial" targetInfo={getTargetInfo("e-altar-luz", selectedCard, b, state.summonedThisTurn)} isPlayerSlot={false} hasAltarBonus={false} onDetail={b["e-altar-luz"] ? () => setDetailCard(b["e-altar-luz"]!) : undefined} />
        <BoardSlot card={b["e-artifact"]} slotId="e-artifact" label="🛡" targetInfo={{ valid: false, type: "artifact" }} isPlayerSlot={false} hasAltarBonus={false} artifactActive={!!b["e-artifact"]} onDetail={b["e-artifact"] ? () => setDetailCard(b["e-artifact"]!) : undefined} />
        <BoardSlot card={b["e-altar-sombra"]} slotId="e-altar-sombra" label="Altar Umbral" targetInfo={getTargetInfo("e-altar-sombra", selectedCard, b, state.summonedThisTurn)} isPlayerSlot={false} hasAltarBonus={false} onDetail={b["e-altar-sombra"] ? () => setDetailCard(b["e-altar-sombra"]!) : undefined} />
        {/* Row 2: Enemy Monsters (red tint) */}
        <div className="col-span-3 bg-red-950/10 rounded -mx-0.5 px-0.5">
          <div className="grid grid-cols-3 gap-0.5">
            <BoardSlot card={b["e-mon-1"]} slotId="e-mon-1" label="M1" computedAtk={eAtk("e-mon-1")} targetInfo={getTargetInfo("e-mon-1", selectedCard, b, state.summonedThisTurn)} isPlayerSlot={false} hasAltarBonus={false} onClick={() => handleSlotClick("e-mon-1")} onDetail={b["e-mon-1"] ? () => setDetailCard(b["e-mon-1"]!) : undefined} justPlaced={justPlacedSlots.has("e-mon-1")} enemyHighlight={getEnemyHighlight("e-mon-1")} />
            <BoardSlot card={b["e-mon-2"]} slotId="e-mon-2" label="M2" computedAtk={eAtk("e-mon-2")} targetInfo={getTargetInfo("e-mon-2", selectedCard, b, state.summonedThisTurn)} isPlayerSlot={false} hasAltarBonus={false} onClick={() => handleSlotClick("e-mon-2")} onDetail={b["e-mon-2"] ? () => setDetailCard(b["e-mon-2"]!) : undefined} justPlaced={justPlacedSlots.has("e-mon-2")} enemyHighlight={getEnemyHighlight("e-mon-2")} />
            <BoardSlot card={b["e-mon-3"]} slotId="e-mon-3" label="M3" computedAtk={eAtk("e-mon-3")} targetInfo={getTargetInfo("e-mon-3", selectedCard, b, state.summonedThisTurn)} isPlayerSlot={false} hasAltarBonus={false} onClick={() => handleSlotClick("e-mon-3")} onDetail={b["e-mon-3"] ? () => setDetailCard(b["e-mon-3"]!) : undefined} justPlaced={justPlacedSlots.has("e-mon-3")} enemyHighlight={getEnemyHighlight("e-mon-3")} />
          </div>
        </div>
        {/* Row 3: Divider */}
        <div className="col-span-3 border-t border-zinc-600/40" />
        {/* Row 4: Player Monsters (blue tint) */}
        <div className="col-span-3 bg-blue-950/10 rounded -mx-0.5 px-0.5">
          <div className="grid grid-cols-3 gap-0.5">
            <BoardSlot card={b["p-mon-1"]} slotId="p-mon-1" label="M1" computedAtk={pAtk("p-mon-1")} targetInfo={getTargetInfo("p-mon-1", selectedCard, b, state.summonedThisTurn)} isPlayerSlot hasAltarBonus={luzActive} attackedSlots={state.attackedThisTurn} noEffectDestroy={state.effects.noEffectDestroy} onClick={() => handleSlotClick("p-mon-1")} onDetail={b["p-mon-1"] ? () => setDetailCard(b["p-mon-1"]!) : undefined} justPlaced={justPlacedSlots.has("p-mon-1")} />
            <BoardSlot card={b["p-mon-2"]} slotId="p-mon-2" label="M2" computedAtk={pAtk("p-mon-2")} targetInfo={getTargetInfo("p-mon-2", selectedCard, b, state.summonedThisTurn)} isPlayerSlot hasAltarBonus={false} attackedSlots={state.attackedThisTurn} noEffectDestroy={state.effects.noEffectDestroy} onClick={() => handleSlotClick("p-mon-2")} onDetail={b["p-mon-2"] ? () => setDetailCard(b["p-mon-2"]!) : undefined} justPlaced={justPlacedSlots.has("p-mon-2")} />
            <BoardSlot card={b["p-mon-3"]} slotId="p-mon-3" label="M3" computedAtk={pAtk("p-mon-3")} targetInfo={getTargetInfo("p-mon-3", selectedCard, b, state.summonedThisTurn)} isPlayerSlot hasAltarBonus={sombraActive} attackedSlots={state.attackedThisTurn} noEffectDestroy={state.effects.noEffectDestroy} onClick={() => handleSlotClick("p-mon-3")} onDetail={b["p-mon-3"] ? () => setDetailCard(b["p-mon-3"]!) : undefined} justPlaced={justPlacedSlots.has("p-mon-3")} />
          </div>
        </div>
        {/* Row 5: Player Altars + Artifact */}
        <BoardSlot card={b["p-altar-luz"]} slotId="p-altar-luz" label="Altar Celestial" targetInfo={getTargetInfo("p-altar-luz", selectedCard, b, state.summonedThisTurn)} isPlayerSlot hasAltarBonus={false} onClick={() => handleSlotClick("p-altar-luz")} onDetail={b["p-altar-luz"] ? () => setDetailCard(b["p-altar-luz"]!) : undefined} />
        <BoardSlot card={b["p-artifact"]} slotId="p-artifact" label="🛡" targetInfo={getTargetInfo("p-artifact", selectedCard, b, state.summonedThisTurn)} isPlayerSlot hasAltarBonus={false} artifactActive={!!b["p-artifact"]} onClick={() => handleSlotClick("p-artifact")} onDetail={b["p-artifact"] ? () => setDetailCard(b["p-artifact"]!) : undefined} justPlaced={justPlacedSlots.has("p-artifact")} />
        <BoardSlot card={b["p-altar-sombra"]} slotId="p-altar-sombra" label="Altar Umbral" targetInfo={getTargetInfo("p-altar-sombra", selectedCard, b, state.summonedThisTurn)} isPlayerSlot hasAltarBonus={false} onClick={() => handleSlotClick("p-altar-sombra")} onDetail={b["p-altar-sombra"] ? () => setDetailCard(b["p-altar-sombra"]!) : undefined} />
      </div>

      {/* ── Hint + Actions row ── */}
      <div className="flex items-center gap-1.5 shrink-0 w-full">
        <div className="flex-1 text-center text-[0.6rem] text-zinc-400 italic bg-zinc-800/60 rounded-lg px-2 py-2 truncate">
          {getHint()}
        </div>
        <div className={`shrink-0 px-2 py-1 rounded-lg text-[0.55rem] font-bold ${
          state.summonedThisTurn >= 1
            ? "bg-zinc-700 text-zinc-500"
            : "bg-blue-900/60 text-blue-300 border border-blue-700/40"
        }`}>
          {state.summonedThisTurn >= 1 ? "✕ Inv." : "1 Inv."}
        </div>
        <div className="flex gap-1">
          <Button
            size="sm"
            disabled={state.isEnemyTurn || state.turnNumber <= 1 || allAttacked}
            onClick={onAttackAll}
            className={`h-11 min-w-[44px] px-3 text-xs font-bold rounded-lg disabled:opacity-30 active:scale-95 transition-transform ${
              allAttacked && state.attackedThisTurn.length > 0
                ? "bg-zinc-700"
                : "bg-red-700 hover:bg-red-600 text-white"
            }`}
          >
            ⚔ Atacar
          </Button>
          <Button size="sm" disabled={state.isEnemyTurn} onClick={onEndTurn} className="h-11 min-w-[44px] px-3 bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-bold rounded-lg disabled:opacity-30 active:scale-95 transition-transform">
            ⏭ Fin
          </Button>
          <Button size="sm" disabled={state.isEnemyTurn} onClick={onSurrender} className="h-11 min-w-[44px] px-3 bg-zinc-800 hover:bg-red-900 text-zinc-500 hover:text-red-300 text-xs font-bold rounded-lg disabled:opacity-30 active:scale-95 transition-transform">
            🏳
          </Button>
        </div>
      </div>

      {/* ── Player HUD + Hand row ── */}
      <div className="flex items-stretch gap-1 shrink-0 w-full safe-bottom">
        {/* LP badge */}
        <div className={`flex flex-col items-center justify-center bg-emerald-900/60 border border-emerald-700/50 rounded-lg px-2.5 py-1.5 shrink-0 transition-all ${playerLpFlash === "damage" ? "animate-damage" : playerLpFlash === "heal" ? "animate-heal" : ""}`}>
          <span className="text-[0.5rem] text-emerald-400/70 font-semibold">LP</span>
          <span className="text-sm font-bold text-emerald-400">{state.playerLP}</span>
          <span className="text-[0.45rem] text-zinc-500">{state.playerDeck.length}</span>
        </div>
        {/* Hand */}
        <div className="flex-1 bg-zinc-800/80 rounded-lg border border-zinc-700 overflow-hidden">
          <div className="flex items-center justify-between px-2 pt-1 pb-0.5">
            <span className="text-[0.5rem] text-zinc-500 font-semibold">Tu Mano</span>
            <span className="text-[0.5rem] text-zinc-600">{state.playerHand.length}</span>
          </div>
          <div className="flex gap-1.5 px-1.5 pb-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            {state.playerHand.length === 0 ? (
              <span className="text-zinc-600 text-[0.55rem] self-center mx-auto">Sin cartas</span>
            ) : (
              state.playerHand.map((card, idx) => (
                <div key={`${card.name}-${idx}`} className="w-16 h-24 shrink-0 snap-start">
                  <CardView
                    card={card}
                    selected={state.selectedCardIndex === idx}
                    showInfo
                    onClick={() => {
                      // If already selected, show detail; otherwise select
                      if (state.selectedCardIndex === idx) {
                        setDetailCard(card);
                      } else {
                        onSelectCard(idx);
                      }
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Game Log (compact) ── */}
      <GameLog log={state.log} />

      {/* ── Card Detail Overlay ── */}
      {detailCard && <CardDetailSheet card={detailCard} onClose={() => setDetailCard(null)} />}
    </div>
  );
}

// ============ TUTORIAL SCREEN ============

function TutorialScreen({ onClose }: { onClose: () => void }) {
  const rules = [
    { icon: "🎯", title: "Objetivo", desc: "Reduce los LP del oponente a 0. Ambos empiezan con 100 LP. El primero en llegar a 0 pierde." },
    { icon: "🌀", title: "El Nexo", desc: "Tu mazo tiene 16 cartas — el Nexo, la corriente infinita que recicla almas. Robas 4 al inicio y 1 por turno. Las cartas destruidas regresan al fondo del mazo." },
    { icon: "📐", title: "Las Líneas Ley", desc: "3 columnas de monstruos + Altares laterales + un Sagrario Central para Artefactos. Cada monstruo ataca solo en su columna. Si no hay enemigo, ataca directo." },
    { icon: "⚡", title: "Ataque", desc: "Pulsa el botón ⚔ para que TODOS tus monstruos ataquen a la vez. Cada uno lucha contra el enemigo en su columna o ataca directo si está vacía." },
    { icon: "🏆", title: "Combate Puro", desc: "No existe la defensa — la duda significa la desintegración del alma. Si tu ATK > ATK enemigo: destruyes al enemigo y el exceso es LP perdidos. Si son iguales: ambos se destruyen." },
    { icon: "✨", title: "Altares", desc: "Coloca cartas Celestiales en el Altar de la Luz y Umbral en el Altar de la Sombra. Los monstruos en Columna 1+Luz o Columna 3+Sombra activan efectos especiales." },
    { icon: "🌟", title: "Efecto Celestial", desc: "Los monstruos elementales en Columna 1 con un Altar Celestial activan su efecto Celestial (marca ☀). Potentes habilidades de apoyo y daño." },
    { icon: "🌑", title: "Efecto Umbral", desc: "Los monstruos elementales en Columna 3 con un Altar Umbral activan su efecto Umbral (marca 🌑). Habilidades de control y debilitación." },
    { icon: "🛡", title: "Artefactos", desc: "Se colocan en el Sagrario Central (centro de la fila trasera). Interceptan ataques directos, aceleran la búsqueda de cartas o alteran las reglas del campo." },
    { icon: "🌀", title: "Anomalías", desc: "Parásitos de la existencia. Se materializan consumiendo un monstruo enemigo sintonizado en Columna 1 o 3, copiando su ATK. El rival debe pelear contra su propio reflejo." },
    { icon: "☣", title: "Corrupción", desc: "Se invoca en Columna 3 sacrificando el monstruo actual de esa zona. Requiere Altar Umbral activo. El cuerpo corrupto retorna al Nexo." },
    { icon: "💫", title: "Eclipse", desc: "Cuando ambos altares brillan, la Luz y Sombra se fusionan en M2. El Monstruo Eclipse absorbe a tus aliados laterales. El precio es alto: los flancos quedan vacíos." },
    { icon: "✦", title: "Génesis", desc: "La creación absoluta. Arrasa TODO tu tablero: altares, artefacto, monstruos. Solo queda el Dios Génesis, cara a cara con la divinidad, listo para dictar el fin." },
    { icon: "🔮", title: "Monstruos Híbridos", desc: "Seres con dos elementos en su alma. Su presencia enciende ambos altares simultáneamente. Por ejemplo, un FULGUR/AURA activa altares de Fuego y Viento." },
    { icon: "⚡", title: "Invocación Especial", desc: "Si no tienes monstruos y el rival controla uno, puedes invocar gratis desde la mano en la misma columna. La Cobertura Cruzada invoca desde el mazo cuando un aliado cae." },
  ];

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-md mx-auto bg-zinc-950 overflow-hidden safe-top">
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 shrink-0">
        <button onClick={onClose} className="text-zinc-400 text-xs font-semibold active:text-white transition-colors cursor-pointer py-2 px-1">
          ← Volver
        </button>
        <div className="text-sm font-bold text-amber-400">Reglas del Juego</div>
        <div className="w-12" />
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {rules.map((r, i) => (
          <div key={i} className="bg-zinc-900/80 rounded-lg border border-zinc-800 p-2.5">
            <div className="flex items-start gap-2">
              <span className="text-lg shrink-0 mt-0.5">{r.icon}</span>
              <div className="min-w-0">
                <div className="text-xs font-bold text-amber-300 mb-0.5">{r.title}</div>
                <div className="text-[0.65rem] text-zinc-300 leading-relaxed">{r.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ MAIN ============

export default function Home() {
  const { state, startGame, selectCard, placeCard, attackAll, endTurn, surrender, resetGame, computePlayerMonAtk, computeEnemyMonAtk, tagTeamSwap, chainSummon, laneChange, specialSummonFromHand, placeArtifact } = useDuelEngine();
  const [editingDeck, setEditingDeck] = useState(false);
  const [customDeck, setCustomDeck] = useState<CardData[] | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isLeavingSetup, setIsLeavingSetup] = useState(false);
  const leaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (leaveTimeout.current) clearTimeout(leaveTimeout.current);
    };
  }, []);

  const handleDeckDone = (deck: CardData[]) => {
    setCustomDeck(deck);
    setEditingDeck(false);
  };

  const handleStartGame = (enemy: "Ignis" | "Zephyr" | "Hydra" | "Terran") => {
    if (leaveTimeout.current) clearTimeout(leaveTimeout.current);
    setIsLeavingSetup(true);
    leaveTimeout.current = setTimeout(() => {
      startGame(enemy, customDeck || undefined);
      setIsLeavingSetup(false);
    }, 300);
  };

  if (editingDeck) return <DeckEditor onDone={handleDeckDone} />;
  if (showTutorial) return <TutorialScreen onClose={() => setShowTutorial(false)} />;
  if (state.phase === "setup" || isLeavingSetup) {
    return (
      <div className={isLeavingSetup ? "screen-fade-out" : "screen-fade-in"}>
        <SetupScreen onSelect={handleStartGame} onEditDeck={() => setEditingDeck(true)} onTutorial={() => setShowTutorial(true)} deckSize={customDeck?.length || buildDefaultDeck().length} />
      </div>
    );
  }
  return (
    <div className="screen-scale-in" key="game-screen">
      <GameScreen
        state={state}
        onSelectCard={selectCard}
        onPlaceCard={placeCard}
        onAttackAll={attackAll}
        onEndTurn={endTurn}
        onSurrender={surrender}
        onReset={resetGame}
        computePlayerMonAtk={computePlayerMonAtk}
        computeEnemyMonAtk={computeEnemyMonAtk}
        onTagTeam={tagTeamSwap}
        onChainSummon={chainSummon}
        onLaneChange={laneChange}
        onPlaceArtifact={placeArtifact}
      />
    </div>
  );
}
