import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, User, Calendar, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MotionDiv, MotionItem } from "@/components/ui/Motion";
import { Article } from "@/lib/data";
import { JsonLd } from "@/components/JsonLd";

interface ArticleDetailProps {
    article: Article;
}

export default function ArticleDetail({ article }: ArticleDetailProps) {
    return (
        <article className="min-h-screen bg-white pb-24">
            {/* Hero Image */}
            <div className="relative w-full h-[50vh] min-h-[400px]">
                <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-12 lg:p-20">
                    <MotionDiv className="max-w-4xl mx-auto text-white">
                        <Link
                            href="/columnas"
                            className="inline-flex items-center text-sm font-medium text-gray-300 hover:text-white mb-6 transition-colors"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Columnas
                        </Link>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="px-3 py-1 rounded-full bg-blue-600/90 text-xs font-bold uppercase tracking-wider">
                                {article.category}
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif leading-tight mb-6">
                            {article.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-sm sm:text-base text-gray-200">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span className="font-semibold">{article.author}</span>
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
            <div className="max-w-3xl mx-auto px-6 py-12 sm:py-20">

                {/* Social Share & Actions (Sticky on Desktop potentially, or just top) */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-8 mb-12">
                    <p className="text-xl font-serif italic text-gray-500 leading-relaxed">
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
                    <div className="prose prose-lg prose-slate prose-headings:font-serif prose-a:text-blue-600 hover:prose-a:text-blue-500 max-w-none font-serif text-gray-800 leading-8">
                        {article.content.map((paragraph, index) => (
                            <p key={index} className="mb-6 first-letter:text-5xl first-letter:font-bold first-letter:text-gray-900 first-letter:mr-3 first-letter:float-left">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </MotionDiv>

                {/* Author Bio / Footer */}
                <div className="mt-16 pt-10 border-t border-gray-100">
                    <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-xl">
                        <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500">
                            {article.author.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Escrito por {article.author}</h3>
                            <p className="text-sm text-gray-500">Analista y colaborador en Centro de Reflexiones Críticas.</p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <MotionItem className="mt-20 text-center bg-blue-600 rounded-2xl p-10 text-white shadow-xl">
                    <h3 className="text-2xl font-bold mb-4">¿Te interesa profundizar en estos temas?</h3>
                    <p className="mb-8 text-blue-100">
                        Ofrecemos consultoría especializada para instituciones y académicos que buscan maximizar su impacto.
                    </p>
                    <Link href="/servicios">
                        <Button className="bg-white text-blue-600 hover:bg-gray-100 font-bold border-none">
                            Ver Servicios de Consultoría
                        </Button>
                    </Link>
                </MotionItem>

                <JsonLd article={article} />

            </div>
        </article>
    );
}
