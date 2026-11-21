import { mejorLinea } from "@/lib/citas"

/**
 * Convierte el texto extraído de un PDF (pdftotext con disposición: columnas separadas por espacios,
 * renglones cortados, encabezados de página repetidos) en bloques con estructura para el visor:
 * títulos, tablas con encabezados, filas de grupo, notas, listas y párrafos con los renglones unidos.
 *
 * Cada bloque y cada fila guarda los índices de las líneas de origen, para resaltar el dato citado.
 */

export interface FilaDatos {
  tipo: "datos"
  celdas: string[]
  lineas: number[]
}
export interface FilaGrupo {
  tipo: "grupo"
  texto: string
  lineas: number[]
}
export interface FilaPagina {
  tipo: "pagina"
  n: number
  lineas: number[]
}
export type Fila = FilaDatos | FilaGrupo | FilaPagina

export interface CabeceraTabla {
  /** Fila superior opcional que agrupa columnas («PESOS» sobre «e.a. n.v.»). */
  superior: { texto: string; span: number }[] | null
  columnas: string[]
}

export type Bloque =
  | { tipo: "pagina"; n: number; lineas: number[] }
  | { tipo: "titulo"; texto: string; mayusculas: boolean; lineas: number[] }
  | { tipo: "parrafo"; texto: string; lineas: number[] }
  | { tipo: "nota"; texto: string; lineas: number[] }
  | { tipo: "lista"; items: { n: string; texto: string; linea: number }[]; lineas: number[] }
  | { tipo: "separador"; lineas: number[] }
  | { tipo: "tabla"; cabecera: CabeceraTabla | null; columnas: number; filas: Fila[]; lineas: number[] }
  | { tipo: "diagrama"; texto: string; lineas: number[] }
  /** Restos de gráficos (ejes y etiquetas sueltas): se agrupan para no ensuciar la lectura. */
  | { tipo: "grafico"; valores: string[]; lineas: number[] }

const MARCA_PAGINA = /^\s*<!--\s*página\s+(\d+)\s*-->\s*$/i
const SEPARADOR = /^\s*[-_=–—]{8,}\s*$/
const ITEM_LISTA = /^\s*(\d{1,3})\s{1,8}(\S.*)$/
const FECHA_CORTA = /\d{1,2}-[a-zé]{3}-\d{2}/i
const VALOR = String.raw`(?:(?:\$|USD|US\$)\s?[\d.,]+(?:\s*\+\s*[A-Za-zÁÉÍÓÚáéíóú]+)*|SERVICIO ESPECIAL(?:\s*\+\s*IVA)?)`
/** «Retiro corresponsal Bancario $ 3.200 + IVA 1-oct-26» (texto sin columnas). */
const FILA_TARIFA = new RegExp(String.raw`^(.*?\S)\s+(${VALOR})\s+(\d{1,2}-[a-zé]{3}-\d{2})$`, "i")
/** «Tasa Compra y Avances 28,19% 24,84% 23,74% 21,49%» (dos o más cifras al final). */
const CIFRA = String.raw`-?(?:\$\s?)?\d[\d.]*(?:,\d+)?%?`
const FILA_CIFRAS = new RegExp(String.raw`^(.*?[^\d\s.,%$-])\s+((?:${CIFRA}\s+)+${CIFRA})$`)
const PALABRAS_CABECERA = /^(producto o servicio|comisi[oó]n|vigente desde|concepto|valor|tarifa|tasa|descripci[oó]n|plazo|monto)$/i

/** Palabra que deja la frase a medias: el renglón continúa abajo. */
const CONECTOR_FINAL = /\s(de|del|la|las|el|los|al|a|y|o|e|que|se|en|con|por|para|su|sus|un|una)$/i
const normalizarLinea = (l: string) => l.replace(/\s+/g, " ").trim()
/** Renglón corto casi sin letras («-3,5%», «jun-19», «0%»): resto de un gráfico. */
const esResiduo = (t: string) => t.length <= 24 && t.replace(/[^\p{L}]/gu, "").length / t.replace(/\s/g, "").length < 0.5
const sangria = (l: string) => l.length - l.trimStart().length
const tieneDigito = (t: string) => /\d/.test(t)

