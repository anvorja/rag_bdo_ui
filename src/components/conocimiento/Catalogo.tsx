import { useDeferredValue, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon, FileTextIcon, RotateCwIcon, SearchIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InsigniaVigencia } from "@/components/comun/InsigniaVigencia"
import { useDocumentos, useFiltros } from "@/hooks/useDocumentos"
import { useVisor } from "@/hooks/useVisor"
import { ETIQUETA_VIGENCIA, humanizar, numero } from "@/lib/formato"
import { cn } from "@/lib/utils"
import type { EstadoVigencia } from "@/types/api"

const POR_PAGINA = 25
const TODOS = "__todos__"

type Clave = "segmento" | "area" | "estado"

export function Catalogo() {
  const { abrir, objetivo } = useVisor()
  const filtros = useFiltros()
  const [q, setQ] = useState("")
  const [sel, setSel] = useState<Partial<Record<Clave, string>>>({})
  const [historicos, setHistoricos] = useState(false)
  const [desde, setDesde] = useState(0)
  const qDiferida = useDeferredValue(q.trim())

  const lista = useDocumentos({
    q: qDiferida || undefined,
    segmento: sel.segmento,
    area: sel.area,
    estado: sel.estado,
    incluir_historicos: historicos || undefined,
    desde,
    limite: POR_PAGINA,
  })

  const cambiar = (clave: Clave, valor: string) => {
    setSel((s) => ({ ...s, [clave]: valor === TODOS ? undefined : valor }))
    setDesde(0)
  }
  const hayFiltros = !!(q || sel.segmento || sel.area || sel.estado || historicos)
  const total = lista.datos?.total ?? 0

  const selector = (clave: Clave, etiqueta: string) => {
    const opciones = filtros.datos?.[clave] ?? {}
    return (
      <Select value={sel[clave] ?? TODOS} onValueChange={(v) => cambiar(clave, v)}>
        <SelectTrigger aria-label={etiqueta} className="h-9 w-full bg-card sm:w-auto sm:min-w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TODOS}>{etiqueta}: todos</SelectItem>
          {Object.entries(opciones).map(([valor, n]) => (
            <SelectItem key={valor} value={valor}>
              {clave === "estado" ? ETIQUETA_VIGENCIA[valor as EstadoVigencia] ?? humanizar(valor) : humanizar(valor)}
              <span className="ml-auto pl-3 font-mono text-xs text-muted-foreground cifras">{numero(n)}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2 sm:flex sm:flex-wrap sm:items-center">
        <div className="relative sm:min-w-64 sm:flex-1">
          <SearchIcon aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <label htmlFor="catalogo-q" className="sr-only">
            Buscar por título
          </label>
          <Input
            id="catalogo-q"
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setDesde(0)
            }}
            placeholder="Buscar por título o descripción"
            className="h-9 bg-card pl-9"
          />
        </div>
        {selector("segmento", "Segmento")}
        {selector("area", "Área")}
        {selector("estado", "Vigencia")}
        <label className="inline-flex h-9 cursor-pointer items-center gap-2 text-[0.8125rem] text-muted-foreground select-none">
          <input
            type="checkbox"
            checked={historicos}
            onChange={(e) => {
              setHistoricos(e.target.checked)
              setDesde(0)
            }}
            className="size-4 accent-[var(--primary)]"
          />
          Incluir versiones anteriores
        </label>
        {hayFiltros && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQ("")
              setSel({})
              setHistoricos(false)
              setDesde(0)
            }}
          >
            <XIcon /> Limpiar
          </Button>
        )}
      </div>

      <p className="text-[0.8125rem] text-muted-foreground cifras" aria-live="polite">
        {lista.datos
          ? `${numero(total)} documentos${historicos ? "" : " (sin versiones anteriores)"}`
          : lista.cargando
            ? "Cargando documentos…"
            : ""}
      </p>

      {lista.error && (
        <div role="alert" className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">
          <span className="flex-1 text-destructive">{lista.error}</span>
          <Button variant="outline" size="sm" onClick={lista.reintentar}>
            <RotateCwIcon /> Reintentar
          </Button>
        </div>
      )}

      {lista.cargando && !lista.datos && (
        <div className="grid gap-px overflow-hidden rounded-xl border">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="bg-card px-4 py-3.5">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="mt-2 h-3 w-1/3" />
            </div>
          ))}
        </div>
      )}

      {lista.datos && total === 0 && (
        <div className="rounded-xl border border-dashed px-6 py-12 text-center">
          <p className="font-medium">No hay documentos con esos filtros</p>
          <p className="mt-1 text-sm text-muted-foreground">Prueba con otra palabra del título o quita algún filtro.</p>
        </div>
      )}

      {lista.datos && total > 0 && (
        <ul className="divide-y overflow-hidden rounded-xl border bg-card">
          {lista.datos.documentos.map((d) => {
            const abierto = objetivo?.docId === d.id
            return (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => abrir({ docId: d.id })}
                  aria-current={abierto || undefined}
                  className={cn(
                    "grid w-full grid-cols-[auto_minmax(0,1fr)] gap-x-3 px-4 py-3 text-left transition-colors duration-150 sm:grid-cols-[auto_minmax(0,1fr)_auto]",
                    "focus-visible:bg-accent focus-visible:outline-none",
                    abierto ? "bg-accent" : "hover:bg-muted/70"
                  )}
                >
                  <FileTextIcon aria-hidden className="mt-0.5 size-4 text-muted-foreground" />
                  <span className="min-w-0">
                    <span className="block truncate text-[0.875rem] font-semibold">{d.titulo}</span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {[humanizar(d.segmento), humanizar(d.area), d.tipo_contenido === "pdf" ? "PDF" : "Página web"]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </span>
                  <span className="col-start-2 mt-1 flex items-center gap-3 sm:col-start-3 sm:mt-0 sm:flex-col sm:items-end sm:gap-1">
                    {(d.estado_vigencia !== "vigente" || d.vigente_hasta) && (
                      <InsigniaVigencia estado={d.estado_vigencia} hasta={d.vigente_hasta} />
                    )}
                    <span className="font-mono text-[0.6875rem] text-muted-foreground cifras">Doc. {d.id}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {lista.datos && total > POR_PAGINA && (
        <nav aria-label="Paginación" className="flex items-center justify-between gap-3">
          <Button variant="outline" size="sm" disabled={desde === 0} onClick={() => setDesde((d) => Math.max(0, d - POR_PAGINA))}>
            <ChevronLeftIcon /> Anteriores
          </Button>
          <span className="text-[0.8125rem] text-muted-foreground cifras">
            {numero(desde + 1)} a {numero(Math.min(desde + POR_PAGINA, total))} de {numero(total)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={desde + POR_PAGINA >= total}
            onClick={() => setDesde((d) => d + POR_PAGINA)}
          >
            Siguientes <ChevronRightIcon />
          </Button>
        </nav>
      )}
    </div>
  )
}
