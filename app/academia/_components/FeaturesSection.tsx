/**
 * Cómo funciona la Academia. Solo describe lo que la plataforma hace hoy
 * (clases grabadas, lecturas descargables, avance guardado, certificado);
 * nada de foros ni talleres que no existen. Estilo editorial CRC: lista con
 * filetes, sin tarjetas, iconos ni brillos (design-system-crc.md).
 */
const features = [
  {
    title: "Clases grabadas",
    desc: "Cada lección se puede ver como diapositivas, PDF o texto accesible. Avanzas a tu ritmo y retomas donde quedaste.",
  },
  {
    title: "Docentes del CRC",
    desc: "Los cursos los dictan académicos e investigadores del equipo del Centro, no instructores externos.",
  },
  {
    title: "Lecturas de apoyo",
    desc: "Las lecciones incluyen material descargable para estudiar sin conexión o volver a él en la práctica.",
  },
  {
    title: "Certificado CRC",
    desc: "Al completar el curso recibes un certificado del Centro de Reflexiones Críticas.",
  },
];

export function FeaturesSection() {
  return (
    <section
      aria-labelledby="academia-como-funciona"
      className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12"
    >
      <div className="grid gap-4 lg:grid-cols-2 lg:items-end">
        <div>
          <p className="text-[0.8125rem] font-semibold text-[#9f5528]">Cómo funciona</p>
          <h2
            id="academia-como-funciona"
            className="crc-serif mt-3 text-balance text-[clamp(1.6rem,2.3vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.01em] text-[#171713]"
          >
            Formación con tiempo, contexto y casos
          </h2>
        </div>
        <p className="max-w-[46ch] text-[0.9375rem] leading-[1.6] text-[#55574f] lg:ml-auto">
          La Academia lleva al formato en línea la misma lectura crítica que el CRC aplica en supervisión, consultoría y
          clínica.
        </p>
      </div>

      <dl className="mt-10 grid border-t border-[#d8cfc0] sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <div
            key={f.title}
            className={`border-b border-[#d8cfc0] py-6 sm:pr-6 lg:border-b-0 lg:py-8 ${
              i > 0 ? "lg:border-l lg:pl-6" : ""
            } ${i % 2 === 1 ? "sm:border-l sm:pl-6 lg:pl-6" : ""}`}
          >
            <dt className="crc-serif text-[1.2rem] font-medium leading-[1.2] text-[#171713]">{f.title}</dt>
            <dd className="mt-2 text-[0.9375rem] leading-[1.6] text-[#55574f]">{f.desc}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
