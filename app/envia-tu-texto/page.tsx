import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
    title: "Envía tu Texto",
    description:
        "Comparte tu columna de opinión, crítica cultural o artículo de ciencias sociales para su publicación en el Centro de Reflexiones Críticas.",
    path: "/envia-tu-texto",
    ogTitle: "Envía tu Texto | Centro de Reflexiones Críticas",
    ogDescription: "Convocatoria para columnas de opinión y crítica cultural.",
});

const OFFICIAL_EMAIL = "centrodereflexionescriticas@gmail.com";

const FOCO = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bd6f3c]";
const CONTENEDOR = "mx-auto max-w-[1240px] px-4 sm:px-8 lg:px-12";

const LINEAMIENTOS = [
    { titulo: "Originalidad", texto: "Aceptamos textos inéditos que aporten una perspectiva propia." },
    { titulo: "Extensión", texto: "Recomendamos entre 800 y 1.500 palabras para artículos de fondo." },
    { titulo: "Estilo", texto: "Buscamos rigor intelectual con un lenguaje accesible y claro." },
    { titulo: "Formato", texto: "Archivo Word (.docx), interlineado 1,5. No se aceptan PDF ni otros formatos." },
    { titulo: "Referencias y citas", texto: "Todas las referencias bibliográficas y citas se ajustan a la norma APA 7.ª edición." },
];

export default function SubmitText() {
    return (
        <div className="bg-[#f8f5ee] text-[#171713]">
            <section className="border-b border-[#d8cfc0]">
                <div className={`${CONTENEDOR} py-12 sm:py-16 lg:py-20`}>
                    <div className="max-w-[680px]">
                        <p className="text-[0.8125rem] font-semibold text-[#9f5528]">Convocatoria abierta · Columnas y ensayos</p>
                        <h1 className="crc-serif mt-4 text-balance text-[clamp(2rem,3.2vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.01em]">
                            Envía tu texto
                        </h1>
                        <p className="mt-5 max-w-[60ch] text-[1.0625rem] leading-[1.7] text-[#55574f]">
                            Publicamos columnas de opinión, crítica cultural y artículos de ciencias sociales. Si tienes un
                            análisis o un ensayo que quieres compartir, envíalo al comité editorial del CRC.
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-[#fffdf8]">
                <div className={`${CONTENEDOR} grid gap-10 py-14 sm:py-20 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-14`}>
                    <p className="text-[0.8125rem] font-semibold text-[#9f5528]">Lineamientos editoriales</p>

                    <div className="max-w-[720px]">
                        <h2 className="crc-serif text-balance text-[clamp(1.6rem,2.3vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.01em]">
                            Qué debe cumplir tu propuesta
                        </h2>
                        <dl className="mt-8 border-t border-[#d8cfc0]">
                            {LINEAMIENTOS.map((item) => (
                                <div
                                    key={item.titulo}
                                    className="grid gap-1 border-b border-[#eee8dc] py-4 sm:grid-cols-[190px_minmax(0,1fr)] sm:gap-6"
                                >
                                    <dt className="text-[1rem] font-semibold">{item.titulo}</dt>
                                    <dd className="text-[1rem] leading-[1.65] text-[#55574f]">{item.texto}</dd>
                                </div>
                            ))}
                        </dl>

                        <div className="mt-12 grid gap-8 sm:grid-cols-2 sm:gap-12">
                            <div>
                                <h3 className="text-[1rem] font-semibold">Columnas de opinión</h3>
                                <p className="mt-2 text-[1rem] leading-[1.65] text-[#55574f]">
                                    Se envían únicamente en formato Word (.docx). Las referencias bibliográficas y citas
                                    textuales se formatean según la norma APA 7.ª edición.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-[1rem] font-semibold">Proceso de selección</h3>
                                <p className="mt-2 text-[1rem] leading-[1.65] text-[#55574f]">
                                    El comité editorial revisa todas las propuestas. El tiempo de respuesta estimado es de
                                    dos semanas.
                                </p>
                            </div>
                        </div>

                        <div className="mt-12 rounded-[6px] border border-[#d8cfc0] bg-[#f8f5ee] p-5 sm:p-7">
                            <h2 className="crc-serif text-[1.35rem] font-medium leading-[1.2]">¿Listo para enviar?</h2>
                            <p className="mt-2 text-[1rem] leading-[1.65] text-[#55574f]">
                                Envía tu propuesta, con el archivo adjunto, a nuestro correo editorial.
                            </p>
                            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                                <a
                                    href={`mailto:${OFFICIAL_EMAIL}`}
                                    className={`inline-flex h-12 items-center justify-center gap-2 rounded-[6px] bg-[#bd6f3c] px-5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[#a85f31] ${FOCO}`}
                                >
                                    Enviar por correo <ArrowRight aria-hidden="true" className="h-4 w-4" />
                                </a>
                                <span className="break-all text-[0.9375rem] text-[#55574f]">{OFFICIAL_EMAIL}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
