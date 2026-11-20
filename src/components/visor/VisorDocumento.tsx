import { useEffect, useRef, useState } from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ExternalLinkIcon, FileTextIcon, RotateCwIcon, TriangleAlertIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InsigniaVigencia } from "@/components/comun/InsigniaVigencia"
import { InsigniaAcceso } from "@/components/comun/InsigniaAcceso"
import { useDocumento, useFragmento } from "@/hooks/useDocumentos"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { useVisor } from "@/hooks/useVisor"
import { ETIQUETA_VIGENCIA, fechaLarga, humanizar, marcasDePagina, tonoVigencia } from "@/lib/formato"
import { cn } from "@/lib/utils"
import { mejorLinea } from "@/lib/citas"
import type { ObjetivoVisor } from "@/contexts/VisorContext"

const ANCHO_ACOPLADO = "(min-width: 1280px)"

/** Visor de la fuente. Acoplado a la derecha en pantallas anchas; panel deslizante en las demás. */
export function VisorDocumento() {
  const { objetivo, cerrar } = useVisor()
  const acoplado = useMediaQuery(ANCHO_ACOPLADO)

  if (acoplado) {
    if (!objetivo) return null
    return (
      <aside
        aria-label="Documento fuente"
        className="hidden h-full w-[min(34rem,42vw)] shrink-0 border-l bg-card animate-in duration-200 ease-salida fade-in-0 slide-in-from-right-4 xl:flex xl:flex-col"
      >
        <ContenidoVisor key={`${objetivo.docId}|${objetivo.fragmento}`} objetivo={objetivo} alCerrar={cerrar} />
      </aside>
    )
  }

  return (
    <Sheet open={!!objetivo} onOpenChange={(abierto) => !abierto && cerrar()}>
      <SheetContent side="right" showCloseButton={false} className="w-full gap-0 p-0 sm:max-w-xl">
        {objetivo && <ContenidoVisor key={`${objetivo.docId}|${objetivo.fragmento}`} objetivo={objetivo} alCerrar={cerrar} enPanel />}
      </SheetContent>
    </Sheet>
  )
}

