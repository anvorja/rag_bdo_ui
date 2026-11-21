import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { ThemeContext, type Tema, type TemaResuelto } from "@/contexts/ThemeContext"

const CONSULTA_OSCURO = "(prefers-color-scheme: dark)"
const CLAVE = "panel-rag.tema"
const TEMAS: Tema[] = ["claro", "oscuro", "sistema"]

function leerTema(): Tema {
  try {
    const guardado = localStorage.getItem(CLAVE)
    if (guardado && TEMAS.includes(guardado as Tema)) return guardado as Tema
  } catch {
    /* almacenamiento bloqueado */
  }
  return "sistema"
}

const temaDelSistema = (): TemaResuelto =>
  window.matchMedia(CONSULTA_OSCURO).matches ? "oscuro" : "claro"

/** Evita que todo el panel anime sus colores al cambiar de tema. */
function sinTransiciones() {
  const estilo = document.createElement("style")
  estilo.appendChild(document.createTextNode("*,*::before,*::after{transition:none!important}"))
  document.head.appendChild(estilo)
  return () => {
    window.getComputedStyle(document.body)
    requestAnimationFrame(() => requestAnimationFrame(() => estilo.remove()))
  }
}

function esEditable(objetivo: EventTarget | null) {
  return (
    objetivo instanceof HTMLElement &&
    (objetivo.isContentEditable || !!objetivo.closest("input, textarea, select, [contenteditable='true']"))
  )
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [tema, setTemaEstado] = useState<Tema>(leerTema)
  const [sistema, setSistema] = useState<TemaResuelto>(temaDelSistema)
  const temaResuelto: TemaResuelto = tema === "sistema" ? sistema : tema

  const setTema = useCallback((nuevo: Tema) => {
    try {
      localStorage.setItem(CLAVE, nuevo)
    } catch {
      /* sin persistencia */
    }
    setTemaEstado(nuevo)
  }, [])

  const alternarTema = useCallback(() => {
    setTema(temaResuelto === "oscuro" ? "claro" : "oscuro")
  }, [setTema, temaResuelto])

  useEffect(() => {
    const consulta = window.matchMedia(CONSULTA_OSCURO)
    const alCambiar = () => setSistema(consulta.matches ? "oscuro" : "claro")
    consulta.addEventListener("change", alCambiar)
    return () => consulta.removeEventListener("change", alCambiar)
  }, [])

  useEffect(() => {
    const restaurar = sinTransiciones()
    const raiz = document.documentElement
    raiz.classList.toggle("dark", temaResuelto === "oscuro")
    raiz.style.colorScheme = temaResuelto === "oscuro" ? "dark" : "light"
    restaurar()
  }, [temaResuelto])

  // Atajo de teclado: «D» alterna el tema fuera de los campos de texto.
  useEffect(() => {
    const alPulsar = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey || esEditable(e.target)) return
      if (e.key.toLowerCase() === "d") alternarTema()
    }
    window.addEventListener("keydown", alPulsar)
    return () => window.removeEventListener("keydown", alPulsar)
  }, [alternarTema])

  const valor = useMemo(
    () => ({ tema, temaResuelto, setTema, alternarTema }),
    [tema, temaResuelto, setTema, alternarTema]
  )
  return <ThemeContext.Provider value={valor}>{children}</ThemeContext.Provider>
}
