"use client";

import { motion } from "framer-motion";
import { Video, Users, Award, BookOpen, MessageSquare, Zap } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

// cols: number of columns to span out of 6 at lg breakpoint
const features = [
  {
    n: "01",
    icon: Video,
    title: "Clases en video HD",
    desc: "Accede a clases grabadas por expertos cuando y donde quieras. Sin horarios fijos — avanza según tu tiempo y retoma donde lo dejaste.",
    tag: "Asíncrono",
    cols: 4,
  },
  {
    n: "02",
    icon: Users,
    title: "Profesores del mundo real",
    desc: "Todos los cursos son impartidos por académicos e investigadores activos del CRC. Sin intermediarios.",
    tag: "Expertos",
    cols: 2,
  },
  {
    n: "03",
    icon: Award,
    title: "Certificados de logro",
    desc: "Al completar cada curso recibes un certificado firmado por el CRC. Descargable y verificable.",
    tag: "Certificación",
    cols: 2,
  },
  {
    n: "04",
    icon: BookOpen,
    title: "Material de profundización",
    desc: "Lecturas complementarias, documentos descargables y recursos curados para ir más allá del video.",
    tag: "Recursos",
    cols: 2,
  },
  {
    n: "05",
    icon: MessageSquare,
    title: "Comunidad y debate",
    desc: "Foros moderados por los propios profesores. Las ideas se construyen en conversación, no en soledad.",
    tag: "Comunidad",
    cols: 2,
  },
  {
    n: "06",
    icon: Zap,
    title: "Talleres y actividades en vivo",
    desc: "Sesiones sincrónicas con el equipo CRC: debates guiados, presentaciones y espacios de reflexión colectiva programados durante el semestre.",
    tag: "En vivo",
    cols: 6,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardAnim = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
};

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease }}
        className="mb-14 grid gap-6 lg:grid-cols-2 lg:items-end"
      >
        <h2
          style={{
            fontFamily: "var(--font-cormorant, Georgia, serif)",
            fontSize: "clamp(2rem, 3.5vw, 3.2rem)",
            fontWeight: 700,
            lineHeight: 0.98,
            letterSpacing: "-0.02em",
            color: "var(--ac-text)",
          }}
        >
          Todo lo que necesitas
          <br />
          <span style={{ color: "var(--ac-gold)", fontStyle: "italic" }}>para aprender de verdad.</span>
        </h2>
        <p
          className="max-w-sm text-sm leading-relaxed lg:ml-auto lg:text-right"
          style={{ color: "var(--ac-text-3)" }}
        >
          Construimos la Academia CRC con un principio claro: el aprendizaje profundo requiere tiempo, contexto y conversación.
        </p>
      </motion.div>

      {/* Bento grid — responsivo vía clases en globals.css (.ac-bento) */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="ac-bento"
      >
        {features.map((f) => {
          const Icon = f.icon;
          const isFull = f.cols === 6;
          return (
            <motion.div
              key={f.n}
              variants={cardAnim}
              data-cols={f.cols}
              className="ac-bento-card group relative overflow-hidden rounded-[10px] transition-all duration-300"
              style={{
                padding: isFull ? "1.6rem 1.5rem" : "1.5rem",
                background: isFull
                  ? "linear-gradient(135deg, var(--ac-surface) 0%, var(--ac-surface-2) 100%)"
                  : "var(--ac-surface)",
                border: "1px solid var(--ac-border)",
              }}
            >
              {/* Gold border on hover */}
              <div
                className="pointer-events-none absolute inset-0 rounded-[10px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ border: "1px solid rgba(212,168,67,0.45)" }}
              />

              {/* Glow on hover */}
              <div
                className="pointer-events-none absolute inset-0 rounded-[10px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: isFull
                    ? "radial-gradient(ellipse at 8% 50%, rgba(212,168,67,0.08) 0%, transparent 55%)"
                    : "radial-gradient(ellipse at 20% 15%, rgba(212,168,67,0.07) 0%, transparent 60%)",
                }}
              />

              {/* Gold top line for full-width card */}
              {isFull && (
                <div
                  className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,67,0.55), transparent)" }}
                />
              )}

              <div
                className="relative z-10"
                style={
                  isFull
                    ? { display: "flex", flexDirection: "column", gap: "1rem" }
                    : undefined
                }
              >
                {/* Number + icon */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: isFull ? 0 : "1.25rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-cormorant, Georgia, serif)",
                      fontSize: isFull ? "clamp(2.8rem, 4vw, 3.8rem)" : "clamp(1.9rem, 2.8vw, 2.6rem)",
                      fontWeight: 700,
                      lineHeight: 1,
                      color: "rgba(255,255,255,0.12)",
                      transition: "color 0.3s",
                      userSelect: "none",
                    }}
                    className="group-hover:!text-[rgba(212,168,67,0.22)]"
                  >
                    {f.n}
                  </span>
                  <div
                    className="transition-all duration-300 group-hover:scale-110"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: isFull ? "3rem" : "2.5rem",
                      height: isFull ? "3rem" : "2.5rem",
                      borderRadius: "7px",
                      flexShrink: 0,
                      background: "var(--ac-gold-dim)",
                      border: "1px solid rgba(212,168,67,0.22)",
                    }}
                  >
                    <Icon
                      style={{
                        width: isFull ? "1.2rem" : "1rem",
                        height: isFull ? "1.2rem" : "1rem",
                        color: "var(--ac-gold)",
                        opacity: 0.85,
                      }}
                    />
                  </div>
                </div>

                {/* Text content — horizontal on full-width (apila en móvil) */}
                <div className={isFull ? "ac-feat-full" : undefined}>
                  <div style={isFull ? { flex: "0 0 auto" } : undefined}>
                    <h3
                      className={`transition-colors duration-300 group-hover:!text-[var(--ac-gold)]${isFull ? " ac-feat-full-title" : ""}`}
                      style={{
                        fontFamily: "var(--font-cormorant, Georgia, serif)",
                        fontSize: isFull ? "clamp(1.3rem, 1.8vw, 1.55rem)" : "clamp(1rem, 1.5vw, 1.18rem)",
                        fontWeight: 600,
                        color: "var(--ac-text)",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.15,
                        marginBottom: "0.5rem",
                      }}
                    >
                      {f.title}
                    </h3>
                  </div>

                  <p
                    style={{
                      flex: isFull ? 1 : undefined,
                      fontSize: isFull ? "0.88rem" : "0.81rem",
                      lineHeight: 1.65,
                      color: "var(--ac-text-3)",
                      minWidth: 0,
                    }}
                  >
                    {f.desc}
                  </p>

                  <div style={isFull ? { flexShrink: 0 } : { marginTop: "1.1rem" }}>
                    <span
                      className="inline-block rounded-full transition-all duration-300 group-hover:!border-[rgba(212,168,67,0.5)] group-hover:!text-[var(--ac-gold)]"
                      style={{
                        padding: "0.2rem 0.65rem",
                        fontSize: "10px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        border: "1px solid var(--ac-border-md)",
                        color: "var(--ac-text-3)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {f.tag}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
