import { useState } from "react"
import { CircleHelpIcon, HeadsetIcon, InfoIcon, RotateCwIcon, ShieldAlertIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/useAuth"
import { useChat } from "@/hooks/useChat"
import { useVisor } from "@/hooks/useVisor"
import { cn } from "@/lib/utils"
import { tonoVigencia } from "@/lib/formato"
import type { Turno as TipoTurno } from "@/contexts/ChatContext"
import type { Accion, Cita } from "@/types/api"
import { AvisosVigencia, ListaFuentes } from "./ListaFuentes"
import { TextoRespuesta } from "./TextoRespuesta"
import { TrazaTecnica } from "./TrazaTecnica"
import { Valoracion } from "./Valoracion"

const MARCO: Record<Exclude<Accion, "responder">, { icono: typeof InfoIcon; titulo: string; clase: string }> = {
  escalar: { icono: HeadsetIcon, titulo: "Te remitimos a un canal de atención", clase: "border-primary/25 bg-accent/60" },
  abstenerse: { icono: InfoIcon, titulo: "No encontré información confiable para responder", clase: "border-border bg-muted/50" },
  aclarar: { icono: CircleHelpIcon, titulo: "Necesito un dato más", clase: "border-aviso-borde bg-aviso/60" },
}

function PreguntaUsuario({ texto }: { texto: string }) {
  return (
    <div className="flex justify-end">
      <p className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-[0.9375rem] leading-relaxed text-pretty whitespace-pre-line text-primary-foreground sm:max-w-[75%]">
        {texto}
      </p>
    </div>
  )
}

function Cargando() {
  return (
    <div className="rounded-2xl border bg-card px-5 py-4" aria-busy>
      <p className="text-[0.8125rem] text-muted-foreground" role="status">
        Buscando en la documentación oficial…
      </p>
      <div className="mt-3 grid gap-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-[92%]" />
        <Skeleton className="h-3.5 w-3/5" />
      </div>
      <div className="mt-5 grid gap-1.5">
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
    </div>
  )
}

export function Turno({ turno }: { turno: TipoTurno }) {
  const { usuario } = useAuth()
  const { reintentar, ocupado } = useChat()
  const { abrir } = useVisor()
  const [citaActiva, setCitaActiva] = useState<number | null>(null)
  const permisos = usuario?.permisos

  const referencia = turno.respuesta?.respuesta ?? ""
  const abrirCita = (c: Cita) => abrir({ docId: c.doc_id, fragmento: c.fragmento, referencia })

  return (
    <article className="grid gap-3 animate-in duration-200 ease-salida fade-in-0 slide-in-from-bottom-1">
      <PreguntaUsuario texto={turno.pregunta} />

      {turno.estado === "cargando" && <Cargando />}

      {turno.estado === "error" && (
        <div role="alert" className="flex flex-wrap items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-4">
          <ShieldAlertIcon aria-hidden className="size-5 shrink-0 text-destructive" />
          <p className="min-w-0 flex-1 text-sm text-pretty">{turno.error}</p>
          <Button variant="outline" size="sm" onClick={() => reintentar(turno.id)} disabled={ocupado}>
            <RotateCwIcon /> Reintentar
          </Button>
        </div>
      )}

      {turno.estado === "listo" && turno.respuesta && (
        <div
          className={cn(
            "grid gap-4 rounded-2xl border bg-card px-5 py-4 shadow-[0_1px_2px_oklch(0.3_0.03_158/0.05)]",
            turno.respuesta.accion !== "responder" && MARCO[turno.respuesta.accion].clase
          )}
        >
          {turno.respuesta.accion !== "responder" && (
            <p className="flex items-center gap-2 text-[0.8125rem] font-semibold">
              {(() => {
                const Icono = MARCO[turno.respuesta.accion].icono
                return <Icono aria-hidden className="size-4 shrink-0" />
              })()}
              {MARCO[turno.respuesta.accion].titulo}
            </p>
          )}

          <AvisosVigencia
            avisos={turno.respuesta.avisos}
            atencion={turno.respuesta.citas.some((c) => tonoVigencia(c.estado_vigencia) !== "ok")}
          />

          <TextoRespuesta
            texto={turno.respuesta.respuesta}
            citasValidas={turno.respuesta.citas.map((c) => c.n)}
            citaActiva={citaActiva}
            alResaltar={setCitaActiva}
            alAbrir={(n) => {
              const c = turno.respuesta?.citas.find((x) => x.n === n)
              if (c) abrirCita(c)
            }}
          />

          <ListaFuentes
            citas={turno.respuesta.citas}
            referencia={referencia}
            citaActiva={citaActiva}
            alResaltar={setCitaActiva}
            alAbrir={abrirCita}
          />

          {permisos?.verTraza && <TrazaTecnica traza={turno.respuesta.traza} />}

          {permisos && (
            <div className="border-t pt-3">
              <Valoracion turno={turno} completa={permisos.valoracion === "completa"} />
            </div>
          )}
        </div>
      )}
    </article>
  )
}
