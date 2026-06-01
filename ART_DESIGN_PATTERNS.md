# ════════════════════════════════════════════════════════════════
# DESIGN PATTERNS - ARTE DE CARTAS v3.0
# GÉNESIS: EL DESPERTAR ELEMENTAL
# ════════════════════════════════════════════════════════════════
# ARCHIVO DE REFERENCIA OBLIGATORIA para cualquier generación de arte.
# LEER ESTE ARCHIVO COMPLETO antes de generar CUALQUIER imagen de carta.
# NO inventar estilos. NO ignorar paletas. SEGUIR las reglas al pie de la letra.
#
# SISTEMA ACTUAL (v3.0):
#   - NO existe la estadística DEF. Combate puramente ofensivo.
#   - TODOS los monstruos son HÍBRIDOS: función combate + función altar.
#   - 11 RAZAS universales definen QUÉ tipo de criatura es.
#   - 6 ATRIBUTOS definen la energía (color del marco).
#   - 5 MÉTODOS DE INVOCACIÓN definen CÓMO entra al campo.
#   - El marco visual = ATRIBUTO (color base) + MÉTODO (modificador).
#   - El diseño de la criatura = RAZA (anatomía) + MÉTODO (alteraciones).

# ════════════════════════════════════════════════════════════════
# 1. GLOSARIO MAESTRO: LAS 11 RAZAS UNIVERSALES
# ════════════════════════════════════════════════════════════════
# La raza define la IDENTIDAD PURA de la criatura: su anatomía,
# su cultura, su aspecto visual base. El atributo solo cambia la
# paleta de color y la energía que emana, pero la criatura en sí
# siempre pertenece a una de estas 11 razas.

# ─── 1. GENS (Los Mortales / Las Civilizaciones) ───
# Concepto: Seres humanos y razas mortales organizadas en sociedades,
# tribus o reinos. Tienen libre albedrío, usan herramientas y dependen
# de su entrenamiento, fe o sabiduría.
# Qué va aquí: Guerreros, caballeros, vikingos, arqueros, berserkers,
# pero también chamanes tribales, sabios, hechiceros, monjes, brujos y
# reyes. Visten armaduras, túnicas de tela o pieles según su rol.
# Dirección de arte: Figuras humanoides con indumentaria cultural clara.
# Anatomía realista, proporciones clásicas. El detalle está en la ropa,
# las armas, los tatuajes o marcas rituales. Son los más "humanos"
# del juego, su poder viene del entrenamiento y la fe, no de la
# naturaleza. Si un GENS es CELESTIAL, irradia luz dorada desde
# sus armas o su halo. Si es UMBRAL, su mirada es vacía y sus
# armas gotean sombra.

# ─── 2. VOLATUS (Los Alados / Dominio Aéreo) ───
# Concepto: Criaturas cuya anatomía está diseñada para el vuelo.
# Su principal fuerte es la movilidad y el dominio de los cielos.
# Qué va aquí: Ángeles, valquirias, gárgolas, grifos, pegasos,
# arpías, aves místicas, dragones con alas y cualquier criatura
# voladora que use el cielo para atacar o defenderse.
# Dirección de arte: Anatomía alada — alas plumosas, membranosas o
# de energía. Cuerpos aerodinámicos, siluetas que sugieren velocidad.
# Las alas son SIEMPRE un elemento visual prominente, nunca
# secundario. Poses en pleno vuelo o aterrizaje. El viento es
# parte de su composición: capas ondeantes, plumas sueltas.

# ─── 3. MARINA (Las Aguas / Fuerzas Náuticas) ───
# Concepto: Seres que habitan las profundidades o que están
# directamente ligados a la navegación y el ecosistema acuático.
# Qué va aquí: Tritones, sirenas, leviatanes, monstruos marinos
# de tentáculos, serpientes de mar, y también embarcaciones
# vivientes o barcos de guerra mecánicos/místicos (como los drakkar).
# Dirección de arte: Piel escamosa, branquias, aletas, tentáculos.
# Superficie siempre húmeda o refractante. Entornos submarinos con
# burbujas, corrientes visibles y bioluminiscencia. Las sirenas
# tienen colas; los tritones llevan tridentes. Los leviatanes son
# masivos y prehistóricos. Los barcos vivientes tienen ojos y
# velas orgánicas.

# ─── 4. FERA (Las Bestias Salvajes) ───
# Concepto: Animales cuadrúpedos y depredadores que actúan por
# puro instinto natural, fuerza bruta, colmillos y garras.
# Qué va aquí: Lobos, osos gigantes, leones prehistóricos,
# panteras, quimeras, sabuesos y monstruos salvajes que atacan
# cuerpo a cuerpo con ferocidad animal.
# Dirección de arte: Anatomía animal hiperrealista. Cuerpos
# musculosos, colmillos prominentes, garras extendidas. Poses
# de acecho, emboscada o rugido. NO son humanoides — andan en
# cuatro patas (o seis, si son quimeras). Sus ojos son
# feroces, su pelaje es salvaje y enmarañado. El entorno es
# selva, pradera nocturna o montaña salvaje.

# ─── 5. NECRO (Los No-Muertos / Reanimados) ───
# Concepto: Cadáveres, osamentas o restos biológicos que han sido
# traídos de vuelta a la vida mediante magia, rituales o maldiciones.
# Tienen cuerpos físicos pero no están vivos.
# Qué va aquí: Esqueletos vivientes, zombis, momias, liches,
# espectros corporales, o armaduras antiguas habitadas por restos
# óseos reanimados.
# Dirección de arte: Cuerpos descarnados, huesos visibles, carne
# putrefacta, vendas de momias, armaduras oxidadas con osamentas
# dentro. Ojos que arden con fuego frío o vacío total. La clave
# visual: TIENEN masa física, se les ve sólidos pero muertos. Los
# liches flotan y emanan energía necrótica. Los esqueletos guerreros
# empuñan armas oxidadas. Las momias gotean resina oscura.

# ─── 6. ÁNIMA (Los Espíritus / Energías Incorpóreas) ───
# Concepto: Manifestaciones que no tienen un cuerpo físico sólido.
# Son almas, entes incorpóreos, apariciones o energía pura
# concentrada que flota y altera el entorno.
# Qué va aquí: Fantasmas, espectros, fuegos fatuos, poltergeist,
# sombras andantes sin masa, y apariciones espirituales que
# atraviesan los ataques físicos.
# Dirección de arte: Siluetas translúcidas, semitransparentes, que
# flotan sin tocar el suelo. Bordes difuminados que se desvanecen
# en la niebla. NO tienen anatomía sólida — se les ve a través.
# Pueden tener formas vagamente humanoides pero siempre etéreas.
# Los fuegos fatuos son orbes de luz flotante. Los fantasmas
# tienen expresiones melancólicas o aterradoras. El entorno
# siempre es brumoso, etéreo, irreal.

