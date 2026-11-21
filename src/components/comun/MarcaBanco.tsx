import { cn } from "@/lib/utils"
import { entorno } from "@/config/entorno"

/** Nombre del banco (configurable) y rótulo del producto, como en los mockups. */
export function MarcaBanco({ className, conRotulo = true }: { className?: string; conRotulo?: boolean }) {
  return (
    <div className={cn("leading-none", className)}>
      <p className="font-serif text-[1.375rem] font-medium tracking-tight text-balance">{entorno.nombreBanco}</p>
      {conRotulo && (
        <p className="mt-1.5 text-[0.6875rem] font-semibold tracking-[0.14em] text-sidebar-primary uppercase">
          Asistente RAG
        </p>
      )}
    </div>
  )
}
