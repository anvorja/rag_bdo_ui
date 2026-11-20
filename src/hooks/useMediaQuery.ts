import { useSyncExternalStore } from "react"

export function useMediaQuery(consulta: string) {
  return useSyncExternalStore(
    (avisar) => {
      const mql = window.matchMedia(consulta)
      mql.addEventListener("change", avisar)
      return () => mql.removeEventListener("change", avisar)
    },
    () => window.matchMedia(consulta).matches,
    () => false
  )
}
