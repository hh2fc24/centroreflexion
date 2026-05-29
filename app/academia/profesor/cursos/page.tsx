/**
 * Academia CRC – Panel del profesor: mis cursos
 * Ruta protegida: /academia/profesor/cursos
 */
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export default async function ProfesorCursosPage() {
  if (!isSupabaseConfigured()) redirect("/academia");

  const supabase = await createClient();
  if (!supabase) redirect("/academia");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/academia/login?redirect=/academia/profesor/cursos");

  const { data: profile } = await supabase
    .from("profiles")
    .select("rol")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.rol !== "profesor" && profile.rol !== "admin")) {
    redirect("/academia/dashboard");
  }

  const { data: cursos } = await supabase
    .from("cursos")
    .select("id, slug, titulo, estado, precio, moneda, created_at")
    .eq("profesor_id", user.id)
    .order("created_at", { ascending: false });

  const estadoColor: Record<string, string> = {
    publicado: "text-green-700 bg-green-50 border-green-200",
    borrador:  "text-yellow-700 bg-yellow-50 border-yellow-200",
    archivado: "text-gray-500 bg-gray-50 border-gray-200",
  };

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
          Aún no has creado ningún curso.
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
              <th className="pb-3">Acciones</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--ac-text-2)" }}>
            {cursos.map((c) => (
              <tr key={c.id} style={{ borderBottom: "1px solid var(--ac-border)" }}>
                <td className="py-3 pr-4 font-medium" style={{ color: "var(--ac-text)" }}>{c.titulo}</td>
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
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
