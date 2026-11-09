import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PautaProgramPlayer } from "@/components/site/PautaProgramPlayer";
import { PautaReels } from "@/components/site/PautaReels";
import { getSiteUrl } from "@/lib/site";

const path = "/prensa/juan-carlos-rauld-radio-pauta-desde-el-jardin-28-octubre-2026";
const videoId = "cyzIgLIOijo";
const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
const spotifyEpisodeId = "43NT7pc4pW5pq7pMvKCTSE";
const programUrl = "https://www.pauta.cl/tendencias/desde-el-jardin/2026/10/28/desde-el-jardin-28-de-octubre-de-2026.html";
const title = "Juan Carlos Rauld en Desde el Jardín: la protección de la niñez ante la liberación de condenados";
const description = "Cristián Warnken conversa con Juan Carlos Rauld, director editorial del CRC, sobre la protección de la niñez ante la liberación de condenados por delitos sexuales, que Rauld considera injusta con la infancia y con las familias víctimas. Radio PAUTA, 28 de octubre de 2026.";

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
  const podcastSchema = {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: videoSchema.name,
    description,
    url: `https://open.spotify.com/episode/${spotifyEpisodeId}`,
    datePublished: "2026-10-28",
    partOfSeries: { "@type": "PodcastSeries", name: "Desde el Jardín" },
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

      <PautaReels />

      <div className="mx-auto max-w-[1120px] px-5 py-12 sm:px-8 sm:py-16">
        <div id="ver-entrevista" className="scroll-mt-24">
          <PautaProgramPlayer youtubeId={videoId} spotifyId={spotifyEpisodeId} />
        </div>

        <div className="mt-16 grid gap-12 border-t border-[#d8cfc0] pt-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)] lg:gap-20">
          <div className="max-w-[68ch]">
            <p className="text-[0.8125rem] font-semibold text-[#9f5528]">La conversación</p>
            <h2 className="crc-serif mt-3 text-balance text-[clamp(1.6rem,2.3vw,2.4rem)] font-medium leading-[1.1]">La niñez y sus familias, en el centro</h2>
            <p className="mt-6 text-[1.0625rem] leading-[1.7] text-[#171713]">
              En la entrevista con Cristián Warnken, Juan Carlos Rauld pone en primer plano a quienes suelen quedar fuera de la discusión: niñas, niños y adolescentes, y las familias que cargan con lo que vivieron. La conversación surge a propósito de la liberación de condenados por delitos sexuales, una decisión que Rauld considera injusta con la infancia y con las víctimas.
            </p>
            <p className="mt-5 text-[1.0625rem] leading-[1.7] text-[#171713]">
              Desde su trabajo sobre desprotección, Rauld plantea una pregunta que atraviesa toda la conversación: dónde está la voz de la niña. En los expedientes aparecen muchas razones y muchos discursos, pero no la voz de quien sufrió el daño. Para el centro, proteger a la niñez empieza por escucharla y por acompañar a las familias que se han hecho cargo de esos procesos traumáticos.
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([videoSchema, podcastSchema]).replace(/</g, "\\u003c") }} />
    </article>
  );
}
