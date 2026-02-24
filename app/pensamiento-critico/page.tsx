import { MotionList, MotionItem } from "@/components/ui/Motion";
import Image from "next/image";
import Link from "next/link";
import { readers } from "@/lib/data";
import { parseDisplayDate } from "@/lib/articles/date";

export const metadata = {
    title: "Pensamiento Crítico",
    description: "Columnas de opinión, crítica literaria y cultural, ensayos y reflexiones sobre la complejidad social contemporánea.",
};

export default function PensamientoCritico() {
    // Merge all reader articles and sort by date (newest first)
    const allArticles = [...readers].map(r => ({ ...r, basePath: "/pensamiento-critico" })).sort((a, b) => {
        const tb = parseDisplayDate(b.date);
        const ta = parseDisplayDate(a.date);
        if (Number.isFinite(tb) && Number.isFinite(ta)) return tb - ta;
        return b.date.localeCompare(a.date);
    });

    if (allArticles.length === 0) return null;

    const featuredArticle = allArticles[0];
    const remainingArticles = allArticles.slice(1);

    // Get unique categories
    const categories = [...new Set(allArticles.map(a => a.category))];

    return (
        <div className="bg-gray-50 py-24 sm:py-32 min-h-screen">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mx-auto max-w-3xl text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <h2 className="text-4xl font-black tracking-tight text-gray-900 sm:text-6xl font-serif">
                        Pensamiento <span className="text-red-700">Crítico</span>
                    </h2>
                    <div className="h-1 w-20 bg-red-700 mx-auto mt-8 mb-6"></div>
                    <p className="mt-4 text-xl leading-8 text-gray-600 font-light">
                        Columnas de opinión, observaciones reflexivas y ensayos analíticos
                        sobre la complejidad social contemporánea.
                    </p>

                    {/* Category badges */}
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                        <span className="inline-flex items-center rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 ring-1 ring-inset ring-red-200 cursor-pointer hover:bg-red-100 transition-colors">
                            Todas
                        </span>
                        {categories.map(cat => (
                            <span
                                key={cat}
                                className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                {cat}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Featured Article */}
                <div className="mb-24 relative isolate overflow-hidden bg-white rounded-3xl ring-1 ring-gray-200 shadow-xl shadow-gray-200/50 sm:mx-0 pr-0 lg:pr-10 lg:pl-0 lg:flex lg:items-center">
                    <Link href={`${featuredArticle.basePath}/${featuredArticle.id}`} className="block lg:w-1/2 group relative aspect-[4/3] lg:aspect-[5/4] overflow-hidden rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none">
                        <Image
                            src={featuredArticle.image}
                            alt={featuredArticle.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </Link>
                    <div className="p-8 sm:p-12 lg:w-1/2 lg:pl-16">
                        <div className="flex items-center gap-x-4 text-sm mb-6">
                            <time dateTime={featuredArticle.date} className="text-gray-500 font-medium tracking-wide uppercase">
                                {featuredArticle.date}
                            </time>
                            <span className="relative z-10 rounded-full px-3 py-1 font-semibold text-xs tracking-wide uppercase bg-red-50 text-red-700">
                                {featuredArticle.category}
                            </span>
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-bold leading-[1.2] text-gray-900 mb-6 font-serif hover:text-red-700 transition-colors">
                            <Link href={`${featuredArticle.basePath}/${featuredArticle.id}`}>
                                {featuredArticle.title}
                            </Link>
                        </h3>
                        <p className="mt-2 text-lg leading-relaxed text-gray-600 mb-8 border-l-2 border-red-200 pl-4 italic">
                            {featuredArticle.excerpt}
                        </p>
                        <div className="flex items-center gap-x-4 border-t border-gray-100 pt-6">
                            <div className="h-12 w-12 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-gray-300">
                                {featuredArticle.author.charAt(0)}
                            </div>
                            <div className="text-base leading-6">
                                <p className="font-semibold text-gray-900">
                                    {featuredArticle.author}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Divider */}
                <div className="flex items-center gap-6 mb-16">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 font-serif">Más Columnas</h2>
                    <div className="h-px bg-gray-200 flex-1"></div>
                </div>

                {/* Masonry-Style Grid for Remaining Articles */}
                <MotionList className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-y-24">
                    {remainingArticles.map((post, idx) => (
                        <MotionItem key={post.id} className="flex flex-col group cursor-pointer bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 overflow-hidden">
                            <Link href={`${post.basePath}/${post.id}`} className="relative w-full aspect-[16/9] overflow-hidden block">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                            </Link>
                            <div className="p-8 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-x-4 text-xs mb-5">
                                        <time dateTime={post.date} className="text-gray-500 font-medium">
                                            {post.date}
                                        </time>
                                        <span className={`relative z-10 rounded-full px-3 py-1 font-semibold uppercase tracking-wider text-[10px] ${post.category === "Educación" ? "bg-blue-50 text-blue-700" :
                                            post.category === "Políticas Públicas" ? "bg-purple-50 text-purple-700" :
                                                post.category === "Infancia" ? "bg-red-50 text-red-700" :
                                                    "bg-gray-100 text-gray-700"
                                            }`}>
                                            {post.category}
                                        </span>
                                    </div>
                                    <div className="group relative">
                                        <h3 className="mt-3 text-2xl font-bold leading-tight text-gray-900 mb-4 font-serif group-hover:text-red-700 transition-colors">
                                            <Link href={`${post.basePath}/${post.id}`}>
                                                <span className="absolute inset-0" />
                                                {post.title}
                                            </Link>
                                        </h3>
                                        <p className="line-clamp-3 text-base leading-relaxed text-gray-600">
                                            {post.excerpt}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-8 flex items-center gap-x-4 pt-6 border-t border-gray-100">
                                    <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 text-xs font-bold ring-1 ring-gray-200">
                                        {post.author.charAt(0)}
                                    </div>
                                    <div className="text-sm leading-6 flex-1">
                                        <p className="font-semibold text-gray-900">
                                            {post.author}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </MotionItem>
                    ))}
                </MotionList>
            </div>
        </div>
    );
}
