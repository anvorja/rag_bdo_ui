---
name: Asistente RAG del banco (panel piloto)
description: Panel del asistente virtual que responde solo con la documentación pública del banco y muestra la fuente y la vigencia de cada dato.
colors:
  primary: "oklch(0.38 0.062 158)"
  primary-foreground: "oklch(0.975 0.008 95)"
  background: "oklch(0.975 0.012 85)"
  foreground: "oklch(0.22 0.022 158)"
  card: "oklch(0.99 0.008 85)"
  secondary: "oklch(0.945 0.012 150)"
  muted: "oklch(0.938 0.014 85)"
  muted-foreground: "oklch(0.47 0.02 155)"
  accent: "oklch(0.935 0.016 150)"
  border: "oklch(0.89 0.015 85)"
  input: "oklch(0.86 0.016 85)"
  ring: "oklch(0.52 0.08 158)"
  destructive: "oklch(0.53 0.16 30)"
  sidebar: "oklch(0.245 0.036 160)"
  sidebar-foreground: "oklch(0.93 0.012 95)"
  sidebar-primary: "oklch(0.8 0.115 78)"
  sidebar-accent: "oklch(0.31 0.042 158)"
  sidebar-muted: "oklch(0.74 0.02 150)"
  aviso: "oklch(0.955 0.035 85)"
  aviso-foreground: "oklch(0.43 0.085 62)"
  aviso-borde: "oklch(0.86 0.07 80)"
  publico: "oklch(0.93 0.04 150)"
  publico-foreground: "oklch(0.38 0.08 152)"
  interno: "oklch(0.94 0.05 82)"
  interno-foreground: "oklch(0.44 0.09 62)"
  confidencial: "oklch(0.94 0.03 25)"
  confidencial-foreground: "oklch(0.5 0.15 28)"
  exito: "oklch(0.5 0.1 155)"
typography:
  display:
    fontFamily: "Source Serif 4 Variable, ui-serif, Georgia, serif"
    fontSize: "3.25rem"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Source Serif 4 Variable, ui-serif, Georgia, serif"
    fontSize: "2.5rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Source Serif 4 Variable, ui-serif, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 500
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Manrope Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.7
  body-sm:
    fontFamily: "Manrope Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Manrope Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    letterSpacing: "0.12em"
  mono:
    fontFamily: "Geist Mono Variable, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    fontFeature: "tnum"
rounded:
  sm: "7.2px"
  md: "9.6px"
  lg: "12px"
  xl: "16.8px"
  2xl: "21.6px"
  full: "9999px"
spacing:
  sidebar: "256px"
  header: "56px"
  column: "760px"
  viewer: "min(34rem, 42vw)"
  card-x: "20px"
  card-y: "16px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "32px"
  button-send:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.xl}"
    padding: "0 20px"
    height: "48px"
  button-outline:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    height: "32px"
  button-ghost:
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    height: "32px"
  input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    height: "44px"
  composer:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.xl}"
    padding: "12px 16px"
  user-bubble:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.2xl}"
    padding: "10px 16px"
  answer-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.2xl}"
    padding: "16px 20px"
  citation-mark:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.foreground}"
    typography: "{typography.mono}"
    height: "1.15rem"
  citation-mark-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
  badge-publico:
    backgroundColor: "{colors.publico}"
    textColor: "{colors.publico-foreground}"
    rounded: "{rounded.full}"
    height: "20px"
  badge-interno:
    backgroundColor: "{colors.interno}"
    textColor: "{colors.interno-foreground}"
    rounded: "{rounded.full}"
    height: "20px"
  badge-confidencial:
    backgroundColor: "{colors.confidencial}"
    textColor: "{colors.confidencial-foreground}"
    rounded: "{rounded.full}"
    height: "20px"
  vigencia-notice-attention:
    backgroundColor: "{colors.aviso}"
    textColor: "{colors.aviso-foreground}"
    rounded: "{rounded.lg}"
    padding: "10px 14px"
  nav-item-active:
    backgroundColor: "{colors.sidebar-accent}"
    textColor: "{colors.sidebar-foreground}"
    rounded: "{rounded.lg}"
    height: "40px"
