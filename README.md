# Panel del asistente RAG (piloto)

Panel web para probar con usuarios reales el asistente virtual que responde con la documentación pública oficial del banco y cita sus fuentes. Consume la API del repositorio `enlaces-rag-bdo` (`api/`).

## Arranque

```bash
pnpm install
cp .env.example .env          # ajusta VITE_API_URL y VITE_NOMBRE_BANCO
pnpm dev                      # http://localhost:5173
```

La API se levanta en el otro repositorio:

```bash
cd ../enlaces-rag-bdo
source .venv/bin/activate && set -a && . ./.env && set +a
python -m uvicorn api.app:app --port 8000
```

La API acepta por defecto peticiones desde `http://localhost:5173`. Si el panel se sirve en otra dirección, se ajusta con `CORS_ORIGENES` en la API.

| Variable | Por defecto | Uso |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | URL base de la API |
| `VITE_NOMBRE_BANCO` | `Banco de Occidente` | Nombre que muestra el panel |

Todo lo que empieza por `VITE_` queda **público** dentro del bundle: aquí nunca van claves ni contraseñas.

## Scripts

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Compila y revisa los tipos (`tsc -b`) |
| `pnpm lint` | ESLint (incluye las reglas de hooks de React) |
| `pnpm typecheck` | Solo la revisión de tipos |

## Perfiles (piloto)

El ingreso pide correo, contraseña y perfil, y **se valida solo en el navegador**: la API todavía no tiene autenticación. No es un control de seguridad. Cuando exista autenticación real, se reemplaza `src/services/autenticacion.ts` y el resto del panel no cambia.

| Perfil | Consultar | Valoración | Traza técnica | Base de conocimiento |
|---|---|---|---|---|
| Cliente | Sí | Útil sí o no | No | No |
| Empleado | Sí | Útil, correcta y comentario | Sí | No |
| Admin | Sí | Útil, correcta y comentario | Sí | Catálogo, búsqueda en las fuentes, visor y estado del servicio |

Hoy todo el contenido es público. Las insignias Interno y Confidencial muestran el nivel de acceso del perfil, pero esos niveles aún no tienen documentos.

## Arquitectura: Context + Custom Hooks

```
src/
├── contexts/     solo createContext() y los tipos del contrato (Auth, Chat, Salud, Theme, Visor)
├── providers/    la lógica y los efectos de cada contexto, más AppProviders
├── hooks/        acceso a los contextos (useAuth, useChat…) y lecturas de la API (useDocumentos…)
├── services/     cliente HTTP de la API (api.ts) y autenticación del piloto
├── types/        contrato de la API (api.ts) y de la sesión (auth.ts)
├── components/   ui/ (shadcn), layout/, chat/, visor/, conocimiento/, comun/, auth/
├── pages/        Ingresar, Consultar, Conocimiento, NoEncontrada
└── config/       variables de entorno
```

Los componentes solo usan hooks: no importan contextos ni llaman a `fetch` directamente.

## Reglas del producto que el panel respeta

- Cada chat empieza con el aviso de que es un asistente virtual y el consentimiento. Sin consentimiento no se envían preguntas, ni en el chat ni en la búsqueda en las fuentes.
- Las citas, los enlaces y los avisos de vigencia vienen de la API (los pone el código, no el modelo). El panel los muestra siempre, y antes del dato cuando la fuente está vencida o es histórica.
- El texto que escribe el usuario no se guarda en el navegador.
