import { createContext } from "react"
import type { Salud } from "@/types/api"

export type EstadoServicio = "verificando" | "en_linea" | "degradado" | "sin_conexion"

export interface SaludContextValue {
  salud: Salud | null
  estado: EstadoServicio
  verificar: () => Promise<void>
}

export const SaludContext = createContext<SaludContextValue | undefined>(undefined)
