import { ArrowUpRightIcon, CalendarCheckIcon, TriangleAlertIcon } from "lucide-react"
import { InsigniaAcceso } from "@/components/comun/InsigniaAcceso"
import { InsigniaVigencia } from "@/components/comun/InsigniaVigencia"
import { cn } from "@/lib/utils"
import { useFragmento } from "@/hooks/useDocumentos"
import { mejorLinea } from "@/lib/citas"
import type { Cita } from "@/types/api"

/** Avisos de vigencia que pone el código: van antes de las fuentes y no se pueden ocultar. */
export function AvisosVigencia({ avisos, atencion }: { avisos: string[]; atencion: boolean }) {
  if (!avisos.length) return null
  const Icono = atencion ? TriangleAlertIcon : CalendarCheckIcon
  return (
    <div
      role="note"
      className={cn(
        "grid gap-1.5 rounded-lg px-3.5 py-2.5",
        atencion ? "border border-aviso-borde bg-aviso text-aviso-foreground" : "bg-foreground/[0.04] text-muted-foreground"
      )}
    >
      {avisos.map((a) => (
        <p key={a} className="flex gap-2 text-[0.8125rem] leading-relaxed">
          <Icono aria-hidden className="mt-0.5 size-4 shrink-0" />
          {a}
        </p>
      ))}
    </div>
  )
}

export function ListaFuentes({
  citas,
  referencia,
  citaActiva,
  alResaltar,
  alAbrir,
}: {
  citas: Cita[]
  referencia: string
  citaActiva: number | null
  alResaltar: (n: number | null) => void
  alAbrir: (cita: Cita) => void
}) {
  if (!citas.length) return null
  return (
    <section aria-label="Fuentes">
      <h3 className="text-[0.6875rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">Fuentes</h3>
      <ol className="mt-2 grid gap-1.5">
        {citas.map((c) => {
          const activa = citaActiva === c.n
          const ubicacion = [c.pagina != null && `Pág. ${c.pagina}`, c.encabezado].filter(Boolean).join(" · ")
          return (
            <li key={c.n} className="group/fuente relative">
              <button
                type="button"
                onClick={() => alAbrir(c)}
                onMouseEnter={() => alResaltar(c.n)}
                onMouseLeave={() => alResaltar(null)}
                onFocus={() => alResaltar(c.n)}
                onBlur={() => alResaltar(null)}
                className={cn(
                  "grid w-full grid-cols-[1.5rem_minmax(0,1fr)] gap-x-2.5 rounded-lg px-2.5 py-2 pr-9 text-left transition-[background-color,box-shadow] duration-150",
                  "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                  activa ? "bg-foreground/[0.08] ring-1 ring-primary/35" : "bg-foreground/[0.04] hover:bg-foreground/[0.07]"
                )}
              >
                <span
                  className={cn(
                    "mt-px flex size-6 items-center justify-center rounded-md font-mono text-xs font-semibold cifras transition-colors",
                    activa ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
                  )}
                >
                  {c.n}
                </span>
                <span className="min-w-0">
                  <span className="flex items-start gap-2">
                    <span className="min-w-0 flex-1 text-[0.8125rem] leading-snug font-semibold text-pretty">{c.titulo}</span>
                    <InsigniaAcceso nivel="publico" className="mt-px" />
                  </span>
                  <Extracto fragmento={c.fragmento} referencia={referencia} />
                  <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                    <InsigniaVigencia estado={c.estado_vigencia} hasta={c.vigente_hasta} />
                    {ubicacion && <span className="truncate text-xs text-muted-foreground">{ubicacion}</span>}
                  </span>
                </span>
              </button>
              <a
                href={c.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Abrir el original de «${c.titulo}» en una pestaña nueva`}
                className="absolute top-2 right-1.5 inline-flex size-7 items-center justify-center rounded-md text-muted-foreground opacity-70 transition hover:bg-card hover:text-foreground hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <ArrowUpRightIcon className="size-4" />
              </a>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

/** La línea del fragmento que respalda la respuesta (cifra y palabras en común); si no hay, la primera con texto. */
function Extracto({ fragmento, referencia }: { fragmento: string; referencia: string }) {
  const { datos } = useFragmento(fragmento)
  const lineas =
    datos?.texto
      .split("\n")
      .map((l) => l.replace(/\s+/g, " ").trim())
      .filter((l) => l.replace(/[^\p{L}]/gu, "").length >= 4) ?? []
  const i = mejorLinea(lineas, referencia)
  const texto = i >= 0 ? lineas[i] : lineas[0]
  if (!texto) return <span aria-hidden className="mt-1 block h-4" />
  return <span className="mt-0.5 line-clamp-1 text-[0.8125rem] text-muted-foreground">{texto}</span>
}
