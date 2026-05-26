import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Check,
  ClipboardCheck,
  ExternalLink,
  FileWarning,
  GraduationCap,
  HeartPulse,
  Mail,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { getSiteUrl } from "@/lib/site";
import { ComplianceSchoolForm } from "./ComplianceSchoolForm";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Compliance Escolar Chile y Ley 21.809",
  description:
    "Asesoría en Compliance Escolar Chile para colegios: auditoría de protocolos, capacitación docente y manejo clínico de crisis de convivencia escolar ante Ley 21.809.",
  keywords: [
    "Compliance Escolar Chile",
    "Ley Convivencia Escolar 2026",
    "Ley 21.809",
    "Asesoría Bullying Colegios",
    "protocolos convivencia escolar",
    "salud mental escolar",
  ],
  alternates: {
    canonical: `${siteUrl}/servicios/compliance-escolar`,
  },
  openGraph: {
    title: "Compliance Escolar Chile | Centro de Reflexiones Críticas",
    description:
      "Diagnóstico, formación y soporte clínico-jurídico para colegios ante crisis de convivencia escolar y Ley 21.809.",
    url: `${siteUrl}/servicios/compliance-escolar`,
    siteName: "CRC",
    locale: "es_CL",
    type: "website",
  },
};

const pressItems = [
  {
    source: "Cooperativa.cl / Poder Judicial",
    date: "20 mayo 2026",
    title: 'Alianza Francesa deberá indemnizar a los padres de un alumno "funado" en redes sociales',
    amount: "$60.407.386",
    court: "26° Juzgado Civil de Santiago",
    detail: "No activación oportuna del protocolo ante denuncia de acoso escolar.",
    href: "https://www.cooperativa.cl/noticias/pais/judicial/alianza-francesa-debera-indemnizar-a-los-padres-de-un-alumno-funado/2026-05-20/161721.html",
    image: "/images/press/cooperativa-alianza-francesa.jpg",
    imageAlt: "Captura de pantalla del artículo de Cooperativa.cl sobre el caso Alianza Francesa",
  },
  {
    source: "La Batalla de Maipú",
    date: "17 mayo 2026",
    title: "Tribunal condena a sostenedora de colegio de Maipú a pagar 55 millones por negligencia en caso de acoso escolar",
    amount: ">$55 millones",
    court: "17° Juzgado Civil",
    detail: "Protocolo existente, pero aplicado de forma deficiente según el fallo.",
    href: "https://www.labatalla.cl/tribunal-condena-a-sostenedora-de-colegio-de-maipu-a-pagar-55-millones-por-negligencia-en-caso-de-acoso-escolar/",
    image: "/images/press/labatalla-maipu.jpg",
    imageAlt: "Captura de pantalla del artículo de La Batalla de Maipú sobre el caso de acoso escolar",
  },
  {
    source: "Corte Suprema / BioBioChile",
    date: "16 diciembre 2025",
    title: "Corte Suprema condena a Scuola Italiana a pagar $25 millones por bullying a una alumna",
    amount: "$25 millones",
    court: "Corte Suprema (Primera Sala)",
    detail: 'El máximo tribunal dictaminó que la simple existencia de protocolos no basta si las medidas son "tardías e ineficaces".',
    href: "https://www.biobiochile.cl/noticias/nacional/region-metropolitana/2025/12/16/condenan-a-scuola-italiana-deberan-indemnizar-con-25-millones-a-mama-de-alumna-victima-de-bullying.shtml",
    image: "/images/press/scuola-italiana-press.png",
    imageAlt: "Fotografía de la Corte Suprema publicada por BioBioChile sobre el caso Scuola Italiana",
  },
  {
    source: "Cooperativa.cl / Corte Suprema",
    date: "19 mayo 2026",
    title: "Corte Suprema confirma condena a Lincoln International Academy por expulsar a hermanos víctimas de bullying",
    amount: "$10 millones",
    court: "Corte Suprema",
    detail: "El tribunal declaró improcedente la cancelación de matrícula como sanción o represalia aplicada a los estudiantes por conductas de su apoderada.",
    href: "https://www.cooperativa.cl/noticias/pais/educacion/colegios/colegio-fue-condenado-por-sancionar-a-alumnos-por-conducta-de-su-apoderada/2026-05-19/174553.html",
    image: "/images/press/lincoln-academy-press.jpg",
    imageAlt: "Fotografía del Lincoln International Academy publicada por Cooperativa.cl",
  },
];