# ─── 7. SECAT (El Enjambre / Los Insectos) ───
# Concepto: Artrópodos, insectos gigantes y criaturas segmentadas
# que operan bajo una mente de colmena o como parásitos depredadores.
# Qué va aquí: Escarabajos gigantes (Skarab), avispas, mantis
# religiosas, arañas, escorpiones, larvas y cualquier bicho con
# exoesqueleto y antenas.
# Dirección de arte: Exoesqueletos brillantes, segmentos visibles,
# patas articuladas múltiples, antenas, mandíbulas, aguijones.
# Los escarabajos tienen élitros iridiscentes. Las arañas tejen
# telarañas en el entorno. Los escorpiones elevan su cola. Las
# larvas son húmedas y segmentadas. Pueden aparecer en enjambres
# (múltiples individuos en una sola carta). Los parásitos se
# adhieren a otras criaturas.

# ─── 8. CLASTO (Las Rocas / Los Minerales) ───
# Concepto: Seres macizos hechos de piedra, tierra compacta,
# cristales o minerales. Destacan por su pesadez, dureza y aspecto
# imponente de estatua o montaña.
# Qué va aquí: Golems de roca, gigantes de piedra o montaña,
# monolitos rúnicos vivientes, gárgolas de mármol y criaturas
# hechas de gemas o cristales animados.
# Dirección de arte: Masividad — cuerpos anchos, pesados, con
# textura de piedra tallada o natural. Grietas por las que escapa
# energía luminosa. Cristales incrustados que brillan. Extremidades
# como pilares o columnas. Ojos que son gemas o huecos con luz
# interior. Los golems tienen runas grabadas. Los monolitos son
# humanoides geométricos. Las gárgolas tienen alas pétreas.

# ─── 9. SATIVA (La Botánica / Las Plantas) ───
# Concepto: Vegetación viviente. Flora que ha cobrado consciencia
# y utiliza raíces, esporas, venenos y madera para combatir o
# expandirse.
# Qué va aquí: Ents (árboles caminantes), plantas carnívoras
# gigantes, monstruos de zarzas y espinas, hongos caminantes,
# brotes místicos y raíces inteligentes.
# Dirección de arte: Textura de corteza, hojas, pétalos, esporas.
# Raíces como tentáculos o piernas. Plantas carnívoras con fauces
# abiertas. Hongos con sombreros brillantes y esporas flotantes.
# Zarzas que envuelven como serpientes. Los ents tienen caras en
# el tronco. Las flores emiten polen luminoso. El entorno siempre
# tiene vegetación exuberante o corrupta.

# ─── 10. ARTIFEX (Lo Fabricado / Las Máquinas) ───
# Concepto: Seres inertes que fueron construidos artificialmente
# en laboratorios, talleres o forjas. Funcionan mediante engranajes,
# magia rúnica, vapor o tecnología.
# Qué va aquí: Autómatas, robots rúnicos, goliats de metal,
# engranajes vivientes, ballestas autopropulsadas, trampas
# mecánicas con piernas y muñecos de cuerda animados.
# Dirección de arte: Metal, engranajes, tubos de vapor, runas
# grabadas, junturas articuladas. Los autómatas tienen caras
# sin expresión o máscaras. Los goliats son torres de metal
# andante. Las ballestas autopropulsadas tienen patas mecánicas.
# Siempre se ven las uniones, los remaches, las costuras de
# fabricación. El entorno es talleres, forjas o laboratorios.

# ─── 11. FÁBULA (La Mitología / Los Dioses) ───
# Concepto: Entes divinos, deidades supremas, avatares de la fe
# o criaturas que solo existen en las leyendas y los mitos más
# sagrados del mundo del juego.
# Qué va aquí: Dioses ancestrales, titanes, avatares divinos,
# señores del cosmos, esfinges místicas y representaciones de
# conceptos universales abstractos.
# Dirección de arte: Escala COLOSAL — la criatura se ve enorme,
# los fondos muestran constelaciones, templos desmoronándose o
# el horizonte desde el cielo. Rostros ocultos tras máscaras
# monolíticas, halos flotantes gigantescos, múltiples extremidades
# místicas, ojos que brillan con luz o vacío absoluto. Su diseño
# es imponente, limpio y digno de un fin de partida. Son las
# únicas criaturas que pueden aparecer como GÉNESIS.

# ════════════════════════════════════════════════════════════════
# 2. GUÍA DE DISEÑO VISUAL DE MARCOS POR ATRIBUTO
# ════════════════════════════════════════════════════════════════
# El ATRIBUTO define el COLOR del marco de la carta. Esto le
# indica al jugador qué tipo de energía aportará la criatura
# si se activa como Altar. El marco SIEMPRE corresponde al
# atributo, sin importar la raza ni el método de invocación.

# FULGUR (Fuego):
#   Marco UI: border-red-500, gradient from-red-800 to-orange-900
#   Detalles: Bordes rojos vivos, texturas de lava, chispas
#   Efecto: Llamas sutilmente animadas en los bordes del marco

# ABIS (Agua Profunda):
#   Marco UI: border-blue-500, gradient from-blue-800 to-cyan-950
#   Detalles: Bordes azul profundo, texturas de fluidos, gotas cristalinas
#   Efecto: Refracción de agua en los bordes

# FOSO (Tierra):
#   Marco UI: border-amber-600, gradient from-amber-700 to-yellow-950
#   Detalles: Bordes marrones, ocres, texturas de roca agrietada
#   Efecto: Textura pétrea en el marco

# AURA (Viento):
#   Marco UI: border-emerald-500, gradient from-emerald-800 to-teal-950
#   Detalles: Bordes verdes claros o grisáceos con líneas de flujo de aire
#   Efecto: Líneas de viento en movimiento

# CELESTIAL (Luz):
#   Marco UI: border-amber-400, gradient from-amber-500 via-yellow-600 to-amber-800
#   Detalles: Bordes dorados, destellos blancos, líneas limpias y brillantes
#   Efecto: Brillo solar pulsante, destellos

