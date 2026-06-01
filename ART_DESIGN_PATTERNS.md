# DESIGN PATTERNS - ARTE DE CARTAS
# Génesis: El Despertar Elemental
# ====================================
# ARCHIVO DE REFERENCIA OBLIGATORIA para cualquier generación de arte.
# LEER ESTE ARCHIVO COMPLETO antes de generar CUALQUIER imagen de carta.
# NO inventar estilos. NO ignorar paletas. SEGUIR las reglas al pie de la letra.

# ============================================================
# 1. ESTILO GLOBAL DE ARTE
# ============================================================
# Tecnica: Acuarela oscura (dark fantasy watercolor)
# Inspiracion: TCG como Magic: The Gathering (estilo artistico, no CGI)
# Textura: Pinceladas de acuarela visibles, lavados de tinta, bordes difuminados
# Iluminacion: Dramatica, alto contraste, fuentes de luz unicas por tipo
# Composicion: Retrato de medio cuerpo o cuerpo completo del personaje/criatura
# Fondo: Atmosferico, NEVER fondo plano, siempre con profundidad
# Texto: NUNCA incluir texto en la imagen. Cero letras, numeros, simbolos, logos, nada.
#          REGLA CRITICA: Agregar SIEMPRE al final del prompt esta linea EXACTA:
#          'ABSOLUTELY NO TEXT NO WRITING NO LETTERS NO NUMBERS NO CHARACTERS NO SYMBOLS NO LOGOS NO CHINESE NO JAPANESE NO KOREAN NO ENGLISH NO SPANISH NO INSCRIPTIONS NO RUNES NO HIEROGLYPHS NO MARKS OF ANY KIND IN ANY LANGUAGE OR ALPHABET OR WRITING SYSTEM THE IMAGE MUST CONTAIN ZERO TEXTUAL CONTENT WHATSOEVER'
# Bordes: FULL ART - NUNCA bordes blancos, marcos, margenes ni rectangulos.
#          La imagen debe ser edge-to-edge, completamente llena de arte.
#          La imagen ocupa el 100% del lienzo sin recortes ni fondos vacios.
# Idioma prompts: SIEMPRE en ingles para el generador (mejor calidad)
# Formato salida: PNG, 768x1344 (portrait 3:4 ratio)

# ============================================================
# 2. PALETA DE COLORES POR TIPO
# ============================================================
# Cada tipo tiene colores oficiales que DEFINEN su identidad visual.
# La paleta del arte DEBE coincidir con los bordes y gradientes de la UI.

# CELESTIAL (Luz / Altares de Luz)
#   Colores UI: slate-200 to slate-400, border slate-300
#   Paleta Arte: Blancos, dorados, amarillos suaves, plata, luz celestial
#   Iluminacion: Superior, halo dorado, brillo etereo
#   Atmosfera: Pura, divina, luminosa, nubes blancas, rayos de luz

# UMBRAL (Sombra / Altares de Sombra)
#   Colores UI: indigo-800 to indigo-950, border indigo-600
#   Paleta Arte: Azules muy oscuros, indigo profundo, violeta oscuro, negro
#   Iluminacion: Nula o apenas resplandor violeta tenue
#   Atmosfera: Oscura, mistica, sombras profundas, niebla negra/violeta

# FULGUR (Fuego / Elemental)
#   Colores UI: red-700 to red-900, border red-500
#   Paleta Arte: Rojos intensos, naranjas, amarillos fuego, cenizas negras
#   Iluminacion: Propia del fuego/lava, emanaciones rojas
#   Atmosfera: Volcanica, ardiente, humo, brasas, llamas

# AURA (Viento / Elemental)
#   Colores UI: emerald-700 to emerald-900, border emerald-500
#   Paleta Arte: Verdes esmeralda, turquesa, celeste, bruma verde
#   Iluminacion: Difusa, eterea, filtros de luz suave
#   Atmosfera: Aerea, tormentas de viento, nubes, brisa visible

