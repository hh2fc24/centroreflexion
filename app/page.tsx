import { Hero } from "@/components/Hero";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";
import { ArrowRight, BookOpen, PenTool } from "lucide-react";
import { MotionDiv, MotionItem, MotionList } from "@/components/ui/Motion";
import Image from "next/image";
import { columns, reviews } from "@/lib/data";
import { InterviewsSection } from "@/components/InterviewsSection";

export default function Home() {
  // Select latest articles from both collections
  const featuredColumns = columns.slice(0, 1);
  const featuredReviews = reviews.slice(0, 2);
  // Combine for display (just for variety in the snippet)
  // Or just pick specific curated ones as per original intent

  // Specific curated articles for Home
  const article1 = columns.find(c => c.id === "elecciones-polarizacion") || columns[0];
  const article2 = reviews.find(r => r.id === "soledad-garcia-marquez") || reviews[0];
  const article3 = columns.find(c => c.id === "mito-progreso") || columns[2];

  const featuredArticles = [
    { ...article1, link: `/columnas/${article1.id}` },
    { ...article2, link: `/critica/${article2.id}` },
    { ...article3, link: `/columnas/${article3.id}` }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      {/* Featured Sections - Premium overlapping cards */}
      <section className="relative z-20 -mt-24 pb-24 px-4 sm:px-6 lg:px-8">
        <MotionDiv
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto max-w-7xl"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {/* Columnas Card */}
            <Link href="/columnas" className="group relative">
              <div className="absolute inset-0 bg-blue-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="h-full relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm p-8 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-100">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <PenTool className="h-24 w-24 text-blue-900" />
                </div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center p-3 rounded-xl bg-blue-50 text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <PenTool className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-serif">Columnas de Opinión</h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Análisis profundos sobre la actualidad social y política desde una perspectiva crítica y fundamentada.
                  </p>
                  <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Leer Columnas <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Crítica Card */}
            <Link href="/critica" className="group relative">
              <div className="absolute inset-0 bg-purple-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="h-full relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm p-8 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-100">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <BookOpen className="h-24 w-24 text-purple-900" />
                </div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center p-3 rounded-xl bg-purple-50 text-purple-600 mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-serif">Crítica Literaria</h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Reseñas y ensayos exahustivos sobre obras literarias, cine y fenómenos culturales contemporáneos.
                  </p>
                  <div className="flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Explorar Crítica <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Servicios Premium Card */}
            <Link href="/servicios" className="group relative md:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl transform transition-transform duration-300 group-hover:scale-[1.02]" />
              <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-20 mix-blend-overlay rounded-2xl" />

              <div className="h-full relative overflow-hidden rounded-2xl p-8 shadow-xl flex flex-col justify-between border border-gray-700">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20 tracking-wide">
                      SERVICIO PREMIUM
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 font-serif">Potencia tu Impacto</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed text-sm">
                    Estrategia digital y tecnología para líderes. No dejes que tus ideas se pierdan en el ruido.
                  </p>
                </div>

                <div className="mt-auto">
                  <div className="w-full bg-white text-gray-900 font-bold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
                    Agendar Consultoría
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>

          </div>
        </MotionDiv>
      </section>

      {/* Latest Content with Real Images */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MotionDiv className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Lo más reciente</h2>
            <Link href="/columnas" className="text-sm font-semibold text-blue-600 hover:text-blue-500 group flex items-center">
              Ver todo <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </MotionDiv>

          <MotionList className="grid grid-cols-1 gap-y-16 lg:grid-cols-3 lg:gap-x-8">
            {featuredArticles.map((post) => (
              <MotionItem key={post.id} className="flex flex-col items-start justify-between group cursor-pointer">
                <Link href={post.link} className="relative w-full aspect-[16/9] mb-4 bg-gray-100 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow block">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                <div className="flex items-center gap-x-4 text-xs">
                  <time dateTime={post.date} className="text-gray-500">{post.date}</time>
                  <span className={`relative z-10 rounded-full px-3 py-1.5 font-medium ${post.category === 'Política' ? 'bg-blue-50 text-blue-600' : post.category === 'Literatura' ? 'bg-purple-50 text-purple-600' : 'bg-green-50 text-green-600'}`}>
                    {post.category}
                  </span>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-bold leading-6 text-gray-900 group-hover:text-blue-600 transition-colors">
                    <Link href={post.link}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                    {post.excerpt}
                  </p>
                </div>
              </MotionItem>
            ))}
          </MotionList>
        </div>
      </section>

      {/* Interviews Section */}
      <InterviewsSection />

    </div>
  );
}