# UMBRAL (Oscuridad):
#   Marco UI: border-violet-500, gradient from-violet-800 via-indigo-900 to-purple-950
#   Detalles: Bordes morados oscuros, negros, texturas de niebla y vacío
#   Efecto: Niebla umbral que se desplaza, brillo violeta tenue

# ════════════════════════════════════════════════════════════════
# 3. MODIFICADORES DE MARCO POR MÉTODO DE INVOCACIÓN
# ════════════════════════════════════════════════════════════════
# El método de invocación NO cambia el color base del marco (eso
# lo define el atributo), pero AÑADE detalles visuales que le
# indican al jugador de un vistazo CÓMO entra la carta al campo.

# ─── INVOCACIÓN NORMAL ───
# Marco elemental estándar y limpio.
# UI: El marco usa directamente el color del atributo sin modificaciones.
# Arte: La criatura aparece en su estado natural, estable, coherente.
# Sin alteraciones visuales especiales. Es la base del ejército.

# ─── ANOMALÍA (La Regla Rota) ───
# Marco elemental con efecto de "Falla" o Distorsión.
# UI: Líneas dobles o bordes fragmentados sobre el color del atributo.
#      border-purple-500 se superpone al borde del atributo base.
# Arte: La criatura debe verse INESTABLE, FRAGMENTADA o DISTORSIONADA.
#       Partes del cuerpo flotando separadas del torso (estilo modular
#       o piezas suspendidas en el aire). Siluetas dobles, fallas de
#       "glitch" mágico o rúnico alrededor, extremidades que desafían
#       la gravedad. Transmite que la criatura está apareciendo en un
#       lugar donde NO debería estar.

# ─── CORRUPCIÓN (La Llave de la Columna 3) ───
# Marco elemental INFECTADO o ENVUELTO por filamentos oscuros.
# UI: Filamentos oscuros/malditos sobre el color del atributo base.
#      border-red-500 del método se mezcla con el atributo.
# Arte: La criatura de su raza original aparece ALTERADA por una
#       fuerza externa que la consume o potencia. Presencia de venas
#       brillantes, zarcillos oscuros o parásitos adheridos al cuerpo.
#       Ojos inyectados en energía, caparazones agrietados por donde
#       escapa humo o esporas. Aspecto de "huésped infectado". No son
#       feos por ser malos — se nota que están siendo propulsados por
#       la energía corrupta que emana del Altar lateral.

# ─── ECLIPSE (Fusión de dos elementos) ───
# Marco BICOLOR o DIVIDIDO. Fusiona los dos colores de los atributos
# necesarios para su invocación.
# UI: border-indigo-400 con gradient que fusiona dos atributos.
#      Ejemplo: Si requiere Altar de Luz + Altar de Oscuridad, el
#      marco es mitad dorado brillante y mitad morado umbral,
#      chocando en el centro.
# Arte: Diseño que representa la DUALIDAD o MEZCLA de dos fuerzas.
#       Estructuras simétricas perfectas, auras divididas, diseños
#       que mezclan dos naturalezas de forma elegante (escamas que
#       se transforman en plumas, armas dobles). Se ven como los
#       "Campeones o Jefes de Campo" del juego. Armaduras heráldicas
#       ornamentales, imponentes, estilizadas.

# ─── GÉNESIS (El Dios Supremo — Doble Vínculo) ───
# Marco CÓSMICO / PRISMÁTICO. El borde más imponente del juego.
# UI: border-fuchsia-400 con gradient iridiscente. No tiene color
#      elemental fijo; brilla con efecto iridiscente, galáctico o
#      dorado ancestral que resalta sobre cualquier otra carta.
# Arte: Estética COLOSAL, SAGRADA, MÍTICA o CÓSMICA. La carta ya
#       no muestra a un "bicho peleando" — muestra a una ENTIDAD
#       UNIVERSAL. Gigantismo (fondo con constelaciones, templos
#       gigantes, horizonte desde el cielo). Rostros ocultos tras
#       máscaras monolíticas, halos flotantes gigantescos, múltiples
#       extremidades místicas, ojos que brillan con luz o vacío
#       absoluto. Diseño imponente, limpio, digno de fin de partida.
#       RENDERIZADO: FULL BLEED — el arte cubre el 100% de la carta.

# ════════════════════════════════════════════════════════════════
# 4. ESTILO GLOBAL DE ARTE
# ════════════════════════════════════════════════════════════════
# Técnica: Acuarela oscura (dark fantasy watercolor)
# Inspiración: TCG como Magic: The Gathering (estilo artístico, no CGI)
# Textura: Pinceladas de acuarela visibles, lavados de tinta, bordes difuminados
# Iluminación: Dramática, alto contraste, fuentes de luz únicas por tipo
# Composición: Retrato de medio cuerpo o cuerpo completo del personaje/criatura
# Fondo: Atmosférico, NUNCA fondo plano, siempre con profundidad
# Texto: NUNCA incluir texto en la imagen. Cero letras, números, símbolos, logos, nada.
#        REGLA CRÍTICA: Agregar SIEMPRE al final del prompt esta línea EXACTA:
#        'ABSOLUTELY NO TEXT NO WRITING NO LETTERS NO NUMBERS NO CHARACTERS NO SYMBOLS NO LOGOS
#         NO CHINESE NO JAPANESE NO KOREAN NO ENGLISH NO SPANISH NO INSCRIPTIONS NO RUNES
#         NO HIEROGLYPHS NO MARKS OF ANY KIND IN ANY LANGUAGE OR ALPHABET OR WRITING SYSTEM
#         THE IMAGE MUST CONTAIN ZERO TEXTUAL CONTENT WHATSOEVER'
# Bordes: FULL ART — NUNCA bordes blancos, marcos, márgenes ni rectángulos.
#          La imagen debe ser edge-to-edge, completamente llena de arte.
# Idioma prompts: SIEMPRE en inglés para el generador (mejor calidad)
# Formato salida: PNG, 768x1344 (portrait 3:4 ratio)

# ════════════════════════════════════════════════════════════════
# 5. PALETA DE COLORES POR ATRIBUTO
# ════════════════════════════════════════════════════════════════
# Cada atributo tiene colores oficiales que DEFINEN su identidad visual.
# La paleta del arte DEBE coincidir con los bordes y gradientes de la UI.

# FULGUR (Fuego):
#   Colores UI: border-red-500, gradient from-red-800 to-orange-900
#   Paleta Arte: Rojos intensos, naranjas, amarillos fuego, cenizas negras
#   Iluminación: Propia del fuego/lava, emanaciones rojas
#   Atmosfera: Volcánica, ardiente, humo, brasas, llamas