# ABIS (Agua / Elemental)
#   Colores UI: blue-700 to blue-950, border blue-500
#   Paleta Arte: Azules profundos, teal, turquesa oscuro, espuma blanca
#   Iluminacion: Bioluminiscente, desde las profundidades
#   Atmosfera: Oceonica, abismal, corrientes, profundidad marina

# FOSO (Tierra / Elemental)
#   Colores UI: amber-700 to amber-950, border amber-500
#   Paleta Arte: Marrones, ocre, verde musgo, piedra, cristales
#   Iluminacion: Terrenal, filtrada por rocas, moteada
#   Atmosfera: Subterranea, cavernas, cristalina, telurica

# ECLIPSE (Columna 2 / Fusion Luz+Sombra)
#   Colores UI: fuchsia-700 to fuchsia-950, border fuchsia-400
#   Paleta Arte: Rosa fucsia, magenta, violeta, contrastes luz/sombra
#   Iluminacion: Dual, mitad iluminada mitad en sombra
#   Atmosfera: Mistica, equilibrio, crepusculo, fusion

# CORRUPCION (Columna 3 / Sacrificio)
#   Colores UI: green-700 to green-950, border green-400
#   Paleta Arte: Verdes enfermizos, putrefaccion, negros, limo
#   Iluminacion: Tenue, verdosa, fetida, bioluminiscente toxica
#   Atmosfera: Repugnante, parasitaria, en descomposicion

# ANOMALIA (Consumir monstruos)
#   Colores UI: zinc-500 to zinc-900, border zinc-400
#   Paleta Arte: Grises, plata, distorsion, fracturas, geometria imposible
#   Iluminacion: Anomala, iridiscente, parpadeante
#   Atmosfera: Abstracta, alienigena, glitch, realidad rota

# GENESIS (Columna 2 / Definitivas - FULL BLEED)
#   Colores UI: black via purple-800 to black, border purple-400
#   Paleta Arte: Purpura profundo, violeta oscuro, dorado, negro absoluto
#   Iluminacion: Cosmica, divina, resplandor majestuoso
#   Atmosfera: Epica, trascendente, poder absoluto, celestial definitiva
#   RENDERIZADO: FULL BLEED - el arte cubre el 100% de la carta
#   (Ver seccion 6 para detalle de renderizado GENESIS)

# ============================================================
# 3. COMPOSICION POR CATEGORIA DE CARTA
# ============================================================

# --- ENERGIA (CELESTIAL / UMBRAL) ---
# Son altares: representan entidades divinas/demoniacas pasivas
# Composicion: Figura eterea, parcialmente translucida, flotando
# Actitud: Serena, contemplativa, poder latente
# Elementos recurrentes: Halo, alas (rotas/puras), simbolos arcanos
# Ejemplo: "Ethereal angel with broken wings floating in golden light,
#           watercolor texture, soft white and gold palette, divine atmosphere"

# --- ELEMENTALES (FULGUR / AURA / ABIS / FOSO) ---
# Son guerreros/criaturas activas del campo de batalla
# Composicion: Figura dinamica, en pose de combate o desafiante
# Actitud: Agresiva, poderosa, lista para luchar
# Elementos recurrentes: Armas, armaduras, efectos elementales visibles
# Tienen DOBLE aspecto segun si es efecto Celestial o Umbral:
#   - La paleta BASE siempre es del tipo (rojo para Fulgur, etc.)
#   - La composicion puede sugerir dualidad si la carta tiene ambos efectos

# --- ESPECIALES (ECLIPSE / CORRUPCION / ANOMALIA) ---
# ECLIPSE: Guerreros fusionados, equilibrio perfecto, armaduras ornamentales
# CORRUPCION: Monstruos deformes, mutantes, biologicos, asquerosos
# ANOMALIA: Entidades abstractas, geometricas, imposibles, alienigenas

