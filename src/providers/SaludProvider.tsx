import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { SaludContext, type EstadoServicio } from "@/contexts/SaludContext"
import { api } from "@/services/api"
import type { Salud } from "@/types/api"

const INTERVALO_MS = 60_000

export function SaludProvider({ children }: { children: ReactNode }) {
  const [salud, setSalud] = useState<Salud | null>(null)
  const [estado, setEstado] = useState<EstadoServicio>("verificando")

  const verificar = useCallback(async () => {
    try {
      const s = await api.salud()
      setSalud(s)
      setEstado(s.estado === "ok" ? "en_linea" : "degradado")
    } catch {
      setEstado("sin_conexion")
    }
  }, [])

  useEffect(() => {
    // Primera verificación diferida al siguiente ciclo para no actualizar estado durante el montaje.
    const inicial = window.setTimeout(verificar, 0)
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") void verificar()
    }, INTERVALO_MS)
    return () => {
      window.clearTimeout(inicial)
      window.clearInterval(id)
    }
  }, [verificar])

  const valor = useMemo(() => ({ salud, estado, verificar }), [salud, estado, verificar])
  return <SaludContext.Provider value={valor}>{children}</SaludContext.Provider>
}
