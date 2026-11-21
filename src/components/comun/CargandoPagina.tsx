import { Skeleton } from "@/components/ui/skeleton"

/** Esqueleto mientras llega el código de una página que se carga bajo demanda. */
export function CargandoPagina() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8" aria-busy aria-label="Cargando">
      <Skeleton className="h-8 w-72" />
      <Skeleton className="mt-3 h-4 w-full max-w-xl" />
      <Skeleton className="mt-8 h-9 w-64 rounded-lg" />
      <div className="mt-6 grid gap-2">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}
