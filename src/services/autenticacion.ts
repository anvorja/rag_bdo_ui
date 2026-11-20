import type { Credenciales, Perfil, Permisos, Usuario } from "@/types/auth"

/**
 * Autenticación del PILOTO. Decisión del producto: el ingreso se valida solo en el navegador
 * porque la API todavía no tiene autenticación. No es un control de seguridad.
 *
 * Para pasar a autenticación real se reemplaza `iniciarSesion` (y `restaurar`) por llamadas al
 * servidor; el AuthProvider y los componentes no cambian. Aquí no hay ni debe haber contraseñas
 * o claves escritas: la contraseña escrita por el usuario no se guarda en ningún lado.
 */

const PERMISOS: Record<Perfil, Permisos> = {
  cliente: {
    niveles: ["publico"],
    verTraza: false,
    valoracion: "simple",
    baseConocimiento: false,
  },
  empleado: {
    niveles: ["publico", "interno"],
    verTraza: true,
    valoracion: "completa",
    baseConocimiento: false,
  },
  admin: {
    niveles: ["publico", "interno", "confidencial"],
    verTraza: true,
    valoracion: "completa",
    baseConocimiento: true,
  },
}

export const ETIQUETA_PERFIL: Record<Perfil, string> = {
  cliente: "Cliente",
  empleado: "Empleado",
  admin: "Administrador",
}

const CLAVE_ALMACEN = "panel-rag.usuario"
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export const MIN_CONTRASENA = 8

export type ErroresIngreso = Partial<Record<"correo" | "contrasena", string>>

export function validarCredenciales(c: Credenciales): ErroresIngreso {
  const errores: ErroresIngreso = {}
  if (!c.correo.trim()) errores.correo = "Escribe tu correo."
  else if (!CORREO_VALIDO.test(c.correo.trim()))
    errores.correo = "Revisa el correo: debe tener la forma nombre@dominio.com."
  if (!c.contrasena) errores.contrasena = "Escribe tu contraseña."
  else if (c.contrasena.length < MIN_CONTRASENA)
    errores.contrasena = `La contraseña debe tener al menos ${MIN_CONTRASENA} caracteres.`
  return errores
}

function nombreDesdeCorreo(correo: string) {
  const base = correo.split("@")[0].split(/[._-]/)[0] || correo
  return base.charAt(0).toLocaleUpperCase("es-CO") + base.slice(1)
}

function construirUsuario(correo: string, perfil: Perfil): Usuario {
  return { correo, perfil, nombre: nombreDesdeCorreo(correo), permisos: PERMISOS[perfil] }
}

export async function iniciarSesion(c: Credenciales): Promise<Usuario> {
  const usuario = construirUsuario(c.correo.trim().toLowerCase(), c.perfil)
  try {
    sessionStorage.setItem(CLAVE_ALMACEN, JSON.stringify({ correo: usuario.correo, perfil: usuario.perfil }))
  } catch {
    /* almacenamiento bloqueado: la sesión dura lo que dure la pestaña en memoria */
  }
  return usuario
}

export function restaurarSesion(): Usuario | null {
  try {
    const crudo = sessionStorage.getItem(CLAVE_ALMACEN)
    if (!crudo) return null
    const { correo, perfil } = JSON.parse(crudo) as { correo?: string; perfil?: string }
    if (!correo || !perfil || !(perfil in PERMISOS)) return null
    return construirUsuario(correo, perfil as Perfil)
  } catch {
    return null
  }
}

export function cerrarSesion() {
  try {
    sessionStorage.removeItem(CLAVE_ALMACEN)
  } catch {
    /* nada que limpiar */
  }
}
