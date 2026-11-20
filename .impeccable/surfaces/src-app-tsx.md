---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Panel del asistente (piloto)

Scope: ingreso, consultar (chat con fuentes), base de conocimiento (admin). Mode: Operate.
Audience: cliente que pregunta y experto del banco que evalúa. Task: preguntar, verificar la fuente, valorar.
Constraints: mockups en mockups/ fijan el mundo; login solo en navegador (piloto); todo el contenido es público.

## Direction contract
THESIS: Un despacho bancario sobrio donde cada respuesta trae su comprobante. Rechaza el chat genérico de burbujas grises con fuentes escondidas: aquí la fuente, la vigencia y la acción del asistente son ciudadanos de primera clase.
OWN-WORLD: Barra lateral verde bosque profundo (casi negro verdoso), superficie de trabajo hueso claro, un solo acento verde institucional para acciones y selección, ámbar solo para el rótulo de marca y avisos de vigencia, rojo terroso solo para confidencial y errores. Serif sobria solo en la marca, el saludo y títulos de página; sans de trabajo (Manrope) en todo lo demás; mono para números de documento, páginas y trazas. Radio 12px en superficies, 10px en controles, insignias en píldora.
STORY: El usuario entra con su perfil, acepta el aviso una vez, pregunta, ve la respuesta con marcas [n] enlazadas a fuentes con vigencia, abre el documento en el visor sin perder la conversación, y valora con un clic.
FIRST VIEWPORT: Desktop: barra lateral fija 264px (marca, navegación por perfil, usuario abajo); cabecera delgada con título de página e insignias de acceso; columna de conversación de 760px centrada; compositor anclado abajo con textarea que crece y botón Enviar con contraste pleno. Vacío: saludo serif grande alineado a la izquierda de la columna, tarjeta de aviso y consentimiento, y sugerencias por perfil en lista de dos columnas. Móvil: barra superior con menú, compositor fijo con área segura.
FORM: Mundo fijado por los mockups del usuario (refinar y expandir, sin tirada de concepto); posición 1; seed key: pinned-by-brief.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
Signature interaction: al pasar o enfocar una marca [n] en la respuesta se resalta su fuente; al activarla se abre el visor lateral en el fragmento citado.
Motion grammar: 150-220 ms, ease-out exponencial; entrada de turnos por opacidad y 4px; panel del visor desliza desde la derecha; nada decorativo; todo se apaga con prefers-reduced-motion.
