import { NavLink } from "react-router"
import { LogOutIcon, MoonIcon, SunIcon } from "lucide-react"
import { MarcaBanco } from "@/components/comun/MarcaBanco"
import { useAuth } from "@/hooks/useAuth"
import { useTheme } from "@/hooks/useTheme"
import { ETIQUETA_PERFIL } from "@/services/autenticacion"
import { cn } from "@/lib/utils"
import { ENLACES } from "./navegacion"

/** Contenido de la barra lateral; se usa fija en escritorio y dentro de un panel en el celular. */
export function BarraLateral({ alNavegar }: { alNavegar?: () => void }) {
  const { usuario, salir } = useAuth()
  const { temaResuelto, alternarTema } = useTheme()
  if (!usuario) return null
  const enlaces = ENLACES.filter((e) => !e.permiso || usuario.permisos[e.permiso])

  return (
    <div className="flex h-full flex-col bg-sidebar px-4 pt-6 pb-5 text-sidebar-foreground">
      <MarcaBanco className="px-2" />

      <nav aria-label="Principal" className="mt-9">
        <ul className="grid gap-1">
          {enlaces.map(({ ruta, titulo, icono: Icono }) => (
            <li key={ruta}>
              <NavLink
                to={ruta}
                onClick={alNavegar}
                className={({ isActive }) =>
                  cn(
                    "flex h-10 items-center gap-2.5 rounded-lg px-3 text-[0.875rem] font-medium transition-colors duration-150",
                    "outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                  )
                }
              >
                <Icono aria-hidden className="size-4 shrink-0 opacity-80" />
                {titulo}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto border-t border-sidebar-border pt-4">
        <div className="px-2">
          <p className="truncate text-sm font-semibold" title={usuario.correo}>
            {usuario.correo}
          </p>
          <p className="mt-0.5 text-xs text-sidebar-muted">{ETIQUETA_PERFIL[usuario.perfil]}</p>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={salir}
            className="inline-flex h-9 items-center gap-2 rounded-lg px-2 text-[0.8125rem] font-medium text-sidebar-primary transition-colors hover:bg-sidebar-accent/60 focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none"
          >
            <LogOutIcon aria-hidden className="size-4" />
            Cerrar sesión
          </button>
          <button
            type="button"
            onClick={alternarTema}
            aria-label={temaResuelto === "oscuro" ? "Usar tema claro" : "Usar tema oscuro"}
            title="Cambiar tema (tecla D)"
            className="inline-flex size-9 items-center justify-center rounded-lg text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none"
          >
            {temaResuelto === "oscuro" ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
