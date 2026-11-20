import { LibraryBigIcon, MessageSquareTextIcon, type LucideIcon } from "lucide-react"
import type { Permisos } from "@/types/auth"

export interface EnlaceNavegacion {
  ruta: string
  titulo: string
  icono: LucideIcon
  permiso?: keyof Permisos
}

export const ENLACES: EnlaceNavegacion[] = [
  { ruta: "/consultar", titulo: "Consultar", icono: MessageSquareTextIcon },
  { ruta: "/conocimiento", titulo: "Base de conocimiento", icono: LibraryBigIcon, permiso: "baseConocimiento" },
]

export function tituloDeRuta(ruta: string) {
  return ENLACES.find((e) => ruta.startsWith(e.ruta))?.titulo ?? ""
}