# ABIS (Agua Profunda):
#   Colores UI: border-blue-500, gradient from-blue-800 to-cyan-950
#   Paleta Arte: Azules profundos, teal, turquesa oscuro, espuma blanca
#   Iluminación: Bioluminiscente, desde las profundidades
#   Atmosfera: Oceánica, abismal, corrientes, profundidad marina

# FOSO (Tierra):
#   Colores UI: border-amber-600, gradient from-amber-700 to-yellow-950
#   Paleta Arte: Marrones, ocre, verde musgo, piedra, cristales
#   Iluminación: Terrenal, filtrada por rocas, moteada
#   Atmosfera: Subterránea, cavernas, cristalina, telúrica

# AURA (Viento):
#   Colores UI: border-emerald-500, gradient from-emerald-800 to-teal-950
#   Paleta Arte: Verdes esmeralda, turquesa, celeste, bruma verde
#   Iluminación: Difusa, etérea, filtros de luz suave
#   Atmosfera: Aérea, tormentas de viento, nubes, brisa visible

# CELESTIAL (Luz):
#   Colores UI: border-amber-400, gradient from-amber-500 via-yellow-600 to-amber-800
#   Paleta Arte: Blancos, dorados, amarillos suaves, plata, luz celestial
#   Iluminación: Superior, halo dorado, brillo etéreo
#   Atmosfera: Pura, divina, luminosa, nubes blancas, rayos de luz

# UMBRAL (Oscuridad):
#   Colores UI: border-violet-500, gradient from-violet-800 via-indigo-900 to-purple-950
#   Paleta Arte: Azules muy oscuros, indigo profundo, violeta oscuro, negro
#   Iluminación: Nula o apenas resplandor violeta tenue
#   Atmosfera: Oscura, mística, sombras profundas, niebla negra/violeta

# ════════════════════════════════════════════════════════════════
# 6. COMPOSICIÓN POR MÉTODO DE INVOCACIÓN
# ════════════════════════════════════════════════════════════════

# ─── NORMAL (La Base del Ejército) ───
# Son las criaturas en su estado natural, representativas de sus
# reinos y razas. Tienen un diseño lógico, anatómico y terrenal.
# Dirección de Arte: Ilustraciones claras, enfocadas en la acción
# o en la guardia. Un GENS se ve como un guerrero o chamán con su
# indumentaria típica, un SECAT es un escarabajo gigante en su
# hábitat. Su arte transmite estabilidad y coherencia con su raza pura.
# Composición: Figura dinámica, en pose de combate o desafiante.
# Actitud: Agresiva o de guardia, lista para luchar.
# Elementos: Armas, armaduras, efectos elementales visibles.

# ─── ANOMALÍA (La Regla Rota) ───
# Las Anomalías son FALLAS EN LA REALIDAD del juego. Como entran
# rompiendo las reglas de posición en el tablero 3x3, su aspecto
# físico debe reflejar que algo está MAL con su existencia.
# Dirección de Arte: El diseño de la criatura debe verse INESTABLE,
# FRAGMENTADO o DISTORSIONADO.
# Detalles visuales: Partes del cuerpo flotando separadas del torso
# (estilo modular o piezas suspendidas en el aire), siluetas dobles,
# fallas de "glitch" mágico o rúnico alrededor del bicho, o
# extremidades que desafían la gravedad. El arte debe transmitir que
# la criatura está apareciendo en un lugar donde NO debería estar.
# Composición: Fragmentada, con elementos separados del cuerpo
# principal flotando en el aire. Bordes dobles o desplazados.

# ─── CORRUPCIÓN (La Llave de la Columna 3) ───
# Como estas cartas exigen obligatoriamente que la Columna 3 esté
# afectada por un Altar para poder manifestarse, su diseño está
# ligado al parásito, la simbiosis, el desgaste y la energía invasiva.
# Dirección de Arte: La criatura original de su raza debe verse
# ALTERADA por una fuerza externa que la consume o la potencia.
# Detalles visuales: Presencia de venas brillantes, zarcillos oscuros
# o parásitos adheridos a su cuerpo. Ojos inyectados en energía,
# caparazones agrietados por donde escapa humo o esporas, y un
# aspecto de "huésped infectado". No es que sean feos por ser malos,
# es que se nota que están siendo propulsados por la energía corrupta
# que emana del Altar lateral.
# Composición: La criatura se ve infectada/mejorada. Hay siempre un
# elemento parasitario visible (zarcillos, venas, esporas).

# ─── ECLIPSE (La Fusión del Horizonte) ───
# Al ser monstruos intermedios de gran poder que nacen de la
# combinación de los atributos de la Columna 1 y la Columna 3, su
# diseño debe ser una FUSIÓN PERFECTA, ARMÓNICA y ESTILIZADA.
# Dirección de Arte: El arte debe representar la DUALIDAD o la
# MEZCLA de dos fuerzas. Su diseño es imponente, heráldico y
# estilizado (como las quimeras o criaturas heráldicas).
# Detalles visuales: Estructuras simétricas perfectas, auras divididas
# y diseños que mezclan dos naturalezas de forma elegante (ej: si
# fusiona dos conceptos raciales u orgánicos, se ven transiciones
# limpias como escamas que se transforman en plumas, o armas dobles).
# Visualmente se deben notar como los "Campeones o Jefes de Campo"
# del juego.
# Composición: Bipartita o dual. Mitad y mitad con transición
# elegante. Armadura ornamentada y simétrica.

# ─── GÉNESIS (Las Deidades Supremas) ───
# Los Génesis son los Dioses Absolutos. Han consumido el Doble
# Vínculo de los dos Altares para descender al centro del tablero.
# Su diseño debe inspirar RESPETO, DIVINIDAD y un poder que SUPERLA
# ESCALA del juego.
# Dirección de Arte: Estética COLOSAL, SAGRADA, MÍTICA o CÓSMICA.
# La carta ya no muestra a un "bicho peleando" — muestra a una
# ENTIDAD UNIVERSAL.
# Detalles visuales: Gigantismo (la criatura se ve enorme, los fondos
# muestran constelaciones, templos gigantes desmoronándose o el
# horizonte desde el cielo). Rostros ocultos tras máscaras
# monolíticas, halos flotantes gigantescos alrededor de su cabeza o
# cuerpo, múltiples extremidades místicas, y ojos que brillan con luz
# o vacío absoluto. Su diseño debe ser imponente, limpio y digno de
# un fin de partida.
# Composición: Figura majestuosa, ENORME, dominante.
# Actitud: Trascendente, omnipotente, aterradora.
# Elementos: Efectos cósmicos, galaxias, destrucción/creación masiva.
# RENDERIZADO: FULL BLEED — el arte cubre el 100% de la carta.

