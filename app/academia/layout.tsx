/**
 * Academia CRC – Layout dark & premium
 * Envuelve todas las rutas /academia con el tema oscuro.
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
        background: "var(--ac-bg, #09090f)",
        color: "var(--ac-text, #f0ece4)",
        transition: "background 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Aplica el tema (día/noche) antes del primer pintado para evitar parpadeo.
          Prioridad: elección guardada del usuario → preferencia del sistema. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var el=document.currentScript.parentElement;var t=localStorage.getItem('ac-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}el.setAttribute('data-theme',t);}catch(e){}})();`,
        }}
      />
      <AcademiaNav rol={rol} authed={authed} />
      {children}
    </div>
  );
}