# --- GENESIS ---
# Dioses/titanes definitivos. Lo mas epico posible.
# Composicion: Figura majestuosa, enorme, dominante
# Actitud: Trascendente, omnipotente, aterradora
# Elementos: Efectos cosmicos, galaxias, destruccion/creacion masiva

# ============================================================
# 4. PLANTILLAS DE PROMPT (COPIAR Y RELLENAR)
# ============================================================
# FORMULA BASE (todas las cartas):
# "[Dark fantasy watercolor painting of] {DESCRIPCION DEL SUJETO}.
#  [Pose/action]. {ELEMENTOS VISUALES}.
#  Watercolor texture with rich ink washes, dramatic lighting.
#  {PALETA DE COLORES}. Full bleed edge-to-edge art.
#  ABSOLUTELY NO TEXT NO WRITING NO LETTERS NO NUMBERS NO CHARACTERS NO SYMBOLS NO LOGOS
#  NO CHINESE NO JAPANESE NO KOREAN NO ENGLISH NO SPANISH NO INSCRIPTIONS NO RUNES
#  NO HIEROGLYPHS NO MARKS OF ANY KIND IN ANY LANGUAGE OR ALPHABET OR WRITING SYSTEM
#  THE IMAGE MUST CONTAIN ZERO TEXTUAL CONTENT WHATSOEVER"

# (IMPORTANTE: todas las plantillas llevan "full bleed edge-to-edge art, no borders, no frames, no margins"
#  MAS el bloque anti-texto completo al final del prompt — ver FORMULA BASE arriba)

# --- PLANTILLA: ENERGIA CELESTIAL ---
# (recordar: paleta blanca/dorada/plata, figura eterea flotando, NO es de fuego)
# "Ethereal watercolor painting of {NOMBRE}, {DESCRIPCION}.
#  {SUJETO} floating serenely in golden divine light, {POSE}.
#  Soft white and gold palette with silver accents, angelic atmosphere,
#  watercolor texture with delicate ink washes, halo of light.
#  {ELEMENTOS ESPECIFICOS}. Full bleed edge-to-edge art.
#  ABSOLUTELY NO TEXT NO WRITING NO LETTERS NO NUMBERS NO CHARACTERS NO SYMBOLS NO LOGOS
#  NO CHINESE NO JAPANESE NO KOREAN NO ENGLISH NO SPANISH NO INSCRIPTIONS NO RUNES
#  NO HIEROGLYPHS NO MARKS OF ANY KIND IN ANY LANGUAGE OR ALPHABET OR WRITING SYSTEM
#  THE IMAGE MUST CONTAIN ZERO TEXTUAL CONTENT WHATSOEVER"

# --- PLANTILLA: ENERGIA UMBRAL ---
# (recordar: paleta indigo/violeta oscuro/negro, figura espectral en sombras)
# "Dark watercolor painting of {NOMBRE}, {DESCRIPCION}.
#  {SUJETO} emerging from deep indigo shadows, {POSE}.
#  Deep indigo and violet-black palette with faint purple glow,
#  watercolor texture with dark ink washes, misty dark atmosphere.
#  {ELEMENTOS ESPECIFICOS}. Full bleed edge-to-edge art.
#  ABSOLUTELY NO TEXT NO WRITING NO LETTERS NO NUMBERS NO CHARACTERS NO SYMBOLS NO LOGOS
#  NO CHINESE NO JAPANESE NO KOREAN NO ENGLISH NO SPANISH NO INSCRIPTIONS NO RUNES
#  NO HIEROGLYPHS NO MARKS OF ANY KIND IN ANY LANGUAGE OR ALPHABET OR WRITING SYSTEM
#  THE IMAGE MUST CONTAIN ZERO TEXTUAL CONTENT WHATSOEVER"

