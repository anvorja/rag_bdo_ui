import { useCallback, useMemo, useState, type ReactNode } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import * as autenticacion from "@/services/autenticacion"
import type { Credenciales } from "@/types/auth"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState(autenticacion.restaurarSesion)

  const ingresar = useCallback(async (credenciales: Credenciales) => {
    const nuevo = await autenticacion.iniciarSesion(credenciales)
    setUsuario(nuevo)
    return nuevo
  }, [])

  const salir = useCallback(() => {
    autenticacion.cerrarSesion()
    setUsuario(null)
  }, [])

  const valor = useMemo(
    () => ({ usuario, autenticado: usuario !== null, ingresar, salir }),
    [usuario, ingresar, salir]
  )
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
