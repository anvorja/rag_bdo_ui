import { createContext } from "react"

export type Tema = "claro" | "oscuro" | "sistema"
export type TemaResuelto = "claro" | "oscuro"

export interface ThemeContextValue {
  tema: Tema
  temaResuelto: TemaResuelto
  setTema: (tema: Tema) => void
  alternarTema: () => void
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
