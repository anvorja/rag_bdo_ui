import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import {
  ChatContext,
  type EstadoConsentimiento,
  type Turno,
  type ValoracionLocal,
} from "@/contexts/ChatContext"
import { api, ErrorApi } from "@/services/api"
import type { Sesion } from "@/types/api"

const nuevoId = () => crypto.randomUUID()

const mensajeDeError = (e: unknown) =>
  e instanceof ErrorApi ? e.message : "Ocurrió un error inesperado. Intenta de nuevo."

/**
 * Un chat = una sesión de la API. Cada chat empieza con el aviso de asistente virtual y el
 * consentimiento (decisión de cumplimiento): sin consentimiento no se envían preguntas.
 */
export function ChatProvider({ children }: { children: ReactNode }) {
  const [sesionApi, setSesionApi] = useState<Sesion | null>(null)
  const [sesion, setSesion] = useState<"abriendo" | "lista" | "error">("abriendo")
  const [errorSesion, setErrorSesion] = useState<string | null>(null)
  const [consentimiento, setConsentimiento] = useState<EstadoConsentimiento>("pendiente")
  const [turnos, setTurnos] = useState<Turno[]>([])
  const sesionRef = useRef<Sesion | null>(null)
  const abriendoRef = useRef<Promise<Sesion> | null>(null)

  const abrir = useCallback(async () => {
    // StrictMode monta dos veces: se reutiliza la petición en curso.
    if (!abriendoRef.current) {
      abriendoRef.current = api.abrirSesion().finally(() => {
        abriendoRef.current = null
      })
    }
    setSesion("abriendo")
    setErrorSesion(null)
    try {
      const s = await abriendoRef.current
      sesionRef.current = s
      setSesionApi(s)
      setSesion("lista")
      return s
    } catch (e) {
      setSesion("error")
      setErrorSesion(mensajeDeError(e))
      throw e
    }
  }, [])

  useEffect(() => {
    const id = window.setTimeout(() => void abrir().catch(() => {}), 0)
    return () => window.clearTimeout(id)
  }, [abrir])

  const responder = useCallback(
    async (acepta: boolean) => {
      const s = sesionRef.current ?? (await abrir())
      await api.consentir(s.sesion_id, acepta)
      setConsentimiento(acepta ? "aceptado" : "rechazado")
    },
    [abrir]
  )

  /** Si el servidor se reinició, la sesión ya no existe: se abre otra y se registra el consentimiento ya dado. */
  const conSesion = useCallback(
    async <T,>(llamada: (sesionId: string) => Promise<T>): Promise<T> => {
      const s = sesionRef.current ?? (await abrir())
      try {
        return await llamada(s.sesion_id)
      } catch (e) {
        if (!(e instanceof ErrorApi) || e.estado !== 404 || !e.message.startsWith("Sesión")) throw e
        const nueva = await abrir()
        await api.consentir(nueva.sesion_id, true)
        return llamada(nueva.sesion_id)
      }
    },
    [abrir]
  )

  const pedirRespuesta = useCallback(
    async (turnoId: string, pregunta: string) => {
      try {
        const respuesta = await conSesion((id) => api.chat(id, pregunta))
        setTurnos((t) => t.map((x) => (x.id === turnoId ? { ...x, estado: "listo", respuesta, error: undefined } : x)))
      } catch (e) {
        setTurnos((t) => t.map((x) => (x.id === turnoId ? { ...x, estado: "error", error: mensajeDeError(e) } : x)))
      }
    },
    [conSesion]
  )

  const ocupado = turnos.some((t) => t.estado === "cargando")

  const enviar = useCallback(
    async (pregunta: string) => {
      const texto = pregunta.trim()
      if (!texto || consentimiento !== "aceptado" || ocupado) return
      const id = nuevoId()
      setTurnos((t) => [...t, { id, pregunta: texto, estado: "cargando" }])
      await pedirRespuesta(id, texto)
    },
    [consentimiento, ocupado, pedirRespuesta]
  )

  const reintentar = useCallback(
    async (turnoId: string) => {
      const turno = turnos.find((t) => t.id === turnoId)
      if (!turno || ocupado) return
      setTurnos((t) => t.map((x) => (x.id === turnoId ? { ...x, estado: "cargando", error: undefined } : x)))
      await pedirRespuesta(turnoId, turno.pregunta)
    },
    [turnos, ocupado, pedirRespuesta]
  )

  const valorar = useCallback(
    async (turnoId: string, datos: Omit<ValoracionLocal, "estado">) => {
      const turno = turnos.find((t) => t.id === turnoId)
      const s = sesionRef.current
      if (!turno?.respuesta || !s) return
      const fusion = { ...turno.valoracion, ...datos }
      const poner = (estado: ValoracionLocal["estado"]) =>
        setTurnos((t) => t.map((x) => (x.id === turnoId ? { ...x, valoracion: { ...fusion, estado } } : x)))
      poner("enviando")
      try {
        await api.valorar({
          sesion_id: s.sesion_id,
          turno_id: turno.respuesta.turno_id,
          util: fusion.util ?? null,
          correcta: fusion.correcta ?? null,
          comentario: fusion.comentario?.trim() || null,
        })
        poner("enviada")
      } catch {
        poner("error")
      }
    },
    [turnos]
  )

  const nuevaConsulta = useCallback(async () => {
    setTurnos([])
    setConsentimiento("pendiente")
    sesionRef.current = null
    setSesionApi(null)
    await abrir().catch(() => {})
  }, [abrir])

  const buscar = useCallback(
    (consulta: string, k = 10) => conSesion((id) => api.buscar(id, consulta, k)),
    [conSesion]
  )

  const valor = useMemo(
    () => ({
      sesion,
      errorSesion,
      avisoInicio: sesionApi?.aviso_inicio ?? null,
      textoConsentimiento: sesionApi?.texto_consentimiento ?? null,
      consentimiento,
      turnos,
      ocupado,
      responder,
      enviar,
      reintentar,
      valorar,
      nuevaConsulta,
      buscar,
    }),
    [sesion, errorSesion, sesionApi, consentimiento, turnos, ocupado, responder, enviar, reintentar, valorar, nuevaConsulta, buscar]
  )
  return <ChatContext.Provider value={valor}>{children}</ChatContext.Provider>
}
