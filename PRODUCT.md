# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Cliente:** persona o empresa que pregunta por productos, tasas, tarifas, requisitos y canales del banco, en lenguaje coloquial, desde el computador o el celular.
- **Empleado (evaluador):** persona del banco que, en la prueba piloto, pregunta como lo haría un cliente y califica cada respuesta (útil, correcta, comentario) revisando las fuentes citadas y la traza técnica del turno.
- **Administrador:** además de lo anterior, explora la base de conocimiento: catálogo de documentos, búsqueda en las fuentes sin LLM, visor del documento con sus versiones y estado del servicio.

En la prueba participan los dos tipos de usuario (cliente real y experto que evalúa).

## Product Purpose

Panel web del asistente virtual (RAG) que responde solo con la documentación pública oficial del banco y muestra la fuente de cada dato. El éxito de la prueba es medir, con usuarios reales, si las respuestas son correctas, están respaldadas y resultan útiles, y recoger esas valoraciones.

## Positioning

Cada respuesta es verificable: el modelo redacta, pero el código pone las citas (URL, título, página), los avisos de vigencia y las verificaciones. El asistente prefiere abstenerse o remitir a un canal antes que inventar.

## Operating Context

- Backend: API FastAPI del repositorio `enlaces-rag-bdo` (`api/`), contrato en `/openapi.json`. Endpoints de sesiones, consentimiento, chat, búsqueda, documentos, fragmentos, valoraciones y salud.
- Cada chat empieza con el aviso de que es un asistente virtual (no una persona) y el consentimiento para tratar la consulta. Sin consentimiento no se puede chatear.
- Acciones posibles de un turno: responder (con citas y avisos), abstenerse, escalar (quejas y fraude al WhatsApp; consultas de la cuenta propia a la app, el portal y las líneas de atención) y aclarar.
- Las tasas se publican cada mes; los avisos de vigencia son obligatorios cuando la fuente está vencida, es histórica o depende de existencias.

## Capabilities and Constraints

- Hoy todo el contenido es **público**. Los niveles «Interno» y «Confidencial» de los mockups no tienen documentos todavía.
- **No hay autenticación en el servidor.** El ingreso con correo, contraseña y perfil (Cliente, Empleado, Admin) es una decisión del usuario para el piloto y se valida solo en el navegador; no es un control de seguridad y debe poder reemplazarse por autenticación real sin tocar los componentes.
- El asistente no tiene acceso a las cuentas de los clientes; integrar esa consulta se considera a futuro.
- La sesión del backend vive en memoria: el historial dura lo que dura la sesión.
- El nombre del banco que muestra el panel es configurable (`VITE_NOMBRE_BANCO`); por defecto, Banco de Occidente.
- Stack: React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui (radix), lucide. Arquitectura obligatoria: Context + Custom Hooks (`contexts/` solo definiciones, `providers/` la lógica, `hooks/` el acceso).

## Brand Commitments

- Mockups en `mockups/` (6 pantallas): ingreso dividido con panel verde profundo y formulario claro; barra lateral verde oscura con el nombre del banco y «Asistente RAG»; saludo «Hola, …» y preguntas sugeridas; burbuja del usuario en verde; respuesta con bloque «Fuentes» y etiqueta de acceso por fuente; insignias de acceso en la cabecera (Público, Interno, Confidencial).
- Idioma: español de Colombia, trato de «tú», tono claro y cercano.

## Evidence on Hand

- Corpus real: 965 documentos indexables, con títulos públicos, URL, vigencia y versiones.
- Evaluación real sobre `dev` (golden «plata», sin validación experta): 94,5 % de acciones correctas y 89,3 % de respuestas correctas según un juez LLM.
- No hay testimonios, clientes ni métricas de uso reales: no se inventan.

## Product Principles

1. La fuente se ve siempre: ningún dato sin su origen a un clic.
2. La vigencia manda: si un dato está vencido o es histórico, se dice antes que el dato.
3. Decir «no sé» o remitir es un resultado válido, no un error.
4. La prueba debe producir evidencia: valorar una respuesta toma un clic.
5. Lo que el sistema todavía no hace no se finge.

## Accessibility & Inclusion

Contraste WCAG AA, foco visible, uso completo con teclado y lectores de pantalla en el chat (las respuestas nuevas se anuncian), y uso cómodo en el celular.
