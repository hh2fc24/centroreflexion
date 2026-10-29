import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { getSiteUrl } from "@/lib/site";

const path = "/prensa/juan-carlos-rauld-radio-pauta-desde-el-jardin-28-octubre-2026";
const videoId = "cyzIgLIOijo";
const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
const programUrl = "https://www.pauta.cl/tendencias/desde-el-jardin/2026/10/28/desde-el-jardin-28-de-octubre-de-2026.html";
const title = "Juan Carlos Rauld en Desde el Jardín: infancia, justicia y responsabilidad del Estado";
const description = "Cristián Warnken conversa con Juan Carlos Rauld, director editorial del CRC, sobre la crisis de la protección de la infancia, la institucionalización y la tensión entre legalidad y justicia. Radio PAUTA, 28 de octubre de 2026.";

export const metadata: Metadata = {
  title: `${title} | Centro de Reflexiones Críticas`,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    type: "article",
    url: path,
    images: [{ url: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`, width: 1280, height: 720, alt: "Entrevista a Juan Carlos Rauld en Radio PAUTA" }],
  },
  twitter: { card: "summary_large_image", title, description, images: [`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`] },
};

export default function PautaInterviewPage() {
  const siteUrl = getSiteUrl();
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "Juan Carlos Rauld y Ernesto Pfeiffer entre la protección de la infancia, la literatura y la memoria",
    description,
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    uploadDate: "2026-10-29",
    duration: "PT57M20S",
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
    url: videoUrl,
    publisher: { "@type": "Organization", name: "Radio PAUTA", url: "https://www.pauta.cl" },
    about: { "@type": "Person", name: "Juan Carlos Rauld" },
    mainEntityOfPage: `${siteUrl}${path}`,
  };

  return (
    <article className="bg-[#fffdf8] text-[#171713]">
      <header className="border-b border-[#d8cfc0] bg-[#f8f5ee]">
        <div className="mx-auto max-w-[1120px] px-5 py-12 sm:px-8 sm:py-20">
          <Link href="/prensa" className="inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-[#55574f] underline-offset-4 hover:text-[#9f5528] hover:underline">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Sala de prensa
          </Link>
          <p className="mt-10 text-[0.8125rem] font-semibold text-[#9f5528]">Entrevista · Desde el Jardín · Radio PAUTA · 28 de octubre de 2026</p>
          <h1 className="crc-serif mt-4 max-w-[24ch] text-balance text-[clamp(2rem,3.2vw,3.25rem)] font-medium leading-[1.1] tracking-[-0.01em]">{title}</h1>
          <p className="mt-6 max-w-[68ch] text-[1.0625rem] leading-[1.7] text-[#55574f]">{description}</p>
        </div>
      </header>

      <div className="mx-auto max-w-[1120px] px-5 py-12 sm:px-8 sm:py-16">
        <div id="ver-entrevista" className="scroll-mt-24 overflow-hidden rounded-[6px] bg-[#15120e]">
          <div className="relative aspect-video">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
              title="Juan Carlos Rauld en Desde el Jardín, Radio PAUTA, 28 de octubre de 2026"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
        <p className="mt-3 max-w-[82ch] text-[0.875rem] leading-[1.6] text-[#6f675d]">
          Programa completo de Desde el Jardín. La conversación con Juan Carlos Rauld abre la emisión; el espacio continúa con el editor Ernesto Pfeiffer y una sección sobre literatura y memoria.
        </p>
        <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-[#171713] underline decoration-[#bd6f3c] underline-offset-[6px] hover:text-[#9f5528]">
          Ver en el canal de Radio PAUTA <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>

        <div className="mt-16 grid gap-12 border-t border-[#d8cfc0] pt-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)] lg:gap-20">
          <div className="max-w-[68ch]">
            <p className="text-[0.8125rem] font-semibold text-[#9f5528]">La conversación</p>
            <h2 className="crc-serif mt-3 text-balance text-[clamp(1.6rem,2.3vw,2.4rem)] font-medium leading-[1.1]">La protección infantil ante sus consecuencias reales</h2>
            <p className="mt-6 text-[1.0625rem] leading-[1.7] text-[#171713]">
              En la entrevista con Cristián Warnken, Juan Carlos Rauld aborda la crisis del sistema de protección de la infancia en Chile y las consecuencias de la institucionalización para niños, niñas y adolescentes. La conversación examina qué ocurre cuando las decisiones legales y los procedimientos administrativos se alejan del cuidado y de la responsabilidad ética.
            </p>
            <p className="mt-5 text-[1.0625rem] leading-[1.7] text-[#171713]">
              El diálogo surge a propósito de la controversia por la liberación anticipada de condenados por delitos sexuales. Desde su trabajo sobre desprotección y tecnocracia, Rauld plantea una pregunta que atraviesa la discusión pública: cómo responder por la vida de la niñez cuando una resolución jurídicamente tramitada puede producir daño.
            </p>
            <p className="mt-6 text-[0.9375rem] leading-[1.6] text-[#55574f]">
              La emisión corresponde al <a href={programUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-[#bd6f3c] underline-offset-4 hover:text-[#9f5528]">programa del 28 de octubre de 2026</a>; Radio PAUTA publicó el video en YouTube el 29 de octubre.
            </p>
          </div>
          <aside className="border-t border-[#d8cfc0] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <h2 className="text-[0.875rem] font-semibold">Para seguir el debate</h2>
            <ul className="mt-5 border-t border-[#d8cfc0]">
              <li className="border-b border-[#d8cfc0] py-5">
                <Link href="/pensamiento-critico/mala-mia-decreto-expediente-banalizacion-mal" className="group block">
                  <span className="text-[0.8125rem] font-semibold text-[#9f5528]">Columna · Juan Carlos Rauld</span>
                  <span className="crc-serif mt-2 block text-[1.2rem] leading-[1.3] group-hover:underline group-hover:decoration-[#bd6f3c] group-hover:underline-offset-4">“Mala mía”: el decreto, el expediente y la banalización del mal</span>
                </Link>
              </li>
              <li className="border-b border-[#d8cfc0] py-5">
                <a href="https://www.elmostrador.cl/agenda-pais/ninez/2026/04/05/juan-carlos-rauld-el-estado-desprotege-es-una-intervencion-cara-con-malos-resultados/" target="_blank" rel="noopener noreferrer" className="group block">
                  <span className="text-[0.8125rem] font-semibold text-[#9f5528]">Entrevista · El Mostrador</span>
                  <span className="crc-serif mt-2 block text-[1.2rem] leading-[1.3] group-hover:underline group-hover:decoration-[#bd6f3c] group-hover:underline-offset-4">“El Estado desprotege. Es una intervención cara con malos resultados”</span>
                </a>
              </li>
              <li className="py-5">
                <Link href="/prensa" className="inline-flex items-center gap-2 text-[0.9375rem] font-semibold underline decoration-[#bd6f3c] underline-offset-4 hover:text-[#9f5528]">Conocer al vocero y su trabajo <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </li>
            </ul>
          </aside>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema).replace(/</g, "\\u003c") }} />
    </article>
  );
}
