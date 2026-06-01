// ============ CARD SCRIPTS REGISTRY ============
// Sistema de scripts por carta — estilo EDOPRO.
// Con el nuevo sistema declarativo, los efectos simples se resuelven
// desde EfectoDescriptor. Los scripts se usan solo para lógica compleja.

import type { CardScript } from "@/engine/types";

/** Registry de scripts: id numérico → CardScript */
export const CARD_SCRIPTS: Record<number, CardScript> = {
  // Los scripts se irán registrando conforme se implementen
  // efectos complejos que no se pueden resolver con EfectoDescriptor solo.
};