# --- PLANTILLA: ELEMENTAL FULGUR ---
# (recordar: paleta rojo/naranja/amarillo fuego/cenizas negras)
# "Dark fantasy watercolor painting of {NOMBRE}, {DESCRIPCION}.
#  {SUJETO} surrounded by roaring flames and embers, {POSE COMBATIVA}.
#  Intense red and orange palette with black ash and glowing embers,
#  watercolor texture with fiery ink washes, volcanic atmosphere.
#  {ELEMENTOS ESPECIFICOS}. Full bleed edge-to-edge art.
#  ABSOLUTELY NO TEXT NO WRITING NO LETTERS NO NUMBERS NO CHARACTERS NO SYMBOLS NO LOGOS
#  NO CHINESE NO JAPANESE NO KOREAN NO ENGLISH NO SPANISH NO INSCRIPTIONS NO RUNES
#  NO HIEROGLYPHS NO MARKS OF ANY KIND IN ANY LANGUAGE OR ALPHABET OR WRITING SYSTEM
#  THE IMAGE MUST CONTAIN ZERO TEXTUAL CONTENT WHATSOEVER"

# --- PLANTILLA: ELEMENTAL AURA ---
# (recordar: paleta verde esmeralda/turquesa/celeste/bruma verde)
# "Dark fantasy watercolor painting of {NOMBRE}, {DESCRIPCION}.
#  {SUJETO} wielding wind currents and emerald storms, {POSE}.
#  Emerald green and teal palette with silver wind streaks,
#  watercolor texture with flowing ink washes, aerial stormy atmosphere.
#  {ELEMENTOS ESPECIFICOS}. Full bleed edge-to-edge art.
#  ABSOLUTELY NO TEXT NO WRITING NO LETTERS NO NUMBERS NO CHARACTERS NO SYMBOLS NO LOGOS
#  NO CHINESE NO JAPANESE NO KOREAN NO ENGLISH NO SPANISH NO INSCRIPTIONS NO RUNES
#  NO HIEROGLYPHS NO MARKS OF ANY KIND IN ANY LANGUAGE OR ALPHABET OR WRITING SYSTEM
#  THE IMAGE MUST CONTAIN ZERO TEXTUAL CONTENT WHATSOEVER"

# --- PLANTILLA: ELEMENTAL ABIS ---
# (recordar: paleta azul profundo/teal/turquesa oscuro/espuma blanca)
# "Dark fantasy watercolor painting of {NOMBRE}, {DESCRIPCION}.
#  {SUJETO} rising from deep ocean depths, {POSE}.
#  Deep blue and teal palette with bioluminescent highlights,
#  watercolor texture with deep ink washes, abyssal ocean atmosphere.
#  {ELEMENTOS ESPECIFICOS}. Full bleed edge-to-edge art.
#  ABSOLUTELY NO TEXT NO WRITING NO LETTERS NO NUMBERS NO CHARACTERS NO SYMBOLS NO LOGOS
#  NO CHINESE NO JAPANESE NO KOREAN NO ENGLISH NO SPANISH NO INSCRIPTIONS NO RUNES
#  NO HIEROGLYPHS NO MARKS OF ANY KIND IN ANY LANGUAGE OR ALPHABET OR WRITING SYSTEM
#  THE IMAGE MUST CONTAIN ZERO TEXTUAL CONTENT WHATSOEVER"

# --- PLANTILLA: ELEMENTAL FOSO ---
# (recordar: paleta marron/ocre/verde musgo/piedra/cristales)
# "Dark fantasy watercolor painting of {NOMBRE}, {DESCRIPCION}.
#  {SUJETO} emerging from ancient stone and crystal caverns, {POSE}.
#  Amber brown and mossy green palette with crystal sparkles,
#  watercolor texture with earthy ink washes, subterranean cavern atmosphere.
#  {ELEMENTOS ESPECIFICOS}. Full bleed edge-to-edge art.
#  ABSOLUTELY NO TEXT NO WRITING NO LETTERS NO NUMBERS NO CHARACTERS NO SYMBOLS NO LOGOS
#  NO CHINESE NO JAPANESE NO KOREAN NO ENGLISH NO SPANISH NO INSCRIPTIONS NO RUNES
#  NO HIEROGLYPHS NO MARKS OF ANY KIND IN ANY LANGUAGE OR ALPHABET OR WRITING SYSTEM
#  THE IMAGE MUST CONTAIN ZERO TEXTUAL CONTENT WHATSOEVER"

