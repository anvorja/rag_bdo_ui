import { useEffect, useState } from "react"
import { ErrorApi } from "@/services/api"

const cache = new Map<string, unknown>()

interface Estado<T> {
  clave: string | null
  datos?: T
  error?: string
}

/**
 * Lectura de la API con caché en memoria por clave. `clave = null` no consulta.
 * El estado «cargando» se deriva de la clave (sin setState síncrono en el efecto).
 */
export function useConsulta<T>(clave: string | null, cargar: () => Promise<T>) {
  const [estado, setEstado] = useState<Estado<T>>(() =>
    clave && cache.has(clave) ? { clave, datos: cache.get(clave) as T } : { clave: null }
  )
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    if (!clave || cache.has(clave)) return
    let vigente = true
    cargar().then(
      (datos) => {
        cache.set(clave, datos)
        if (vigente) setEstado({ clave, datos })
      },
      (e: unknown) => {
        if (vigente)
          setEstado({ clave, error: e instanceof ErrorApi ? e.message : "No se pudo cargar la información." })
      }
    )
    return () => {
      vigente = false
    }
    // `cargar` cambia en cada render; la clave identifica la consulta.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave, intento])

  const enCache = clave ? (cache.get(clave) as T | undefined) : undefined
  const actual = estado.clave === clave
  return {
    datos: enCache ?? (actual ? estado.datos : undefined),
    error: actual ? estado.error : undefined,
    cargando: !!clave && enCache === undefined && !(actual && estado.error),
    reintentar: () => {
      if (clave) cache.delete(clave)
      setEstado({ clave: null })
      setIntento((n) => n + 1)
    },
  }
}
