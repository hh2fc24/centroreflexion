import { EditableText } from "@/components/editor/EditableText";

const interviews = [
    {
        youtubeId: "QvJ5Y3pJyrY",
        channel: "Extensión Línea Uno",
        title: "“Tecnócratas de la Infancia: desprotección y neoliberalismo”",
        summary:
            "Una investigación crítica sobre el sistema de protección estatal y cómo la lógica del encierro administra la niñez.",
        frameTitle: "Entrevista a Juan Carlos Rauld en Extensión Línea Uno",
    },
    {
        youtubeId: "9fFTnDS0b6M",
        channel: "Entrevista",
        title: "“Cuando un niño pobre en Chile entra a un centro de la infancia, enfrenta un proceso burocrático donde no se escucha al menor”",
        summary: "Conversación sobre las fallas estructurales del sistema al abordar la niñez vulnerada.",
        frameTitle: "Entrevista a Juan Carlos Rauld sobre políticas de infancia",
    },
];

export function InterviewsSection() {
    return (
        <section className="bg-[#15120e] py-14 text-[#f8f5ee] sm:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-8">
                <p className="text-[0.8125rem] font-semibold text-[#e4935d]">En los medios</p>
                <h2 className="crc-serif mt-3 max-w-[24ch] text-balance text-[clamp(1.6rem,2.3vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.01em] text-[#fffdf8]">
                    <EditableText path="homeInterviews.title" ariaLabel="Multimedia título" />
                </h2>
                <p className="mt-4 max-w-[62ch] text-[1rem] leading-[1.7] text-[#d8cfc0]">
                    Participaciones en medios donde analizamos la infancia, el sistema de protección y la salud mental pública.
                </p>

                <div className="mt-10 grid gap-10 lg:grid-cols-2">
                    {interviews.map((item) => (
                        <article key={item.youtubeId}>
                            <div className="relative aspect-video overflow-hidden rounded-[6px] bg-black">
                                <iframe
                                    className="absolute inset-0 h-full w-full"
                                    src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}?controls=1&rel=0&modestbranding=1`}
                                    title={item.frameTitle}
                                    loading="lazy"
                                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            </div>
                            <p className="mt-4 text-[0.8125rem] font-semibold text-[#e4935d]">{item.channel}</p>
                            <h3 className="crc-serif mt-2 text-balance text-[1.35rem] font-semibold leading-[1.25] text-[#fffdf8]">
                                {item.title}
                            </h3>
                            <p className="mt-3 max-w-[60ch] text-[0.9375rem] leading-[1.7] text-[#d8cfc0]">{item.summary}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
