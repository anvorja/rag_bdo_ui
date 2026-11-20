import { useState } from "react"
import { ArrowRightIcon, CloudOffIcon, Loader2Icon, MessageSquareTextIcon, ShieldCheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/useAuth"
import { useChat } from "@/hooks/useChat"
import type { Perfil } from "@/types/auth"

/**
 * Preguntas sugeridas por perfil, probadas contra la API el 2026-11-20. Los evaluadores reciben casos
 * que muestran cada comportamiento: responder, dato histórico con su aviso, remitir y rechazar temas ajenos.
 */
const SUGERENCIAS: Record<Perfil, string[]> = {
  cliente: [
    "¿Cuánto cuesta un retiro en corresponsal bancario?",
    "¿Qué necesito para abrir una cuenta de ahorros?",
    "¿Cuánto cobra la comisión de la pasarela Shopify?",
    "¿Qué canales de atención tiene el banco?",
  ],
  empleado: [
    "¿Cuánto cuesta un retiro en corresponsal bancario?",
    "¿Cuál era la tasa de interés de las tarjetas de crédito para personas en septiembre de 2026?",
    "¿Cuánto debo en mi tarjeta de crédito?",
    "Me clonaron la tarjeta y no reconozco una compra",
  ],
  admin: [
    "¿Cuánto cuesta un retiro en corresponsal bancario?",
    "¿Cuál era la tasa de interés de las tarjetas de crédito para personas en septiembre de 2026?",
    "¿Cuánto debo en mi tarjeta de crédito?",
    "Escríbeme un programa en Python",
  ],
}

export function Consentimiento() {
  const { avisoInicio, textoConsentimiento, consentimiento, responder } = useChat()
  const [enviando, setEnviando] = useState<null | boolean>(null)
  const [error, setError] = useState<string | null>(null)

  async function elegir(acepta: boolean) {
    setEnviando(acepta)
    setError(null)
    try {
      await responder(acepta)
    } catch {
      setError("No se pudo registrar tu respuesta. Intenta de nuevo.")
    } finally {
      setEnviando(null)
    }
  }

  return (
    <section
      aria-labelledby="aviso-titulo"
      className="rounded-2xl border bg-card px-5 py-5 shadow-[0_1px_2px_oklch(0.3_0.03_158/0.05)] sm:px-6"
    >
      <h2 id="aviso-titulo" className="flex items-center gap-2 text-[0.9375rem] font-semibold">
        <ShieldCheckIcon aria-hidden className="size-4.5 text-primary" />
        Antes de empezar
      </h2>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-pretty">{avisoInicio}</p>
      <p className="mt-3 text-[0.875rem] leading-relaxed text-pretty text-muted-foreground">{textoConsentimiento}</p>
      {consentimiento === "rechazado" && (
        <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-[0.8125rem] leading-relaxed">
          Sin tu autorización no podemos procesar preguntas. Puedes cambiar de opinión cuando quieras, o escribirnos por
          los canales oficiales del banco.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 text-[0.8125rem] text-destructive">
          {error}
        </p>
      )}
      <div className="mt-5 flex flex-wrap gap-2">
        <Button onClick={() => elegir(true)} disabled={enviando !== null} className="h-10 px-4 font-semibold">
          {enviando === true && <Loader2Icon className="animate-spin" aria-hidden />}
          Acepto y continuar
        </Button>
        {consentimiento !== "rechazado" && (
          <Button variant="ghost" onClick={() => elegir(false)} disabled={enviando !== null} className="h-10 px-4">
            No acepto
          </Button>
        )}
      </div>
    </section>
  )
}

export function PanelBienvenida() {
  const { usuario } = useAuth()
  const { sesion, errorSesion, consentimiento, enviar, ocupado, nuevaConsulta } = useChat()
  const perfil = usuario?.perfil ?? "cliente"

  return (
    <div className="mx-auto w-full max-w-[47.5rem] px-4 pt-10 pb-8 sm:px-6 sm:pt-16">
      <h2 className="font-serif text-[2rem] leading-tight font-medium tracking-tight sm:text-[2.5rem]">
        Hola, {usuario?.nombre}
      </h2>
      <p className="mt-1.5 text-[1.0625rem] text-muted-foreground">¿Qué necesitas saber hoy?</p>

      <div className="mt-8">
        {sesion === "abriendo" && (
          <div className="rounded-2xl border bg-card p-6" aria-busy>
            <Skeleton className="h-4 w-40" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-4/5" />
            <Skeleton className="mt-6 h-10 w-44 rounded-lg" />
          </div>
        )}

        {sesion === "error" && (
          <div role="alert" className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
            <p className="flex items-center gap-2 font-semibold">
              <CloudOffIcon aria-hidden className="size-4.5 text-destructive" />
              No pudimos conectar con el asistente
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{errorSesion}</p>
            <Button variant="outline" className="mt-4" onClick={() => void nuevaConsulta()}>
              Reintentar
            </Button>
          </div>
        )}

        {sesion === "lista" && consentimiento !== "aceptado" && <Consentimiento />}

        {sesion === "lista" && consentimiento === "aceptado" && (
          <section aria-labelledby="sugerencias-titulo">
            <h3 id="sugerencias-titulo" className="text-sm font-medium text-muted-foreground">
              Puedes empezar con una de estas preguntas
            </h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {SUGERENCIAS[perfil].map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    disabled={ocupado}
                    onClick={() => void enviar(s)}
                    className="group flex h-full w-full items-start gap-3 rounded-xl border bg-card px-4 py-3.5 text-left text-[0.875rem] leading-snug transition-[background-color,border-color,transform] duration-150 ease-salida hover:border-primary/40 hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none active:scale-[0.99]"
                  >
                    <MessageSquareTextIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                    <span className="flex-1 text-pretty">{s}</span>
                    <ArrowRightIcon aria-hidden className="mt-0.5 size-4 shrink-0 -translate-x-1 opacity-0 transition duration-150 group-hover:translate-x-0 group-hover:opacity-100" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
