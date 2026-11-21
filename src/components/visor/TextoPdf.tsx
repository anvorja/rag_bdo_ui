import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { partirValor, type Bloque, type Fila } from "@/lib/textoPdf"

const FECHA_CORTA = /^\d{1,2}-[a-zé]{3}-\d{2}$/i

/** Nombre legible de cada columna: «PESOS» sobre «e.a.» → «Pesos e.a.». Vacío si no hay cabecera. */
export function nombresColumnas(tabla: Extract<Bloque, { tipo: "tabla" }>): string[] {
  const { cabecera, columnas, filas } = tabla
  if (!cabecera) {
    const datos = filas.filter((f) => f.tipo === "datos")
    const conFecha = datos.length > 0 && datos.every((f) => FECHA_CORTA.test(f.celdas[columnas - 1]?.trim() ?? ""))
    if (columnas === 3 && conFecha) return ["Concepto", "Valor", "Vigente desde"]
    return Array(columnas).fill("")
  }
  const porColumna: string[] = []
  for (const s of cabecera.superior ?? []) for (let k = 0; k < s.span; k++) porColumna.push(capitalizar(s.texto))
  return cabecera.columnas.map((c, i) => [porColumna[i], c].filter(Boolean).join(" "))
}

function capitalizar(t: string) {
  if (t !== t.toLocaleUpperCase("es-CO")) return t
  const minus = t.toLocaleLowerCase("es-CO")
  return minus.charAt(0).toLocaleUpperCase("es-CO") + minus.slice(1)
}

/** Celda con valor monetario: la cifra destacada y los recargos («+ IVA») en segundo plano. */
export function Valor({ celda, grande = false }: { celda: string; grande?: boolean }) {
  const partes = partirValor(celda)
  if (!partes) return <>{celda}</>
  return (
    <>
      <span className={cn("font-medium text-foreground", grande && "font-semibold")}>{partes.cifra}</span>
      {partes.resto && <span className="ml-1 text-[0.75em] font-normal text-muted-foreground">{partes.resto}</span>}
    </>
  )
}

interface Props {
  bloques: Bloque[]
  /** Líneas de origen del dato citado: su fila o párrafo se resalta y recibe el id «cita-marcada». */
  marcadas?: Set<number>
}

/** Documento PDF con estructura: títulos, tablas con cabecera, notas y párrafos legibles. */
export function TextoPdf({ bloques, marcadas }: Props) {
  const esMarcado = (lineas: number[]) => !!marcadas?.size && lineas.some((l) => marcadas.has(l))
  const primera = marcadas?.size ? Math.min(...marcadas) : -1
  const idCita = (lineas: number[]) => (lineas.includes(primera) ? "cita-marcada" : undefined)

  return (
    <div className="grid gap-3 text-[0.875rem] leading-relaxed">
      {bloques.map((b, k) => {
        const marcado = b.tipo !== "tabla" && esMarcado(b.lineas)
        const resalte = marcado && "-mx-2 rounded-md bg-primary/10 px-2 py-1 ring-1 ring-primary/20"
        switch (b.tipo) {
          case "pagina":
            return (
              <div key={k} className="flex items-center gap-3 pt-2 text-[0.6875rem] tracking-wide text-muted-foreground uppercase">
                <span className="cifras">Página {b.n}</span>
                <span aria-hidden className="h-px flex-1 bg-border" />
              </div>
            )
          case "titulo":
            return b.mayusculas ? (
              <h3 key={k} id={idCita(b.lineas)} className={cn("pt-2 text-[0.75rem] font-semibold tracking-wider text-foreground/80", resalte)}>
                {b.texto}
              </h3>
            ) : (
              <h3 key={k} id={idCita(b.lineas)} className={cn("pt-1 font-serif text-[0.9375rem] font-semibold tracking-tight", resalte)}>
                {b.texto}
              </h3>
            )
          case "parrafo":
            return (
              <p key={k} id={idCita(b.lineas)} className={cn("max-w-[68ch] text-pretty text-foreground/90", resalte)}>
                {b.texto}
              </p>
            )
          case "nota":
            return (
              <p key={k} id={idCita(b.lineas)} className={cn("max-w-[68ch] border-l-2 pl-3 text-[0.75rem] leading-relaxed text-muted-foreground", resalte)}>
                {b.texto}
              </p>
            )
          case "lista":
            return (
              <ol key={k} className="grid gap-1">
                {b.items.map((it) => (
                  <li key={it.linea} className="flex gap-3">
                    <span className="w-6 shrink-0 text-right font-mono text-[0.75rem] leading-relaxed text-muted-foreground cifras">{it.n}</span>
                    <span className="text-pretty">{it.texto}</span>
                  </li>
                ))}
              </ol>
            )
          case "separador":
            return <hr key={k} className="my-1 border-dashed" />
          case "grafico":
            return (
              <p key={k} className="text-[0.75rem] text-muted-foreground">
                <span className="font-medium">Valores de un gráfico del PDF:</span>{" "}
                <span className="cifras">
                  {b.valores.slice(0, 24).join(" · ")}
                  {b.valores.length > 24 && ` · y ${b.valores.length - 24} más`}
                </span>
              </p>
            )
          case "diagrama":
            return (
              <figure key={k} className="grid gap-1.5">
                <pre className="max-h-96 overflow-auto rounded-lg border bg-muted/40 p-3 font-mono text-[0.6875rem] leading-snug">{b.texto}</pre>
                <figcaption className="text-[0.75rem] text-muted-foreground">
                  Cuadro o diagrama: se conserva la disposición del PDF. Desplázate para verlo completo.
                </figcaption>
              </figure>
            )
          case "tabla":
            return <Tabla key={k} tabla={b} esMarcado={esMarcado} idCita={idCita} />
        }
      })}
    </div>
  )
}

