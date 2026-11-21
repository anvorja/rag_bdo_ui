import { useId, useState } from "react"
import { CheckIcon, Loader2Icon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useChat } from "@/hooks/useChat"
import { cn } from "@/lib/utils"
import type { Turno, ValoracionLocal } from "@/contexts/ChatContext"

type Correcta = NonNullable<ValoracionLocal["correcta"]>

const OPCIONES_CORRECTA: { valor: Correcta; texto: string }[] = [
  { valor: "si", texto: "Sí" },
  { valor: "parcial", texto: "En parte" },
  { valor: "no", texto: "No" },
]

function Segmento({
  activo,
  onClick,
  children,
  etiqueta,
}: {
  activo: boolean
  onClick: () => void
  children: React.ReactNode
  etiqueta?: string
}) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      aria-label={etiqueta}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[0.8125rem] font-medium transition-colors duration-150",
        "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
        activo ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}

function Estado({ v }: { v?: ValoracionLocal }) {
  if (!v) return null
  if (v.estado === "enviando")
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Loader2Icon className="size-3 animate-spin" /> Guardando
      </span>
    )
  if (v.estado === "error") return <span className="text-xs text-destructive">No se guardó. Intenta de nuevo.</span>
  return (
    <span className="inline-flex items-center gap-1 text-xs text-exito">
      <CheckIcon className="size-3.5" /> Guardada
    </span>
  )
}

/** Valoración de un turno. Cliente: útil sí/no. Empleado y admin: útil, correcta y comentario. */
export function Valoracion({ turno, completa }: { turno: Turno; completa: boolean }) {
  const { valorar } = useChat()
  const v = turno.valoracion
  const [comentario, setComentario] = useState(v?.comentario ?? "")
  const id = useId()
  const pendienteComentario = comentario.trim() !== (v?.comentario ?? "").trim()

  const util = (
    <div className="flex items-center gap-1" role="group" aria-label="¿Te sirvió esta respuesta?">
      <span className="mr-1 text-xs text-muted-foreground">¿Te sirvió?</span>
      <Segmento activo={v?.util === true} onClick={() => valorar(turno.id, { util: true })} etiqueta="Sí, me sirvió">
        <ThumbsUpIcon className="size-3.5" />
      </Segmento>
      <Segmento activo={v?.util === false} onClick={() => valorar(turno.id, { util: false })} etiqueta="No me sirvió">
        <ThumbsDownIcon className="size-3.5" />
      </Segmento>
    </div>
  )

  if (!completa)
    return (
      <div className="flex flex-wrap items-center gap-3">
        {util}
        <Estado v={v} />
      </div>
    )

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {util}
        <div className="flex items-center gap-1" role="group" aria-label="¿La respuesta es correcta?">
          <span className="mr-1 text-xs text-muted-foreground">¿Es correcta?</span>
          {OPCIONES_CORRECTA.map((o) => (
            <Segmento key={o.valor} activo={v?.correcta === o.valor} onClick={() => valorar(turno.id, { correcta: o.valor })}>
              {o.texto}
            </Segmento>
          ))}
        </div>
        <span className="ml-auto">
          <Estado v={v} />
        </span>
      </div>
      <form
        className="flex flex-col gap-2 sm:flex-row sm:items-end"
        onSubmit={(e) => {
          e.preventDefault()
          if (pendienteComentario) void valorar(turno.id, { comentario })
        }}
      >
        <label htmlFor={`${id}-comentario`} className="sr-only">
          Comentario sobre esta respuesta
        </label>
        <Textarea
          id={`${id}-comentario`}
          value={comentario}
          maxLength={1000}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Comentario para el equipo (opcional)"
          className="min-h-9 flex-1 resize-none bg-card text-[0.8125rem]"
          rows={1}
        />
        <Button type="submit" variant="outline" size="sm" disabled={!pendienteComentario} className="h-9">
          Guardar comentario
        </Button>
      </form>
    </div>
  )
}
