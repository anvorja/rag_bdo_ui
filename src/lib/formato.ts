import type { EstadoVigencia } from "@/types/api"

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
]

/** «2026-12-31» → «31 de diciembre de 2026». Devuelve el texto tal cual si no es una fecha ISO. */
export function fechaLarga(iso: string | null | undefined) {
  if (!iso) return ""
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (!m) return iso
  return `${Number(m[3])} de ${MESES[Number(m[2]) - 1]} de ${m[1]}`
}

export const ETIQUETA_VIGENCIA: Record<EstadoVigencia, string> = {
  vigente: "Vigente",
  vigente_hasta_reemplazo: "Vigente hasta reemplazo",
  sujeta_a_existencias: "Sujeta a existencias",
  vencido: "Vencido",
  historico: "Versión anterior",
}

/** Tono visual por estado: «ok» sin alarma; «atencion» requiere leer el aviso. */
export function tonoVigencia(estado: EstadoVigencia): "ok" | "atencion" | "pasado" {
  if (estado === "vigente") return "ok"
  if (estado === "vencido" || estado === "historico") return "pasado"
  return "atencion"
}

/** «pagos_recaudos_canales» → «Pagos recaudos canales» */
export function humanizar(valor: string | null | undefined) {
  if (!valor) return ""
  const t = valor.replace(/_/g, " ").trim()
  return t.charAt(0).toLocaleUpperCase("es-CO") + t.slice(1)
}

export const numero = (n: number) => n.toLocaleString("es-CO")

/** Los PDF del corpus marcan las páginas con «<!-- página N -->». Se vuelven encabezados de página para el visor. */
export function marcasDePagina(texto: string) {
  return texto.replace(/<!--\s*página\s+(\d+)\s*-->/gi, "\n\n###### Página $1\n\n")
}
