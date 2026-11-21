import { createContext } from "react"

export interface ObjetivoVisor {
  docId: string
  /** Fragmento citado («<doc_id>#<n>»), si se abrió desde una cita o una búsqueda. */
  fragmento?: string
  /** Texto de la respuesta: sirve para resaltar la línea del fragmento que la respalda. */
  referencia?: string
}

export interface VisorContextValue {
  objetivo: ObjetivoVisor | null
  abrir: (objetivo: ObjetivoVisor) => void
  cerrar: () => void
}

export const VisorContext = createContext<VisorContextValue | undefined>(undefined)
