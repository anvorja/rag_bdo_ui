export type Perfil = "cliente" | "empleado" | "admin"

export type NivelAcceso = "publico" | "interno" | "confidencial"

export interface Permisos {
  /** Niveles de documentos que el perfil puede consultar. */
  niveles: NivelAcceso[]
  /** Ver la traza técnica de cada turno (vía, puntaje, tiempos). */
  verTraza: boolean
  /** «simple»: útil sí/no. «completa»: útil, correcta y comentario. */
  valoracion: "simple" | "completa"
  /** Catálogo, búsqueda en las fuentes y estado del servicio. */
  baseConocimiento: boolean
}

export interface Usuario {
  correo: string
  perfil: Perfil
  /** Nombre para saludar (parte del correo antes del primer punto o arroba). */
  nombre: string
  permisos: Permisos
}

export interface Credenciales {
  correo: string
  contrasena: string
  perfil: Perfil
}
