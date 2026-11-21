import { Suspense } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import { RutaProtegida } from "@/components/auth/RutaProtegida"
import { AreaPrivada } from "@/components/layout/AreaPrivada"
import { AppProviders } from "@/providers/AppProviders"
import { CargandoPagina } from "@/components/comun/CargandoPagina"
import { LimiteError } from "@/components/comun/LimiteError"
import { lazyConReintento } from "@/lib/carga"
import Consultar from "@/pages/Consultar"
import Ingresar from "@/pages/Ingresar"
import NoEncontrada from "@/pages/NoEncontrada"

const Conocimiento = lazyConReintento(() => import("@/pages/Conocimiento"))

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/ingresar" element={<Ingresar />} />
          <Route element={<RutaProtegida />}>
            <Route element={<AreaPrivada />}>
              <Route index element={<Navigate to="/consultar" replace />} />
              <Route path="/consultar" element={<Consultar />} />
              <Route element={<RutaProtegida permiso="baseConocimiento" />}>
                <Route
                  path="/conocimiento"
                  element={
                    <LimiteError zona="la base de conocimiento">
                      <Suspense fallback={<CargandoPagina />}>
                        <Conocimiento />
                      </Suspense>
                    </LimiteError>
                  }
                />
              </Route>
              <Route path="*" element={<NoEncontrada />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProviders>
  )
}