# --- PLANTILLA: ECLIPSE ---
# (recordar: paleta fucsia/magenta/violeta, dualidad luz/sombra)
# "Dark fantasy watercolor painting of {NOMBRE}, {DESCRIPCION}.
#  {SUJETO} armored warrior radiating fuchsia twilight energy, {POSE}.
#  Fuchsia and magenta palette with half light half shadow contrast,
#  watercolor texture with dramatic ink washes, twilight duality atmosphere.
#  {ELEMENTOS ESPECIFICOS}. Full bleed edge-to-edge art.
#  ABSOLUTELY NO TEXT NO WRITING NO LETTERS NO NUMBERS NO CHARACTERS NO SYMBOLS NO LOGOS
#  NO CHINESE NO JAPANESE NO KOREAN NO ENGLISH NO SPANISH NO INSCRIPTIONS NO RUNES
#  NO HIEROGLYPHS NO MARKS OF ANY KIND IN ANY LANGUAGE OR ALPHABET OR WRITING SYSTEM
#  THE IMAGE MUST CONTAIN ZERO TEXTUAL CONTENT WHATSOEVER"

# --- PLANTILLA: CORRUPCION ---
# (recordar: paleta verde enfermizo/negro/limo, monstruos deformes)
# "Dark watercolor painting of {NOMBRE}, {DESCRIPCION}.
#  {SUJETO} twisted monstrous creature with rotting flesh, {POSE}.
#  Sickly green and black palette with toxic bioluminescent glow,
#  watercolor texture with repulsive ink washes, parasitic decay atmosphere.
#  {ELEMENTOS ESPECIFICOS}. Full bleed edge-to-edge art.
#  ABSOLUTELY NO TEXT NO WRITING NO LETTERS NO NUMBERS NO CHARACTERS NO SYMBOLS NO LOGOS
#  NO CHINESE NO JAPANESE NO KOREAN NO ENGLISH NO SPANISH NO INSCRIPTIONS NO RUNES
#  NO HIEROGLYPHS NO MARKS OF ANY KIND IN ANY LANGUAGE OR ALPHABET OR WRITING SYSTEM
#  THE IMAGE MUST CONTAIN ZERO TEXTUAL CONTENT WHATSOEVER"

# --- PLANTILLA: ANOMALIA ---
# (recordar: paleta gris/plata, geometria imposible, glitch, realidad rota)
# "Surreal watercolor painting of {NOMBRE}, {DESCRIPCION}.
#  {SUJETO} impossible geometric entity with fractured reality, {POSE}.
#  Silver and grey palette with iridescent glitches and dimensional tears,
#  watercolor texture with distorted ink washes, abstract alien atmosphere.
#  {ELEMENTOS ESPECIFICOS}. Full bleed edge-to-edge art.
#  ABSOLUTELY NO TEXT NO WRITING NO LETTERS NO NUMBERS NO CHARACTERS NO SYMBOLS NO LOGOS
#  NO CHINESE NO JAPANESE NO KOREAN NO ENGLISH NO SPANISH NO INSCRIPTIONS NO RUNES
#  NO HIEROGLYPHS NO MARKS OF ANY KIND IN ANY LANGUAGE OR ALPHABET OR WRITING SYSTEM
#  THE IMAGE MUST CONTAIN ZERO TEXTUAL CONTENT WHATSOEVER"

