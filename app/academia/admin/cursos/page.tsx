/**
 * Academia CRC – Panel admin: todos los cursos
 * Ruta protegida: /academia/admin/cursos (solo rol admin)
 */
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export default async function AdminCursosPage() {
  if (!isSupabaseConfigured()) redirect("/academia");

  const supabase = await createClient();
  if (!supabase) redirect("/academia");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/academia/login?redirect=/academia/admin/cursos");

  const { data: profileData } = await supabase
    .from("profiles")
    .select("rol")
    .eq("id", user.id)
    .single();
  const profile = profileData as { rol: string } | null;

  if (!profile || profile.rol !== "admin") redirect("/academia/dashboard");

  const { data: cursosData } = await supabase
    .from("cursos")
    .select(`id, slug, titulo, estado, precio, moneda, created_at, profiles (nombre, apellido)`)
    .order("created_at", { ascending: false });
  const cursos = cursosData as Array<{
    id: string;
    slug: string;
    titulo: string;
    estado: string;
    precio: number | string | null;
    moneda: string | null;
    profiles: { nombre: string | null; apellido: string | null } | { nombre: string | null; apellido: string | null }[] | null;
  }> | null;

  const estadoColor: Record<string, string> = {
    publicado: "text-green-700 bg-green-50 border-green-200",
    borrador:  "text-yellow-700 bg-yellow-50 border-yellow-200",
    archivado: "text-gray-500 bg-gray-50 border-gray-200",
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1
          style={{
            fontFamily: "var(--font-cormorant, Georgia, serif)",
            fontSize: "2.5rem",
            fontWeight: 700,
            color: "var(--ac-text)",
          }}
        >
          Administración de cursos
        </h1>
        <Link
          href="/academia/admin/solicitudes"
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.1em] ac-btn-ghost"
        >
          Solicitudes de inscripción →
        </Link>
      </div>

      {!cursos || cursos.length === 0 ? (
        <p className="mt-12 text-center" style={{ color: "var(--ac-text-3)" }}>No hay cursos todavía.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="text-left text-xs uppercase tracking-wider"
                style={{ borderBottom: "1px solid var(--ac-border)", color: "var(--ac-text-3)" }}
              >
                <th className="pb-3 pr-4">Título</th>
                <th className="pb-3 pr-4">Profesor</th>
                <th className="pb-3 pr-4">Estado</th>
                <th className="pb-3 pr-4">Precio</th>
                <th className="pb-3">Ver</th>
              </tr>
            </thead>
            <tbody style={{ color: "var(--ac-text-2)" }}>
              {cursos.map((c) => {
                const prof = c.profiles as unknown as { nombre: string | null; apellido: string | null } | null;
                return (
                  <tr key={c.id} style={{ borderBottom: "1px solid var(--ac-border)" }}>
                    <td className="py-3 pr-4 font-medium" style={{ color: "var(--ac-text)" }}>{c.titulo}</td>
                    <td className="py-3 pr-4">{prof ? [prof.nombre, prof.apellido].filter(Boolean).join(" ") : "—"}</td>
                    <td className="py-3 pr-4">
                      <span className={`rounded-full border px-2 py-0.5 text-xs capitalize ${estadoColor[c.estado] ?? ""}`}>
                        {c.estado}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      {Number(c.precio) === 0 ? "Gratuito" : `${c.moneda} ${Number(c.precio).toLocaleString("es-CL")}`}
                    </td>
                    <td className="py-3">
                      <Link href={`/academia/cursos/${c.slug}`} style={{ color: "var(--ac-gold)" }} className="hover:underline">
                        Ver →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