function esMayusculas(t: string) {
  const letras = t.replace(/[^\p{L}]/gu, "")
  if (letras.length < 4) return false
  const mayus = letras.replace(/[^\p{Lu}]/gu, "").length
  return mayus / letras.length >= 0.85
}

/** Celdas de una línea: primero por columnas (3+ espacios); si no hay, por patrones de tarifa o de cifras. */
export function celdasDe(linea: string): string[] {
  const t = linea.trim()
  if (!t) return []
  const porColumnas = t.split(/\s{3,}/)
  if (porColumnas.length >= 2) return porColumnas
  const tarifa = FILA_TARIFA.exec(t)
  if (tarifa) return [tarifa[1], tarifa[2], tarifa[3]]
  const cifras = FILA_CIFRAS.exec(t)
  if (cifras) {
    const numeros = cifras[2].split(/\s+/)
    // al menos dos cifras con forma de dato (porcentaje, decimales o pesos), no un año suelto
    if (numeros.filter((n) => /[%,$]/.test(n)).length >= 2) return [cifras[1], ...numeros]
  }
  return [t]
}

const esFila = (celdas: string[]) => celdas.length >= 2

/**
 * Líneas que se repiten en muchas páginas (encabezados y pies), con la posición de su primera
 * aparición: solo esa se muestra.
 */
function lineasRepetidas(lineas: string[]) {
  const cuenta = new Map<string, { veces: number; primera: number }>()
  lineas.forEach((l, i) => {
    const n = normalizarLinea(l)
    if (n.length < 4 || n.length > 90 || MARCA_PAGINA.test(l)) return
    if (esFila(celdasDe(l))) return
    const previa = cuenta.get(n)
    if (previa) previa.veces++
    else cuenta.set(n, { veces: 1, primera: i })
  })
  return new Map([...cuenta].filter(([, c]) => c.veces >= 3).map(([n, c]) => [n, c.primera]))
}

interface TablaEnCurso {
  cabeceras: { celdas: string[]; linea: number }[]
  etiqueta: string | null
  filas: Fila[]
  lineas: number[]
}

/** Conserva la disposición original (organigramas, cuadros) sin la sangría común. */
function comoDiagrama(t: TablaEnCurso, lineas: string[]): Bloque {
  const desde = Math.min(...t.lineas)
  const hasta = Math.max(...t.lineas)
  const bloque = lineas.slice(desde, hasta + 1).filter((l) => !MARCA_PAGINA.test(l))
  const minimo = Math.min(...bloque.filter((l) => l.trim()).map(sangria))
  return {
    tipo: "diagrama",
    texto: bloque.map((l) => l.slice(minimo).trimEnd()).join("\n").replace(/\n{3,}/g, "\n\n"),
    lineas: t.lineas,
  }
}