# ════════════════════════════════════════════════════════════════
# 7. ARTEFACTOS (El Objeto Puro)
# ════════════════════════════════════════════════════════════════
# Los Artefactos NO son monstruos. Son objetos, reliquias o
# mecanismos que se colocan en su ranura propia (p-artifact).
# Regla Visual: SIN MARCOS DE COLORES ELEMENTALES.
# Estética: La carta prescinde de bordes brillantes o colores
# asociados a los elementos. Su diseño es sobrio, elegante, enfocado
# al 100% en la ilustración del objeto (el engranaje, la reliquia,
# el espejo). Visualmente se lee como un "Documento" o una "Piedra
# Rúnica", indicando que es un soporte técnico que entra al juego,
# resuelve y rota al fondo del mazo.
# UI: border-zinc-500, gradient from-zinc-600 to-zinc-800

# ════════════════════════════════════════════════════════════════
# 8. PLANTILLAS DE PROMPT (COPIAR Y RELLENAR)
# ════════════════════════════════════════════════════════════════
# FORMULA BASE (todas las cartas):
# "[Dark fantasy watercolor painting of] {DESCRIPCIÓN DEL SUJETO},
#  a {RAZA} creature with {ATRIBUTO} energy. {POSE/ACCIÓN}.
#  {ELEMENTOS VISUALES DE LA RAZA}. {MODIFICADORES POR MÉTODO}.
#  Watercolor texture with rich ink washes, dramatic lighting.
#  {PALETA DE COLORES DEL ATRIBUTO}. Full bleed edge-to-edge art.
#  ABSOLUTELY NO TEXT NO WRITING NO LETTERS NO NUMBERS NO CHARACTERS
#  NO SYMBOLS NO LOGOS NO CHINESE NO JAPANESE NO KOREAN NO ENGLISH
#  NO SPANISH NO INSCRIPTIONS NO RUNES NO HIEROGLYPHS NO MARKS OF ANY
#  KIND IN ANY LANGUAGE OR ALPHABET OR WRITING SYSTEM THE IMAGE MUST
#  CONTAIN ZERO TEXTUAL CONTENT WHATSOEVER"

# ─── PLANTILLA: NORMAL + ATRIBUTO ───
# "Dark fantasy watercolor painting of {NOMBRE}, {DESCRIPCIÓN DE LA CRIATURA}.
#  A {RAZA} creature radiating {ATRIBUTO} energy, {POSE COMBATIVA}.
#  {ELEMENTOS DE LA RAZA}. {PALETA DEL ATRIBUTO},
#  watercolor texture with dramatic ink washes, {ATMÓSFERA DEL ATRIBUTO}.
#  Full bleed edge-to-edge art.
#  ABSOLUTELY NO TEXT NO WRITING NO LETTERS NO NUMBERS NO CHARACTERS
#  NO SYMBOLS NO LOGOS NO CHINESE NO JAPANESE NO KOREAN NO ENGLISH
#  NO SPANISH NO INSCRIPTIONS NO RUNES NO HIEROGLYPHS NO MARKS OF ANY
#  KIND IN ANY LANGUAGE OR ALPHABET OR WRITING SYSTEM THE IMAGE MUST
#  CONTAIN ZERO TEXTUAL CONTENT WHATSOEVER"

# ─── PLANTILLA: ANOMALÍA ───
# "Surreal dark fantasy watercolor painting of {NOMBRE}, {DESCRIPCIÓN}.
#  A {RAZA} creature with fractured unstable form, body parts floating
#  separated from the torso, double silhouettes, magical glitch artifacts
#  surrounding the figure. Radiating {ATRIBUTO} energy in a distorted way,
#  limbs defying gravity, dimensional tears around the creature.
#  {PALETA DEL ATRIBUTO} with iridescent glitches,
#  watercolor texture with distorted ink washes, abstract unstable atmosphere.
#  Full bleed edge-to-edge art.
#  ABSOLUTELY NO TEXT NO WRITING NO LETTERS NO NUMBERS NO CHARACTERS
#  NO SYMBOLS NO LOGOS NO CHINESE NO JAPANESE NO KOREAN NO ENGLISH
#  NO SPANISH NO INSCRIPTIONS NO RUNES NO HIEROGLYPHS NO MARKS OF ANY
#  KIND IN ANY LANGUAGE OR ALPHABET OR WRITING SYSTEM THE IMAGE MUST
#  CONTAIN ZERO TEXTUAL CONTENT WHATSOEVER"

# ─── PLANTILLA: CORRUPCIÓN ───
# "Dark fantasy watercolor painting of {NOMBRE}, {DESCRIPCIÓN}.
#  A {RAZA} creature corrupted and altered by an invasive external force,
#  glowing veins pulsing across its body, dark tendrils wrapping around
#  its limbs, eyes injected with {ATRIBUTO} energy, cracked shell or
#  skin releasing dark smoke and spores, parasitic symbiotic organism
#  attached to its body. {PALETA DEL ATRIBUTO} with dark corrupting veins,
#  watercolor texture with dramatic ink washes, parasitic decay atmosphere.
#  Full bleed edge-to-edge art.
#  ABSOLUTELY NO TEXT NO WRITING NO LETTERS NO NUMBERS NO CARACTERS
#  NO SYMBOLS NO LOGOS NO CHINESE NO JAPANESE NO KOREAN NO ENGLISH
#  NO SPANISH NO INSCRIPTIONS NO RUNES NO HIEROGLYPHS NO MARKS OF ANY
#  KIND IN ANY LANGUAGE OR ALPHABET OR WRITING SYSTEM THE IMAGE MUST
#  CONTAIN ZERO TEXTUAL CONTENT WHATSOEVER"

