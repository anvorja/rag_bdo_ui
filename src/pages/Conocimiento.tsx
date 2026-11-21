import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BusquedaFuentes } from "@/components/conocimiento/BusquedaFuentes"
import { Catalogo } from "@/components/conocimiento/Catalogo"
import { useSalud } from "@/hooks/useSalud"
import { numero } from "@/lib/formato"

export default function Conocimiento() {
  const { salud } = useSalud()
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="max-w-2xl">
        <h2 className="font-serif text-[1.75rem] leading-tight font-medium tracking-tight">Documentación del asistente</h2>
        <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground">
          {salud ? `${numero(salud.documentos_indexables)} documentos públicos` : "Documentos públicos"} del sitio del
          banco, con su vigencia y sus versiones. Abre cualquiera para ver su contenido.
        </p>
      </div>
      <Tabs defaultValue="catalogo" className="mt-6 gap-5">
        <TabsList className="h-9">
          <TabsTrigger value="catalogo">Catálogo</TabsTrigger>
          <TabsTrigger value="buscar">Buscar en las fuentes</TabsTrigger>
        </TabsList>
        <TabsContent value="catalogo">
          <Catalogo />
        </TabsContent>
        <TabsContent value="buscar">
          <BusquedaFuentes />
        </TabsContent>
      </Tabs>
    </div>
  )
}
