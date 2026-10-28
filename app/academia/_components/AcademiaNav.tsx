"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

type Rol = "alumno" | "profesor" | "admin" | null;

function linksForRole(rol: Rol) {
  // Usuarios autenticados exploran el catálogo en el área privada (sin marketing)
  const base = [{ href: "/academia/explorar", label: "Cursos" }];
  if (rol === "admin") {
    return [
      ...base,
      { href: "/academia/admin/cursos", label: "Cursos (admin)" },
      { href: "/academia/admin/solicitudes", label: "Solicitudes" },
      { href: "/academia/dashboard", label: "Dashboard" },
    ];
  }
  if (rol === "profesor") {
    return [
      ...base,
      { href: "/academia/profesor/cursos", label: "Mis cursos" },
      { href: "/academia/dashboard", label: "Dashboard" },
    ];
  }
  // alumno (o autenticado sin rol específico)
  return [
    ...base,
    { href: "/academia/mis-cursos", label: "Mis cursos" },
    { href: "/academia/dashboard", label: "Dashboard" },
  ];
}

export function AcademiaNav({ rol = null, authed = false }: { rol?: Rol; authed?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = authed ? linksForRole(rol) : [{ href: "/academia", label: "Cursos" }];

  async function logout() {
    const sb = createClient();
    if (sb) await sb.auth.signOut();
    router.push("/academia");
    router.refresh();
  }

  const rolLabel = rol === "admin" ? "Admin" : rol === "profesor" ? "Profesor" : "Alumno";

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50"
      style={{
        background: "var(--ac-nav-bg)",
        borderBottom: "1px solid var(--ac-nav-border)",
        boxShadow: scrolled ? "0 1px 0 rgba(23,23,19,0.04)" : "none",
        transition: "box-shadow 0.2s ease",
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Logo: el sello del CRC lleva al sitio; "Academia" a su portada. */}
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="Centro de Reflexiones Críticas, ir al inicio" className="relative block h-10 w-10 shrink-0">
            <Image src="/logo-crc.png" alt="" fill sizes="40px" className="object-contain" />
          </Link>
          <Link
            href="/academia"
            className="crc-serif border-l pl-3 text-[1.1rem] font-medium leading-none"
            style={{ borderColor: "var(--ac-border-md)", color: "var(--ac-text)" }}
          >
            Academia
          </Link>
        </div>

        {/* Nav links (desktop) */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className="relative px-4 py-2 text-sm font-medium transition-colors"
                style={{ color: active ? "var(--ac-gold)" : "var(--ac-text-2)" }}
              >
                {l.label}
                {active && (
                  <motion.span layoutId="ac-nav-indicator" className="absolute inset-x-3 -bottom-px h-px" style={{ background: "var(--ac-gold)" }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          {authed ? (
            <div className="hidden items-center gap-3 sm:flex">
              <span
                className="rounded-[6px] px-2.5 py-1 text-[0.8125rem] font-semibold"
                style={{ background: "var(--ac-gold-dim)", color: "var(--ac-gold)" }}
              >
                {rolLabel}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2"
                style={{ border: "1px solid var(--ac-border-md)", color: "var(--ac-text-2)", fontSize: "0.8rem" }}
              >
                <LogOut className="h-3.5 w-3.5" /> Salir
              </button>
            </div>
          ) : (
            <Link
              href="/academia/login"
              className="hidden rounded-lg px-4 py-2 text-sm sm:block ac-btn-gold"
              style={{ fontSize: "0.8rem", letterSpacing: "0.04em", padding: "0.5rem 1.1rem" }}
            >
              Iniciar sesión
            </Link>
          )}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg md:hidden"
            style={{ border: "1px solid var(--ac-border-md)", color: "var(--ac-text-2)" }}
            onClick={() => setOpen(!open)}
            aria-label="Menú"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{ background: "var(--ac-surface)", borderBottom: "1px solid var(--ac-border)" }}
            className="overflow-hidden md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium"
                  style={{
                    color: pathname === l.href ? "var(--ac-gold)" : "var(--ac-text-2)",
                    background: pathname === l.href ? "var(--ac-gold-dim)" : "transparent",
                  }}
                >
                  {l.label}
                </Link>
              ))}
              {authed ? (
                <button
                  onClick={() => { setOpen(false); logout(); }}
                  className="mt-2 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-center text-sm"
                  style={{ border: "1px solid var(--ac-border-md)", color: "var(--ac-text-2)" }}
                >
                  <LogOut className="h-4 w-4" /> Salir
                </button>
              ) : (
                <Link href="/academia/login" onClick={() => setOpen(false)} className="mt-2 rounded-lg px-4 py-3 text-center text-sm ac-btn-gold">
                  Iniciar sesión
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