# ─── PLANTILLA: ECLIPSE ───
# "Dark fantasy watercolor painting of {NOMBRE}, {DESCRIPCIÓN}.
#  A {RAZA} champion of dual nature, perfectly symmetrical armored warrior
#  with one half radiating {ATRIBUTO 1} and the other half channeling
#  {ATRIBUTO 2}, ornate heraldic armor with clean transitions between
#  two elemental forces, dual auras merging at the center, imposing
#  battlefield champion stance. {PALETA BICOLOR}, watercolor texture
#  with dramatic ink washes, twilight duality atmosphere.
#  Full bleed edge-to-edge art.
#  ABSOLUTELY NO TEXT NO WRITING NO LETTERS NO NUMBERS NO CARACTERS
#  NO SYMBOLS NO LOGOS NO CHINESE NO JAPANESE NO KOREAN NO ENGLISH
#  NO SPANISH NO INSCRIPTIONS NO RUNES NO HIEROGLYPHS NO MARKS OF ANY
#  KIND IN ANY LANGUAGE OR ALPHABET OR WRITING SYSTEM THE IMAGE MUST
#  CONTAIN ZERO TEXTUAL CONTENT WHATSOEVER"

# ─── PLANTILLA: GÉNESIS ───
# (CRÍTICO: full bleed, paleta cósmica/prismática, escala COLOSAL)
# "Epic dark fantasy watercolor painting of {NOMBRE}, {DESCRIPCIÓN}.
#  An impossibly vast cosmic {RAZA} deity radiating absolute divine power,
#  towering over mountains and temples, face hidden behind a monolithic mask,
#  enormous floating halos surrounding the body, multiple mystical limbs,
#  eyes blazing with primordial light or absolute void. Background shows
#  constellations being born and dying, cosmic apocalypse, the horizon
#  viewed from the sky. Deep purple and gold palette with cosmic iridescence
#  and stellar energy, watercolor texture with majestic ink washes,
#  transcendent epic atmosphere. Full body portrait, vertical composition,
#  dark majestic and terrifying. Full bleed edge-to-edge art.
#  ABSOLUTELY NO TEXT NO WRITING NO LETTERS NO NUMBERS NO CARACTERS
#  NO SYMBOLS NO LOGOS NO CHINESE NO JAPANESE NO KOREAN NO ENGLISH
#  NO SPANISH NO INSCRIPTIONS NO RUNES NO HIEROGLYPHS NO MARKS OF ANY
#  KIND IN ANY LANGUAGE OR ALPHABET OR WRITING SYSTEM THE IMAGE MUST
#  CONTAIN ZERO TEXTUAL CONTENT WHATSOEVER"

# ════════════════════════════════════════════════════════════════
# 9. CONVENCIONES DE NOMBRE DE ARCHIVO
# ════════════════════════════════════════════════════════════════
# Regla: /public/cards/{nombre_en_minusculas_con_guiones_bajos}.png
# Ejemplos:
#   "Aethel, Portador del Alba"    -> /cards/aethel_portador_alba.png
#   "Sombra de Espejo"             -> /cards/sombra_espejo.png
#   "Oblivion, El Fin de Todo"     -> /cards/oblivion_fin_todo.png
#
# Regla: Minúsculas, espacios reemplazados por _, tildes REMOVIDAS
# Regla: Si el nombre base está ocupado, agregar sufijo descriptivo corto
# Regla: Extensión SIEMPRE .png
# Regla: Ubicación SIEMPRE /public/cards/
#
# PASO OBLIGATORIO después de generar:
# 1. Guardar imagen en /home/z/my-project/public/cards/{nombre}.png
# 2. Agregar entrada en ART_MAP de /home/z/my-project/src/data/art-map.ts:
#    "CEL-001": "/cards/aethel_portador_alba.png",
# 3. Verificar que coincida exactamente con el id de CartaMaestra

# ════════════════════════════════════════════════════════════════
# 10. RENDERIZADO EN LA UI (page.tsx — CardView)
# ════════════════════════════════════════════════════════════════
# Dos modos de renderizado:

# MODO NORMAL (todas las cartas excepto GÉNESIS):
#   Layout: Art ocupa 75% arriba, footer negro ocupa 25% abajo
#   Art: object-cover, en small usa object-top
#   Overlays: gradiente negro arriba (h-8), badge tipo, nombre centrado
#   Footer: efecto texto + ATK en fondo negro/70
#   Marco: Color definido por CARD_TYPE_INFO[card.type] donde type =
#          atributo (para NORMAL) o método (para especiales)
#   Imagen recomendada: 768x1344 (se recorta al 75% superior)

# MODO GÉNESIS (solo tipo GÉNESIS):
#   Layout: FULL BLEED — arte cubre 100% de la carta
#   Badge tipo: bg-purple-900/70, texto purple-200, border purple-500/30
#   Nombre: texto purple-100 con drop-shadow fuerte
#   Overlay arriba: gradiente h-10 from-black/70
#   Overlay abajo: gradiente h-12 from-black/80 via-black/40
#   ATK: se superpone sobre el arte, bg-purple-900/70
#   Efecto: se superpone sobre el arte en posición inferior
#   Marco: border-fuchsia-400, gradient prismático/iridiscente
#   Imagen recomendada: 768x1344 (se usa completa)

# ════════════════════════════════════════════════════════════════
# 11. TAMAÑO Y FORMATO DE IMAGEN
# ════════════════════════════════════════════════════════════════
# Comando de generación:
#   z-ai-generate -p "{PROMPT}" -o "./public/cards/{archivo}.png" -s 768x1344
#
# Tamaños disponibles: 1024x1024 | 768x1344 | 864x1152 | 1344x768 | 1152x864 | 1440x720 | 720x1440
# USAR SIEMPRE 768x1344 (portrait 3:4 ratio) — es el formato de carta

# ════════════════════════════════════════════════════════════════
# 12. CHECKLIST OBLIGATORIO antes de generar
# ════════════════════════════════════════════════════════════════
# [ ] Leí ART_DESIGN_PATTERNS.md completo
# [ ] Sé la RAZA de la criatura → anatomía y diseño visual correctos
# [ ] Sé el ATRIBUTO → paleta de colores y marco correctos
# [ ] Sé el MÉTODO DE INVOCACIÓN → modificadores visuales correctos
# [ ] Construí el prompt usando la PLANTILLA correspondiente al método
# [ ] El prompt está en INGLÉS
# [ ] El prompt incluye el bloque anti-texto COMPLETO al final
# [ ] El tamaño es 768x1344
# [ ] El nombre del archivo sigue la convención (minúsculas, _, sin tildes)
# [ ] Agregué la entrada en ART_MAP de src/data/art-map.ts
# [ ] Para GÉNESIS: verifiqué que el arte funciona en full-bleed

