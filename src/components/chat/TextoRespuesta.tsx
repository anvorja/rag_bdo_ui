import { Fragment, useMemo } from "react"
import { segmentarCitas } from "@/lib/citas"
import { cn } from "@/lib/utils"

const URL = /(https?:\/\/[^\s)]+[^\s).,;:])/g

/** Texto plano con enlaces clicables (el backend pone el enlace de WhatsApp en algunas respuestas). */
function ConEnlaces({ texto }: { texto: string }) {
  const partes = texto.split(URL)
  return (
    <>
      {partes.map((p, i) =>
        i % 2 === 1 ? (
          <a key={i} href={p} target="_blank" rel="noreferrer" className="font-medium text-primary underline break-all">
            {/api\.whatsapp\.com|wa\.me/.test(p) ? "WhatsApp del banco" : p.replace(/^https?:\/\//, "")}
          </a>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        )
      )}
    </>
  )
}

/**
 * Respuesta con sus marcas [n] convertidas en botones. Pasar el cursor o enfocar una marca resalta su fuente;
 * activarla abre el visor en el fragmento citado.
 */
export function TextoRespuesta({
  texto,
  citasValidas,
  citaActiva,
  alResaltar,
  alAbrir,
}: {
  texto: string
  citasValidas: number[]
  citaActiva: number | null
  alResaltar: (n: number | null) => void
  alAbrir: (n: number) => void
}) {
  const segmentos = useMemo(() => segmentarCitas(texto, new Set(citasValidas)), [texto, citasValidas])

  return (
    <p className="text-[0.9375rem] leading-[1.7] text-pretty whitespace-pre-line">
      {segmentos.map((s, i) =>
        s.tipo === "texto" ? (
          <ConEnlaces key={i} texto={s.valor} />
        ) : (
          <button
            key={i}
            type="button"
            onMouseEnter={() => alResaltar(s.n)}
            onMouseLeave={() => alResaltar(null)}
            onFocus={() => alResaltar(s.n)}
            onBlur={() => alResaltar(null)}
            onClick={() => alAbrir(s.n)}
            aria-label={`Ver fuente ${s.n}`}
            className={cn(
              "mx-0.5 inline-flex h-[1.15rem] min-w-[1.15rem] -translate-y-px items-center justify-center rounded-[0.3rem] px-1 align-middle font-mono text-[0.6875rem] leading-none font-semibold transition-colors duration-150 cifras",
              "focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none",
              citaActiva === s.n
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
            )}
          >
            {s.n}
          </button>
        )
      )}
    </p>
  )
}