function ContenidoVisor({
  objetivo,
  alCerrar,
  enPanel = false,
}: {
  objetivo: ObjetivoVisor
  alCerrar: () => void
  enPanel?: boolean
}) {
  const { abrir } = useVisor()
  const doc = useDocumento(objetivo.docId)
  const frag = useFragmento(objetivo.fragmento ?? null)
  const [pestana, setPestana] = useState(objetivo.fragmento ? "fragmento" : "documento")
  const d = doc.datos
  const Titulo = enPanel ? SheetTitle : "h2"

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-start gap-3 border-b px-5 pt-4 pb-3">
        <FileTextIcon aria-hidden className="mt-1 size-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          {d ? (
            <>
              <Titulo className="font-serif text-[1.0625rem] leading-snug font-semibold tracking-tight text-balance">
                {d.titulo}
              </Titulo>
              {enPanel && <SheetDescription className="sr-only">Documento fuente y fragmento citado</SheetDescription>}
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <InsigniaAcceso nivel="publico" />
                <InsigniaVigencia estado={d.estado_vigencia} hasta={d.vigente_hasta} />
                <span className="font-mono text-xs text-muted-foreground cifras">Doc. {d.id}</span>
              </div>
            </>
          ) : doc.error ? (
            <Titulo className="text-sm font-semibold">No se pudo abrir el documento</Titulo>
          ) : (
            <>
              {enPanel && <SheetTitle className="sr-only">Cargando documento</SheetTitle>}
              {enPanel && <SheetDescription className="sr-only">Cargando</SheetDescription>}
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="mt-2 h-4 w-1/2" />
            </>
          )}
        </div>
        <Button variant="ghost" size="icon-sm" onClick={alCerrar} aria-label="Cerrar documento" className="-mr-1">
          <XIcon />
        </Button>
      </div>

      {doc.error && (
        <div className="m-5 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <p className="text-destructive">{doc.error}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={doc.reintentar}>
            <RotateCwIcon /> Reintentar
          </Button>
        </div>
      )}

      {d && (
        <Tabs value={pestana} onValueChange={setPestana} className="flex min-h-0 flex-1 flex-col gap-0">
          <div className="flex items-center gap-2 border-b px-5 py-2">
            <TabsList className="h-8">
              {objetivo.fragmento && <TabsTrigger value="fragmento">Fragmento citado</TabsTrigger>}
              <TabsTrigger value="documento">Documento</TabsTrigger>
              <TabsTrigger value="versiones">
                Versiones{d.versiones.length > 1 ? ` (${d.versiones.length})` : ""}
              </TabsTrigger>
            </TabsList>
            <Button asChild variant="ghost" size="sm" className="ml-auto text-muted-foreground">
              <a href={d.url} target="_blank" rel="noreferrer">
                Original <ExternalLinkIcon aria-hidden />
              </a>
            </Button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {d.aviso && tonoVigencia(d.estado_vigencia) !== "ok" && (
              <p className="mx-5 mt-4 flex gap-2 rounded-lg border border-aviso-borde bg-aviso px-3 py-2 text-[0.8125rem] leading-relaxed text-aviso-foreground">
                <TriangleAlertIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
                {d.aviso}
              </p>
            )}

            {objetivo.fragmento && (
              <TabsContent value="fragmento" className="px-5 py-4">
                {frag.datos ? (
                  <>
                    <p className="text-xs text-muted-foreground">
                      {[
                        frag.datos.pagina != null && `Página ${frag.datos.pagina}`,
                        frag.datos.encabezado && `Sección «${frag.datos.encabezado}»`,
                      ]
                        .filter(Boolean)
                        .join(" · ") || "Fragmento del documento"}
                    </p>
                    <FragmentoResaltado texto={frag.datos.texto} referencia={objetivo.referencia ?? ""} />
                    <Button variant="link" size="sm" className="mt-2 px-0" onClick={() => setPestana("documento")}>
                      Ver el documento completo
                    </Button>
                  </>
                ) : frag.error ? (
                  <p className="text-sm text-destructive">{frag.error}</p>
                ) : (
                  <div className="grid gap-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-28 w-full" />
                  </div>
                )}
              </TabsContent>
            )}

            <TabsContent value="documento" className="px-5 py-4">
              <dl className="mb-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[0.8125rem]">
                {d.segmento && <Dato termino="Segmento" valor={humanizar(d.segmento)} />}
                {d.area && <Dato termino="Área" valor={humanizar(d.area)} />}
                {d.vigente_desde && <Dato termino="Vigente desde" valor={fechaLarga(d.vigente_desde)} />}
                {d.vigente_hasta && <Dato termino="Vigente hasta" valor={fechaLarga(d.vigente_hasta)} />}
                {d.paginas != null && <Dato termino="Páginas" valor={String(d.paginas)} />}
                {d.fecha_extraccion && <Dato termino="Capturado" valor={fechaLarga(d.fecha_extraccion)} />}
              </dl>
              <article className="documento">
                <Markdown remarkPlugins={[remarkGfm]}>{marcasDePagina(d.texto)}</Markdown>
              </article>
            </TabsContent>

            <TabsContent value="versiones" className="px-5 py-4">
              <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                Cuando el banco publica una versión nueva, la anterior se conserva como histórica con sus fechas.
              </p>
              <ol className="mt-4 grid gap-2">
                {d.versiones.map((v) => {
                  const actual = v.id === d.id
                  return (
                    <li key={v.id}>
                      <button
                        type="button"
                        disabled={actual}
                        onClick={() => abrir({ docId: v.id })}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                          actual ? "border-primary/40 bg-accent" : "hover:bg-muted"
                        )}
                      >
                        <span className="font-mono text-xs text-muted-foreground cifras">Doc. {v.id}</span>
                        <span className="text-sm font-medium">{ETIQUETA_VIGENCIA[v.estado_vigencia]}</span>
                        <span className="ml-auto text-xs text-muted-foreground cifras">
                          {[fechaLarga(v.vigente_desde), fechaLarga(v.vigente_hasta)].filter(Boolean).join(" al ") || "Sin fechas"}
                        </span>
                        {actual && <span className="sr-only">(abierta)</span>}
                      </button>
                    </li>
                  )
                })}
              </ol>
            </TabsContent>
          </div>
        </Tabs>
      )}

      {!d && !doc.error && (
        <div className="grid gap-3 p-5">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className={cn("h-4", i % 3 === 2 ? "w-2/3" : "w-full")} />
          ))}
        </div>
      )}
    </div>
  )
}

function Dato({ termino, valor }: { termino: string; valor: string }) {
  return (
    <>
      <dt className="text-muted-foreground">{termino}</dt>
      <dd className="min-w-0 cifras">{valor}</dd>
    </>
  )
}

/** Fragmento citado con la línea que respalda la respuesta (cifra y palabras en común) marcada y a la vista. */
function FragmentoResaltado({ texto, referencia }: { texto: string; referencia: string }) {
  const lineas = texto.trim().split("\n")
  const indicePrimera = mejorLinea(lineas, referencia)
  const primera = useRef<HTMLSpanElement>(null)
  const hay = indicePrimera >= 0

  useEffect(() => {
    primera.current?.scrollIntoView({ block: "center", behavior: "smooth" })
  }, [])

  return (
    <>
      {hay && (
        <p className="mt-1 text-xs text-muted-foreground">Resaltada: la línea que respalda la cifra de la respuesta.</p>
      )}
      <blockquote className="mt-2 rounded-lg border bg-muted/50 px-2 py-2 text-[0.875rem] leading-relaxed cifras">
        {lineas.map((l, i) => {
          const marcada = i === indicePrimera
          const ref = i === indicePrimera ? primera : undefined
          return (
            <span
              key={i}
              ref={ref}
              className={cn(
                "block rounded px-2 whitespace-pre-wrap",
                marcada && "bg-primary/12 font-medium text-foreground ring-1 ring-primary/25"
              )}
            >
              {l || "\u00a0"}
            </span>
          )
        })}
      </blockquote>
    </>
  )
}