function Tabla({
  tabla,
  esMarcado,
  idCita,
}: {
  tabla: Extract<Bloque, { tipo: "tabla" }>
  esMarcado: (lineas: number[]) => boolean
  idCita: (lineas: number[]) => string | undefined
}) {
  const nombres = nombresColumnas(tabla)
  const conCabecera = nombres.some(Boolean)
  const { superior } = tabla.cabecera ?? {}

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full border-collapse text-[0.8125rem] leading-snug">
        {conCabecera && (
          <thead className="bg-muted/60 text-[0.6875rem] text-muted-foreground">
            {superior && (
              <tr>
                {superior.map((s, i) => (
                  <th key={i} colSpan={s.span} scope="colgroup" className="px-3 pt-2 pb-0.5 text-center font-medium">
                    {capitalizar(s.texto)}
                  </th>
                ))}
              </tr>
            )}
            <tr>
              {(tabla.cabecera?.columnas ?? nombres).map((c, i) => (
                <th key={i} scope="col" className={cn("px-3 py-2 font-medium whitespace-nowrap", i === 0 ? "text-left" : "text-right")}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {tabla.filas.map((f, i) => (
            <FilaTabla key={i} fila={f} columnas={tabla.columnas} marcada={esMarcado(f.lineas)} id={idCita(f.lineas)} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function FilaTabla({ fila, columnas, marcada, id }: { fila: Fila; columnas: number; marcada: boolean; id?: string }) {
  if (fila.tipo === "pagina") {
    return (
      <tr>
        <td colSpan={columnas} className="border-t border-dashed px-3 py-1 text-[0.6875rem] text-muted-foreground cifras">
          Página {fila.n}
        </td>
      </tr>
    )
  }
  if (fila.tipo === "grupo") {
    return (
      <tr id={id}>
        <th colSpan={columnas} scope="rowgroup" className={cn("border-t bg-muted/30 px-3 pt-2.5 pb-1.5 text-left text-[0.75rem] font-semibold", marcada && "bg-primary/10")}>
          {fila.texto}
        </th>
      </tr>
    )
  }
  return (
    <tr id={id} className={cn("border-t", marcada && "bg-primary/10")}>
      {fila.celdas.map((c, i): ReactNode => (
        <td
          key={i}
          className={cn(
            "px-3 py-2 align-top",
            i === 0
              ? cn("text-left text-pretty", marcada && "font-medium shadow-[inset_3px_0_0_var(--primary)]")
              : cn("text-right cifras", (partirValor(c) || FECHA_CORTA.test(c.trim()) || c.length <= 12) && "whitespace-nowrap"),
            i > 0 && FECHA_CORTA.test(c.trim()) && "text-muted-foreground"
          )}
        >
          {i === 0 ? c : <Valor celda={c} />}
        </td>
      ))}
    </tr>
  )
}
