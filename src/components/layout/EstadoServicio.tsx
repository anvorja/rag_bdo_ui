import { CircleAlertIcon, CloudOffIcon, Loader2Icon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/hooks/useAuth"
import { useSalud } from "@/hooks/useSalud"
import { numero } from "@/lib/formato"

/** Solo aparece cuando hay algo que decir: verificando, sin conexión o con limitaciones. El administrador ve el detalle. */
export function EstadoServicio() {
  const { estado, salud, verificar } = useSalud()
  const { usuario } = useAuth()
  if (estado === "en_linea" && !usuario?.permisos.baseConocimiento) return null

  const contenido = {
    verificando: { icono: <Loader2Icon className="size-3.5 animate-spin" />, texto: "Conectando", clase: "text-muted-foreground" },
    en_linea: { icono: null, texto: "En línea", clase: "text-exito" },
    degradado: { icono: <CircleAlertIcon className="size-3.5" />, texto: "Con limitaciones", clase: "text-aviso-foreground" },
    sin_conexion: { icono: <CloudOffIcon className="size-3.5" />, texto: "Sin conexión", clase: "text-destructive" },
  }[estado]

  const detalle =
    estado === "sin_conexion"
      ? "No responde la API del asistente. Clic para reintentar."
      : salud
        ? [
            `${numero(salud.documentos_indexables)} documentos`,
            `LLM: ${salud.llm_proveedor}${salud.llm_modelo ? ` (${salud.llm_modelo})` : ""}${salud.llm_listo ? "" : ", se carga con la primera consulta"}`,
            `Reranker: ${salud.reranker}`,
            salud.faltan_variables.length ? `Falta configurar: ${salud.faltan_variables.join(", ")}` : null,
            salud.llm_error ? `Último error: ${salud.llm_error}` : null,
          ]
            .filter(Boolean)
            .join(" · ")
        : "Verificando el servicio"

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => void verificar()}
          className={`inline-flex h-7 items-center gap-1.5 rounded-full px-2 text-xs font-medium transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none ${contenido.clase}`}
        >
          {contenido.icono}
          {contenido.texto}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" align="end" className="max-w-xs text-pretty">
        {detalle}
      </TooltipContent>
    </Tooltip>
  )
}