---

# Design System: Asistente RAG del banco (panel piloto)

## Overview

**Creative North Star: "El despacho con comprobante"**

Un despacho bancario sobrio: barra lateral verde bosque casi negra, una superficie de trabajo color hueso cálido y un único verde institucional para actuar y seleccionar. La interfaz no compite con el contenido; su trabajo es que cada respuesta llegue con su comprobante visible (marcas [n], fuentes, vigencia) y que verificar cueste un clic. La fuente, la vigencia y la acción del asistente son ciudadanos de primera clase, no notas al pie plegadas.

La densidad es de herramienta de trabajo, no de página de marketing: textos de 13 a 15 px, filas compactas, una columna de lectura de 760 px y un visor de documentos que se acopla a la derecha sin cerrar la conversación. La serif aparece poco y siempre con intención (marca, saludo, títulos de página y de documento); el resto es Manrope. Las cifras usan numerales tabulares y los identificadores van en mono.

El mundo lo fijaron los mockups del usuario; la construcción calentó los fondos hacia el hueso y el verde bosque de esos mockups. Rechazo confirmado: el chat genérico de burbujas grises con fuentes escondidas.

**Key Characteristics:**
- Barra lateral verde bosque profunda frente a superficie hueso cálida; nunca gris neutro.
- Un solo acento verde institucional para acciones, selección, cita activa y burbuja del usuario.
- Ámbar reservado para el rótulo de marca y los estados que piden atención (vigencia vencida, histórica o limitada; servicio con limitaciones).
- Rojo terroso solo para «Confidencial» y errores.
- Plano por defecto: profundidad por capas tonales y bordes finos, sombras de 1-2 px apenas perceptibles.
- Movimiento corto (150-220 ms) con salida exponencial; todo se apaga con prefers-reduced-motion.

## Colors

Paleta cálida y contenida: verdes con tono 150-162 sobre hueso con tono 85, y dos colores semánticos (ámbar y rojo terroso) que solo aparecen cuando significan algo. Los valores se definen en OKLCH en `src/global.css`, que es la fuente normativa; el tema oscuro redefine las mismas variables.

### Primary
- **Verde institucional** (`primary`): botones de acción (Enviar, Ingresar, Acepto y continuar), burbuja de la pregunta del usuario, marca [n] activa y su número en la fila de fuente, perfil elegido en el ingreso, enlaces del documento, cursor de texto y selección (al 22 %). En el tema oscuro se aclara para conservar el contraste.
- **Verde de foco** (`ring`): anillos de foco a la mitad de opacidad y borde del compositor enfocado.

### Secondary
- **Ámbar de marca** (`sidebar-primary`): el rótulo «Asistente RAG» bajo el nombre del banco y el anillo de foco dentro de la barra lateral.
- **Ámbar de atención** (`aviso`, `aviso-foreground`, `aviso-borde`): avisos de vigencia cuando alguna fuente está vencida, es histórica o depende de existencias; la insignia de vigencia en esos estados; el marco del turno «aclarar»; el estado «Con limitaciones» del servicio.

### Tertiary
- **Rojo terroso** (`destructive`, `confidencial`): errores (turno fallido, validación, conexión) sobre fondos al 5 % con borde al 30 %, y la insignia «Confidencial».

