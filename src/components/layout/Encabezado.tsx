import { useLocation } from "react-router"
import { MenuIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { InsigniaAcceso } from "@/components/comun/InsigniaAcceso"
import { useAuth } from "@/hooks/useAuth"
import { EstadoServicio } from "./EstadoServicio"
import { tituloDeRuta } from "./navegacion"
import type { ReactNode } from "react"

export function Encabezado({ alAbrirMenu, acciones }: { alAbrirMenu: () => void; acciones?: ReactNode }) {
  const { usuario } = useAuth()
  const { pathname } = useLocation()
  const titulo = tituloDeRuta(pathname)

  return (
    <header className="z-20 flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4 sm:px-6">
      <Button variant="ghost" size="icon" className="-ml-1 lg:hidden" onClick={alAbrirMenu} aria-label="Abrir menú">
        <MenuIcon />
      </Button>
      <h1 className="min-w-0 truncate font-serif text-[1.25rem] font-medium tracking-tight">{titulo}</h1>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {acciones}
        <EstadoServicio />
        {usuario && (
          <div className="hidden items-center gap-1.5 md:flex" aria-label="Niveles de acceso de tu perfil">
            <span className="text-xs text-muted-foreground">Acceso:</span>
            {usuario.permisos.niveles.map((nivel) =>
              nivel === "publico" ? (
                <InsigniaAcceso key={nivel} nivel={nivel} />
              ) : (
                <Tooltip key={nivel}>
                  <TooltipTrigger asChild>
                    <span tabIndex={0} className="inline-flex rounded-full focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none">
                      <InsigniaAcceso nivel={nivel} />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Todavía no hay documentos de este nivel: hoy la base es pública.</TooltipContent>
                </Tooltip>
              )
            )}
          </div>
        )}
      </div>
    </header>
  )
}
