import { useContext } from "react"
import { ThemeContext } from "@/contexts/ThemeContext"

export function useTheme() {
  const contexto = useContext(ThemeContext)
  if (contexto === undefined) {
    throw new Error("useTheme debe usarse dentro de ThemeProvider")
  }
  return contexto
}