function cerrarTabla(t: TablaEnCurso, lineas: string[]): Bloque[] {
  const datos = t.filas.filter((f): f is FilaDatos => f.tipo === "datos")
  if (!datos.length && t.cabeceras.filter((c) => c.celdas.length >= 3).length >= 3) return [comoDiagrama(t, lineas)]
  if (!datos.length) {
    // solo cabeceras o grupos: texto justificado con espacios anchos, no una tabla
    const texto = [...t.cabeceras.map((c) => c.celdas.join(" ")), ...t.filas.map((f) => (f.tipo === "grupo" ? f.texto : ""))]
      .filter(Boolean)
      .join(" ")
    return texto ? [{ tipo: "parrafo", texto, lineas: t.lineas }] : []
  }
  const columnas = Math.max(...datos.map((f) => f.celdas.length))
  const completas = datos.filter((f) => f.celdas.length === columnas).length
  const conCifras = datos.filter((f) => f.celdas.slice(1).some(tieneDigito)).length
  // Disposición visual sin filas regulares (organigramas, cuadros): se conserva tal cual.
  if (columnas >= 5 && completas / datos.length < 0.5 && conCifras / datos.length < 0.5) return [comoDiagrama(t, lineas)]
  // Las filas con menos celdas que la tabla llevan la etiqueta en la primera columna y las cifras al final.
  const filas = t.filas.map((f) => {
    if (f.tipo !== "datos" || f.celdas.length >= columnas) return f
    const [primera, ...resto] = f.celdas
    return { ...f, celdas: [primera, ...Array(columnas - f.celdas.length).fill(""), ...resto] }
  })
  return [{ tipo: "tabla", cabecera: armarCabecera(t, columnas), columnas, filas, lineas: t.lineas }]
}

function armarCabecera(t: TablaEnCurso, columnas: number): CabeceraTabla | null {
  if (!t.cabeceras.length) return null
  let superior: CabeceraTabla["superior"] = null
  let nombres: string[] | null = null
  for (const { celdas } of t.cabeceras) {
    if (celdas.length === columnas) nombres = celdas
    else if (celdas.length === columnas - 1) nombres = [t.etiqueta ?? "", ...celdas]
    else if (celdas.length < columnas - 1 && (columnas - 1) % celdas.length === 0) {
      const span = (columnas - 1) / celdas.length
      superior = [{ texto: "", span: 1 }, ...celdas.map((texto) => ({ texto, span }))]
    }
  }
  if (!nombres && superior) nombres = [t.etiqueta ?? "", ...Array(columnas - 1).fill("")]
  if (!nombres) return null
  return { superior, columnas: nombres }
}

/**
 * Bloques del texto. `rango` limita la conversión a unas líneas (el fragmento citado) sin perder
 * el contexto del documento para reconocer encabezados repetidos.
 */
