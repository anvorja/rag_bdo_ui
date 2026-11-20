import { useEffect, useRef } from "react"
import { Compositor } from "@/components/chat/Compositor"
import { PanelBienvenida } from "@/components/chat/PanelBienvenida"
import { Turno } from "@/components/chat/Turno"
import { useChat } from "@/hooks/useChat"

export default function Consultar() {
  const { turnos } = useChat()
  const ultimo = useRef<HTMLLIElement>(null)
  const cantidad = turnos.length

  // Al enviar una pregunta, se lleva al inicio del turno nuevo (se lee la respuesta desde arriba).
  useEffect(() => {
    const li = ultimo.current
    const contenedor = li?.closest("main")
    if (!cantidad || !li || !contenedor) return
    // Solo se desplaza <main> (scrollIntoView movería también el armazón).
    const destino = li.getBoundingClientRect().top - contenedor.getBoundingClientRect().top + contenedor.scrollTop - 16
    contenedor.scrollTo({ top: destino, behavior: "smooth" })
  }, [cantidad])

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1">
        {cantidad === 0 ? (
          <PanelBienvenida />
        ) : (
          <ol
            role="log"
            aria-live="polite"
            aria-label="Conversación"
            className="mx-auto grid w-full max-w-[47.5rem] gap-8 px-4 pt-6 pb-10 sm:px-6"
          >
            {turnos.map((t, i) => (
              <li key={t.id} ref={i === cantidad - 1 ? ultimo : undefined}>
                <Turno turno={t} />
              </li>
            ))}
          </ol>
        )}
      </div>
      <Compositor />
    </div>
  )
}
