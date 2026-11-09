"use client";

import { useRef, useState } from "react";
import { ArrowDown, Loader2, Play, RotateCcw } from "lucide-react";

type Reel = {
  id: string;
  src: string;
  poster: string;
  label: string;
  duration: string;
  summary: string;
};

const REELS: Reel[] = [
  {
    id: "contexto",
    src: "/videos/prensa/rauld-reel-contexto.mp4",
    poster: "/images/prensa/rauld-reel-contexto.webp",
    label: "El contexto",
    duration: "1:03",
    summary: "Cómo se mira a niñas y niños desde la medicina, la conducta y el derecho, y qué queda afuera.",
  },
  {
    id: "la-voz-de-la-nina",
    src: "/videos/prensa/rauld-reel-la-voz-de-la-nina.mp4",
    poster: "/images/prensa/rauld-reel-la-voz-de-la-nina.webp",
    label: "La voz de la niña",
    duration: "0:36",
    summary: "Entre tantos discursos, una pregunta sigue abierta: quién la escucha a ella.",
  },
];

type Status = "idle" | "loading" | "playing" | "ended" | "error";

function ReelCard({ reel, className, onStart }: { reel: Reel; className?: string; onStart: (video: HTMLVideoElement) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const title = `${reel.label}, fragmento de ${reel.duration}`;

  function play() {
    const video = videoRef.current;
    if (!video) return;
    if (status === "error") video.load();
    setStatus("loading");
    video.play().catch(() => setStatus("error"));
  }

  const showCover = status === "idle" || status === "ended" || status === "error";

  return (
    <figure className={className}>
      <div className="relative aspect-[9/16] overflow-hidden rounded-[6px] bg-black">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={reel.src}
          poster={reel.poster}
          preload="none"
          playsInline
          controls={status === "playing" || status === "loading"}
          aria-label={title}
          onPlay={(event) => onStart(event.currentTarget)}
          onPlaying={() => setStatus("playing")}
          onWaiting={() => setStatus("loading")}
          onEnded={(event) => {
            setStatus("ended");
            event.currentTarget.load();
          }}
          onError={() => setStatus("error")}
        />
        {showCover ? (
          <button type="button" onClick={play} aria-label={`${status === "ended" ? "Ver de nuevo" : status === "error" ? "Reintentar" : "Reproducir"}: ${title}`} className="group absolute inset-0 block focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#e2965c]">
            <span className="absolute bottom-4 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#bd6f3c] text-white shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-colors group-hover:bg-[#a85f31]">
              {status === "idle" ? <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden="true" /> : <RotateCcw className="h-5 w-5" aria-hidden="true" />}
            </span>
          </button>
        ) : null}
        {status === "loading" ? (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center" role="status" aria-label="Cargando video">
            <Loader2 className="h-9 w-9 animate-spin text-white motion-reduce:animate-none" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <figcaption className="mt-4">
        <p className="text-[0.875rem] font-semibold text-[#f8f5ee]">
          {reel.label} <span className="font-normal text-[#a89f90]">· {reel.duration}</span>
        </p>
        {status === "error" ? (
          <p className="mt-1.5 text-[0.9375rem] leading-[1.55] text-[#e2965c]" role="alert">No pudimos cargar el video. Toca la imagen para reintentar.</p>
        ) : (
          <p className="mt-1.5 text-[0.9375rem] leading-[1.55] text-[#d8cfc0]">{reel.summary}</p>
        )}
      </figcaption>
    </figure>
  );
}

export function PautaReels() {
  const current = useRef<HTMLVideoElement | null>(null);

  // Solo suena un video a la vez: al partir uno, se pausa el que estaba corriendo.
  function handleStart(video: HTMLVideoElement) {
    if (current.current && current.current !== video) current.current.pause();
    current.current = video;
  }

  return (
    <section aria-labelledby="reels-title" className="bg-[#15120e]">
      <div className="mx-auto grid max-w-[1120px] gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-[0.8125rem] font-semibold text-[#e2965c]">Dos momentos de la conversación</p>
          <h2 id="reels-title" className="crc-serif mt-3 text-balance text-[clamp(1.6rem,2.3vw,2.4rem)] font-medium leading-[1.12] text-[#f8f5ee]">
            Menos de dos minutos para entrar en el tema
          </h2>
          <p className="mt-5 max-w-[46ch] text-[1.0625rem] leading-[1.7] text-[#d8cfc0]">
            Cristián Warnken pregunta y Juan Carlos Rauld responde. Editamos estos fragmentos para poner en primer plano lo que nos importa como centro: proteger a niñas y niños, y que su voz sea escuchada.
          </p>
          <a href="#ver-entrevista" className="mt-5 inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-[#f8f5ee] underline decoration-[#e2965c] underline-offset-[6px] hover:text-[#e2965c]">
            Ver la entrevista completa <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 sm:gap-6">
          <ReelCard reel={REELS[0]} onStart={handleStart} />
          <ReelCard reel={REELS[1]} className="sm:mt-20" onStart={handleStart} />
        </div>
      </div>
    </section>
  );
}