export function bloquesPdf(texto: string, rango?: { desde: number; hasta: number }): Bloque[] {
  const lineas = texto.split("\n")
  const repetidas = lineasRepetidas(lineas)
  /** ¿Es un encabezado o pie de página repetido que ya se mostró antes de esta línea? */
  const repetida = (i: number) => {
    const primera = repetidas.get(normalizarLinea(lineas[i]))
    return primera !== undefined && i > primera
  }
  const desde = rango?.desde ?? 0
  const hasta = rango?.hasta ?? lineas.length - 1

  const salida: Bloque[] = []
  let tabla = null as TablaEnCurso | null
  let parrafo = null as { partes: string[]; lineas: number[]; nota: boolean } | null
  let lista = null as Extract<Bloque, { tipo: "lista" }> | null
  let grafico = null as Extract<Bloque, { tipo: "grafico" }> | null

  const cerrarParrafo = () => {
    if (!parrafo) return
    const texto = unirRenglones(parrafo.partes)
    salida.push({ tipo: parrafo.nota ? "nota" : "parrafo", texto, lineas: parrafo.lineas })
    parrafo = null
  }
  const cerrarLista = () => {
    if (lista) salida.push(lista)
    lista = null
  }
  const cerrarGrafico = () => {
    if (grafico) salida.push(grafico.valores.length >= 3 ? grafico : { tipo: "parrafo", texto: grafico.valores.join(" "), lineas: grafico.lineas })
    grafico = null
  }
  const cerrarTodo = () => {
    cerrarGrafico()
    cerrarParrafo()
    cerrarLista()
    if (tabla) salida.push(...cerrarTabla(tabla, lineas))
    tabla = null
  }
  const abrirTabla = () => (tabla ??= { cabeceras: [], etiqueta: null, filas: [], lineas: [] })

  /** ¿La siguiente línea con contenido (sin cruzar más de dos en blanco) es una fila? */
  const siguienteEsFila = (i: number) => {
    let blancos = 0
    for (let j = i + 1; j <= hasta; j++) {
      const l = lineas[j]
      if (MARCA_PAGINA.test(l)) continue
      if (!l.trim()) {
        if (++blancos > 2) return false
        continue
      }
      if (repetida(j)) continue
      return esFila(celdasDe(l)) || esEtiquetaPartida(j)
    }
    return false
  }

  /** ¿La siguiente línea con contenido es un renglón largo de texto corrido? */
  const siguienteLarga = (i: number) => {
    for (let j = i + 1; j <= Math.min(hasta, i + 3); j++) {
      const l = lineas[j]
      if (!l.trim() || MARCA_PAGINA.test(l)) continue
      return normalizarLinea(l).length >= 60 && celdasDe(l).length === 1
    }
    return false
  }

  /** Etiqueta partida en dos renglones con el valor en medio («Consignación … a la / $ 9.000 / cuenta)»). */
  const esEtiquetaPartida = (i: number) => {
    const l = lineas[i]
    const siguiente = lineas[i + 1]
    if (i + 1 > hasta || !siguiente?.trim() || sangria(l) > 12) return false
    const celdas = celdasDe(siguiente)
    return esFila(celdas) && sangria(siguiente) >= 30 && celdasDe(l).length === 1
  }

  for (let i = desde; i <= hasta; i++) {
    const l = lineas[i]
    const pagina = MARCA_PAGINA.exec(l)
    if (pagina) {
      cerrarParrafo()
      cerrarLista()
      if (tabla) tabla.filas.push({ tipo: "pagina", n: Number(pagina[1]), lineas: [i] })
      else salida.push({ tipo: "pagina", n: Number(pagina[1]), lineas: [i] })
      continue
    }
    if (!l.trim()) {
      cerrarParrafo()
      continue
    }
    const normal = normalizarLinea(l)
    if (repetida(i)) continue
    if (!tabla && !parrafo && esResiduo(normal) && !ITEM_LISTA.test(l)) {
      cerrarLista()
      grafico ??= { tipo: "grafico", valores: [], lineas: [] }
      grafico.valores.push(...normal.split(/\s{2,}|\s(?=-?\d)/).filter(Boolean))
      grafico.lineas.push(i)
      continue
    }
    cerrarGrafico()
    if (SEPARADOR.test(l)) {
      cerrarTodo()
      salida.push({ tipo: "separador", lineas: [i] })
      continue
    }

    // Fila con la etiqueta partida alrededor del valor.
    if (esEtiquetaPartida(i)) {
      cerrarParrafo()
      cerrarLista()
      const t = abrirTabla()
      const celdas = celdasDe(lineas[i + 1])
      const usadas = [i, i + 1]
      let etiqueta = normal
      const despues = lineas[i + 2]
      if (i + 2 <= hasta && despues?.trim() && sangria(despues) <= 12 && celdasDe(despues).length === 1 && !despues.trim().startsWith("* Nota")) {
        etiqueta = `${etiqueta} ${normalizarLinea(despues)}`
        usadas.push(i + 2)
      }
      t.filas.push({ tipo: "datos", celdas: [etiqueta, ...celdas], lineas: usadas })
      t.lineas.push(...usadas)
      i = usadas[usadas.length - 1]
      continue
    }

    const celdas = celdasDe(l)
    if (esFila(celdas)) {
      cerrarParrafo()
      cerrarLista()
      const t = abrirTabla()
      const sinCifras = !celdas.some(tieneDigito)
      const datos = t.filas.some((f) => f.tipo === "datos")
      const esCabecera = sinCifras && (!datos || celdas.every((c) => PALABRAS_CABECERA.test(c.trim())))
      if (esCabecera) {
        // cabecera repetida en otra página: no se vuelve a mostrar
        if (!datos) t.cabeceras.push({ celdas, linea: i })
      } else {
        t.filas.push({ tipo: "datos", celdas, lineas: [i] })
      }
      t.lineas.push(i)
      continue
    }

    const item = ITEM_LISTA.exec(l)
    if (item && !FECHA_CORTA.test(l) && !(tabla && tabla.filas.some((f) => f.tipo === "datos"))) {
      if (tabla) {
        salida.push(...cerrarTabla(tabla, lineas))
        tabla = null
      }
      cerrarParrafo()
      lista ??= { tipo: "lista", items: [], lineas: [] }
      lista.items.push({ n: item[1], texto: normalizarLinea(item[2]), linea: i })
      lista.lineas.push(i)
      continue
    }
    cerrarLista()

    const nota = normal.startsWith("*")
    const palabras = normal.split(" ").length
    const corta = palabras <= 10 && !/[.:;,]$/.test(normal)
    const grupo = palabras <= 14 && !/[.:;,]$/.test(normal) && !esMayusculas(normal)

    // Dentro de una tabla: etiqueta de columna, grupo de filas o fin de la tabla.
    if (tabla && !nota) {
      const sinDatos = !tabla.filas.some((f) => f.tipo === "datos")
      if (sinDatos && tabla.cabeceras.length && corta && !tieneDigito(normal)) {
        tabla.etiqueta = normal
        tabla.lineas.push(i)
        continue
      }
      if (grupo && siguienteEsFila(i)) {
        tabla.filas.push({ tipo: "grupo", texto: normal, lineas: [i] })
        tabla.lineas.push(i)
        continue
      }
      cerrarTodo()
    } else if (tabla && nota) {
      cerrarTodo()
    } else if (!tabla && !nota && grupo && sangria(l) <= 12 && siguienteEsFila(i)) {
      // Grupo que abre una tabla («Cheques» antes de sus filas).
      cerrarParrafo()
      const t = abrirTabla()
      t.filas.push({ tipo: "grupo", texto: normal, lineas: [i] })
      t.lineas.push(i)
      continue
    }

    // Renglón corto que abre una sección («Visa Gold» antes de su texto): subtítulo, no inicio de párrafo.
    const subtitulo = !parrafo && palabras <= 6 && normal.length <= 50 && !/[.:;,]$/.test(normal) && !nota
    if (subtitulo && !esMayusculas(normal) && siguienteLarga(i)) {
      salida.push({ tipo: "titulo", texto: normal, mayusculas: false, lineas: [i] })
      continue
    }

    // Título: en mayúsculas, o centrado (con sangría), con mayúscula inicial y aislado por renglones en blanco.
    const siguiente = lineas[i + 1] ?? ""
    const antesEnBlanco = !lineas[i - 1]?.trim() || MARCA_PAGINA.test(lineas[i - 1])
    const sueltaDespues = !siguiente.trim() || sangria(siguiente) < sangria(l) - 15
    const centrado = sangria(l) >= 20 && normal.length <= 70 && /^\p{Lu}/u.test(normal) && antesEnBlanco && sueltaDespues
    // En mayúsculas pero sin quedar a medias («… QUE EN ADELANTE SE») ni seguir en mayúsculas el renglón de abajo.
    const tituloMayus =
      esMayusculas(normal) && !CONECTOR_FINAL.test(normal) && (!siguiente.trim() || !esMayusculas(normalizarLinea(siguiente)))
    if (!nota && corta && (tituloMayus || centrado)) {
      cerrarParrafo()
      salida.push({ tipo: "titulo", texto: normal, mayusculas: esMayusculas(normal), lineas: [i] })
      continue
    }

    // Un renglón que empieza con «*» abre una nota nueva; los demás continúan el párrafo o la nota.
    if (parrafo && !nota) {
      parrafo.partes.push(normal)
      parrafo.lineas.push(i)
      continue
    }
    cerrarParrafo()
    parrafo = { partes: [normal], lineas: [i], nota }
  }
  cerrarTodo()
  return salida
}

