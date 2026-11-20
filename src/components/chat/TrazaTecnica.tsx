import { ChevronRightIcon } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { numero } from "@/lib/formato"
import type { Traza, ViaTurno } from "@/types/api"

const VIA: Record<ViaTurno, string> = {
  generador: "Respuesta generada y verificada",
  compuerta: "Frenada por la compuerta de suficiencia",
  verificador: "Bloqueada por el verificador",
  escalamiento_reglas: "Regla de quejas y fraude",
  cuenta_propia: "Regla de consulta de cuenta propia",
  limites: "Límite de uso",
}

/** Detalle técnico del turno, para evaluadores. Nunca muestra datos personales: solo tipos y cantidades. */
export function TrazaTecnica({ traza }: { traza: Traza }) {
  const enmascarados = Object.entries(traza.datos_enmascarados)
  const filas: [string, string][] = [
    ["Vía", traza.via ? VIA[traza.via] : "Sin dato"],
    ["Puntaje del mejor fragmento", traza.top1_rerank != null ? traza.top1_rerank.toFixed(3) : "No aplica"],
    ["Juez de suficiencia", traza.juez == null ? "No se consultó" : traza.juez ? "Hay información suficiente" : "Sin información suficiente"],
    ["Reintento del redactor", traza.reintento ? `Sí (${traza.problemas.join(", ") || "sin detalle"})` : "No"],
    ["Datos personales enmascarados", enmascarados.length ? enmascarados.map(([t, n]) => `${t} ×${n}`).join(", ") : "Ninguno"],
    ["Tiempo", traza.segundos != null ? `${traza.segundos.toLocaleString("es-CO")} s` : "Sin dato"],
    ["Tokens del redactor", numero(traza.tokens_generador)],
  ]
  return (
    <Collapsible>
      <CollapsibleTrigger className="group/traza inline-flex items-center gap-1 rounded-md text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none">
        <ChevronRightIcon aria-hidden className="size-3.5 transition-transform duration-200 group-data-[state=open]/traza:rotate-90" />
        Detalles técnicos
        {traza.alerta_sesion && <span className="ml-1 text-aviso-foreground">· sesión con varias abstenciones seguidas</span>}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <dl className="mt-2 grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] gap-x-4 gap-y-1 rounded-lg bg-muted/60 px-3.5 py-2.5 text-xs">
          {filas.map(([t, v]) => (
            <div key={t} className="contents">
              <dt className="text-muted-foreground">{t}</dt>
              <dd className="font-mono cifras">{v}</dd>
            </div>
          ))}
        </dl>
      </CollapsibleContent>
    </Collapsible>
  )
}
