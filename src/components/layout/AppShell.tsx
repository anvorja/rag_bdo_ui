import { Suspense, useState } from "react"
import { Outlet, useLocation } from "react-router"
import { SquarePenIcon } from "lucide-react"
import { LimiteError } from "@/components/comun/LimiteError"
import { Button } from "@/components/ui/button"
import { lazyConReintento } from "@/lib/carga"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { useChat } from "@/hooks/useChat"
import { useVisor } from "@/hooks/useVisor"
import { BarraLateral } from "./BarraLateral"
import { Encabezado } from "./Encabezado"

const VisorDocumento = lazyConReintento(() =>
  import("@/components/visor/VisorDocumento").then((m) => ({ default: m.VisorDocumento }))
)

export function AppShell() {
  const [menu, setMenu] = useState(false)
  const { pathname } = useLocation()
  const { turnos, nuevaConsulta, ocupado } = useChat()
  const { cerrar, objetivo } = useVisor()

  const accionChat =
    pathname.startsWith("/consultar") && turnos.length > 0 ? (
      <Button
        variant="outline"
        size="sm"
        disabled={ocupado}
        onClick={() => {
          cerrar()
          void nuevaConsulta()
        }}
        className="h-8 bg-card"
      >
        <SquarePenIcon aria-hidden />
        <span className="max-sm:sr-only">Nueva consulta</span>
      </Button>
    ) : null

  return (
    <div className="h-dvh overflow-clip">
      <a
        href="#contenido"
        className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Saltar al contenido
      </a>

      <aside aria-label="Navegación" className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <BarraLateral />
      </aside>

      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent side="left" className="w-72 border-none p-0" showCloseButton={false}>
          <SheetTitle className="sr-only">Menú</SheetTitle>
          <SheetDescription className="sr-only">Navegación principal y sesión</SheetDescription>
          <BarraLateral alNavegar={() => setMenu(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex h-dvh min-w-0 flex-col overflow-clip lg:pl-64">
        <Encabezado alAbrirMenu={() => setMenu(true)} acciones={accionChat} />
        <div className="flex min-h-0 min-w-0 flex-1">
          <main id="contenido" tabIndex={-1} className="min-w-0 flex-1 overflow-y-auto overscroll-contain outline-none">
            <LimiteError zona="esta página">
              <Outlet />
            </LimiteError>
          </main>
          {objetivo && (
            <LimiteError zona="el documento" alCerrar={cerrar} key={objetivo.docId}>
              <Suspense fallback={null}>
                <VisorDocumento />
              </Suspense>
            </LimiteError>
          )}
        </div>
      </div>
    </div>
  )
}