# --- PLANTILLA: GENESIS ---
# (CRITICO: full bleed edge-to-edge art, paleta purpura/dorado/negro absoluto)
# "Epic dark fantasy watercolor painting of {NOMBRE}, {DESCRIPCION}.
#  {SUJETO} towering cosmic entity radiating absolute power, {POSE}.
#  Deep purple and gold palette with black cosmic void and stellar energy,
#  watercolor texture with majestic ink washes, transcendent epic atmosphere.
#  Full body portrait, vertical composition, dark majestic and terrifying.
#  {ELEMENTOS ESPECIFICOS}. Full bleed edge-to-edge art.
#  ABSOLUTELY NO TEXT NO WRITING NO LETTERS NO NUMBERS NO CHARACTERS NO SYMBOLS NO LOGOS
#  NO CHINESE NO JAPANESE NO KOREAN NO ENGLISH NO SPANISH NO INSCRIPTIONS NO RUNES
#  NO HIEROGLYPHS NO MARKS OF ANY KIND IN ANY LANGUAGE OR ALPHABET OR WRITING SYSTEM
#  THE IMAGE MUST CONTAIN ZERO TEXTUAL CONTENT WHATSOEVER"

# ============================================================
# 5. CONVENCIONES DE NOMBRE DE ARCHIVO
# ============================================================
# Regla: /public/cards/{nombre_en_minusculas_con_guiones_bajos}.png
# Ejemplos:
#   "Serafín del Ala Rota"    -> /cards/serafin.png
#   "Pyros, Coloso de Ceniza" -> /cards/pyros.png
#   "Aethel, el Núcleo..."    -> /cards/aethel_genesis.png
#   "Luz Devoradora"          -> /cards/luz_devoradora.png
#   "Tsunami Aniquilador"     -> /cards/tsunami_aniquilador.png
#   "Guja del Destierro"      -> /cards/guja_destierro.png
#
# Regla: Minusculas, espacios reemplazados por _, tildes REMOVIDAS
# Regla: Si el nombre base esta ocupado, agregar sufijo descriptivo corto
# Regla: Extension SIEMPRE .png
# Regla: Ubicacion SIEMPRE /public/cards/
#
# PASO OBLIGATORIO despues de generar:
# 1. Guardar imagen en /home/z/my-project/public/cards/{nombre}.png
# 2. Agregar entrada en CARD_ART en /home/z/my-project/src/lib/game-types.ts:
#    "Nombre Completo de la Carta": "/cards/nombre_archivo.png",
# 3. Verificar que coincida exactamente con el nombre de la carta en game-types.ts

# ============================================================
# 6. RENDERIZADO EN LA UI (page.tsx - CardView)
# ============================================================
# Dos modos de renderizado:

# MODO NORMAL (todas las cartas excepto GENESIS):
#   Layout: Art ocupa 75% arriba, footer negro ocupa 25% abajo
#   Art: object-cover, en small usa object-top
#   Overlays: gradiente negro arriba (h-8), badge tipo, nombre centrado
#   Footer: efecto texto + ATK en fondo negro/70
#   Imagen recomendada: 768x1344 (se recorta al 75% superior)

# MODO GENESIS (solo tipo GENESIS):
#   Layout: FULL BLEED - arte cubre 100% de la carta
#   Badge tipo: bg-purple-900/70, texto purple-200, border purple-500/30
#   Nombre: texto purple-100 con drop-shadow fuerte
#   Overlay arriba: gradiente h-10 from-black/70
#   Overlay abajo: gradiente h-12 from-black/80 via-black/40
#   ATK: se superpone sobre el arte, bg-purple-900/70
#   Efecto: se superpone sobre el arte en posicion inferior
#   Imagen recomendada: 768x1344 (se usa completa)

# ============================================================
# 7. TAMANO Y FORMATO DE IMAGEN
# ============================================================
# Comando de generacion:
#   z-ai-generate -p "{PROMPT}" -o "./public/cards/{archivo}.png" -s 768x1344
#
# Tamaños disponibles: 1024x1024 | 768x1344 | 864x1152 | 1344x768 | 1152x864 | 1440x720 | 720x1440
# USAR SIEMPRE 768x1344 (portrait 3:4 ratio) - es el formato de carta

