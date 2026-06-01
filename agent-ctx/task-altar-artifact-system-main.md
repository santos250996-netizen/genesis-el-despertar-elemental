# Task: Altar Activation System, Artifact Equipment Binding, and UI

## Summary

Implemented the complete altar activation system, artifact equipment binding, and UI updates for the "Génesis: El Despertar Elemental" card game.

## Changes Made

### 1. Engine Updates (`src/engine/core.ts`)

- **`activateAltar(slotId)` method**: New method that:
  - Validates player altar slots (p-altar-luz, p-altar-sombra)
  - Only works during player's turn
  - Checks for activatable altar effects (non-PASIVO categoria)
  - For TURNO: checks altarUsedThisTurn to enforce 1/turn limit
  - Resolves effects: buff_atk, debuff_atk, direct_damage, lp_gain, draw, negate, move, add_shield
  - ACTIVABLE/RESPUESTA: returns card to bottom of deck and clears altar slot
  - TURNO: marks altarUsedThisTurn and keeps card
  - Added `resolveAltarEffect()` private helper

- **Artifact placement in `placeCard()`**: For equipo artifacts, auto-equips to first available player monster (p-mon-1, p-mon-3, p-mon-2). Shows error if no monsters on field.

- **`altarUsedThisTurn` reset**: Added `altarUsedThisTurn: {}` to:
  - `createInitialState()` initialization
  - `endTurn()` state reset
  - Enemy turn completion state reset

- **Equipment destruction**: 
  - In `destroyCard()`: checks if destroyed monster had equipped artifact, returns artifact to deck
  - In `attackAll()`: added equipment destruction checks after player monster destruction in battle

- **Equipment ATK bonus in `computePlayerMonAtk()`**: Checks for equipped artifact and adds its ATK value as bonus

### 2. Type Updates (`src/engine/types.ts`)

- Extended `ArtefactoTipo` to include `"global"` and `"intercepcion"` for legacy compatibility

### 3. Hook Updates (`src/hooks/use-duel-engine.ts`)

- Added `activateAltar` to `UseDuelEngineReturn` interface
- Implemented `activateAltar` callback using `engine.activateAltar()`
- Added `altarUsedThisTurn: {}` to initial state
- Exposed in hook return

### 4. UI Updates (`src/app/page.tsx`)

- **Altar Category Badge**: On altar slots, shows colored dots for each categoria:
  - 🟢 PASIVO (green, no button)
  - 🔵 ACTIVABLE (blue + button)
  - 🟡 TURNO (yellow + button)
  - 🔴 RESPUESTA (red + button, pulses during enemy turn)

- **Altar Activation Button**: "⚡" button on altar cards with activatable effects, calls `onActivateAltar(slotId)`

- **Equipment Display**: ⚔ badge on monster cards that have an equipped artifact

- **Artifact Card Placement**: Updated `getTargetInfo()` to handle `isArtifact` flag and `equipo` type (requires monster on field)

- **CardDetailSheet**: Enhanced with:
  - `isOnAltar`, `canActivateAltar`, `onActivateAltar` props
  - Shows altar categoria label next to "Efecto Altar"
  - "⚡ Activar Efecto" button when altar effect is activatable

- **GameScreen**: Added `onActivateAltar` prop, passes altar categoria/canActivate/onActivate to BoardSlot components

- **Main Home component**: Destructures and passes `activateAltar` from hook

## TypeScript Status

- All compilation errors resolved (0 errors in `src/`)
- Pre-existing ArtefactoTipo type mismatch fixed by extending the type
- Lint shows only warnings (no new errors from our changes)
- Dev server compiles successfully
