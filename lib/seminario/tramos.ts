/**
 * Tramos de precio del seminario "Desprotección de la Infancia" (cohorte 1).
 *
 * Fuente única: la landing los muestra desde aquí y la ruta de pago calcula
 * el monto desde aquí. El precio NUNCA viaja desde el navegador — si el
 * cliente pudiera mandar el monto, cualquiera pagaría el valor de Fundadores
 * después de que se agotaron esos cinco cupos.
 *
 * Un tramo se cierra por lo que ocurra primero: que se llenen sus cupos o que
 * pase su fecha.
 */

export const SEMINARIO_CUPOS_TOTALES = 15;

/**
 * Cupos restantes a partir de los cuales la landing muestra la cifra.
 *
 * Con la cohorte recién abierta, "quedan 15 de 15" le dice a cada visitante que
 * nadie se ha inscrito todavía. Sobre este umbral se muestra el tamaño de la
 * cohorte ("cohorte cerrada de 15 personas"); bajo él, la cifra real.
 */
export const UMBRAL_CUPOS_VISIBLES = 8;

/** true cuando conviene mostrar cuántos cupos quedan (hay, y son pocos). */
export function mostrarCuposRestantes(disponibles: number) {
  return disponibles > 0 && disponibles <= UMBRAL_CUPOS_VISIBLES;
}

export type TramoId = "fundadores" | "anticipada" | "general";

export interface Tramo {
  id: TramoId;
  nombre: string;
  /** Primer y último cupo del tramo, 1-indexado e inclusivo. */
  desde: number;
  hasta: number;
  precio: number;
  ahorro: string;
  /** Cierre del tramo en hora de Chile (UTC-3 en octubre). */
  vence: string;
  nota: string;
}

export const TRAMOS: Tramo[] = [
  {
    id: "fundadores",
    nombre: "Fundadores",
    desde: 1,
    hasta: 5,
    precio: 225_000,
    ahorro: "Ahorras $75.000",
    vence: "2026-10-01T23:59:59-03:00",
    nota: "Hasta el jueves 1 de octubre, o hasta agotar los cinco cupos.",
  },
  {
    id: "anticipada",
    nombre: "Anticipada",
    desde: 6,
    hasta: 10,
    precio: 265_000,
    ahorro: "Ahorras $35.000",
    vence: "2026-10-09T23:59:59-03:00",
    nota: "Hasta el viernes 9 de octubre, o hasta agotar los cinco cupos.",
  },
  {
    id: "general",
    nombre: "General",
    desde: 11,
    hasta: 15,
    precio: 300_000,
    ahorro: "Valor de lista",
    vence: "2026-10-13T23:59:59-03:00",
    nota: "Hasta el cierre de matrícula, martes 13 de octubre.",
  },
];

export type EstadoTramo = "vigente" | "agotado" | "vencido" | "proximo";

export interface EstadoVenta {
  vendidos: number;
  disponibles: number;
  /** Tramo al que corresponde el próximo cupo, o null si ya no se puede comprar. */
  vigente: Tramo | null;
  /** Por qué no se puede comprar, cuando `vigente` es null. */
  motivo: "abierto" | "sin_cupos" | "cerrado";
}

export function formatoCLP(n: number) {
  return "$" + n.toLocaleString("es-CL");
}

/**
 * Fecha de cierre de un tramo para mostrar en texto corrido, en hora de Chile:
 * "jueves 1 de octubre". Se calcula desde `vence` para que el día de la semana
 * nunca quede desalineado con la fecha real.
 */
export function fechaCierreLegible(tramo: Tramo) {
  const partes = new Intl.DateTimeFormat("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "America/Santiago",
  }).formatToParts(new Date(tramo.vence));
  const parte = (tipo: Intl.DateTimeFormatPartTypes) => partes.find((p) => p.type === tipo)?.value ?? "";
  return `${parte("weekday")} ${parte("day")} de ${parte("month")}`;
}

/**
 * Resuelve qué tramo aplica al próximo cupo.
 *
 * Si el tramo que toca por cupo ya venció por fecha, se salta al siguiente que
 * siga vigente: es preferible cobrar el valor mayor que dejar la compra caída.
 */
export function resolverEstadoVenta(vendidos: number, ahora: Date = new Date()): EstadoVenta {
  const disponibles = Math.max(SEMINARIO_CUPOS_TOTALES - vendidos, 0);

  if (disponibles === 0) {
    return { vendidos, disponibles, vigente: null, motivo: "sin_cupos" };
  }

  const proximoCupo = vendidos + 1;
  const candidatos = TRAMOS.filter(
    (t) => t.hasta >= proximoCupo && new Date(t.vence).getTime() > ahora.getTime()
  );

  if (candidatos.length === 0) {
    return { vendidos, disponibles, vigente: null, motivo: "cerrado" };
  }

  return { vendidos, disponibles, vigente: candidatos[0], motivo: "abierto" };
}

export function estadoDeTramo(tramo: Tramo, estado: EstadoVenta): EstadoTramo {
  if (estado.vigente?.id === tramo.id) return "vigente";
  if (estado.vendidos >= tramo.hasta) return "agotado";
  if (new Date(tramo.vence).getTime() <= Date.now()) return "vencido";
  return "proximo";
}