# ============================================================
# 8. CHECKLIST OBLIGATORIO antes de generar
# ============================================================
# [ ] Lei ART_DESIGN_PATTERNS.md completo
# [ ] Se el tipo de la carta -> verificar paleta de colores correcta
# [ ] Se la categoria (Energia/Elemental/Especial/Genesis) -> composicion correcta
# [ ] Se construyo el prompt usando la PLANTILLA correspondiente
# [ ] El prompt esta en INGLES
# [ ] El prompt incluye el bloque anti-texto COMPLETO al final (ver FORMULA BASE)
# [ ] El tamano es 768x1344
# [ ] El nombre del archivo sigue la convencion (minusculas, _, sin tildes)
# [ ] Se agrego la entrada en CARD_ART de game-types.ts
# [ ] Para Genesis: se verifico que el arte funciona en full-bleed

# ============================================================
# 9. EJEMPLOS DE PROMPTS YA USADOS (referencia de calidad)
# ============================================================

# FULGUR - Pyros:
# "Dark fantasy watercolor painting of Pyros, a massive volcanic colossus
#  made of cooling lava and obsidian armor. Enormous humanoid figure with
#  rivers of magma flowing through cracks in its stone body, one arm raised
#  holding a blazing greatsword. Intense red and orange palette with black
#  ash clouds and glowing embers, watercolor texture with fiery ink washes,
#  volcanic atmosphere. Full body portrait. No text."

# AURA - Zephyr:
# "Dark fantasy watercolor painting of Zephyr, a fierce storm hawk warrior
#  with emerald feathers and wind-infused armor. Majestic humanoid hawk with
#  emerald green and silver armor crackling with wind energy, wings spread
#  wide summoning a hurricane. Emerald green and teal palette with silver wind
#  streaks, watercolor texture with flowing ink washes. No text."

# GENESIS - Oblivion:
# "Dark fantasy watercolor painting of Oblivion, an impossibly vast cosmic void
#  entity consuming reality itself. A towering humanoid silhouette made of
#  swirling galaxies, nebulas and absolute darkness, with a face that is an
#  endless black hole. Energy tendrils of deep purple, midnight blue and obsidian
#  black spiral outward consuming entire worlds and stars. The background is a
#  cosmic apocalypse - fragments of galaxies being devoured into nothingness.
#  Watercolor texture with rich ink washes, dramatic contrast between the
#  absolute void of the figure and the brilliant dying stars around it.
#  Full body portrait, vertical composition, dark majestic and terrifying.
#  No text."

