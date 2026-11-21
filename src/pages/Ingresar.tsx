import { useId, useState, type FormEvent } from "react"
import { Navigate, useLocation, useNavigate } from "react-router"
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MarcaBanco } from "@/components/comun/MarcaBanco"
import { useAuth } from "@/hooks/useAuth"
import { validarCredenciales, type ErroresIngreso } from "@/services/autenticacion"
import { cn } from "@/lib/utils"
import type { Perfil } from "@/types/auth"

const PERFILES: { valor: Perfil; titulo: string; detalle: string }[] = [
  { valor: "cliente", titulo: "Cliente", detalle: "Personas y empresas" },
  { valor: "empleado", titulo: "Empleado", detalle: "Consulta y evalúa respuestas" },
  { valor: "admin", titulo: "Admin", detalle: "Gestión y base de conocimiento" },
]

export default function Ingresar() {
  const { usuario, ingresar } = useAuth()
  const navegar = useNavigate()
  const ubicacion = useLocation()
  const [perfil, setPerfil] = useState<Perfil>("cliente")
  const [correo, setCorreo] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [verContrasena, setVerContrasena] = useState(false)
  const [errores, setErrores] = useState<ErroresIngreso>({})
  const [enviando, setEnviando] = useState(false)
  const id = useId()

  if (usuario) return <Navigate to="/consultar" replace />

  const destino = (ubicacion.state as { desde?: string } | null)?.desde ?? "/consultar"

  async function alEnviar(e: FormEvent) {
    e.preventDefault()
    const credenciales = { correo, contrasena, perfil }
    const encontrados = validarCredenciales(credenciales)
    setErrores(encontrados)
    if (Object.keys(encontrados).length) {
      document.getElementById(encontrados.correo ? `${id}-correo` : `${id}-contrasena`)?.focus()
      return
    }
    setEnviando(true)
    try {
      await ingresar(credenciales)
      navegar(destino, { replace: true })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section
        aria-label="Presentación"
        className="relative flex flex-col justify-between gap-10 overflow-hidden bg-[linear-gradient(160deg,#16301f_0%,#1a3328_35%,#2c542e_100%)] px-6 py-7 text-sidebar-foreground sm:px-10 lg:px-12 lg:py-10"
      >
        <MarcaBanco className="relative" conRotulo={false} />
        <div className="relative max-w-xl pb-2 lg:pb-16">
          <h1 className="font-serif text-[2rem] leading-[1.12] font-medium tracking-tight text-balance sm:text-[2.5rem] lg:text-[3.25rem]">
            La documentación oficial del banco, en una pregunta.
          </h1>
          <p className="mt-5 max-w-md text-[0.9375rem] leading-relaxed text-sidebar-foreground/80">
            Tasas vigentes, tarifas, requisitos y canales de atención para personas y empresas, con la fuente de cada
            dato.
          </p>
        </div>
      </section>

      <main className="flex items-center justify-center px-6 py-10 sm:px-10">
        <form noValidate onSubmit={alEnviar} className="w-full max-w-[25rem]" aria-labelledby={`${id}-titulo`}>
          <h2 id={`${id}-titulo`} className="font-serif text-[1.875rem] font-medium tracking-tight">
            Ingresar
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Elige tu perfil de acceso</p>

          <fieldset className="mt-6">
            <legend className="sr-only">Perfil de acceso</legend>
            <div className="grid grid-cols-3 gap-2">
              {PERFILES.map((p) => {
                const activo = perfil === p.valor
                return (
                  <label
                    key={p.valor}
                    className={cn(
                      "group relative flex min-h-[4.75rem] cursor-pointer flex-col justify-center rounded-xl border px-3 py-2.5 transition-[background-color,border-color,box-shadow] duration-200 ease-salida",
                      "has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50",
                      activo
                        ? "border-primary bg-primary text-primary-foreground shadow-[0_6px_16px_-8px_oklch(0.3_0.06_158/0.6)]"
                        : "bg-card hover:border-primary/40 hover:bg-accent"
                    )}
                  >
                    <input
                      type="radio"
                      name="perfil"
                      value={p.valor}
                      checked={activo}
                      onChange={() => setPerfil(p.valor)}
                      className="sr-only"
                    />
                    <span className="text-sm font-semibold">{p.titulo}</span>
                    <span
                      className={cn(
                        "mt-0.5 text-[0.75rem] leading-snug",
                        activo ? "text-primary-foreground/80" : "text-muted-foreground"
                      )}
                    >
                      {p.detalle}
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <div className="mt-6 grid gap-2">
            <Label htmlFor={`${id}-correo`}>Correo</Label>
            <Input
              id={`${id}-correo`}
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="nombre@correo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              aria-invalid={!!errores.correo}
              aria-describedby={errores.correo ? `${id}-correo-error` : undefined}
              className="h-11 bg-card text-[0.9375rem]"
            />
            {errores.correo && (
              <p id={`${id}-correo-error`} className="text-[0.8125rem] text-destructive">
                {errores.correo}
              </p>
            )}
          </div>

          <div className="mt-4 grid gap-2">
            <Label htmlFor={`${id}-contrasena`}>Contraseña</Label>
            <div className="relative">
              <Input
                id={`${id}-contrasena`}
                type={verContrasena ? "text" : "password"}
                autoComplete="current-password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                aria-invalid={!!errores.contrasena}
                aria-describedby={errores.contrasena ? `${id}-contrasena-error` : undefined}
                className="h-11 bg-card pr-11 text-[0.9375rem]"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setVerContrasena((v) => !v)}
                aria-label={verContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
                aria-pressed={verContrasena}
                className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground"
              >
                {verContrasena ? <EyeOffIcon /> : <EyeIcon />}
              </Button>
            </div>
            {errores.contrasena && (
              <p id={`${id}-contrasena-error`} className="text-[0.8125rem] text-destructive">
                {errores.contrasena}
              </p>
            )}
          </div>

          <Button type="submit" disabled={enviando} className="mt-7 h-11 w-full text-[0.9375rem] font-semibold">
            {enviando && <Loader2Icon className="animate-spin" aria-hidden />}
            Continuar
          </Button>

          <p className="mt-5 text-[0.8125rem] leading-relaxed text-muted-foreground">
            Versión piloto: el acceso aún no se valida con los sistemas del banco. No uses la contraseña de tu banca en
            línea.
          </p>
        </form>
      </main>
    </div>
  )
}
