import { useContext } from "react"
import { VisorContext } from "@/contexts/VisorContext"

export function useVisor() {
  const contexto = useContext(VisorContext)
  if (contexto === undefined) {
    throw new Error("useVisor debe usarse dentro de VisorProvider")
  }
  return contexto
}