/** Une los renglones de un párrafo; corrige la partición de palabras con guion al final del renglón. */
function unirRenglones(partes: string[]) {
  return partes.reduce((acc, p) => {
    if (!acc) return p
    if (/\p{L}-$/u.test(acc) && /^\p{Ll}/u.test(p)) return acc.slice(0, -1) + p
    return `${acc} ${p}`
  }, "")
}

/**
 * Ubica el fragmento citado (texto con espacios compactados) dentro del documento con su
 * disposición original. Devuelve el rango de líneas o null si no se encuentra.
 */
export function ubicarFragmento(documento: string, fragmento: string) {
  const lineas = documento.split("\n").map(normalizarLinea)
  const delFragmento = fragmento
    .split("\n")
    .map(normalizarLinea)
    .filter((l) => l.length >= 12)
  if (!delFragmento.length) return null
  const indice = new Map<string, number[]>()
  lineas.forEach((l, i) => {
    if (!l) return
    const lista = indice.get(l)
    if (lista) lista.push(i)
    else indice.set(l, [i])
  })
  // primera línea del fragmento que exista en el documento, y la última después de ella
  for (let a = 0; a < delFragmento.length; a++) {
    const inicios = indice.get(delFragmento[a])
    if (!inicios) continue
    for (const inicio of inicios) {
      for (let b = delFragmento.length - 1; b > a; b--) {
        const fin = (indice.get(delFragmento[b]) ?? []).find((j) => j > inicio && j - inicio < 400)
        if (fin !== undefined) return { desde: inicio, hasta: fin }
      }
    }
  }
  return null
}

