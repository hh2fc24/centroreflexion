/**
 * Academia CRC – Configuración de Supabase Auth (URLs + correos branded)
 * ----------------------------------------------------------------------
 * 1) Siempre: escribe las plantillas HTML en supabase/email-templates/
 *    (para pegarlas manualmente en el dashboard si lo prefieres).
 * 2) Si defines SUPABASE_ACCESS_TOKEN (Personal Access Token de Supabase,
 *    https://supabase.com/dashboard/account/tokens): aplica TODO vía la
 *    Management API — Site URL, lista de redirects y las 5 plantillas.
 *
 * Uso:
 *   node scripts/configure-auth.mjs                 # solo escribe los .html
 *   SUPABASE_ACCESS_TOKEN=sbp_xxx node scripts/configure-auth.mjs   # aplica todo
 *
 * El token NO se guarda: se lee del entorno solo durante la ejecución.
 */
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { TEMPLATES } from "./email-templates.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = readFileSync(join(ROOT, ".env.local"), "utf8");
const get = (k) => (env.match(new RegExp("^" + k + "=(.*)$", "m")) || [])[1]?.replace(/^["']|["']$/g, "");

const SUPABASE_URL = get("NEXT_PUBLIC_SUPABASE_URL");
const REF = SUPABASE_URL?.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1];
const SITE = (get("NEXT_PUBLIC_SITE_URL") || "https://centrodereflexionescriticas.com").replace(/\/$/, "");

// URLs de redirección permitidas (callback de la academia + dev)
const REDIRECTS = [
  `${SITE}/academia/auth/callback`,
  `${SITE}/academia/**`,
  "http://localhost:3000/academia/auth/callback",
  "http://localhost:3000/academia/**",
];

// 1) Escribir plantillas a disco (referencia / pegado manual)
const outDir = join(ROOT, "supabase", "email-templates");
mkdirSync(outDir, { recursive: true });
for (const [key, t] of Object.entries(TEMPLATES)) {
  writeFileSync(join(outDir, `${key}.html`), t.html, "utf8");
}
writeFileSync(
  join(outDir, "_SUBJECTS.txt"),
  Object.entries(TEMPLATES).map(([k, t]) => `${k}: ${t.subject}`).join("\n"),
  "utf8"
);
console.log(`✓ Plantillas escritas en supabase/email-templates/ (${Object.keys(TEMPLATES).length} correos)`);

// 2) Aplicar vía Management API si hay token
const TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
if (!TOKEN) {
  console.log("\nℹ  Sin SUPABASE_ACCESS_TOKEN: solo se escribieron los archivos.");
  console.log("   Para aplicar automáticamente:");
  console.log("   SUPABASE_ACCESS_TOKEN=sbp_xxx node scripts/configure-auth.mjs\n");
  console.log("   Configura en el dashboard (Authentication → URL Configuration):");
  console.log("   • Site URL:", SITE);
  console.log("   • Redirect URLs:", REDIRECTS.join(", "));
  process.exit(0);
}

if (!REF) { console.error("✖ No pude derivar el ref del proyecto desde NEXT_PUBLIC_SUPABASE_URL"); process.exit(1); }

const body = {
  site_url: SITE,
  uri_allow_list: REDIRECTS.join(","),
  mailer_subjects_confirmation: TEMPLATES.confirmation.subject,
  mailer_subjects_recovery: TEMPLATES.recovery.subject,
  mailer_subjects_magic_link: TEMPLATES.magic_link.subject,
  mailer_subjects_invite: TEMPLATES.invite.subject,
  mailer_subjects_email_change: TEMPLATES.email_change.subject,
  mailer_templates_confirmation_content: TEMPLATES.confirmation.html,
  mailer_templates_recovery_content: TEMPLATES.recovery.html,
  mailer_templates_magic_link_content: TEMPLATES.magic_link.html,
  mailer_templates_invite_content: TEMPLATES.invite.html,
  mailer_templates_email_change_content: TEMPLATES.email_change.html,
};

const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/config/auth`, {
  method: "PATCH",
  headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

if (!res.ok) {
  console.error(`\n✖ Management API respondió ${res.status}: ${await res.text()}`);
  process.exit(1);
}
console.log(`\n✅ Supabase Auth configurado en el proyecto ${REF}:`);
console.log("   • Site URL →", SITE);
console.log("   • Redirect URLs →", REDIRECTS.length, "entradas");
console.log("   • 5 plantillas de correo branded aplicadas");
console.log("\n   (Para personalizar el remitente 'noreply@mail.app.supabase.io' necesitas un SMTP propio.)");