# ════════════════════════════════════════════════════════════════
# 13. LISTA COMPLETA DE CARTAS — MAZO BASE "LUZ Y OSCURIDAD"
# ════════════════════════════════════════════════════════════════
# 16 cartas | Atributos: CELESTIAL + UMBRAL
# Distribución: 10 NORMAL, 3 ANOMALÍA, 1 CORRUPCIÓN, 1 ECLIPSE, 1 GÉNESIS
# Razas CELESTIAL: GENS, ÁNIMA, FÁBULA
# Razas UMBRAL: NECRO, CLASTO, SECAT

# ─── CELESTIAL (8 cartas) ───

# CEL-001 | Aethel, Portador del Alba
#   Raza: GENS | Atributo: CELESTIAL | Método: NORMAL | ATK: 1500
#   Arte: Guerrero humano con armadura dorada que emana luz solar.
#         Espada levantada, halo dorado tenue detrás de la cabeza.
#         Paleta: dorados, blancos, plata. Guardia combativa.
#   Archivo: /cards/aethel_portador_alba.png

# CEL-002 | Lumina, Voz del Firmamento
#   Raza: GENS | Atributo: CELESTIAL | Método: NORMAL | ATK: 1200
#   Arte: Chamana/hechicera humana con túnica blanca y cabello
#         flotante, manos emitiendo energía dorada. Sabia mística.
#         Paleta: blancos, dorados suaves, amarillo pálido.
#   Archivo: /cards/lumina_voz_firmamento.png

# CEL-003 | Seraphel, Centinela Radiante
#   Raza: GENS | Atributo: CELESTIAL | Método: NORMAL | ATK: 1800
#   Arte: Caballero pesado con armadura completa de plata y oro,
#         escudo con sol radiante, espada de luz blanca.
#         Imponente, en pose de guardia defensiva.
#         Paleta: plata, oro, blanco puro.
#   Archivo: /cards/seraphel_centinela_radiante.png

# CEL-004 | Eos, Eco del Alba
#   Raza: ÁNIMA | Atributo: CELESTIAL | Método: NORMAL | ATK: 1000
#   Arte: Espíritu incorpóreo, fantasma translúcido que flota,
#         silueta etérea femenina con bordes difuminados en niebla
#         dorada. Aparición espiritual luminosa.
#         Paleta: blanco translúcido, dorado vaporoso, amarillo pálido.
#   Archivo: /cards/eos_eco_alba.png

# CEL-005 | Valeria, Ánima del Refugio
#   Raza: ÁNIMA | Atributo: CELESTIAL | Método: NORMAL | ATK: 1400
#   Arte: Espíritu guerrero femenino, semitransparente pero con
#         forma más definida, empuñando una espada espectral de
#         luz sólida. Protección y guardia etérea.
#         Paleta: blanco sólido, oro pálido, brillo celestial.
#   Archivo: /cards/valeria_anima_refugio.png

# CEL-006 | Sombra de Espejo
#   Raza: ÁNIMA | Atributo: CELESTIAL | Método: ANOMALÍA | ATK: 2000
#   Arte: Entidad espectral INESTABLE — partes del cuerpo fantasmal
#         flotando separadas, silueta doble, glitch mágico a su
#         alrededor. Un espíritu que no debería estar aquí.
#         Efecto anomalía: fragmentación, bordes dobles, gravedad rota.
#         Paleta: blanco roto, dorado con distorsiones iridiscentes.
#   Archivo: /cards/sombra_espejo.png

# CEL-007 | Hada del Crepúsculo
#   Raza: FÁBULA | Atributo: CELESTIAL | Método: NORMAL | ATK: 1100
#   Arte: Pequeña criatura mítica/faérica con alas de polvo estelar,
#         aura dorada, flotando en un claro iluminado. Criatura
#         legendaria menor, delicada pero poderosa.
#         Paleta: dorado suave, polvo estelar blanco, amarillo cálido.
#   Archivo: /cards/hada_crepusculo.png

# CEL-008 | Quimera de Luz
#   Raza: FÁBULA | Atributo: CELESTIAL | Método: CORRUPCIÓN | ATK: 2500
#   Arte: Criatura mítica CORROMPIDA — una quimera legendaria
#         alterada por venas brillantes y zarcillos oscuros que la
#         recorren. Ojos inyectados en energía celestial, caparazón
#         agrietado por donde escapa luz dorada contaminada.
#         Efecto corrupción: parásitos adheridos, huésped infectado.
#         Paleta: dorado contaminado, venas oscuras, blanco enfermo.
#   Archivo: /cards/quimera_luz.png

# ─── UMBRAL (8 cartas) ───

# UMB-009 | Malakor, Susurro Final
#   Raza: NECRO | Atributo: UMBRAL | Método: NORMAL | ATK: 1600
#   Arte: Esqueleto vivo envuelto en harapos oscuros, empuñando
#         una guadaña de sombra. Ojos arden con fuego frío violeta.
#         No-muerto clásico en pose amenazante.
#         Paleta: violeta oscuro, negro, blanco hueso, fuego frío.
#   Archivo: /cards/malakor_susurro_final.png

# UMB-010 | Espectro del Abismo
#   Raza: NECRO | Atributo: UMBRAL | Método: NORMAL | ATK: 1300
#   Arte: Liche flotante, osamenta envuelta en energía necrótica
#         violeta, manos esqueléticas emitiendo sombras. Bajo las
#         profundidades abismales.
#         Paleta: indigo profundo, violeta, negro, resplandor umbral.
#   Archivo: /cards/espectro_abismo.png

# UMB-011 | Nigromante Sin Rostro
#   Raza: NECRO | Atributo: UMBRAL | Método: ANOMALÍA | ATK: 2100
#   Arte: No-muerto INESTABLE — cráneo flotando separado del torso,
#         costillas desplazadas, sombras que se duplican y distorsionan.
#         Efecto anomalía: fragmentación, siluetas dobles, glitch.
#         Paleta: negro, violeta distorsionado, iridiscencia umbral.
#   Archivo: /cards/nigromante_sin_rostro.png

# UMB-012 | Kaél, Fragmentador
#   Raza: CLASTO | Atributo: UMBRAL | Método: NORMAL | ATK: 1700
#   Arte: Golem de roca oscura con cristales violeta incrustados,
#         grietas por donde escapa energía umbral. Puños masivos
#         de piedra, ojos que son gemas oscuras.
#         Paleta: piedra oscura, violeta cristalino, negro rocoso.
#   Archivo: /cards/kael_fragmentador.png

