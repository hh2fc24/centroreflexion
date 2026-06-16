/**
 * Academia CRC – Panel del profesor: mis cursos
 * Ruta protegida: /academia/profesor/cursos
 */
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Profile, Curso } from "@/lib/supabase/database.types";

export default async function ProfesorCursosPage() {
  if (!isSupabaseConfigured()) redirect("/academia");

  const supabase = await createClient();
  if (!supabase) redirect("/academia");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/academia/login?redirect=/academia/profesor/cursos");

  const { data: profileRaw } = await supabase
    .from("profiles")
    .select("rol")
    .eq("id", user.id)
    .single();
  const profile = profileRaw as Pick<Profile, "rol"> | null;

  if (!profile || (profile.rol !== "profesor" && profile.rol !== "admin")) {
    redirect("/academia/dashboard");
  }

  const { data: cursosRaw } = await supabase
    .from("cursos")
    .select("id, slug, titulo, estado, precio, moneda, created_at")
    .eq("profesor_id", user.id)
    .order("created_at", { ascending: false });
  const cursosBase = (cursosRaw as Pick<Curso, "id" | "slug" | "titulo" | "estado" | "precio" | "moneda" | "created_at">[] | null) ?? [];

  const cursos = await Promise.all(
    cursosBase.map(async (c) => {
      const { count } = await supabase
        .from("inscripciones")
        .select("*", { count: "exact", head: true })
        .eq("curso_id", c.id)
        .eq("estado", "activa");
      return { ...c, nInscritos: count ?? 0 };
    })
  );

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
      <h1
        style={{
          fontFamily: "var(--font-cormorant, Georgia, serif)",
          fontSize: "2.5rem",
          fontWeight: 700,
          color: "var(--ac-text)",
        }}
      >
        Mis cursos
      </h1>

      {!cursos || cursos.length === 0 ? (
        <p className="mt-12 text-center" style={{ color: "var(--ac-text-3)" }}>
          Aún no tienes cursos asignados.
        </p>
      ) : (
        <table className="mt-8 w-full text-sm">
          <thead>
            <tr
              className="text-left text-xs uppercase tracking-wider"
              style={{ borderBottom: "1px solid var(--ac-border)", color: "var(--ac-text-3)" }}
            >
              <th className="pb-3 pr-4">Título</th>
              <th className="pb-3 pr-4">Estado</th>
              <th className="pb-3 pr-4">Precio</th>
              <th className="pb-3 pr-4">Inscritos</th>
              <th className="pb-3">Acciones</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--ac-text-2)" }}>
            {cursos.map((c) => (
              <tr key={c.id} style={{ borderBottom: "1px solid var(--ac-border)" }}>
                <td className="py-3 pr-4 font-medium" style={{ color: "var(--ac-text)" }}>{c.titulo}</td>
                <td className="py-3 pr-4">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs capitalize"
                    style={{
                      background: c.estado === "publicado" ? "rgba(74,222,128,0.12)" : c.estado === "borrador" ? "rgba(212,168,67,0.12)" : "var(--ac-surface-2)",
                      color: c.estado === "publicado" ? "#4ade80" : c.estado === "borrador" ? "var(--ac-gold)" : "var(--ac-text-3)",
                    }}
                  >
                    {c.estado}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  {Number(c.precio) === 0 ? "Gratuito" : `${c.moneda} ${Number(c.precio).toLocaleString("es-CL")}`}
                </td>
                <td className="py-3 pr-4 tabular-nums">{c.nInscritos}</td>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/academia/profesor/cursos/${c.id}/inscritos`} style={{ color: "var(--ac-gold)" }} className="hover:underline">
                      Inscritos
                    </Link>
                    <Link href={`/academia/cursos/${c.slug}`} style={{ color: "var(--ac-text-3)" }} className="hover:underline">
                      Ver
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
