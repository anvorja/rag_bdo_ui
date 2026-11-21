import { CalendarClockIcon, HistoryIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { ETIQUETA_VIGENCIA, fechaLarga, tonoVigencia } from "@/lib/formato"
import type { EstadoVigencia } from "@/types/api"

/** Estado de vigencia de una fuente. Lo «vigente» va discreto; lo que exige leer el aviso, en ámbar. */
export function InsigniaVigencia({
  estado,
  hasta,
  className,
}: {
  estado: EstadoVigencia
  hasta?: string | null
  className?: string
}) {
  const tono = tonoVigencia(estado)
  const Icono = tono === "pasado" ? HistoryIcon : CalendarClockIcon
  const texto =
    estado === "vigente" && hasta ? `Vigente hasta el ${fechaLarga(hasta)}` : ETIQUETA_VIGENCIA[estado]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs",
        tono === "ok" ? "text-muted-foreground" : "font-medium text-aviso-foreground",
        className
      )}
    >
      <Icono aria-hidden className="size-3.5 shrink-0" />
      {texto}
    </span>
  )
}
