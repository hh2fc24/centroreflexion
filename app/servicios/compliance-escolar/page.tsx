import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getSiteUrl } from "@/lib/site";
import { EngagementList, PersonInCharge, SectionHead, ServiceHero } from "../_components/Blocks";
import { COMPLIANCE_DIAGNOSTICO, COMPLIANCE_IMPLEMENTACION, VALUE_NOTE } from "../_components/engagements";
import { HUGO } from "../_components/people";
import { Reveal } from "../_components/Reveal";
import { btnPrimary, container, label, labelMuted, labelOnDark, textLink } from "../_components/ui";
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
  },
  {
    source: "La Batalla de Maipú",
    date: "17 mayo 2026",
    title: "Tribunal condena a sostenedora de colegio de Maipú a pagar 55 millones por negligencia en caso de acoso escolar",
    amount: ">$55 millones",
    court: "17° Juzgado Civil",
    detail: "Protocolo existente, pero aplicado de forma deficiente según el fallo.",
    href: "https://www.labatalla.cl/tribunal-condena-a-sostenedora-de-colegio-de-maipu-a-pagar-55-millones-por-negligencia-en-caso-de-acoso-escolar/",
  },
  {
    source: "Corte Suprema / BioBioChile",
    date: "16 diciembre 2025",
    title: "Corte Suprema condena a Scuola Italiana a pagar $25 millones por bullying a una alumna",
    amount: "$25 millones",
    court: "Corte Suprema (Primera Sala)",
    detail: 'El máximo tribunal dictaminó que la simple existencia de protocolos no basta si las medidas son "tardías e ineficaces".',
    href: "https://www.biobiochile.cl/noticias/nacional/region-metropolitana/2025/12/16/condenan-a-scuola-italiana-deberan-indemnizar-con-25-millones-a-mama-de-alumna-victima-de-bullying.shtml",
  },
  {
    source: "Cooperativa.cl / Corte Suprema",
    date: "19 mayo 2026",
    title: "Corte Suprema confirma condena a Lincoln International Academy por expulsar a hermanos víctimas de bullying",
    amount: "$10 millones",
    court: "Corte Suprema",
    detail: "El tribunal declaró improcedente la cancelación de matrícula como sanción o represalia aplicada a los estudiantes por conductas de su apoderada.",
    href: "https://www.cooperativa.cl/noticias/pais/educacion/colegios/colegio-fue-condenado-por-sancionar-a-alumnos-por-conducta-de-su-apoderada/2026-05-19/174553.html",
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

const contrast = {
  before: [
    "Protocolos declarativos sin operabilidad",
    "Docentes sin márgenes claros de acción",
    "Registros incompletos o inexistentes",
    "Exposición ante familias, prensa y fiscalización",
  ],
  after: [
    "Protocolos operables y trazables",
    "Equipos entrenados para actuar sin improvisar",
    "Trazabilidad de decisiones documentada",
    "Cumplimiento legal verificable ante cualquier instancia",
  ],
};

const lawDuties = [
  "Actuar oportunamente frente a violencia, acoso, discriminación y amenazas.",
  "Contar con equipos y responsables claros para convivencia educativa.",
  "Activar protocolos y registrar medidas con trazabilidad.",
  "Reducir exposición a sanciones administrativas y responsabilidad civil.",
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

      <ServiceHero
        area="Compliance escolar"
        title="¿Es su protocolo de convivencia una protección real o un riesgo financiero?"
        intro={
          <p>
            Diagnóstico, formación y acompañamiento clínico-jurídico para colegios que deben actuar con evidencia frente a
            acoso, violencia y Ley 21.809.
          </p>
        }
        actions={
          <>
            <a href="#diagnostico" className={btnPrimary}>
              Solicitar diagnóstico
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href="#evidencia" className={textLink}>
              Ver los fallos recientes
            </a>
          </>
        }
        facts={[
          { term: "Para quién", detail: "Sostenedores, equipos directivos y encargados de convivencia escolar." },
          {
            term: "Marco",
            detail: (
              <>
                Ley 21.809. <span className="font-semibold">Vigencia obligatoria: 1 julio 2026.</span>
              </>
            ),
          },
          { term: "Compromisos", detail: "Diagnóstico de cumplimiento Ley 21.809 · Implementación de protocolos y trazabilidad" },
          { term: "A cargo", detail: HUGO.name },
          { term: "Valor", detail: VALUE_NOTE },
        ]}
      />

      {/* Evidencia */}
      <section id="evidencia" aria-labelledby="evidencia-title" className="scroll-mt-24 bg-[#fffdf8]">
        <div className={`${container} py-16 sm:py-24`}>
          <Reveal className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-end lg:gap-16">
            <SectionHead eyebrow="Cifras y fallos" title="El costo de improvisar ya aparece en fallos, denuncias y normativa." id="evidencia-title" />
            <p className="max-w-[52ch] text-[1rem] leading-[1.7] text-[#55574f]">
              La Ley 21.809 exige gestión oportuna frente a acoso, violencia y discriminación. Para un colegio, el problema no es
              solo tener un documento: es poder demostrar decisiones diligentes, registradas y proporcionales.
            </p>
          </Reveal>

          <Reveal className="mt-12">
            <dl className="grid border-y border-[#d8cfc0] md:grid-cols-3">
              {criticalFigures.map((item) => (
                <div key={item.value} className="border-b border-[#d8cfc0] py-6 last:border-b-0 md:border-b-0 md:border-l md:px-6 md:first:border-l-0 md:first:pl-0">
                  <dt className="crc-serif text-[1.9rem] font-medium leading-none tabular-nums text-[#9f5528]">{item.value}</dt>
                  <dd className="mt-3">
                    <span className="block text-[0.9375rem] font-semibold leading-[1.5] text-[#171713]">{item.label}</span>
                    <span className="mt-1 block text-[0.875rem] leading-[1.6] text-[#6f675d]">{item.note}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-[0.875rem] text-[#6f675d]">
              <a className="underline decoration-[#d8cfc0] underline-offset-4 hover:text-[#9f5528]" href="https://accioneducar.cl/wp-content/uploads/2024/09/Estado-de-la-Educacion-2024-4-2.pdf" target="_blank" rel="noopener noreferrer">
                Fuente denuncias: Acción Educar
              </a>
              <a className="underline decoration-[#d8cfc0] underline-offset-4 hover:text-[#9f5528]" href="https://www.bcn.cl/leychile/Navegar?idNorma=1222799&idVersion=2026-07-01" target="_blank" rel="noopener noreferrer">
                Ley 21.809: BCN
              </a>
            </p>
          </Reveal>

          <Reveal className="mt-16">
            <p className={labelMuted}>Fallos recientes informados por la prensa</p>
            <ul className="mt-3 border-b border-[#d8cfc0]">
              {pressItems.map((item) => (
                <li key={item.title} className="border-t border-[#d8cfc0]">
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group grid gap-3 py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171713] md:grid-cols-[10rem_minmax(0,1fr)_9rem] md:gap-8"
                  >
                    <span className="text-[0.875rem] leading-[1.5] text-[#6f675d]">
                      <span className="block font-semibold tabular-nums text-[#171713]">{item.date}</span>
                      <span className="block">{item.source}</span>
                    </span>
                    <span>
                      <span className="crc-serif block text-[1.2rem] font-medium leading-[1.3] text-[#171713] transition-colors group-hover:text-[#9f5528]">
                        {item.title}
                      </span>
                      <span className="mt-2 block text-[0.9375rem] leading-[1.6] text-[#55574f]">
                        <span className="font-semibold text-[#171713]">{item.court}.</span> {item.detail}
                      </span>
                    </span>
                    <span className="flex items-start justify-between gap-3 md:flex-col md:items-end">
                      <span className="crc-serif text-[1.3rem] font-medium tabular-nums text-[#9f5528] md:text-right">{item.amount}</span>
                      <span className="inline-flex items-center gap-1 text-[0.875rem] font-semibold text-[#9f5528]">
                        Ver noticia
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[0.875rem] text-[#6f675d]">Fuentes verificables: cada fila enlaza a la noticia original.</p>
          </Reveal>
        </div>
      </section>

      {/* Contraste */}
      <section aria-labelledby="contraste-title" className="bg-[#15120e] text-[#fbf7ee]">
        <div className={`${container} py-16 sm:py-24`}>
          <Reveal>
            <SectionHead
              eyebrow="Debida diligencia"
              title="De la existencia formal del protocolo a la gobernanza escolar efectiva."
              id="contraste-title"
              dark
            />
          </Reveal>
          <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <p className="text-[0.8125rem] font-semibold text-[#ede7dc]/60">Sin CRC: riesgo</p>
              <ul className="mt-3 border-t border-white/15">
                {contrast.before.map((item) => (
                  <li key={item} className="border-b border-white/15 py-4 text-[1rem] leading-[1.6] text-[#ede7dc]/75">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.06}>
              <p className={labelOnDark}>Con CRC: protección</p>
              <ul className="mt-3 border-t border-[#e4935d]/50">
                {contrast.after.map((item) => (
                  <li key={item} className="border-b border-white/15 py-4 text-[1rem] leading-[1.6] text-[#fbf7ee]">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <EngagementList
        engagements={[COMPLIANCE_DIAGNOSTICO, COMPLIANCE_IMPLEMENTACION]}
        title="Dos compromisos: saber dónde está el colegio y cerrar las brechas"
        intro={
          <p>
            El diagnóstico se puede contratar solo. La implementación incluye la formación del equipo y, cuando hay una crisis
            de salud mental después de un caso de acoso, el soporte clínico del CRC para contener, leer el riesgo y derivar.
          </p>
        }
      />

      {/* Ley 21.809 */}
      <section aria-labelledby="ley-title" className="border-t border-[#d8cfc0] bg-[#f8f5ee]">
        <div className={`${container} grid gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:gap-16`}>
          <Reveal>
            <SectionHead eyebrow="Ley 21.809" title="Julio 2026 no es una fecha administrativa: es un cambio de estándar." id="ley-title">
              <p>
                La ley exige a los colegios actuar <em>oportunamente</em> frente a violencia, amenazas y acoso, bajo pena de
                sanciones administrativas y responsabilidad civil directa del sostenedor.
              </p>
            </SectionHead>
          </Reveal>
          <Reveal>
            <ul className="border-t border-[#d8cfc0]">
              {lawDuties.map((item) => (
                <li key={item} className="border-b border-[#d8cfc0] py-4 text-[1rem] leading-[1.6] text-[#171713]">
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="https://www.bcn.cl/portal/leyfacil/recurso/convivencia-buen-trato-y-bienestar-de-las-comunidades-educativas"
              target="_blank"
              rel="noopener noreferrer"
              className={`${textLink} mt-5`}
            >
              Resumen BCN Ley Fácil
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </section>

      <PersonInCharge
        person={HUGO}
        className="bg-[#fffdf8]"
        cta={{ href: "/instituciones?servicio=compliance-escolar#agenda", label: "Agenda 20 minutos con Hugo" }}
      >
        <p>
          Hugo coordina el trabajo con colegios y sostenedores: arma el diagnóstico, la propuesta y el convenio, y se asegura
          de que lo acordado se implemente y se mida. Desde Altius Ignite aporta la capa de datos y automatización que permite
          sostener el registro de cada caso.
        </p>
      </PersonInCharge>

      {/* Formulario */}
      <section id="diagnostico" aria-labelledby="diagnostico-title" className="scroll-mt-20 border-t border-[#d8cfc0] bg-[#f8f5ee]">
        <div className={`${container} grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16`}>
          <Reveal>
            <SectionHead eyebrow="Diagnóstico institucional" title="Partamos por saber si el protocolo protege o expone al colegio." id="diagnostico-title">
              <p>
                Solicite una reunión para evaluar brechas de compliance escolar, riesgos de convivencia y necesidades de
                capacitación del equipo.
              </p>
            </SectionHead>
            <div className="mt-8 border-l-2 border-[#bd6f3c] pl-5">
              <p className={label}>Entrega esperada</p>
              <p className="mt-1 text-[1rem] leading-[1.7] text-[#55574f]">
                Mapa inicial de riesgos, prioridades de acción y ruta de trabajo para cumplimiento, formación y soporte clínico.
              </p>
            </div>
            <p className="mt-8 text-[1rem] leading-[1.7] text-[#55574f]">
              ¿Prefiere conversarlo antes de completar el formulario?{" "}
              <Link href="/instituciones?servicio=compliance-escolar#agenda" className="font-semibold text-[#9f5528] underline decoration-[#d8cfc0] underline-offset-4 hover:text-[#171713]">
                Agende 20 minutos con Hugo
              </Link>
              .
            </p>
          </Reveal>
          <Reveal className="rounded-[6px] border border-[#d8cfc0] bg-[#fffdf8] p-5 sm:p-8">
            <ComplianceSchoolForm />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
