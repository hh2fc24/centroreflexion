/**
 * Academia CRC – Carga del primer curso a Supabase
 * --------------------------------------------------
 * Sube el material (PDF + slides + texto) al bucket "academia" de Storage
 * y crea/actualiza: perfil del profesor, curso, módulos y lecciones.
 *
 * Requisitos:
 *   - Variables en .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *   - Carpeta ./academia-content (generada con el material de las clases)
 *   - npm i  (ya incluye @supabase/supabase-js)
 *
 * Uso:
 *   node scripts/seed-academia.mjs
 *
 * Idempotente: puede correrse varias veces. Reemplaza módulos/lecciones
 * del curso y hace upsert del resto.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CONTENT_DIR = join(ROOT, "academia-content");

// ── Cargar .env.local manualmente (sin dependencias) ──
function loadEnv() {
  const p = join(ROOT, ".env.local");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PROFESOR_EMAIL = process.env.PROFESOR_EMAIL || "juan.rauld@centrodereflexionescriticas.com";

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("✖ Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const BUCKET = "academia";
const CURSO_SLUG = "salud-mental-infantil-trabajo-social";

// ── Definición del curso ──────────────────────────────────
const PROFESOR = {
  email: PROFESOR_EMAIL,
  nombre: "Juan Carlos",
  apellido: "Rauld Farías",
  bio:
    "Trabajador social, autor y analista en políticas de infancia. Doctorando en Trabajo Social " +
    "(Universidad Rovira i Virgili, España), Magíster en Filosofía Política Contemporánea (UDP) y " +
    "Trabajador Social (UTEM). Con 16 años de experiencia en dirección de programas de infancia, " +
    "asesoría y gestión pública en contextos de alta complejidad. Autor de tres libros que analizan " +
    "críticamente cómo el Estado chileno gobierna la infancia pobre bajo una racionalidad neoliberal y " +
    "tecnocrática. Su trabajo sostiene que la crisis de la infancia no es un problema técnico ni de " +
    "gestión, sino estructural y político.",
};

const CURSO = {
  slug: CURSO_SLUG,
  titulo: "Intervención Social en Salud Mental Infantil en Trabajo Social",
  descripcion_corta:
    "Curso de nivel magíster sobre intervención clínica en salud mental infanto-juvenil desde una " +
    "perspectiva crítica e informada en el trauma.",
  descripcion:
    "Curso predominantemente teórico-práctico (UC · sigla TSM3026, nivel magíster). El propósito es que " +
    "las y los estudiantes desarrollen y profundicen conocimientos relativos a la intervención social en " +
    "salud mental infanto-juvenil, desplegando habilidades clínicas y de comprensión terapéutica para la " +
    "atención de niños, niñas y adolescentes, desde una perspectiva centrada en la comprensión del trauma " +
    "psíquico infantil.\n\n" +
    "A lo largo de las clases se abordan el modelo de salud mental comunitario y sus críticas, el trauma " +
    "psíquico y el trauma complejo, los efectos de la institucionalización y la hospitalización psiquiátrica, " +
    "la desprotección de la infancia pobre, las intervenciones familiares basadas en la evidencia, la crianza " +
    "terapéutica y la intervención frente a la conducta antisocial.\n\n" +
    "Resultados de aprendizaje: (1) conocer conceptos básicos de la salud mental infantil desde la " +
    "perspectiva informada en el trauma; (2) indagar en los aspectos de salud pública vinculados al " +
    "desarrollo psíquico temprano; y (3) aprender intervenciones sociales clínicas basadas en la evidencia.",
  precio: 149000,
  moneda: "CLP",
  estado: "publicado",
  nivel: "avanzado",
  categoria: "Salud mental infantil",
  duracion_horas: 24,
};

const MODULOS = [
  {
    titulo: "Módulo 1 · Fundamentos críticos: salud mental, trauma y subjetividad infantil",
    descripcion:
      "Marco conceptual del curso: el modelo de salud mental comunitario y sus críticas, y el trauma " +
      "psíquico como eje de la intervención.",
    slugs: ["programa-del-curso", "clase-1", "clase-2", "clase-3", "clase-4", "clase-5"],
  },
  {
    titulo: "Módulo 2 · Institucionalización, familia e intervención",
    descripcion:
      "De la institución a la familia: efectos de la hospitalización, desprotección de la infancia pobre, " +
      "intervenciones familiares, crianza terapéutica y conducta antisocial.",
    slugs: [
      "efectos-hospitalizacion",
      "desproteccion-infancia",
      "intervenciones-familiares",
      "crianza-terapeutica",
      "delincuencia-justicia",
    ],
  },
];

const MIME = { ".pdf": "application/pdf", ".webp": "image/webp" };
const mimeOf = (f) => MIME[f.slice(f.lastIndexOf("."))] || "application/octet-stream";
const publicUrl = (path) =>
  `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;

function cleanText(t) {
  return (t || "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((l) => l.trim())
    .join("\n")
    .trim();
}

async function ensureBucket() {
  const { data } = await supabase.storage.getBucket(BUCKET);
  if (!data) {
    await supabase.storage.createBucket(BUCKET, { public: true });
    console.log("✓ Bucket 'academia' creado");
  } else {
    console.log("✓ Bucket 'academia' ya existe");
  }
}

async function uploadLessonAssets(slug) {
  const dir = join(CONTENT_DIR, slug);
  const files = readdirSync(dir).filter((f) => f.endsWith(".webp") || f.endsWith(".pdf"));
  // Reanudable: omite los que ya están subidos
  const { data: existing } = await supabase.storage.from(BUCKET).list(`cursos/${CURSO_SLUG}/${slug}`, { limit: 1000 });
  const yaSubidos = new Set((existing ?? []).map((o) => o.name));
  let up = 0;
  for (const f of files) {
    if (yaSubidos.has(f)) continue;
    const path = `cursos/${CURSO_SLUG}/${slug}/${f}`;
    const body = readFileSync(join(dir, f));
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, body, { contentType: mimeOf(f), upsert: true });
    if (error) throw new Error(`upload ${path}: ${error.message}`);
    up++;
  }
  return up;
}

async function ensureProfesor() {
  // ¿existe ya un perfil con ese email?
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", PROFESOR.email)
    .maybeSingle();

  let id = existing?.id;
  if (!id) {
    const { data: created, error } = await supabase.auth.admin.createUser({
      email: PROFESOR.email,
      email_confirm: true,
      password: cryptoRandom(),
      user_metadata: { nombre: PROFESOR.nombre, apellido: PROFESOR.apellido },
      app_metadata: { role: "profesor" }, // el middleware lee el rol del JWT
    });
    if (error) throw new Error(`crear profesor: ${error.message}`);
    id = created.user.id;
  } else {
    await supabase.auth.admin.updateUserById(id, { app_metadata: { role: "profesor" } });
  }

  const { error: upErr } = await supabase
    .from("profiles")
    .update({
      nombre: PROFESOR.nombre,
      apellido: PROFESOR.apellido,
      bio: PROFESOR.bio,
      rol: "profesor",
    })
    .eq("id", id);
  if (upErr) throw new Error(`perfil profesor: ${upErr.message}`);
  console.log(`✓ Profesor listo: ${PROFESOR.nombre} ${PROFESOR.apellido} (${id})`);
  return id;
}

function cryptoRandom() {
  return "Crc-" + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + "!9";
}

async function upsertCurso(profesorId) {
  const imagen_url = publicUrl(`cursos/${CURSO_SLUG}/clase-1/cover.webp`);
  const { data: existing } = await supabase
    .from("cursos")
    .select("id")
    .eq("slug", CURSO.slug)
    .maybeSingle();

  const payload = { ...CURSO, profesor_id: profesorId, imagen_url };
  let id;
  if (existing) {
    const { error } = await supabase.from("cursos").update(payload).eq("id", existing.id);
    if (error) throw new Error(`update curso: ${error.message}`);
    id = existing.id;
  } else {
    const { data, error } = await supabase.from("cursos").insert(payload).select("id").single();
    if (error) throw new Error(`insert curso: ${error.message}`);
    id = data.id;
  }
  console.log(`✓ Curso: ${CURSO.titulo} (${id})`);
  return id;
}

async function rebuildModulosYLecciones(cursoId) {
  // Borrar módulos previos (cascade borra lecciones); el progreso se mantiene por curso.
  await supabase.from("modulos").delete().eq("curso_id", cursoId);

  const manifest = JSON.parse(readFileSync(join(CONTENT_DIR, "manifest.json"), "utf8"));
  const bySlug = Object.fromEntries(manifest.map((m) => [m.slug, m]));

  let nMods = 0, nLecs = 0;
  for (let mi = 0; mi < MODULOS.length; mi++) {
    const mod = MODULOS[mi];
    const { data: modRow, error: modErr } = await supabase
      .from("modulos")
      .insert({ curso_id: cursoId, titulo: mod.titulo, descripcion: mod.descripcion, orden: mi + 1 })
      .select("id")
      .single();
    if (modErr) throw new Error(`insert modulo: ${modErr.message}`);
    nMods++;

    for (let li = 0; li < mod.slugs.length; li++) {
      const slug = mod.slugs[li];
      const meta = bySlug[slug];
      if (!meta) throw new Error(`manifest sin entrada para ${slug}`);

      const base = publicUrl(`cursos/${CURSO_SLUG}/${slug}`);
      const textJson = JSON.parse(readFileSync(join(CONTENT_DIR, slug, "text.json"), "utf8"));
      const contenido = JSON.stringify({
        kind: "slidedeck",
        base,
        slides: meta.slides,
        pdf: "doc.pdf",
        cover: "cover.webp",
        text: (textJson.text || []).map(cleanText).filter(Boolean),
      });

      const { error: lecErr } = await supabase.from("lecciones").insert({
        modulo_id: modRow.id,
        curso_id: cursoId,
        titulo: meta.titulo,
        descripcion: meta.descripcion,
        tipo: "documento",
        contenido,
        recurso_url: `${base}/doc.pdf`,
        orden: li + 1,
        es_preview: !!meta.es_preview,
      });
      if (lecErr) throw new Error(`insert leccion ${slug}: ${lecErr.message}`);
      nLecs++;
      console.log(`   · ${meta.titulo}  (${meta.slides} slides${meta.es_preview ? ", preview" : ""})`);
    }
  }
  console.log(`✓ ${nMods} módulos, ${nLecs} lecciones`);
}

async function main() {
  console.log(`\n🎓 Academia CRC — sembrando "${CURSO.titulo}"\n`);
  if (!existsSync(CONTENT_DIR)) {
    console.error(`✖ No existe ${CONTENT_DIR}. Genera el material primero.`);
    process.exit(1);
  }

  await ensureBucket();

  const slugs = MODULOS.flatMap((m) => m.slugs);
  console.log(`\n⬆  Subiendo material de ${slugs.length} lecciones a Storage…`);
  let total = 0;
  for (const slug of slugs) total += await uploadLessonAssets(slug);
  console.log(`✓ ${total} archivos subidos al bucket '${BUCKET}'`);

  console.log("");
  const profesorId = await ensureProfesor();
  const cursoId = await upsertCurso(profesorId);
  await rebuildModulosYLecciones(cursoId);

  console.log(`\n✅ Listo. Curso publicado en /academia/cursos/${CURSO_SLUG}\n`);
}

main().catch((e) => {
  console.error("\n✖ Error:", e.message, "\n");
  process.exit(1);
});
