import { useRef, useState, type FormEvent, type KeyboardEvent } from "react"
import { ArrowUpIcon, Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useChat } from "@/hooks/useChat"
import { cn } from "@/lib/utils"

/** El backend rechaza mensajes de más de 600 caracteres (límite anti-abuso). */
const MAXIMO = 600
const AVISAR_DESDE = 480

export function Compositor() {
  const { enviar, ocupado, consentimiento, sesion } = useChat()
  const [texto, setTexto] = useState("")
  const area = useRef<HTMLTextAreaElement>(null)
  const habilitado = consentimiento === "aceptado" && sesion === "lista"
  const puedeEnviar = habilitado && !ocupado && texto.trim().length > 0 && texto.length <= MAXIMO

  const motivo =
    sesion === "error"
      ? "Sin conexión con el asistente"
      : consentimiento === "pendiente"
        ? "Acepta el aviso de arriba para empezar"
        : consentimiento === "rechazado"
          ? "Necesitamos tu autorización para responder"
          : "Escribe tu pregunta…"

  async function alEnviar(e?: FormEvent) {
    e?.preventDefault()
    if (!puedeEnviar) return
    const pregunta = texto
    setTexto("")
    await enviar(pregunta)
    area.current?.focus()
  }

  function alPulsar(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      void alEnviar()
    }
  }

  return (
    <div className="sticky bottom-0 z-10 border-t bg-background/92 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm supports-[backdrop-filter]:bg-background/80 sm:px-6">
      <form onSubmit={alEnviar} className="mx-auto flex w-full max-w-[47.5rem] items-end gap-2">
        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col rounded-xl border bg-card shadow-[0_1px_2px_oklch(0.3_0.03_158/0.06)] transition-[border-color,box-shadow] duration-150",
            "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/25",
            !habilitado && "opacity-70"
          )}
        >
          <label htmlFor="compositor" className="sr-only">
            Tu pregunta
          </label>
          <textarea
            id="compositor"
            ref={area}
            rows={1}
            value={texto}
            disabled={!habilitado}
            maxLength={MAXIMO + 200}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={alPulsar}
            placeholder={motivo}
            aria-describedby="compositor-ayuda"
            className="field-sizing-content max-h-40 min-h-12 w-full resize-none bg-transparent px-4 py-3 text-[0.9375rem] leading-relaxed outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          />
          {texto.length >= AVISAR_DESDE && (
            <p
              className={cn(
                "px-4 pb-2 text-right font-mono text-xs cifras",
                texto.length > MAXIMO ? "text-destructive" : "text-muted-foreground"
              )}
              aria-live="polite"
            >
              {texto.length}/{MAXIMO}
              {texto.length > MAXIMO && " · acorta la pregunta"}
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={!puedeEnviar}
          className="h-12 shrink-0 gap-2 rounded-xl px-4 text-[0.9375rem] font-semibold sm:px-5"
        >
          {ocupado ? <Loader2Icon className="animate-spin" aria-hidden /> : <ArrowUpIcon aria-hidden className="sm:hidden" />}
          <span className="max-sm:sr-only">{ocupado ? "Respondiendo" : "Enviar"}</span>
        </Button>
      </form>
      <p id="compositor-ayuda" className="mx-auto mt-1.5 max-w-[47.5rem] text-center text-[0.75rem] text-muted-foreground max-sm:hidden">
        Enter para enviar · Shift + Enter para una línea nueva · Las respuestas citan la documentación pública del banco.
      </p>
    </div>
  )
}
