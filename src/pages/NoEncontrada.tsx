import { Link } from "react-router"
import { Button } from "@/components/ui/button"

export default function NoEncontrada() {
  return (
    <div className="mx-auto flex min-h-[60dvh] max-w-md flex-col items-start justify-center px-6">
      <h2 className="font-serif text-[1.75rem] font-medium tracking-tight">Esta página no existe</h2>
      <p className="mt-2 text-muted-foreground">Puede que el enlace esté mal escrito o que tu perfil no tenga acceso.</p>
      <Button asChild className="mt-6">
        <Link to="/consultar">Ir a Consultar</Link>
      </Button>
    </div>
  )
}
