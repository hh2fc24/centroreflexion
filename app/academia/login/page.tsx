"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, ArrowRight, GraduationCap, Quote } from "lucide-react";
import Link from "next/link";

type Mode = "login" | "registro";

const ease = [0.22, 1, 0.36, 1] as const;

// Cita destacada en el panel izquierdo
const CITA = {
  texto: "El pensamiento crítico no es un lujo, es la herramienta más poderosa para transformar el mundo.",
  autor: "Academia CRC",
};

function AcademiaLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/academia/dashboard";

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  const supabase = createClient();

  function resetToStart() {
    setConfirmSent(false);
    setMode("login");
    setPassword("");
    setNombre("");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!supabase) {
        throw new Error("Supabase no está configurado aún. Añade las credenciales en .env.local");
      }
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(redirect);
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { nombre },
            emailRedirectTo: `${window.location.origin}/academia/auth/callback`,
          },
        });
        if (error) throw error;
        setConfirmSent(true);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "var(--ac-bg)" }}
    >
      {/* ── Panel izquierdo (solo desktop) ── */}
      <div
        className="relative hidden flex-col overflow-hidden lg:flex"
        style={{ flex: "0 0 52%", background: "var(--ac-surface)" }}
      >
        {/* Orbs */}
        <div
          className="ac-orb-1 pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(212,168,67,0.18) 0%, transparent 70%)", filter: "blur(40px)" }}
        />
        <div
          className="ac-orb-2 pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(107,92,231,0.15) 0%, transparent 70%)", filter: "blur(50px)" }}
        />
        {/* Grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--ac-border) 1px, transparent 1px), linear-gradient(90deg, var(--ac-border) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Border derecho */}
        <div
          className="absolute inset-y-0 right-0 w-px"
          style={{ background: "linear-gradient(to bottom, transparent, var(--ac-border-gold), transparent)" }}
        />

        {/* Contenido */}
        <div className="relative z-10 flex flex-1 flex-col justify-between p-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[6px] ac-btn-gold">
              <GraduationCap className="h-5 w-5" style={{ color: "#0c0c10" }} />
            </div>
            <span
              style={{
                fontFamily: "var(--font-cormorant, Georgia, serif)",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--ac-text)",
              }}
            >
              Academia <span style={{ color: "var(--ac-gold)" }}>CRC</span>
            </span>
          </div>

          {/* Cita central */}
          <div>
            <Quote
              className="mb-4 h-8 w-8 opacity-30"
              style={{ color: "var(--ac-gold)" }}
            />
            <blockquote
              className="leading-relaxed"
              style={{
                fontFamily: "var(--font-cormorant, Georgia, serif)",
                fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
                fontWeight: 500,
                fontStyle: "italic",
                color: "var(--ac-text)",
                lineHeight: 1.4,
              }}
            >
              &ldquo;{CITA.texto}&rdquo;
            </blockquote>
            <p className="mt-5 text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--ac-gold)" }}>
              — {CITA.autor}
            </p>
          </div>

        </div>
      </div>

      {/* ── Panel derecho (formulario) ── */}
      <div className="flex flex-1 items-center justify-center px-5 py-16 sm:px-10">
        <div className="w-full max-w-md">

          {confirmSent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease }}
              className="text-center"
            >
              <div
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ac-pulse-ring"
                style={{ background: "var(--ac-gold-dim)", border: "1px solid rgba(212,168,67,0.4)" }}
              >
                <span className="text-2xl">✉️</span>
              </div>
              <h1
                style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "2rem", fontWeight: 700, color: "var(--ac-text)" }}
              >
                Revisa tu email
              </h1>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--ac-text-2)" }}>
                Te enviamos un enlace a <strong style={{ color: "var(--ac-gold)" }}>{email}</strong>.<br />
                Confírmalo para activar tu cuenta.
              </p>
              <button
                type="button"
                onClick={resetToStart}
                className="mt-8 inline-block px-6 py-3 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] ac-btn-ghost"
                style={{ borderRadius: "5px" }}
              >
                Volver al inicio
              </button>
            </motion.div>
          ) : (
            <>
              {/* Título */}
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease }}
              >
                <h1
                  style={{
                    fontFamily: "var(--font-cormorant, Georgia, serif)",
                    fontSize: "clamp(1.6rem, 3vw, 2rem)",
                    fontWeight: 700,
                    color: "var(--ac-text)",
                    lineHeight: 1.1,
                  }}
                >
                  {mode === "login" ? "Bienvenido de vuelta." : "Crea tu cuenta."}
                </h1>
                <p className="mt-2 text-sm" style={{ color: "var(--ac-text-3)" }}>
                  {mode === "login"
                    ? "Ingresa tus datos para continuar aprendiendo."
                    : "Únete a la Academia CRC hoy. Es gratis."}
                </p>
              </motion.div>

              {/* Tabs */}
              <div
                className="mt-8 flex rounded-[6px] p-1"
                style={{ background: "var(--ac-surface)", border: "1px solid var(--ac-border)" }}
              >
                {(["login", "registro"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setError(null); }}
                    className="relative flex-1 rounded-[4px] py-2 text-sm font-semibold transition-colors"
                    style={{
                      color: mode === m ? "var(--ac-text)" : "var(--ac-text-3)",
                    }}
                  >
                    {mode === m && (
                      <motion.span
                        layoutId="ac-tab-bg"
                        className="absolute inset-0 rounded-[4px]"
                        style={{ background: "var(--ac-surface-2)" }}
                        transition={{ duration: 0.25, ease }}
                      />
                    )}
                    <span className="relative">
                      {m === "login" ? "Iniciar sesión" : "Registrarse"}
                    </span>
                  </button>
                ))}
              </div>

              {/* Formulario */}
              <motion.form
                key={`form-${mode}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease }}
                onSubmit={handleSubmit}
                className="mt-6 flex flex-col gap-4"
              >
                <AnimatePresence>
                  {mode === "registro" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider" style={{ color: "var(--ac-text-3)" }}>
                        Nombre
                      </label>
                      <input
                        type="text"
                        placeholder="Tu nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required={mode === "registro"}
                        className="ac-input w-full rounded-[6px] px-4 py-3 text-sm"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider" style={{ color: "var(--ac-text-3)" }}>
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="ac-input w-full rounded-[6px] px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider" style={{ color: "var(--ac-text-3)" }}>
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder={mode === "registro" ? "Mínimo 8 caracteres" : "••••••••"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="ac-input w-full rounded-[6px] px-4 py-3 text-sm pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--ac-text-3)" }}
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="rounded-[6px] px-4 py-3 text-sm"
                      style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-2 flex w-full items-center justify-center gap-2.5 py-3 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] ac-btn-gold"
                  style={{ borderRadius: "5px", opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <>
                      {mode === "login" ? "Entrar a la Academia" : "Crear cuenta"}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </motion.form>

              {mode === "login" && (
                <p className="mt-4 text-center text-xs" style={{ color: "var(--ac-text-3)" }}>
                  <a href="#" className="underline-offset-2 hover:underline" style={{ color: "var(--ac-text-2)" }}>
                    ¿Olvidaste tu contraseña?
                  </a>
                </p>
              )}

              <p className="mt-8 text-center text-xs" style={{ color: "var(--ac-text-3)" }}>
                ¿Prefieres explorar primero?{" "}
                <Link href="/academia" className="font-semibold underline-offset-2 hover:underline" style={{ color: "var(--ac-gold)" }}>
                  Ver cursos →
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AcademiaLoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--ac-bg)" }} />}>
      <AcademiaLoginForm />
    </Suspense>
  );
}
