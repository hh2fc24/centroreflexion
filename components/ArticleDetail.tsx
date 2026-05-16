import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, User, Calendar, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MotionDiv, MotionItem } from "@/components/ui/Motion";
import { Article } from "@/lib/data";
import { JsonLd } from "@/components/JsonLd";

const getAuthorDetails = (author: string) => {
    if (author.includes("Rocío Solar")) {
        return { image: "/images/rocio_solar_real_white.png", role: "Co-fundadora & Terapeuta Ocupacional" };
    }
    if (author.includes("Juan Carlos Rauld")) {
        return { image: "/images/juan_carlos_real_white.png", role: "Director Editorial & Consultor en Ciencias Sociales" };
    }
    return null;
};

interface ArticleDetailProps {
    article: Article;
    backHref?: string;
    backLabel?: string;
}

export default function ArticleDetail({
    article,
    backHref = "/pensamiento-critico",
    backLabel = "Volver a Pensamiento Crítico",
}: ArticleDetailProps) {
    return (
        <article className="min-h-screen bg-[#fffdf8] pb-16 sm:pb-24">
            {/* Hero Image */}
            <div className="relative h-[42vh] min-h-[320px] w-full sm:h-[50vh] sm:min-h-[400px]">
                <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-4 sm:p-10 lg:p-20">
                    <MotionDiv className="max-w-4xl mx-auto text-white">
                        <Link
                            href={backHref}
                            className="inline-flex items-center text-sm font-medium text-[#d8d0c4] hover:text-white mb-6 transition-colors"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> {backLabel}
                        </Link>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="px-3 py-1 rounded-full bg-[#bd6f3c]/90 text-xs font-bold uppercase tracking-wider">
                                {article.category}
                            </span>
                        </div>
                        <h1 className="mb-4 text-3xl font-bold leading-tight sm:mb-6 sm:text-4xl lg:text-4xl font-serif">
                            {article.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-sm sm:text-base text-[#eee8dc]">
                            <div className="flex items-center gap-2">
                                {(() => {
                                    const details = getAuthorDetails(article.author);
                                    return (
                                        <>
                                            {details?.image ? (
                                                <Image src={details.image} alt={article.author} width={24} height={24} className="h-6 w-6 rounded-full object-cover ring-1 ring-white/50" />
                                            ) : (
                                                <User className="h-4 w-4" />
                                            )}
                                            <span className="font-semibold">{article.author}</span>
                                        </>
                                    );
                                })()}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{article.date}</span>
                            </div>
                        </div>
                    </MotionDiv>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-20">

                {/* Social Share & Actions (Sticky on Desktop potentially, or just top) */}
                <div className="mb-10 flex flex-col gap-6 border-b border-[#eee8dc] pb-8 sm:mb-12 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-lg font-serif italic leading-relaxed text-[#70695f] sm:text-xl">
                        {article.excerpt}
                    </p>
                    <div className="hidden sm:flex items-center gap-2">
                        <Button variant="ghost" size="sm" aria-label="Guardar">
                            <Bookmark className="h-5 w-5 text-[#8a8276] hover:text-[#171713]" />
                        </Button>
                        <Button variant="ghost" size="sm" aria-label="Compartir">
                            <Share2 className="h-5 w-5 text-[#8a8276] hover:text-[#171713]" />
                        </Button>
                    </div>
                </div>

                <MotionDiv transition={{ delay: 0.2 }}>
                    <div className="prose prose-stone max-w-none font-serif leading-8 text-[#23241f] prose-headings:font-serif prose-a:text-[#bd6f3c] hover:prose-a:text-[#bd6f3c] sm:prose-lg">
                        {article.content.map((paragraph, index, arr) => {
                            const isReferenceHeader = paragraph.toLowerCase().startsWith("referencias integradas") || paragraph.toLowerCase().startsWith("referencias bibliográficas");
                            const refHeaderIndex = arr.findIndex(p => p.toLowerCase().startsWith("referencias integradas") || p.toLowerCase().startsWith("referencias bibliográficas"));
                            
                            const isReference = refHeaderIndex !== -1 && index > refHeaderIndex;

                            if (isReferenceHeader) {
                                return (
                                    <h3 key={index} className="text-lg font-bold mt-12 mb-6 text-[#171713] border-b pb-2">
                                        Referencias
                                    </h3>
                                );
                            }

                            if (isReference) {
                                // Clean up bullet points if they exist
                                const cleanRef = paragraph.replace(/^•\s*/, '');
                                return (
                                    <p key={index} className="pl-6 -indent-6 mb-3 text-sm text-[#70695f] leading-relaxed font-serif italic">
                                        {cleanRef}
                                    </p>
                                );
                            }

                            return (
                                <p key={index} className="mb-6 first-letter:text-4xl first-letter:font-bold first-letter:text-[#171713] first-letter:mr-3 first-letter:float-left">
                                    {paragraph}
                                </p>
                            );
                        })}
                    </div>
                </MotionDiv>

                {/* Author Bio / Footer */}
                <div className="mt-16 pt-10 border-t border-[#eee8dc]">
                    <div className="flex flex-col items-start gap-4 rounded-[6px] bg-[#f8f5ee] p-5 sm:flex-row sm:items-center sm:p-6">
                        {(() => {
                            const details = getAuthorDetails(article.author);
                            return (
                                <>
                                    {details?.image ? (
                                        <Image src={details.image} alt={article.author} width={64} height={64} className="h-16 w-16 rounded-full object-cover ring-2 ring-[#ded5c7]" />
                                    ) : (
                                        <div className="h-16 w-16 rounded-full bg-[#ded5c7] flex items-center justify-center text-xl font-bold text-[#70695f]">
                                            {article.author.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-bold text-[#171713]">Escrito por {article.author}</h3>
                                        <p className="text-sm text-[#70695f]">
                                            {details?.role || "Analista y colaborador en Centro de Reflexiones Críticas."}
                                        </p>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>

                {/* CTA */}
                <MotionItem className="mt-16 rounded-[8px] bg-[#bd6f3c] p-6 text-center text-white shadow-md sm:mt-20 sm:p-10">
                    <h3 className="text-2xl font-bold mb-4">¿Te interesa profundizar en estos temas?</h3>
                    <p className="mb-8 text-[#f1ded0]">
                        Ofrecemos consultoría especializada para instituciones y académicos que buscan maximizar su impacto.
                    </p>
                    <Link href="/servicios">
                        <Button className="w-full border-none bg-[#fffdf8] font-bold text-[#bd6f3c] hover:bg-[#eee8dc] sm:w-auto">
                            Ver Servicios de Consultoría
                        </Button>
                    </Link>
                </MotionItem>

                <JsonLd article={article} />

            </div>
        </article>
    );
}
