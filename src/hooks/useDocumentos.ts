import { api } from "@/services/api"
import type { ConsultaDocumentos } from "@/types/api"
import { useConsulta } from "./useConsulta"

export function useDocumentos(consulta: ConsultaDocumentos) {
  return useConsulta(`documentos:${JSON.stringify(consulta)}`, () => api.documentos(consulta))
}

export function useFiltros() {
  return useConsulta("filtros", api.filtros)
}

export function useDocumento(docId: string | null) {
  return useConsulta(docId ? `documento:${docId}` : null, () => api.documento(docId!))
}

/** `fragmento` = «<doc_id>#<n>» */
export function useFragmento(fragmento: string | null) {
  const [docId, n] = fragmento?.split("#") ?? []
  const valido = !!docId && n !== undefined && !Number.isNaN(Number(n))
  return useConsulta(valido ? `fragmento:${fragmento}` : null, () => api.fragmento(docId, Number(n)))
}
