/**
 * Configuración pública del panel. Sale de variables VITE_ (ver .env.example).
 * Nada de aquí es secreto: Vite lo incluye en el bundle.
 */
const quitarBarraFinal = (url: string) => url.replace(/\/+$/, "")

export const entorno = {
  apiUrl: quitarBarraFinal(
    import.meta.env.VITE_API_URL?.trim() || "http://localhost:8000"
  ),
  nombreBanco: import.meta.env.VITE_NOMBRE_BANCO?.trim() || "Banco de Occidente",
} as const
