/**
 * Academia CRC – Cuentas demo (alumno, profesor, admin)
 * Crea/actualiza tres usuarios de demostración con contraseña conocida
 * e inscribe al alumno demo en el curso para acceso completo.
 *
 * Uso:  node scripts/seed-demo.mjs
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

const PASS = process.env.DEMO_PASSWORD || "DemoCRC2026!";
const CURSO_SLUG = "salud-mental-infantil-trabajo-social";

const cuentas = [
  { email: "alumno.demo@centrodereflexionescriticas.com", rol: "alumno", nombre: "Alumno", apellido: "Demo" },
  { email: "profesor.demo@centrodereflexionescriticas.com", rol: "profesor", nombre: "Profesor", apellido: "Demo" },
  { email: "admin.demo@centrodereflexionescriticas.com", rol: "admin", nombre: "Admin", apellido: "Demo" },
];

async function ensure(c) {
  const { data: ex } = await sb.from("profiles").select("id").eq("email", c.email).maybeSingle();
  let id = ex?.id;
  if (!id) {
    const { data, error } = await sb.auth.admin.createUser({
      email: c.email, password: PASS, email_confirm: true,
      user_metadata: { nombre: c.nombre, apellido: c.apellido },
    });
    if (error) throw new Error(c.email + ": " + error.message);
    id = data.user.id;
  } else {
    await sb.auth.admin.updateUserById(id, { password: PASS, email_confirm: true });
  }
  await sb.from("profiles").update({ nombre: c.nombre, apellido: c.apellido, rol: c.rol }).eq("id", id);
  console.log("✓", c.rol.padEnd(9), c.email);
  return id;
}

async function main() {
  const ids = {};
  for (const c of cuentas) ids[c.rol] = await ensure(c);

  const { data: curso } = await sb.from("cursos").select("id").eq("slug", CURSO_SLUG).single();
  if (curso) {
    const { data: exi } = await sb.from("inscripciones").select("id").eq("alumno_id", ids.alumno).eq("curso_id", curso.id).maybeSingle();
    if (!exi) {
      await sb.from("inscripciones").insert({ alumno_id: ids.alumno, curso_id: curso.id, estado: "activa", monto_pagado: 0, metodo_pago: "demo" });
    } else {
      await sb.from("inscripciones").update({ estado: "activa" }).eq("id", exi.id);
    }
    console.log("✓ alumno demo inscrito en el curso (acceso completo)");
  }
  console.log("\nContraseña de las 3 cuentas:", PASS);
}

main().catch((e) => { console.error("✖", e.message); process.exit(1); });
