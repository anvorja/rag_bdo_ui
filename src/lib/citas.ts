export type Segmento = { tipo: "texto"; valor: string } | { tipo: "cita"; n: number }

/**
 * Separa el texto de la respuesta en trozos de texto y marcas de cita.
 * Acepta «[1]», «[1][2]» y «[1, 2]». Una marca que no corresponde a ninguna cita se deja como texto.
 */
export function segmentarCitas(texto: string, validas: Set<number>): Segmento[] {
  const salida: Segmento[] = []
  const patron = /\[(\d+(?:\s*,\s*\d+)*)\]/g
  let ultimo = 0
  for (const m of texto.matchAll(patron)) {
    const numeros = m[1].split(",").map((x) => Number(x.trim()))
    if (!numeros.every((n) => validas.has(n))) continue
    if (m.index > ultimo) salida.push({ tipo: "texto", valor: texto.slice(ultimo, m.index) })
    for (const n of numeros) salida.push({ tipo: "cita", n })
    ultimo = m.index + m[0].length
  }
  if (ultimo < texto.length) salida.push({ tipo: "texto", valor: texto.slice(ultimo) })
  return salida
}

/** Cifras de un texto («0,8%», «$3.200», «2026»), sin los números de las marcas de cita. */
export function extraerCifras(texto: string) {
  const sinMarcas = texto.replace(/\[(\d+(?:\s*,\s*\d+)*)\]/g, " ")
  const encontradas = sinMarcas.match(/\d[\d.,]*\d%?|\d%/g) ?? []
  return [...new Set(encontradas.filter((c) => c.replace(/\D/g, "").length >= 2 || c.includes("%")))]
}

const compactar = (t: string) => t.replace(/\s+/g, "")

/** ¿La línea contiene alguna de las cifras? (ignora espacios: «0,8 %» = «0,8%») */
export function contieneCifra(linea: string, cifras: string[]) {
  const l = compactar(linea)
  return cifras.some((c) => {
    const i = l.indexOf(compactar(c))
    if (i < 0) return false
    // evita que «8%» coincida dentro de «18%» o «2,8%»
    const antes = l[i - 1]
    return !antes || !/[\d.,]/.test(antes)
  })
}

const VACIAS = new Set(
  "para como tiene tienen este esta estos estas desde hasta sobre entre donde cuando cual cuales banco occidente valor vigente vigencia aplica tanto cada otros otras puede pueden debes tarifa tarifas personas empresas".split(" ")
)

const normalizar = (t: string) =>
  t.toLocaleLowerCase("es-CO").normalize("NFD").replace(/[\u0300-\u036f]/g, "")

/** Palabras con significado de un texto (5+ letras, sin acentos ni palabras comunes). */
export function palabrasClave(texto: string) {
  const palabras = normalizar(texto.replace(/\[(\d+(?:\s*,\s*\d+)*)\]/g, " ")).match(/\p{L}{5,}/gu) ?? []
  return new Set(palabras.filter((p) => !VACIAS.has(p)))
}

/**
 * La línea del fragmento que respalda la respuesta: debe contener una cifra de la respuesta Y
 * compartir al menos una palabra clave con ella (una cifra sola puede ser el precio de otro servicio).
 * Gana la que comparte más palabras. Devuelve -1 si ninguna cumple.
 */
export function mejorLinea(lineas: string[], referencia: string) {
  const cifras = extraerCifras(referencia)
  const claves = palabrasClave(referencia)
  let mejor = -1
  let puntaje = 0
  lineas.forEach((l, i) => {
    if (!cifras.length || !contieneCifra(l, cifras)) return
    const compartidas = [...palabrasClave(l)].filter((p) => claves.has(p)).length
    if (compartidas > puntaje) {
      puntaje = compartidas
      mejor = i
    }
  })
  return mejor
}
