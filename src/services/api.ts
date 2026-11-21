import { entorno } from "@/config/entorno"
import type {
  ConsultaDocumentos,
  Documento,
  Filtros,
  Fragmento,
  ListaDocumentos,
  RespuestaBuscar,
  RespuestaChat,
  Salud,
  Sesion,
  Valoracion,
} from "@/types/api"

/** Error de la API con el código HTTP y el mensaje `detail` que manda FastAPI. */
export class ErrorApi extends Error {
  readonly estado: number

  constructor(estado: number, mensaje: string) {
    super(mensaje)
    this.name = "ErrorApi"
    this.estado = estado
  }

  /** El servidor no respondió (caído, sin red o bloqueado por CORS). */
  get sinConexion() {
    return this.estado === 0
  }
}

const MENSAJE_SIN_CONEXION =
  "No hay conexión con el servidor del asistente. Revisa que la API esté encendida."

async function pedir<T>(ruta: string, init?: RequestInit): Promise<T> {
  let respuesta: Response
  try {
    respuesta = await fetch(`${entorno.apiUrl}${ruta}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    })
  } catch {
    throw new ErrorApi(0, MENSAJE_SIN_CONEXION)
  }
  if (!respuesta.ok) {
    let detalle = `Error ${respuesta.status}`
    try {
      const cuerpo = (await respuesta.json()) as { detail?: unknown }
      if (typeof cuerpo.detail === "string") detalle = cuerpo.detail
      else if (Array.isArray(cuerpo.detail)) detalle = "La solicitud no es válida."
    } catch {
      /* cuerpo sin JSON: se queda el código */
    }
    throw new ErrorApi(respuesta.status, detalle)
  }
  return (await respuesta.json()) as T
}

const post = <T>(ruta: string, cuerpo?: unknown) =>
  pedir<T>(ruta, { method: "POST", body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo) })

function query(params: Record<string, string | number | boolean | undefined>) {
  const qs = new URLSearchParams()
  for (const [clave, valor] of Object.entries(params)) {
    if (valor !== undefined && valor !== "") qs.set(clave, String(valor))
  }
  const texto = qs.toString()
  return texto ? `?${texto}` : ""
}

export const api = {
  salud: () => pedir<Salud>("/api/salud"),
  abrirSesion: () => post<Sesion>("/api/sesiones"),
  consentir: (sesionId: string, acepta: boolean) =>
    post<{ sesion_id: string; consentimiento: boolean }>(
      `/api/sesiones/${encodeURIComponent(sesionId)}/consentimiento`,
      { acepta }
    ),
  chat: (sesionId: string, mensaje: string) =>
    post<RespuestaChat>("/api/chat", { sesion_id: sesionId, mensaje }),
  buscar: (sesionId: string, consulta: string, k = 10) =>
    post<RespuestaBuscar>("/api/buscar", { sesion_id: sesionId, consulta, k }),
  documentos: (consulta: ConsultaDocumentos) =>
    pedir<ListaDocumentos>(`/api/documentos${query({ ...consulta })}`),
  filtros: () => pedir<Filtros>("/api/documentos/filtros"),
  documento: (docId: string) =>
    pedir<Documento>(`/api/documentos/${encodeURIComponent(docId)}`),
  fragmento: (docId: string, n: number) =>
    pedir<Fragmento>(
      `/api/documentos/${encodeURIComponent(docId)}/fragmentos/${n}`
    ),
  valorar: (valoracion: Valoracion) =>
    post<{ ok: boolean }>("/api/valoraciones", valoracion),
}
