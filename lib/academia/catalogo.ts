/**
 * Filtro del catálogo público de la Academia CRC.
 *
 * La base trae ocho cursos sembrados por `scripts/seed-demo.mjs` con slugs
 * `demo-*`: contenido de ejemplo, con precios de ejemplo, que nunca debió
 * quedar visible. Se ven en /academia y en /academia/cursos/<slug>, y a
 * cualquiera que llegue desde una campaña le dicen "esto es una maqueta".
 *
 * Lo correcto es borrar esas filas en Supabase; mientras eso no ocurra, el
 * sitio no las muestra. Este filtro se aplica en todas las consultas del
 * catálogo público para que no dependa de que alguien se acuerde de limpiar
 * la base antes de un lanzamiento.
 */
export const DEMO_SLUG_PREFIX = "demo-";

/** Patrón para `.not("slug", "like", ...)` en consultas a Supabase. */
export const DEMO_SLUG_LIKE = `${DEMO_SLUG_PREFIX}%`;

export function esCursoDemo(slug: string | null | undefined): boolean {
  return typeof slug === "string" && slug.startsWith(DEMO_SLUG_PREFIX);
}
