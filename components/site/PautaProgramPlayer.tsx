"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ExternalLink, Headphones, Play } from "lucide-react";

type Format = "ver" | "escuchar";

const FORMATS: { id: Format; label: string; Icon: typeof Play }[] = [
  { id: "ver", label: "Ver", Icon: Play },
  { id: "escuchar", label: "Escuchar", Icon: Headphones },
];

const LINK_CLASS = "mt-4 inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-[#171713] underline decoration-[#bd6f3c] underline-offset-[6px] hover:text-[#9f5528]";

export function PautaProgramPlayer({ youtubeId, spotifyId }: { youtubeId: string; spotifyId: string }) {
  const [format, setFormat] = useState<Format>("ver");
  const tabs = useRef<Partial<Record<Format, HTMLButtonElement | null>>>({});

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const next: Format = format === "ver" ? "escuchar" : "ver";
    setFormat(next);
    tabs.current[next]?.focus();
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h2 className="crc-serif text-[clamp(1.4rem,1.9vw,1.9rem)] font-medium leading-[1.15]">El programa completo</h2>
        <div role="tablist" aria-label="Formato del programa" className="inline-flex rounded-[6px] border border-[#d8cfc0] p-1">
          {FORMATS.map(({ id, label, Icon }) => {
            const selected = format === id;
            return (
              <button
                key={id}
                ref={(node) => {
                  tabs.current[id] = node;
                }}
                type="button"
                role="tab"
                id={`formato-${id}`}
                aria-selected={selected}
                aria-controls="programa-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setFormat(id)}
                onKeyDown={handleKeyDown}
                className={`inline-flex min-h-11 items-center gap-2 rounded-[4px] px-4 text-[0.9375rem] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bd6f3c] ${selected ? "bg-[#171713] text-white" : "text-[#55574f] hover:text-[#9f5528]"}`}
              >
                <Icon className={`h-4 w-4 ${id === "ver" && selected ? "fill-current" : ""}`} aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Solo se monta el reproductor elegido: así nunca suenan los dos y Spotify carga únicamente si alguien lo pide. */}
      <div id="programa-panel" role="tabpanel" aria-labelledby={`formato-${format}`}>
        {format === "ver" ? (
          <div className="overflow-hidden rounded-[6px] bg-[#15120e]">
            <div className="relative aspect-video">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
                title="Juan Carlos Rauld en Desde el Jardín, Radio PAUTA, 28 de octubre de 2026"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        ) : (
          <iframe
            className="block h-[232px] w-full rounded-[12px] border-0"
            src={`https://open.spotify.com/embed/episode/${spotifyId}?theme=0`}
            title="Desde el Jardín del 28 de octubre de 2026 en Spotify"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
        )}
        <p className="mt-3 max-w-[82ch] text-[0.875rem] leading-[1.6] text-[#6f675d]">
          La conversación con Juan Carlos Rauld abre la emisión; el espacio continúa con el editor Ernesto Pfeiffer y una sección sobre literatura y memoria.
          {format === "escuchar" ? " Son 57 minutos: si aquí aparece como «Muestra», ábrelo en Spotify para escucharlo completo." : ""}
        </p>
        {format === "ver" ? (
          <a href={`https://www.youtube.com/watch?v=${youtubeId}`} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
            Ver en el canal de Radio PAUTA <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        ) : (
          <a href={`https://open.spotify.com/episode/${spotifyId}`} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
            Abrir en Spotify <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        )}
      </div>
    </>
  );
}