const criticalFigures = [
  {
    value: "Hasta $60M",
    label: "en indemnizaciones por negligencia en protocolos",
    note: "La exposición civil ya está llegando a tribunales chilenos.",
  },
  {
    value: "12.369",
    label: "denuncias anuales ante la Superintendencia de Educación",
    note: "Fuente: Acción Educar, Estado de la Educación 2024.",
  },
  {
    value: "1 julio 2026",
    label: "vigencia obligatoria Ley 21.809",
    note: "Los colegios deben llegar con gobernanza, equipo y trazabilidad.",
  },
];

const services = [
  {
    icon: ClipboardCheck,
    title: "Consultoría",
    subtitle: "Auditoría de cumplimiento legal",
    text: "Revisión de protocolos, roles, registros, rutas de escalamiento y brechas frente a Ley 21.809, Superintendencia y riesgo civil.",
  },
  {
    icon: GraduationCap,
    title: "Formación",
    subtitle: "Capacitación técnica para docentes desbordados",
    text: "Entrenamiento situado para equipos directivos, convivencia, docentes y asistentes que deben actuar rápido sin improvisar.",
  },
  {
    icon: HeartPulse,
    title: "Clínica",
    subtitle: "Manejo de crisis de salud mental post-acoso",
    text: "Acompañamiento interdisciplinario para contención, lectura de riesgo, derivación y aprendizaje institucional después de una crisis.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Compliance Escolar Chile",
  provider: {
    "@type": "Organization",
    name: "Centro de Reflexiones Críticas",
    url: siteUrl,
  },
  areaServed: "Chile",
  serviceType: "Asesoría de compliance escolar, convivencia escolar y Ley 21.809",
  url: `${siteUrl}/servicios/compliance-escolar`,
  description:
    "Auditoría de protocolos, capacitación docente y soporte clínico para colegios ante crisis de convivencia escolar.",
};

export default function ComplianceEscolarPage() {
  return (
    <main className="bg-[#fffdf8] text-[#171713]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-[#2a2c27] bg-[#171713]">
        <div className="absolute inset-0 opacity-12">
          <Image
            src="/images/bienestar-escolar/hero-proteccion-institucional.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover mix-blend-luminosity"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#171713] via-[#171713]/90 to-[#171713]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171713] via-transparent to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
          <Link href="/servicios" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#a09890] hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5" />
            Servicios
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-start">
            {/* Left: copy */}
            <div className="lg:col-span-5 xl:col-span-4">
              <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#c8c0b8]">
                <ShieldCheck className="h-3 w-3 text-[#d3976d]" />
                Compliance Escolar Chile
              </span>
              <h1 className="mt-5 text-2xl font-bold leading-snug text-white sm:text-3xl lg:text-[2rem] font-serif">
                ¿Es su protocolo de convivencia una protección real o un riesgo financiero?
              </h1>
              <p className="mt-3 text-sm leading-7 text-[#b8b0a4]">
                Diagnóstico, formación y acompañamiento clínico-jurídico para colegios que deben actuar con evidencia frente a acoso, violencia y Ley 21.809.
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <a
                  href="#diagnostico"
                  className="inline-flex items-center justify-center gap-1.5 rounded-[4px] bg-[#bd6f3c] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#9f5528]"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Solicitar diagnóstico
                </a>
                <a
                  href="#evidencia"
                  className="inline-flex items-center justify-center gap-1.5 rounded-[4px] border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-white/10"
                >
                  Ver evidencia
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* urgency strip */}
              <div className="mt-6 flex items-center gap-3 rounded-[4px] border border-[#d3976d]/30 bg-[#d3976d]/10 px-4 py-3">
                <AlertTriangle className="h-4 w-4 shrink-0 text-[#d3976d]" />
                <p className="text-xs leading-5 text-[#d3976d]">
                  <strong>1 julio 2026:</strong> vigencia obligatoria Ley 21.809. Su colegio debe estar preparado.
                </p>
              </div>
            </div>

            {/* Right: press screenshots */}
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#70695f]">
                  Prensa reciente — casos reales
                </p>
                <span className="rounded-[3px] bg-[#bd6f3c]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#d3976d]">
                  Mayo 2026
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {pressItems.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col overflow-hidden rounded-[6px] border border-white/10 bg-[#1e1f1a] transition hover:border-[#bd6f3c]/50"
                  >
                    {/* Screenshot image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-white/8">
                      <Image
                        src={item.image}
                        alt={item.imageAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
                      />
                      {/* overlay badge */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#171713]/90 to-transparent px-3 pb-2 pt-6">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#c8c0b8]">{item.source}</span>
                          <span className="text-[10px] font-bold text-[#d3976d]">{item.date}</span>
                        </div>
                      </div>
                      {/* "Ver noticia" hover */}
                      <div className="absolute inset-0 flex items-center justify-center bg-[#171713]/60 opacity-0 transition group-hover:opacity-100">
                        <span className="flex items-center gap-1.5 rounded-[4px] bg-white px-3 py-1.5 text-xs font-bold text-[#171713]">
                          <ExternalLink className="h-3 w-3" /> Ver noticia
                        </span>
                      </div>
                    </div>

                    {/* Info strip */}
                    <div className="flex items-start gap-3 p-3">
                      <div className="shrink-0 rounded-[4px] bg-[#171713] border border-[#bd6f3c]/30 px-2 py-1.5 text-center">
                        <span className="block text-[9px] font-bold uppercase tracking-[0.1em] text-[#a09890]">Condena</span>
                        <strong className="mt-0.5 block text-sm font-bold leading-tight text-[#d3976d] font-serif whitespace-nowrap">{item.amount}</strong>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#70695f]">{item.court}</p>
                        <p className="mt-0.5 text-xs leading-5 text-[#c8c0b8] line-clamp-2">{item.detail}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              <p className="mt-2 text-[10px] leading-5 text-[#504d48]">
                Fuentes verificables. Fallos de primera instancia. Los textos subrayados son enlaces a las noticias originales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CIFRAS CRÍTICAS ── */}
      <section id="evidencia" className="border-b border-[#eee8dc] bg-[#f8f5ee] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end gap-6 lg:flex-nowrap lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#bd6f3c]">
                <FileWarning className="h-3.5 w-3.5" />
                Cifras críticas
              </span>
              <h2 className="mt-2 text-xl font-bold leading-snug text-[#171713] sm:text-2xl font-serif">
                El costo de improvisar ya aparece en fallos, denuncias y normativa.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#55574f]">
              La Ley 21.809 exige gestión oportuna frente a acoso, violencia y discriminación. Para un colegio, el problema no es solo tener un documento: es poder demostrar decisiones diligentes, registradas y proporcionales.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {criticalFigures.map((item) => (
              <article key={item.value} className="rounded-[6px] border border-[#ded5c7] bg-[#fffdf8] p-5">
                <strong className="block text-2xl font-bold leading-tight text-[#9f5528] font-serif">{item.value}</strong>
                <h3 className="mt-2 text-sm font-bold leading-snug text-[#171713]">{item.label}</h3>
                <p className="mt-2 text-xs leading-6 text-[#70695f]">{item.note}</p>
              </article>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a8276]">
            <a className="hover:text-[#bd6f3c]" href="https://accioneducar.cl/wp-content/uploads/2024/09/Estado-de-la-Educacion-2024-4-2.pdf" target="_blank" rel="noopener noreferrer">
              Fuente denuncias: Acción Educar
            </a>
            <a className="hover:text-[#bd6f3c]" href="https://www.bcn.cl/leychile/Navegar?idNorma=1222799&idVersion=2026-07-01" target="_blank" rel="noopener noreferrer">
              Ley 21.809: BCN
            </a>
          </div>
        </div>
      </section>

      {/* ── ANTES / DESPUÉS ── */}
      <section className="border-b border-[#2a2c27] bg-[#171713] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d3976d]">Contraste</span>
            <h2 className="mt-1 text-xl font-bold text-white font-serif sm:text-2xl">
              Basado en evidencia clínica y jurídica, con respaldo editorial Hammurabi.
            </h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Antes */}
            <article className="rounded-[6px] border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d3976d]">Sin CRC — Riesgo</span>
                <AlertTriangle className="h-4 w-4 text-[#d3976d]" />
              </div>
              <div className="divide-y divide-white/8 border-y border-white/8">
                {["Protocolos declarativos sin operabilidad", "Docentes sin márgenes claros de acción", "Registros incompletos o inexistentes", "Exposición ante familias, prensa y fiscalización"].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 py-3">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#d3976d]/60" />
                    <p className="text-sm leading-6 text-[#c8c0b8]">{item}</p>
                  </div>
                ))}
              </div>
            </article>

            {/* Después */}
            <article className="rounded-[6px] border border-[#bd6f3c]/25 bg-[#bd6f3c]/5 p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d3976d]">Con CRC — Protección</span>
                <ShieldCheck className="h-4 w-4 text-[#d3976d]" />
              </div>
              <div className="divide-y divide-[#bd6f3c]/15 border-y border-[#bd6f3c]/15">
                {["Protocolos operables y trazables", "Equipos entrenados para actuar sin improvisar", "Trazabilidad de decisiones documentada", "Cumplimiento legal verificable ante cualquier instancia"].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 py-3">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#d3976d]" />
                    <p className="text-sm leading-6 text-[#eee8dc]">{item}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── SERVICIOS ── */}
      <section className="border-b border-[#eee8dc] bg-[#fffdf8] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#bd6f3c]">
              <BookOpenCheck className="h-3.5 w-3.5" />
              Solución integrada
            </span>
            <h2 className="mt-2 text-xl font-bold leading-snug text-[#171713] sm:text-2xl font-serif">
              CRC une consultoría, formación y clínica en una respuesta institucional coherente.
            </h2>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <article key={service.title} className="group rounded-[6px] border border-[#ded5c7] bg-[#f8f5ee] p-5 transition hover:-translate-y-0.5 hover:border-[#bd6f3c]/40 hover:bg-[#fffdf8] hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-[5px] bg-[#171713] text-[#d3976d]">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <span className="font-serif text-4xl font-bold leading-none text-[#171713]/8">0{index + 1}</span>
                  </div>
                  <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">{service.title}</p>
                  <h3 className="mt-1.5 text-base font-bold leading-snug text-[#171713] font-serif">{service.subtitle}</h3>
                  <p className="mt-2.5 text-xs leading-6 text-[#70695f]">{service.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── LEY 21.809 ── */}
      <section className="border-b border-[#eee8dc] bg-[#f8f5ee] py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#bd6f3c]">
              <Scale className="h-3.5 w-3.5" />
              Ley 21.809
            </span>
            <h2 className="mt-2 text-xl font-bold leading-snug text-[#171713] sm:text-2xl font-serif">
              Julio 2026 no es una fecha administrativa: es un cambio de estándar.
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#55574f]">
              La ley exige a los colegios actuar <em>oportunamente</em> frente a violencia, amenazas y acoso, bajo pena de sanciones administrativas y responsabilidad civil directa del sostenedor.
            </p>
          </div>
          <div>
            <div className="divide-y divide-[#ded5c7] border-y border-[#ded5c7]">
              {[
                "Actuar oportunamente frente a violencia, acoso, discriminación y amenazas.",
                "Contar con equipos y responsables claros para convivencia educativa.",
                "Activar protocolos y registrar medidas con trazabilidad.",
                "Reducir exposición a sanciones administrativas y responsabilidad civil.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 py-3.5">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#bd6f3c]" />
                  <p className="text-sm leading-6 text-[#3f423a]">{item}</p>
                </div>
              ))}
            </div>
            <a
              href="https://www.bcn.cl/portal/leyfacil/recurso/convivencia-buen-trato-y-bienestar-de-las-comunidades-educativas"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#bd6f3c] hover:text-[#9f5528]"
            >
              Resumen BCN Ley Fácil
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ── FORMULARIO ── */}
      <section id="diagnostico" className="scroll-mt-20 bg-[#fffdf8] py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#bd6f3c]">Diagnóstico institucional</span>
            <h2 className="mt-2 text-xl font-bold leading-snug text-[#171713] sm:text-2xl font-serif">
              Partamos por saber si el protocolo protege o expone al colegio.
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#70695f]">
              Solicite una reunión para evaluar brechas de compliance escolar, riesgos de convivencia y necesidades de capacitación del equipo.
            </p>
            <div className="mt-5 rounded-[6px] border border-[#ded5c7] bg-[#f8f5ee] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9f5528]">Entrega esperada</p>
              <p className="mt-2 text-xs leading-6 text-[#70695f]">
                Mapa inicial de riesgos, prioridades de acción y ruta de trabajo para cumplimiento, formación y soporte clínico.
              </p>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-[6px] border border-[#ded5c7] bg-[#f8f5ee] p-5 shadow-sm sm:p-6">
              <ComplianceSchoolForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