# ============================================================
# 10. LISTA COMPLETA DE CARTAS Y SUS ARCHIVOS
# ============================================================
# CELESTIAL (5):
#   Serafín del Ala Rota         -> serafin.png
#   Guardián del Alba             -> guardian_alba.png
#   Valeria, Portadora del Amanecer -> valeria.png
#   Destello Primordial           -> destello.png
#   Luz Devoradora                -> luz_devoradora.png
#
# UMBRAL (5):
#   Malakor, Susurro del Abismo  -> malakor.png
#   Vórtice Oscuro               -> vortice.png
#   Kaelen, la Sombra Fugaz      -> kaelen.png
#   Espectro del Vacío           -> espectro.png
#   Umbral del Olvido            -> umbral_olvido.png
#
# FULGUR (6):
#   Pyros, Coloso de Ceniza      -> pyros.png
#   Chispa Errante               -> chispa.png
#   Brasa Eterna                 -> brasa.png
#   Núcleo Volcánico             -> nucleo.png
#   Llamarada Voraz              -> llamarada_voraz.png
#   Ceniza del Vacío             -> ceniza_vacio.png
#
# AURA (6):
#   Zephyr, Halcón de Tormenta   -> zephyr.png
#   Hada del Mistral              -> hada.png
#   Brisa Cortante                -> brisa.png
#   Ciclón Ancestral              -> ciclon.png
#   Tormento Silencioso           -> tormento_silencioso.png
#   Viento del Destierro          -> viento_destierro.png
#
# ABIS (6):
#   Leviatán Menor               -> leviatan.png
#   Gota del Océano               -> gota.png
#   Coral de Espinas              -> coral.png
#   Sirena de las Mareas          -> sirena.png
#   Abismo del Silencio           -> abismo_silencio.png
#   Tsunami Aniquilador          -> tsunami_aniquilador.png
#
# FOSO (6):
#   Guardián de Jade              -> guardian_jade.png
#   Gólem de Obsidiana            -> golem.png
#   Brote Telúrico                -> brote.png
#   Fisura Viviente              -> fisura.png
#   Guja del Destierro           -> guja_destierro.png
#   Fosa Mental                  -> fosa_mental.png
#
# ECLIPSE (4):
#   Aethelgard, el Cruzado       -> aethelgard.png
#   Solsticio de Invierno         -> solsticio.png
#   Marea de Penumbra            -> marea_penumbra.png
#   Estrato de Crepúsculo       -> estrato.png
#
# CORRUPCION (5):
#   Xenomorph, Plaga Viviente    -> xenomorph.png
#   Heraldo de la Podredumbre    -> heraldo.png
#   Parásito de las Profundidades -> parasito.png
#   Abominación de Fango         -> abominacion.png
#   Gusano del Vacío             -> gusano_vacio.png
#
# ANOMALIA (4):
#   Quimera Inestable            -> quimera.png
#   Espejismo del Vacío          -> espejismo.png
#   Singularidad Líquida         -> singularidad.png
#   Paradoja de Cristal          -> paradoja.png
#
# GENESIS (5):
#   Aethel, el Núcleo Primigenio -> aethel_genesis.png
#   Érebo, el Fin de los Tiempos -> erebo.png
#   Poseidón, la Furia Abisal   -> poseidon.png
#   Gaia, el Titán de la Tierra  -> gaia.png
#   Oblivion, el Vacío Definitivo -> oblivion.png
#
# TOTAL: 52 cartas con arte asignado

# ============================================================
# 11. REGLAS ABSOLUTAS (NUNCA VIOLAR)
# ============================================================
# 1. NUNCA incluir texto en la imagen generada — SIEMPRE agregar bloque anti-texto completo al final del prompt
# 2. NUNCA usar estilo CGI, 3D render, o fotorealismo
# 3. NUNCA usar colores que no correspondan al tipo de carta
# 4. NUNCA generar en tamano diferente a 768x1344
# 5. SIEMPRE guardar en /public/cards/
# 6. SIEMPRE registrar en CARD_ART de game-types.ts
# 7. SIEMPRE leer este archivo ANTES de generar
# 8. SIEMPRE usar la plantilla de prompt correspondiente al tipo
# 9. SIEMPRE verificar que el nombre de archivo coincide con la entrada CARD_ART
# 10. NUNCA inventar tipos nuevos sin consultar primero game-types.ts
# 11. NUNCA generar la imagen con bordes blancos, marcos, rectangulos o margenes
# 12. NUNCA dejar espacios vacios - FULL ART, la imagen llena todo el lienzo edge-to-edge
# 13. NUNCA incluir texto, letras, numeros, simbolos ni logos de ningun tipo
# 14. El bloque anti-texto obligatorio al final de TODO prompt es:
#     'ABSOLUTELY NO TEXT NO WRITING NO LETTERS NO NUMBERS NO CHARACTERS NO SYMBOLS NO LOGOS
#      NO CHINESE NO JAPANESE NO KOREAN NO ENGLISH NO SPANISH NO INSCRIPTIONS NO RUNES
#      NO HIEROGLYPHS NO MARKS OF ANY KIND IN ANY LANGUAGE OR ALPHABET OR WRITING SYSTEM
#      THE IMAGE MUST CONTAIN ZERO TEXTUAL CONTENT WHATSOEVER'
#     Este bloque va DESPUES de todo el contenido artistico del prompt, como ultima linea.
#     Nunca omitirlo. Nunca acortarlo. Es obligatorio para TODOS los prompts.