/** Texto plano de una fila o bloque, para buscar el dato citado. */
export function textoDeFila(f: Fila) {
  return f.tipo === "datos" ? f.celdas.join(" ") : f.tipo === "grupo" ? f.texto : ""
}

/** Valor monetario partido en cifra y recargos («$ 9.000» y «+ IVA + Timbre»). */
export function partirValor(celda: string) {
  const m = /^((?:\$|USD|US\$)\s?[\d.,]+)\s*(\+.*)?$/.exec(celda.trim())
  return m ? { cifra: m[1], resto: m[2]?.trim() ?? "" } : null
}

export interface DatoCitado {
  lineas: Set<number>
  /** Fila de tabla que respalda la respuesta, con su tabla para nombrar las columnas. */
  fila: FilaDatos | null
  tabla: Extract<Bloque, { tipo: "tabla" }> | null
  /** Texto del párrafo o nota cuando el dato no está en una tabla. */
  texto: string | null
}

/** Busca entre filas y párrafos el que respalda la respuesta (misma cifra y palabras en común). */
export function buscarDatoCitado(bloques: Bloque[], referencia: string): DatoCitado | null {
  if (!referencia) return null
  const candidatos: { texto: string; lineas: number[]; fila?: FilaDatos; tabla?: Extract<Bloque, { tipo: "tabla" }> }[] = []
  for (const b of bloques) {
    if (b.tipo === "tabla") {
      for (const f of b.filas) if (f.tipo === "datos") candidatos.push({ texto: textoDeFila(f), lineas: f.lineas, fila: f, tabla: b })
    } else if (b.tipo === "parrafo" || b.tipo === "nota" || b.tipo === "titulo") {
      candidatos.push({ texto: b.texto, lineas: b.lineas })
    } else if (b.tipo === "lista") {
      for (const it of b.items) candidatos.push({ texto: it.texto, lineas: [it.linea] })
    }
  }
  const i = mejorLinea(
    candidatos.map((c) => c.texto),
    referencia
  )
  if (i < 0) return null
  const c = candidatos[i]
  return { lineas: new Set(c.lineas), fila: c.fila ?? null, tabla: c.tabla ?? null, texto: c.fila ? null : c.texto }
}
