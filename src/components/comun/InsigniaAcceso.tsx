import { cn } from "@/lib/utils"
import type { NivelAcceso } from "@/types/auth"

const ESTILO: Record<NivelAcceso, string> = {
  publico: "bg-publico text-publico-foreground",
  interno: "bg-interno text-interno-foreground",
  confidencial: "bg-confidencial text-confidencial-foreground",
}

export const ETIQUETA_NIVEL: Record<NivelAcceso, string> = {
  publico: "Público",
  interno: "Interno",
  confidencial: "Confidencial",
}

export function InsigniaAcceso({ nivel, className }: { nivel: NivelAcceso; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center rounded-full px-2 text-[0.6875rem] font-semibold",
        ESTILO[nivel],
        className
      )}
    >
      {ETIQUETA_NIVEL[nivel]}
    </span>
  )
}