### Neutral
- **Hueso de trabajo** (`background`): fondo de la superficie principal, la cabecera y el compositor (este al 80-92 % con desenfoque).
- **Papel** (`card`): tarjetas de respuesta, consentimiento, sugerencias, campos y el visor acoplado; un paso más claro que el fondo.
- **Tinta verde** (`foreground`): todo el texto principal; nunca negro puro.
- **Tinta suave** (`muted-foreground`): metadatos, ayudas, vigencia vigente, página y encabezado de la fuente.
- **Hueso hundido** (`muted`) y **verde niebla** (`secondary`, `accent`): rellenos de hover, marca [n] en reposo, fragmento citado, sugerencia en hover.
- **Línea de hueso** (`border`, `input`): bordes de 1 px de tarjetas, cabecera, compositor y campos.
- **Verde bosque** (`sidebar`, `sidebar-accent`, `sidebar-foreground`, `sidebar-muted`): barra lateral, ítem activo, texto claro y perfil del usuario. El panel de ingreso usa un degradado propio de la misma familia (#16301f → #1a3328 → #2c542e).
- **Niveles de acceso** (`publico`, `interno`, `confidencial`): rellenos pastel con texto profundo de su tono, solo en insignias de acceso.
- **Éxito** (`exito`): confirmación «Guardada» de una valoración.

### Named Rules
**The One Green Rule.** Toda acción y toda selección usa el mismo verde institucional. No hay un segundo color de acción.

**The Amber Means Read This Rule.** El ámbar no decora: solo el rótulo de marca y lo que exige leer un aviso. Una fuente vigente se muestra en tinta suave con un fondo neutro; si nada está vencido, histórico o limitado, no hay ámbar en la respuesta.

**The Warm Ground Rule.** Los fondos son hueso cálido (tono 85) y verde bosque (tono 160). Ningún gris neutro de tono 0.

## Typography

**Display Font:** Source Serif 4 Variable (con ui-serif, Georgia)
**Body Font:** Manrope Variable (con ui-sans-serif, system-ui)
**Label/Mono Font:** Geist Mono Variable (con ui-monospace)

**Character:** Una serif de libro, peso 500 y tracking ajustado, para los momentos de identidad; una sans geométrica y cálida para trabajar. La mono marca lo que es dato de máquina: número de documento, número de cita, contadores, trazas.

### Hierarchy
- **Display** (500, 2rem → 2.5rem → 3.25rem, 1.12): solo la frase del panel de ingreso.
- **Headline** (500, 2rem → 2.5rem, ajustado): el saludo «Hola, …» del estado vacío y el título del formulario de ingreso (1.875rem).
- **Title** (serif 500, 1.25rem): título de página en la cabecera; títulos de documento en el visor (serif 600, 1.0625rem); nombre del banco en la barra (1.375rem).
- **Body** (400, 0.9375rem, 1.7): texto de la respuesta, burbuja del usuario, compositor y consentimiento. Columna máxima de 760 px.
- **Body pequeño** (0.8125rem): filas de fuente, avisos de vigencia, extractos, ayudas y errores de campo. Es el tamaño más usado de la app.
- **Label** (600, 0.6875rem, 0.12em, mayúsculas): el encabezado del bloque «Fuentes» y el rótulo de marca (0.14em). Insignias de acceso en 0.6875rem 600 sin mayúsculas.
- **Mono** (0.75rem, numerales tabulares): «Doc. N», número de cita, contador de caracteres, recuentos del catálogo.

### Named Rules
**The Serif Is Rare Rule.** La serif solo va en marca, saludo, títulos de página, de formulario y de documento. Botones, listas, insignias y cuerpo son Manrope.

**The Tabular Figures Rule.** Toda cifra que se compare (tarifas, fechas, páginas, recuentos, tablas del documento) usa numerales tabulares.

## Layout

Marco de aplicación de altura completa: solo `<main>` y el visor acoplado desplazan; la barra lateral, la cabecera y el compositor quedan fijos. En escritorio (≥1024 px) la barra lateral es fija de 256 px; por debajo se abre como panel lateral de 288 px desde un botón de menú en la cabecera de 56 px. La conversación, el estado vacío y el compositor comparten una columna centrada de 760 px con 16 px de margen lateral (24 px desde 640 px). El visor se acopla a la derecha con ancho min(34rem, 42vw) desde 1280 px; por debajo se abre como hoja a pantalla completa (hasta 576 px).

Ritmo: turnos separados 12 px; dentro de la tarjeta de respuesta, bloques separados 16 px con relleno de 20 × 16 px; filas de fuente separadas 6 px. Las sugerencias del estado vacío forman una lista de dos columnas desde 640 px. El compositor respeta el área segura inferior del celular. Las insignias de acceso de la cabecera se ocultan por debajo de 768 px.

## Elevation & Depth

Plano por defecto. La profundidad viene de capas tonales (hueso → papel → hueso hundido) y bordes de 1 px; las sombras son un susurro teñido de verde que separa el papel del hueso, no una elevación. El único volumen mayor es la sombra difusa bajo el perfil elegido en el ingreso. Las superposiciones (menús, hojas, tooltips) usan las sombras de shadcn por defecto.

### Shadow Vocabulary
- **Papel apoyado** (`box-shadow: 0 1px 2px oklch(0.3 0.03 158 / 0.05)`): tarjeta de respuesta y de consentimiento; al 0.06 en el compositor.
- **Selección elevada** (`box-shadow: 0 6px 16px -8px oklch(0.3 0.06 158 / 0.6)`): solo la tarjeta de perfil activa en el ingreso.

### Named Rules
**The Paper On Bone Rule.** Una superficie se separa por un paso tonal y un borde fino; la sombra, si existe, no pasa de 2 px.

## Shapes

Radio base de 12 px que escala: 7 px en elementos pequeños, 10 px en controles compactos y miniaturas (número de fuente, enlace externo), 12 px en botones, campos, ítems de navegación, filas de fuente y avisos, 17 px en el compositor, el botón Enviar y las sugerencias, y 22 px en las tarjetas de respuesta y consentimiento. Las insignias son píldoras. La burbuja del usuario redondea 22 px con la esquina inferior derecha recortada a 10 px, apuntando a quien escribe. La marca [n] en línea es un cuadradito de 5 px de radio a la altura de la x. Bordes de 1 px en todo; nunca bordes gruesos ni de acento lateral.

## Components

### Buttons
Sobrios y de contraste pleno cuando importan.
- **Shape:** curva suave (12 px); el botón Enviar y el compositor comparten 17 px y 48 px de alto.
- **Primary:** verde institucional con texto hueso; 32 px por defecto, 40-44 px en consentimiento e ingreso, peso 600 en las acciones principales.
- **Hover / Focus:** el relleno baja al 80 %; foco con anillo de 3 px del verde de foco al 50 %; al presionar baja 1 px. Deshabilitado al 50 % de opacidad.
- **Outline:** papel con borde de hueso (Nueva consulta, Reintentar, Guardar comentario). **Ghost:** sin relleno, hover en hueso hundido (No acepto, cerrar visor, menú).
- **Destructive:** rojo terroso al 10 % con texto rojo, nunca relleno pleno.

### Chips
- **Insignia de acceso:** píldora de 20 px, 0.6875rem 600, relleno pastel del nivel con texto profundo del mismo tono. Una por fuente y una por nivel en la cabecera; los niveles sin documentos explican en un tooltip que hoy la base es pública.
- **Insignia de vigencia:** texto con icono de calendario de 14 px, sin relleno. Vigente: tinta suave («Vigente hasta el …»). Vencida, histórica o limitada: ámbar de atención 500, con icono de historial para lo pasado.

### Cards / Containers
- **Corner Style:** 22 px en tarjetas de turno y consentimiento; 17 px en sugerencias; 12 px en avisos.
- **Background:** papel sobre hueso.
- **Shadow Strategy:** papel apoyado (ver Elevation & Depth).
- **Border:** 1 px de línea de hueso. Los turnos que no responden cambian el marco: remitir en verde niebla con borde verde al 25 %, abstenerse en hueso hundido, aclarar en ámbar al 60 %, error en rojo al 5 % con borde al 30 %.
- **Internal Padding:** 20 × 16 px (24 px en consentimiento desde 640 px).

### Inputs / Fields
- **Style:** borde de 1 px, papel, 12 px de radio; 44 px en el ingreso, 36 px en filtros del catálogo.
- **Focus:** borde al verde de foco y anillo de 3 px al 50 % (25 % en el compositor).
- **Error / Disabled:** borde rojo terroso con anillo al 20 % y mensaje de 0.8125rem debajo; deshabilitado al 50 %, el compositor al 70 % con el motivo en el placeholder.

### Navigation
- **Barra lateral:** marca arriba, ítems de 40 px en 0.875rem 500 con icono de 16 px; reposo al 80 % de opacidad, hover en verde bosque claro al 60 %, activo en `sidebar-accent` con texto pleno. Usuario y sesión al pie, separados por un borde blanco al 9 %.
- **Cabecera:** 56 px, hueso con borde inferior, título de página en serif 1.25rem, a la derecha la acción contextual, el estado del servicio y las insignias de acceso.
- **Móvil:** botón de menú en la cabecera que abre la barra lateral como panel izquierdo de 288 px.

### Respuesta con comprobante (signature)
La tarjeta de respuesta ordena: marco de acción (si no responde) → avisos de vigencia → texto con marcas [n] → bloque «Fuentes» → detalles técnicos (perfiles con traza) → valoración separada por un borde. Las marcas [n] son botones mono en verde niebla; al pasar o enfocar una marca, su fila de fuente se resalta (relleno al 8 % y anillo verde al 35 %, número en verde pleno) y viceversa; al activarla se abre el visor en el fragmento citado. Cada fila de fuente muestra número, título, insignia de acceso, la línea del fragmento que respalda la respuesta (una línea, tinta suave), vigencia y página, y un enlace externo de 28 px a la derecha.

### Visor de documento
Panel de papel con borde izquierdo que entra desde la derecha (200 ms). Cabecera con título serif, vigencia y «Doc. N» en mono; pestañas Fragmento, Documento y Versiones. En el fragmento citado se marca una sola línea, la que mejor respalda la respuesta (verde al 12 % con anillo al 25 %, peso 500), y se desplaza al centro.

### Valoración
Una fila discreta de 0.75rem: «¿Te sirvió?» con pulgares; los evaluadores añaden «¿Es correcta?» (Sí / En parte / No) y un comentario opcional. Estado «Guardada» en verde de éxito.

## Do's and Don'ts

### Do:
- **Do** usar el verde institucional (`primary`) para toda acción y selección, y nada más para eso.
- **Do** mostrar los avisos de vigencia antes del texto de la respuesta; neutros (tinta suave sobre `foreground` al 4 %) cuando todo está vigente y en ámbar con borde solo cuando algo está vencido, es histórico o limitado.
- **Do** poner las cifras en numerales tabulares y los identificadores (Doc. N, número de cita) en Geist Mono.
- **Do** mantener la columna de lectura en 760 px y dejar que solo `<main>` y el visor desplacen.
- **Do** mantener el movimiento entre 150 y 220 ms con la curva `--ease-salida` (cubic-bezier(0.16, 1, 0.3, 1)) y desactivarlo con prefers-reduced-motion.
- **Do** separar superficies por paso tonal y borde de 1 px antes que por sombra.

### Don't:
- **Don't** usar ámbar para decorar, para acciones o para una fuente vigente.
- **Don't** usar rojo terroso fuera de errores y del nivel «Confidencial».
- **Don't** introducir grises neutros de tono 0 en fondos o texto; la familia es hueso y verde.
- **Don't** esconder las fuentes tras un plegable: el bloque «Fuentes» siempre está abierto bajo la respuesta.
- **Don't** usar la serif en botones, insignias, listas o cuerpo de texto.
- **Don't** usar etiquetas pequeñas en mayúsculas espaciadas como antetítulo sobre un título; ese estilo solo nombra el bloque «Fuentes» y el rótulo de marca.
