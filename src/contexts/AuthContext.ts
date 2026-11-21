import { createContext } from "react"
import type { Credenciales, Usuario } from "@/types/auth"

export interface AuthContextValue {
  usuario: Usuario | null
  autenticado: boolean
  ingresar: (credenciales: Credenciales) => Promise<Usuario>
  salir: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
