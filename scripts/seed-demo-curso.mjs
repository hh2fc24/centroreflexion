/**
 * Academia CRC – Curso demo del profesor + sincronización de roles en el JWT
 * - Propaga profiles.rol → auth app_metadata.role (lo usa el middleware)
 * - Crea un curso demo (BORRADOR, fuera del catálogo público) para profesor.demo,
 *   reutilizando material del curso real, con un alumno inscrito y progreso.
 *
 * Uso: node scripts/seed-demo-curso.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = readFileSync(join(ROOT, ".env.local"), "utf8");
const get = (k) => (env.match(new RegExp("^" + k + "=(.*)$", "m")) || [])[1]?.replace(/^["']|["']$/g, "");
const sb = createClient(get("NEXT_PUBLIC_SUPABASE_URL"), get("SUPABASE_SERVICE_ROLE_KEY"), {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEMO_SLUG = "curso-demo-profesor";
const REAL_SLUG = "salud-mental-infantil-trabajo-social";

async function syncRoles() {
  const { data: profiles } = await sb.from("profiles").select("id, email, rol");
  let n = 0;
  for (const p of profiles ?? []) {
    await sb.auth.admin.updateUserById(p.id, { app_metadata: { role: p.rol } });
    n++;
  }
  console.log(`✓ Roles sincronizados al JWT (app_metadata.role): ${n} usuarios`);
}

async function getId(email) {
  const { data } = await sb.from("profiles").select("id").eq("email", email).maybeSingle();
  return data?.id ?? null;
}

async function main() {
  await syncRoles();

  const profesorId = await getId("profesor.demo@centrodereflexionescriticas.com");
  const alumnoId = await getId("alumno.demo@centrodereflexionescriticas.com");
  if (!profesorId) { console.error("✖ Falta profesor.demo (corre seed-demo.mjs primero)"); process.exit(1); }

  // Curso demo (borrador → no aparece en el catálogo público)
  const { data: real } = await sb.from("cursos").select("id, imagen_url").eq("slug", REAL_SLUG).single();
  const cursoPayload = {
    slug: DEMO_SLUG,
    titulo: "Taller demo · Introducción al trauma (curso de prueba)",
    descripcion_corta: "Curso de demostración para el panel del profesor.",
    descripcion: "Curso de prueba creado para mostrar el panel del profesor (inscritos y progreso). No aparece en el catálogo público.",
    imagen_url: real?.imagen_url ?? null,
    precio: 0, moneda: "CLP", estado: "borrador",
    profesor_id: profesorId, nivel: "basico", categoria: "Demostración", duracion_horas: 4,
  };
  const { data: exist } = await sb.from("cursos").select("id").eq("slug", DEMO_SLUG).maybeSingle();
  let cursoId;
  if (exist) { await sb.from("cursos").update(cursoPayload).eq("id", exist.id); cursoId = exist.id; }
  else { const { data } = await sb.from("cursos").insert(cursoPayload).select("id").single(); cursoId = data.id; }
  console.log("✓ Curso demo:", cursoPayload.titulo);

  // Clonar primeras 4 lecciones del curso real
  await sb.from("modulos").delete().eq("curso_id", cursoId);
  const { data: mod } = await sb.from("modulos")
    .insert({ curso_id: cursoId, titulo: "Módulo único (demo)", orden: 1 }).select("id").single();

  const { data: realLecs } = await sb.from("lecciones")
    .select("titulo, descripcion, tipo, contenido, recurso_url, es_preview")
    .eq("curso_id", real.id).order("orden").limit(4);

  const lecIds = [];
  for (let i = 0; i < (realLecs ?? []).length; i++) {
    const l = realLecs[i];
    const { data: nl } = await sb.from("lecciones").insert({
      modulo_id: mod.id, curso_id: cursoId,
      titulo: l.titulo, descripcion: l.descripcion, tipo: l.tipo,
      contenido: l.contenido, recurso_url: l.recurso_url,
      orden: i + 1, es_preview: i === 0,
    }).select("id").single();
    lecIds.push(nl.id);
  }
  console.log(`✓ ${lecIds.length} lecciones (material reutilizado del curso real)`);

  // Inscribir al alumno demo + progreso (2 de 4 completadas)
  if (alumnoId) {
    const { data: exi } = await sb.from("inscripciones").select("id").eq("alumno_id", alumnoId).eq("curso_id", cursoId).maybeSingle();
    if (!exi) await sb.from("inscripciones").insert({ alumno_id: alumnoId, curso_id: cursoId, estado: "activa", monto_pagado: 0, metodo_pago: "demo" });
    else await sb.from("inscripciones").update({ estado: "activa" }).eq("id", exi.id);

    for (let i = 0; i < lecIds.length; i++) {
      await sb.from("progreso_lecciones").upsert(
        { alumno_id: alumnoId, leccion_id: lecIds[i], curso_id: cursoId, completada: i < 2, porcentaje_visto: i < 2 ? 100 : 30 },
        { onConflict: "alumno_id,leccion_id" }
      );
    }
    console.log("✓ alumno.demo inscrito en curso demo, 2/4 clases completadas");
  }

  console.log("\n✅ Listo. profesor.demo verá 1 curso con 1 inscrito al 50% de avance.");
}

main().catch((e) => { console.error("✖", e.message); process.exit(1); });
