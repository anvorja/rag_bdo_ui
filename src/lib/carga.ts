import { lazy, type ComponentType } from "react"

const CLAVE = "panel-rag.recarga-por-modulo"

/**
 * `lazy` que se recupera cuando un módulo no carga. Pasa tras un despliegue (el navegador pide un
 * archivo con un nombre que ya no existe) o en desarrollo cuando Vite renueva su caché. Recarga la
 * página una sola vez; si vuelve a fallar, el error llega al LimiteError más cercano.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mismo tipo que exige React.lazy
export function lazyConReintento<T extends ComponentType<any>>(
  cargar: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      const modulo = await cargar()
      try {
        sessionStorage.removeItem(CLAVE)
      } catch {
        /* sin almacenamiento */
      }
      return modulo
    } catch (error) {
      let yaRecargo = true
      try {
        yaRecargo = sessionStorage.getItem(CLAVE) === "1"
        if (!yaRecargo) sessionStorage.setItem(CLAVE, "1")
      } catch {
        /* sin almacenamiento: no se arriesga un ciclo de recargas */
      }
      if (!yaRecargo) {
        window.location.reload()
        return new Promise<never>(() => {})
      }
      throw error
    }
  })
}
