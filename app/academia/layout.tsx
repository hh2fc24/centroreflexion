/**
 * Academia CRC – Layout
 * Envuelve las rutas /academia con los tokens --ac-*, que apuntan a la
 * paleta CRC (ver app/globals.css). Un solo tema, claro.
 */
import type { ReactNode } from "react";
import { AcademiaNav } from "./_components/AcademiaNav";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

type Rol = "alumno" | "profesor" | "admin" | null;

export default async function AcademiaLayout({ children }: { children: ReactNode }) {
  let rol: Rol = null;
  let authed = false;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        authed = true;
        const { data } = await supabase.from("profiles").select("rol").eq("id", user.id).single();
        rol = ((data as { rol: Rol } | null)?.rol ?? "alumno") as Rol;
      }
    }
  }

  return (
    <div
      data-academia=""
      className="min-h-screen"
      style={{
        background: "var(--ac-bg)",
        color: "var(--ac-text)",
      }}
    >
      <AcademiaNav rol={rol} authed={authed} />
      {children}
    </div>
  );
}
