import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, User, Calendar, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MotionDiv, MotionItem } from "@/components/ui/Motion";
import { Article } from "@/lib/data";
import { JsonLd } from "@/components/JsonLd";

const getAuthorDetails = (author: string) => {
    if (author.includes("Rocío Solar")) {
        return { image: "/images/rocio_solar.png", role: "Co-fundadora & Terapeuta Ocupacional" };
    }
    if (author.includes("Juan Carlos Rauld")) {
        return { image: "/images/juan_carlos_20260224.png", role: "Director Editorial & Consultor en Ciencias Sociales" };
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
        <article className="min-h-screen bg-white pb-16 sm:pb-24">
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
                            className="inline-flex items-center text-sm font-medium text-gray-300 hover:text-white mb-6 transition-colors"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> {backLabel}
                        </Link>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="px-3 py-1 rounded-full bg-blue-600/90 text-xs font-bold uppercase tracking-wider">
                                {article.category}
                            </span>
                        </div>
                        <h1 className="mb-4 text-3xl font-bold leading-tight sm:mb-6 sm:text-4xl lg:text-5xl font-serif">
                            {article.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-sm sm:text-base text-gray-200">
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
                <div className="mb-10 flex flex-col gap-6 border-b border-gray-100 pb-8 sm:mb-12 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-lg font-serif italic leading-relaxed text-gray-500 sm:text-xl">
                        {article.excerpt}
                    </p>
                    <div className="hidden sm:flex items-center gap-2">
                        <Button variant="ghost" size="sm" aria-label="Guardar">
                            <Bookmark className="h-5 w-5 text-gray-400 hover:text-gray-900" />
                        </Button>
                        <Button variant="ghost" size="sm" aria-label="Compartir">
                            <Share2 className="h-5 w-5 text-gray-400 hover:text-gray-900" />
                        </Button>
                    </div>
                </div>

                <MotionDiv transition={{ delay: 0.2 }}>
                    <div className="prose prose-slate max-w-none font-serif leading-8 text-gray-800 prose-headings:font-serif prose-a:text-blue-600 hover:prose-a:text-blue-500 sm:prose-lg">
                        {article.content.map((paragraph, index) => (
                            <p key={index} className="mb-6 first-letter:text-5xl first-letter:font-bold first-letter:text-gray-900 first-letter:mr-3 first-letter:float-left">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </MotionDiv>

                {/* Author Bio / Footer */}
                <div className="mt-16 pt-10 border-t border-gray-100">
                    <div className="flex flex-col items-start gap-4 rounded-xl bg-gray-50 p-5 sm:flex-row sm:items-center sm:p-6">
                        {(() => {
                            const details = getAuthorDetails(article.author);
                            return (
                                <>
                                    {details?.image ? (
                                        <Image src={details.image} alt={article.author} width={64} height={64} className="h-16 w-16 rounded-full object-cover ring-2 ring-gray-200" />
                                    ) : (
                                        <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500">
                                            {article.author.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-bold text-gray-900">Escrito por {article.author}</h3>
                                        <p className="text-sm text-gray-500">
                                            {details?.role || "Analista y colaborador en Centro de Reflexiones Críticas."}
                                        </p>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>

                {/* CTA */}
                <MotionItem className="mt-16 rounded-2xl bg-blue-600 p-6 text-center text-white shadow-xl sm:mt-20 sm:p-10">
                    <h3 className="text-2xl font-bold mb-4">¿Te interesa profundizar en estos temas?</h3>
                    <p className="mb-8 text-blue-100">
                        Ofrecemos consultoría especializada para instituciones y académicos que buscan maximizar su impacto.
                    </p>
                    <Link href="/servicios">
                        <Button className="w-full border-none bg-white font-bold text-blue-600 hover:bg-gray-100 sm:w-auto">
                            Ver Servicios de Consultoría
                        </Button>
                    </Link>
                </MotionItem>

                <JsonLd article={article} />

            </div>
        </article>
    );
}
