import { useState, type FormEvent } from "react"
import { Loader2Icon, SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Consentimiento } from "@/components/chat/PanelBienvenida"
import { InsigniaVigencia } from "@/components/comun/InsigniaVigencia"
import { useChat } from "@/hooks/useChat"
import { useVisor } from "@/hooks/useVisor"
import { ErrorApi } from "@/services/api"
import { cn } from "@/lib/utils"
import type { RespuestaBuscar } from "@/types/api"

/**
 * Búsqueda en las fuentes con la misma recuperación del asistente (híbrida + reranker), sin LLM.
 * Sirve para comprobar qué encontraría el asistente para una pregunta.
 */
export function BusquedaFuentes() {
  const { buscar, consentimiento, sesion } = useChat()
  const { abrir, objetivo } = useVisor()
  const [consulta, setConsulta] = useState("")
  const [estado, setEstado] = useState<"inicial" | "buscando" | "listo" | "error">("inicial")
  const [resultado, setResultado] = useState<RespuestaBuscar | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (sesion === "lista" && consentimiento !== "aceptado") return <Consentimiento />

  async function alBuscar(e: FormEvent) {
    e.preventDefault()
    const texto = consulta.trim()
    if (!texto) return
    setEstado("buscando")
    setError(null)
    try {
      setResultado(await buscar(texto, 10))
      setEstado("listo")
    } catch (err) {
      setError(err instanceof ErrorApi ? err.message : "No se pudo buscar.")
      setEstado("error")
    }
  }

  return (
    <div className="grid gap-4">
      <form onSubmit={alBuscar} className="flex gap-2" role="search">
        <div className="relative flex-1">
          <SearchIcon aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <label htmlFor="busqueda-fuentes" className="sr-only">
            Pregunta o tema
          </label>
          <Input
            id="busqueda-fuentes"
            value={consulta}
            maxLength={600}
            onChange={(e) => setConsulta(e.target.value)}
            placeholder="Escribe una pregunta como la haría un cliente"
            className="h-10 bg-card pl-9"
          />
        </div>
        <Button type="submit" className="h-10 px-4 font-semibold" disabled={estado === "buscando" || !consulta.trim()}>
          {estado === "buscando" && <Loader2Icon className="animate-spin" aria-hidden />}
          Buscar
        </Button>
      </form>

      {estado === "inicial" && (
        <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
          Muestra los fragmentos que el asistente tendría a mano para esa pregunta, ordenados por relevancia (0 a 1).
          Por encima de 0,76 el asistente suele considerar que hay información suficiente.
        </p>
      )}

      {error && (
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {estado === "buscando" && (
        <div className="grid gap-2" aria-busy>
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      )}

      {estado === "listo" && resultado && (
        <>
          {resultado.consulta_enmascarada !== consulta.trim() && (
            <p className="text-xs text-muted-foreground">
              Consulta enviada (con datos personales enmascarados): «{resultado.consulta_enmascarada}»
            </p>
          )}
          {resultado.resultados.length === 0 ? (
            <p className="rounded-xl border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
              No se encontraron fragmentos para esa consulta.
            </p>
          ) : (
            <ol className="grid gap-2">
              {resultado.resultados.map((r, i) => {
                const abierto = objetivo?.fragmento === r.fragmento
                const alto = r.puntaje >= 0.7617
                return (
                  <li key={r.fragmento}>
                    <button
                      type="button"
                      onClick={() => abrir({ docId: r.doc_id, fragmento: r.fragmento })}
                      className={cn(
                        "grid w-full grid-cols-[3.25rem_minmax(0,1fr)] gap-x-3 rounded-xl border bg-card px-4 py-3 text-left transition-colors duration-150",
                        "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                        abierto ? "border-primary/40 bg-accent" : "hover:bg-muted/60"
                      )}
                    >
                      <span className="flex flex-col items-start">
                        <span className={cn("font-mono text-[0.9375rem] font-semibold cifras", alto ? "text-primary" : "text-muted-foreground")}>
                          {r.puntaje.toFixed(2)}
                        </span>
                        <span className="text-[0.6875rem] text-muted-foreground">#{i + 1}</span>
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[0.875rem] font-semibold text-pretty">{r.titulo}</span>
                        <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                          <InsigniaVigencia estado={r.estado_vigencia} hasta={r.vigente_hasta} />
                          <span className="text-xs text-muted-foreground">
                            {[r.pagina != null && `Pág. ${r.pagina}`, r.encabezado, `Doc. ${r.doc_id}`].filter(Boolean).join(" · ")}
                          </span>
                        </span>
                        <span className="mt-2 line-clamp-3 text-[0.8125rem] leading-relaxed text-muted-foreground">{r.texto}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          )}
        </>
      )}
    </div>
  )
}
