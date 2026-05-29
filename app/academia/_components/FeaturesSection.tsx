"use client";

import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const features = [
  {
    n: "01",
    title: "Clases en video HD",
    desc: "Accede a clases grabadas por expertos cuando y donde quieras. Sin horarios fijos — avanza según tu tiempo y retoma donde lo dejaste con seguimiento automático.",
    tag: "Asíncrono",
  },
  {
    n: "02",
    title: "Profesores del mundo real",
    desc: "Todos los cursos son impartidos por académicos, investigadores y profesionales activos del Centro de Reflexiones Críticas. No hay intermediarios.",
    tag: "Expertos",
  },
  {
    n: "03",
    title: "Certificados de logro",
    desc: "Al completar cada curso recibes un certificado firmado por el CRC. Descargable, verificable y con valor en tu trayectoria académica.",
    tag: "Certificación",
  },
  {
    n: "04",
    title: "Material de profundización",
    desc: "Cada lección incluye lecturas complementarias, documentos descargables y recursos curados para seguir más allá del video.",
    tag: "Recursos",
  },
  {
    n: "05",
    title: "Comunidad y debate",
    desc: "Participa en foros moderados por los propios profesores. Las ideas se construyen en conversación, no en soledad.",
    tag: "Comunidad",
  },
  {
    n: "06",
    title: "Talleres y actividades en vivo",
    desc: "Sesiones sincrónicas con profesores del CRC: debates guiados, presentaciones y espacios de reflexión colectiva programados durante el semestre.",
    tag: "En vivo",
  },
];

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">

      {/* Header editorial */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease }}
        className="mb-16 grid gap-6 lg:grid-cols-2 lg:items-end"
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
          className="max-w-sm text-sm leading-relaxed lg:text-right lg:ml-auto"
          style={{ color: "var(--ac-text-3)" }}
        >
          Construimos la Academia CRC con un principio claro: el aprendizaje profundo requiere tiempo, contexto y conversación.
        </p>
      </motion.div>

      {/* Regla separadora */}
      <div className="mb-0 h-px w-full" style={{ background: "var(--ac-border)" }} />

      {/* Lista editorial de features */}
      <div>
        {features.map((f, i) => (
          <motion.div
            key={f.n}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease, delay: (i % 2) * 0.06 }}
          >
            <div
              className="group grid cursor-default grid-cols-[auto_1fr_auto] items-center gap-6 py-7 transition-colors duration-200 lg:gap-10 lg:py-8"
              style={{ borderBottom: "1px solid var(--ac-border)" }}
            >
              {/* Número */}
              <span
                className="font-bold tabular-nums leading-none transition-colors duration-200 group-hover:text-[var(--ac-gold)]"
                style={{
                  fontFamily: "var(--font-cormorant, Georgia, serif)",
                  fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
                  color: "var(--ac-text-3)",
                  minWidth: "2.5rem",
                }}
              >
                {f.n}
              </span>

              {/* Título + descripción */}
              <div className="min-w-0">
                <h3
                  className="mb-1 font-semibold transition-colors duration-200 group-hover:text-[var(--ac-gold)] lg:mb-0"
                  style={{
                    fontFamily: "var(--font-cormorant, Georgia, serif)",
                    fontSize: "clamp(1rem, 1.6vw, 1.2rem)",
                    fontWeight: 600,
                    color: "var(--ac-text)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  className="mt-1.5 max-w-2xl text-sm leading-relaxed lg:hidden"
                  style={{ color: "var(--ac-text-3)" }}
                >
                  {f.desc}
                </p>
                {/* Desktop: desc aparece en hover */}
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  className="mt-2 hidden max-w-2xl overflow-hidden text-sm leading-relaxed lg:block"
                  style={{
                    color: "var(--ac-text-3)",
                    /* usando max-height para el efecto hover con CSS */
                  }}
                >
                  {f.desc}
                </motion.p>
              </div>

              {/* Tag */}
              <span
                className="shrink-0 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest transition-colors duration-200 group-hover:border-[var(--ac-gold)] group-hover:text-[var(--ac-gold)]"
                style={{
                  border: "1px solid var(--ac-border-md)",
                  color: "var(--ac-text-3)",
                  whiteSpace: "nowrap",
                }}
              >
                {f.tag}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
