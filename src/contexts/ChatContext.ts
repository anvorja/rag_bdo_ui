import { createContext } from "react"
import type { RespuestaBuscar, RespuestaChat, Valoracion } from "@/types/api"

export type EstadoConsentimiento = "pendiente" | "aceptado" | "rechazado"

export interface ValoracionLocal {
  util?: boolean | null
  correcta?: Valoracion["correcta"]
  comentario?: string | null
  estado: "enviando" | "enviada" | "error"
}

export interface Turno {
  /** id local (estable aunque falle la llamada) */
  id: string
  pregunta: string
  estado: "cargando" | "listo" | "error"
  respuesta?: RespuestaChat
  error?: string
  valoracion?: ValoracionLocal
}

export interface ChatContextValue {
  /** Estado de la sesión con la API. */
  sesion: "abriendo" | "lista" | "error"
  errorSesion: string | null
  avisoInicio: string | null
  textoConsentimiento: string | null
  consentimiento: EstadoConsentimiento
  turnos: Turno[]
  ocupado: boolean
  responder: (acepta: boolean) => Promise<void>
  enviar: (pregunta: string) => Promise<void>
  reintentar: (turnoId: string) => Promise<void>
  valorar: (turnoId: string, datos: Omit<ValoracionLocal, "estado">) => Promise<void>
  nuevaConsulta: () => Promise<void>
  /** Búsqueda en las fuentes sin LLM; usa la misma sesión y exige el mismo consentimiento. */
  buscar: (consulta: string, k?: number) => Promise<RespuestaBuscar>
}

export const ChatContext = createContext<ChatContextValue | undefined>(undefined)
