/**
 * Contrato de la API del asistente (api/app.py del repositorio enlaces-rag-bdo).
 * Fuente de verdad: GET /openapi.json. Si el backend cambia, se actualizan estos tipos.
 */

export type Accion = "responder" | "abstenerse" | "escalar" | "aclarar"

export type EstadoVigencia =
  | "vigente"
  | "vigente_hasta_reemplazo"
  | "sujeta_a_existencias"
  | "vencido"
  | "historico"

export type ViaTurno =
  | "limites"
  | "escalamiento_reglas"
  | "cuenta_propia"
  | "compuerta"
  | "verificador"
  | "generador"

export interface Cita {
  n: number
  doc_id: string
  url: string
  titulo: string
  pagina: number | null
  encabezado: string | null
  /** «<doc_id>#<n>» */
  fragmento: string
  estado_vigencia: EstadoVigencia
  vigente_hasta: string | null
  aviso: string | null
}

export interface Traza {
  via: ViaTurno | null
  top1_rerank: number | null
  juez: boolean | null
  reintento: boolean
  problemas: string[]
  datos_enmascarados: Record<string, number>
  segundos: number | null
  tokens_generador: number
  alerta_sesion: boolean
}

export interface Sesion {
  sesion_id: string
  aviso_inicio: string
  texto_consentimiento: string
}

export interface RespuestaChat {
  turno_id: string
  accion: Accion
  respuesta: string
  citas: Cita[]
  avisos: string[]
  traza: Traza
}

export interface Resultado {
  puntaje: number
  fragmento: string
  doc_id: string
  titulo: string
  url: string
  pagina: number | null
  encabezado: string | null
  estado_vigencia: EstadoVigencia
  vigente_hasta: string | null
  aviso: string | null
  texto: string
}

export interface RespuestaBuscar {
  consulta_enmascarada: string
  resultados: Resultado[]
}

export interface DocumentoResumen {
  id: string
  titulo: string
  url: string
  tipo_contenido: string
  tipo_doc: string | null
  segmento: string | null
  area: string | null
  estado_vigencia: EstadoVigencia
  vigente_desde: string | null
  vigente_hasta: string | null
  paginas: number | null
  fuente: string | null
}

export interface Version {
  id: string
  estado_vigencia: EstadoVigencia
  vigente_desde: string | null
  vigente_hasta: string | null
}

export interface Documento extends DocumentoResumen {
  descripcion: string | null
  aviso: string | null
  fecha_extraccion: string | null
  texto: string
  versiones: Version[]
  n_fragmentos: number
}

export interface ListaDocumentos {
  total: number
  documentos: DocumentoResumen[]
}

export interface Fragmento {
  fragmento: string
  doc_id: string
  pagina: number | null
  encabezado: string | null
  texto: string
}

export type Filtros = Record<
  "segmento" | "area" | "estado" | "tipo",
  Record<string, number>
>

export interface Valoracion {
  sesion_id: string
  turno_id: string
  util?: boolean | null
  correcta?: "si" | "parcial" | "no" | null
  comentario?: string | null
}

export interface Salud {
  estado: "ok" | "degradado"
  documentos_indexables: number
  recuperador_cargado: boolean
  reranker: string
  llm_proveedor: string
  llm_modelo: string | null
  llm_listo: boolean
  llm_error: string | null
  faltan_variables: string[]
}

export interface ConsultaDocumentos {
  q?: string
  segmento?: string
  area?: string
  estado?: string
  tipo?: string
  incluir_historicos?: boolean
  desde?: number
  limite?: number
}
