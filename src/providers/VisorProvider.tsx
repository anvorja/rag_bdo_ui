import { useCallback, useMemo, useState, type ReactNode } from "react"
import { VisorContext, type ObjetivoVisor } from "@/contexts/VisorContext"

export function VisorProvider({ children }: { children: ReactNode }) {
  const [objetivo, setObjetivo] = useState<ObjetivoVisor | null>(null)
  const abrir = useCallback((o: ObjetivoVisor) => setObjetivo(o), [])
  const cerrar = useCallback(() => setObjetivo(null), [])
  const valor = useMemo(() => ({ objetivo, abrir, cerrar }), [objetivo, abrir, cerrar])
  return <VisorContext.Provider value={valor}>{children}</VisorContext.Provider>
}