# UMB-013 | Vórtice Devorador
#   Raza: CLASTO | Atributo: UMBRAL | Método: ANOMALÍA | ATK: 2200
#   Arte: Criatura de roca y cristal INESTABLE — fragmentos pétreos
#         flotando desordenados, cristales quebrados suspendidos en
#         el aire sin gravedad, runas rotas destellando.
#         Efecto anomalía: piezas separadas flotando, distorsión.
#         Paleta: cristal violeta roto, piedra fragmentada, iridiscencia.
#   Archivo: /cards/vortice_devorador.png

# UMB-014 | Eclipse Permanente
#   Raza: CLASTO | Atributo: UMBRAL | Método: ECLIPSE | ATK: 2800
#   Arte: Campeón de DUALIDAD — gigante de piedra y cristal con
#         MITAD dorada/celestial y MITADA violeta/umbral, transición
#         perfecta en el centro. Armadura rúnica simétrica, imponente.
#         Efecto eclipse: bicolor, simétrico, heráldico.
#         Paleta: mitad dorado/piedra clara + mitad violeta/piedra oscura.
#   Archivo: /cards/eclipse_permanente.png

# UMB-015 | Desierto Viviente
#   Raza: SECAT | Atributo: UMBRAL | Método: NORMAL | ATK: 900
#   Arte: Enjambre de escarabajos oscuros emergiendo de dunas de
#         arena negra, caparazones brillando con energía umbral
#         tenue. Mente de colmena, muchos individuos.
#         Paleta: negro, violeta oscuro, caparazón iridiscente.
#   Archivo: /cards/desierto_viviente.png

# UMB-016 | Oblivion, El Fin de Todo
#   Raza: SECAT | Atributo: UMBRAL | Método: GÉNESIS | ATK: 3500
#   Arte: DEIDAD SUPREMA — entidad cósmica colosal de forma
#         vagamente insectoide pero a escala universal. Cuerpo hecho
#         de vacío absoluto y galaxias devoradas, múltiples extremidades
#         místicas, rostro oculto tras máscara monolítica, halos
#         flotantes enormes. Fondo: constelaciones muriendo, apocalipsis.
#         Efecto génesis: FULL BLEED, escala cósmica, prismático.
#         Paleta: negro absoluto, púrpura profundo, dorado ancestral,
#                  iridiscencia cósmica.
#   Archivo: /cards/oblivion_fin_todo.png

# TOTAL: 16 cartas en el mazo base "Luz y Oscuridad"

# ════════════════════════════════════════════════════════════════
# 14. TABLA RÁPIDA: RAZA × ATRIBUTO × MÉTODO = DISEÑO
# ════════════════════════════════════════════════════════════════
# Para diseñar cualquier carta, cruzar tres dimensiones:
#
# RAZA (anatomía) + ATRIBUTO (paleta/marco) + MÉTODO (alteración)
#
# Ejemplo: GENS + CELESTIAL + NORMAL =
#   Humano con armadura dorada, marco dorado limpio, estable.
#
# Ejemplo: NECRO + UMBRAL + ANOMALÍA =
#   Esqueleto fragmentado flotando, marco violeta con distorsión,
#   inestable, glitch.
#
# Ejemplo: FÁBULA + CELESTIAL + CORRUPCIÓN =
#   Criatura mítica con venas oscuras y parásitos, marco dorado
#   infectado con filamentos oscuros.
#
# Ejemplo: CLASTO + UMBRAL + ECLIPSE =
#   Golem de piedra mitad dorada mitad violeta, marco bicolor,
#   simétrico, campeón de campo.
#
# Ejemplo: SECAT + UMBRAL + GÉNESIS =
#   Deidad insectoide cósmica, marco prismático iridiscente,
#   full bleed, escala colosal.

# ════════════════════════════════════════════════════════════════
# 15. REGLAS ABSOLUTAS (NUNCA VIOLAR)
# ════════════════════════════════════════════════════════════════
# 1. NUNCA incluir texto en la imagen generada — SIEMPRE agregar
#    bloque anti-texto completo al final del prompt
# 2. NUNCA usar estilo CGI, 3D render, o fotorrealismo
# 3. NUNCA usar colores que no correspondan al ATRIBUTO de la carta
# 4. NUNCA generar en tamaño diferente a 768x1344
# 5. SIEMPRE guardar en /public/cards/
# 6. SIEMPRE registrar en ART_MAP de src/data/art-map.ts
# 7. SIEMPRE leer este archivo ANTES de generar
# 8. SIEMPRE usar la plantilla de prompt correspondiente al MÉTODO
# 9. SIEMPRE verificar que el nombre de archivo coincide con la
#    entrada ART_MAP
# 10. NUNCA inventar razas, atributos o métodos nuevos sin consultar
#     primero src/engine/types.ts
# 11. NUNCA generar la imagen con bordes blancos, marcos, rectángulos
#     o márgenes
# 12. NUNCA dejar espacios vacíos — FULL ART, la imagen llena todo
#     el lienzo edge-to-edge
# 13. NUNCA incluir texto, letras, números, símbolos ni logos de
#     ningún tipo
# 14. SIEMPRE que la carta sea ANOMALÍA, incluir elementos de
#     fragmentación e inestabilidad visual
# 15. SIEMPRE que la carta sea CORRUPCIÓN, incluir elementos
#     parasitarios y de infección visual
# 16. SIEMPRE que la carta sea ECLIPSE, incluir dualidad visual
#     simétrica y bipartita
# 17. SIEMPRE que la carta sea GÉNESIS, usar escala colosal, estética
#     cósmica/divina y FULL BLEED
# 18. El bloque anti-texto obligatorio al final de TODO prompt es:
#     'ABSOLUTELY NO TEXT NO WRITING NO LETTERS NO NUMBERS NO
#      CHARACTERS NO SYMBOLS NO LOGOS NO CHINESE NO JAPANESE NO
#      KOREAN NO ENGLISH NO SPANISH NO INSCRIPTIONS NO RUNES NO
#      HIEROGLYPHS NO MARKS OF ANY KIND IN ANY LANGUAGE OR ALPHABET
#      OR WRITING SYSTEM THE IMAGE MUST CONTAIN ZERO TEXTUAL CONTENT
#      WHATSOEVER'
#     Este bloque va DESPUÉS de todo el contenido artístico del prompt,
#     como última línea. Nunca omitirlo. Nunca acortarlo. Es
#     obligatorio para TODOS los prompts.
