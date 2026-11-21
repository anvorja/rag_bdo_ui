import { Component, type ErrorInfo, type ReactNode } from "react"
import { TriangleAlertIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
  /** Qué parte del panel falló, para el mensaje («el visor del documento»). */
  zona: string
  /** Botón opcional para salir de la zona (por ejemplo, cerrar el visor). */
  alCerrar?: () => void
}

interface Estado {
  error: Error | null
}

/**
 * Evita que un error en una parte del panel deje toda la pantalla en blanco: muestra el aviso en
 * esa zona y deja el resto funcionando. React solo permite límites de error como clases.
 */
export class LimiteError extends Component<Props, Estado> {
  state: Estado = { error: null }

  static getDerivedStateFromError(error: Error): Estado {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[panel] Falló ${this.props.zona}`, error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div role="alert" className="flex flex-1 flex-col items-start gap-3 p-6 text-sm">
        <p className="flex items-center gap-2 font-medium">
          <TriangleAlertIcon className="size-4 text-aviso-foreground" aria-hidden />
          No pudimos mostrar {this.props.zona}.
        </p>
        <p className="max-w-[48ch] text-muted-foreground">
          Recarga la página para intentarlo de nuevo. Tu conversación se pierde al recargar.
        </p>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => window.location.reload()}>
            Recargar
          </Button>
          {this.props.alCerrar && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                this.setState({ error: null })
                this.props.alCerrar?.()
              }}
            >
              Cerrar
            </Button>
          )}
        </div>
      </div>
    )
  }
}
