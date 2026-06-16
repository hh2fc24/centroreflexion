/**
 * Academia CRC – Panel admin: solicitudes de inscripción pendientes
 * /academia/admin/solicitudes (solo rol admin)
 */
import { redirect } from "next/navigation";
import Link from "next/link";
import { Check, X, Clock, Inbox } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function SolicitudesPage() {
  if (!isSupabaseConfigured()) redirect("/academia");
  const supabase = await createClient();
  if (!supabase) redirect("/academia");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/academia/login?redirect=/academia/admin/solicitudes");

  const { data: profileData } = await supabase.from("profiles").select("rol").eq("id", user.id).single();
  const profile = profileData as { rol: string } | null;
  if (!profile || profile.rol !== "admin") redirect("/academia/dashboard");

  const { data: rows } = await supabase
    .from("inscripciones")
    .select(`
      id, estado, fecha_inscripcion, metodo_pago, comprobante_ref,
      profiles!inscripciones_alumno_id_fkey (nombre, apellido, email),
      cursos!inscripciones_curso_id_fkey (titulo, precio, moneda)
    `)
    .eq("estado", "pendiente")
    .order("fecha_inscripcion", { ascending: true });

  type Row = {
    id: string; estado: string; fecha_inscripcion: string; metodo_pago: string | null; comprobante_ref: string | null;
    profiles: { nombre: string | null; apellido: string | null; email: string } | { nombre: string | null; apellido: string | null; email: string }[] | null;
    cursos: { titulo: string; precio: number | string; moneda: string } | { titulo: string; precio: number | string; moneda: string }[] | null;
  };
  const solicitudes = (rows as Row[] | null) ?? [];
  const one = <T,>(v: T | T[] | null): T | null => (Array.isArray(v) ? v[0] ?? null : v);

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
      <div className="flex items-center gap-3">
        <Link href="/academia/admin/cursos" className="text-xs font-semibold" style={{ color: "var(--ac-text-3)" }}>← Admin</Link>
      </div>
      <h1 className="mt-4" style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "2.5rem", fontWeight: 700, color: "var(--ac-text)" }}>
        Solicitudes de inscripción
      </h1>
      <p className="mt-2 text-sm" style={{ color: "var(--ac-text-3)" }}>
        Confirma el pago y activa el acceso del alumno, o rechaza la solicitud.
      </p>

      {solicitudes.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-xl py-20 text-center" style={{ border: "1px dashed var(--ac-border-md)" }}>
          <Inbox className="h-10 w-10" style={{ color: "var(--ac-text-3)" }} />
          <p className="mt-4 text-sm font-semibold" style={{ color: "var(--ac-text-2)" }}>No hay solicitudes pendientes</p>
          <p className="mt-1 text-xs" style={{ color: "var(--ac-text-3)" }}>Las nuevas solicitudes de pago aparecerán aquí.</p>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {solicitudes.map((s) => {
            const al = one(s.profiles);
            const cu = one(s.cursos);
            const nombre = [al?.nombre, al?.apellido].filter(Boolean).join(" ") || "Alumno";
            const monto = cu ? `${cu.moneda} $${Number(cu.precio).toLocaleString("es-CL")}` : "";
            return (
              <div
                key={s.id}
                className="flex flex-wrap items-center gap-4 rounded-xl px-5 py-4"
                style={{ background: "var(--ac-surface)", border: "1px solid var(--ac-border)" }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "var(--ac-gold-dim)" }}>
                  <Clock className="h-4 w-4" style={{ color: "var(--ac-gold)" }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold" style={{ color: "var(--ac-text)" }}>{nombre} <span className="font-normal" style={{ color: "var(--ac-text-3)" }}>· {al?.email}</span></p>
                  <p className="text-xs" style={{ color: "var(--ac-text-2)" }}>{cu?.titulo}</p>
                  <p className="mt-0.5 text-[0.7rem]" style={{ color: "var(--ac-text-3)" }}>
                    {monto} · {new Date(s.fecha_inscripcion).toLocaleDateString("es-CL")}
                    {s.comprobante_ref ? ` · ref: ${s.comprobante_ref}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <form action="/api/academia/solicitud" method="POST">
                    <input type="hidden" name="inscripcion_id" value={s.id} />
                    <input type="hidden" name="accion" value="activar" />
                    <button type="submit" className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-[0.7rem] font-bold ac-btn-gold">
                      <Check className="h-3.5 w-3.5" /> Activar
                    </button>
                  </form>
                  <form action="/api/academia/solicitud" method="POST">
                    <input type="hidden" name="inscripcion_id" value={s.id} />
                    <input type="hidden" name="accion" value="rechazar" />
                    <button type="submit" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[0.7rem] font-bold ac-btn-ghost">
                      <X className="h-3.5 w-3.5" /> Rechazar
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
