import { useContext } from "react"
import { SaludContext } from "@/contexts/SaludContext"

export function useSalud() {
  const contexto = useContext(SaludContext)
  if (contexto === undefined) {
    throw new Error("useSalud debe usarse dentro de SaludProvider")
  }
  return contexto
}
