import { Navigate, Outlet, useLocation } from "react-router"
import { useAuth } from "@/hooks/useAuth"
import type { Permisos } from "@/types/auth"

/** Exige sesión; con `permiso`, además exige ese permiso del perfil. */
export function RutaProtegida({ permiso }: { permiso?: keyof Pick<Permisos, "baseConocimiento" | "verTraza"> }) {
  const { usuario } = useAuth()
  const ubicacion = useLocation()
  if (!usuario) return <Navigate to="/ingresar" replace state={{ desde: ubicacion.pathname }} />
  if (permiso && !usuario.permisos[permiso]) return <Navigate to="/consultar" replace />
  return <Outlet />
}
