import { MotionList, MotionItem } from "@/components/ui/Motion";
import Image from "next/image";
import Link from "next/link";
import { columns, reviews } from "@/lib/data";
import { parseDisplayDate } from "@/lib/articles/date";

export const metadata = {
    title: "Pensamiento Crítico",
    description: "Columnas de opinión, crítica literaria y cultural, ensayos y reflexiones sobre la complejidad social contemporánea.",
};

export default function PensamientoCritico() {
    // Merge all articles and sort by date (newest first)
    const allArticles = [
        ...columns.map(c => ({ ...c, basePath: "/columnas" })),
        ...reviews.map(r => ({ ...r, basePath: "/critica" })),
    ].sort((a, b) => {
        const tb = parseDisplayDate(b.date);
        const ta = parseDisplayDate(a.date);
        if (Number.isFinite(tb) && Number.isFinite(ta)) return tb - ta;
        return b.date.localeCompare(a.date);
    });

    // Get unique categories
    const categories = [...new Set(allArticles.map(a => a.category))];

    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-serif">
                        Pensamiento <span className="text-red-600">Crítico</span>
                    </h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                        Columnas de opinión, crítica literaria y cultural, ensayos y reflexiones
                        sobre la complejidad social contemporánea.
                    </p>

                    {/* Category badges */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                        {categories.map(cat => (
                            <span
                                key={cat}
                                className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200"
                            >
                                {cat}
                            </span>
                        ))}
                    </div>
                </div>

                <MotionList className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {allArticles.map((post) => (
                        <MotionItem key={post.id} className="flex flex-col items-start justify-between group cursor-pointer">
                            <Link href={`${post.basePath}/${post.id}`} className="relative w-full overflow-hidden rounded-2xl block">
                                <div className="aspect-[16/9] w-full sm:aspect-[2/1] lg:aspect-[3/2] relative">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="absolute inset-0 ring-1 ring-inset ring-gray-900/10 rounded-2xl" />
                            </Link>
                            <div className="max-w-xl">
                                <div className="mt-8 flex items-center gap-x-4 text-xs">
                                    <time dateTime={post.date} className="text-gray-500">
                                        {post.date}
                                    </time>
                                    <span className={`relative z-10 rounded-full px-3 py-1.5 font-medium ${post.category === "Política" ? "bg-blue-50 text-blue-600" :
                                            post.category === "Reseña" ? "bg-purple-50 text-purple-700" :
                                                post.category === "Crítica" ? "bg-red-50 text-red-700" :
                                                    post.category === "Ensayo" ? "bg-amber-50 text-amber-700" :
                                                        "bg-gray-50 text-gray-600"
                                        }`}>
                                        {post.category}
                                    </span>
                                </div>
                                <div className="group relative">
                                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-red-600 transition-colors">
                                        <Link href={`${post.basePath}/${post.id}`}>
                                            <span className="absolute inset-0" />
                                            {post.title}
                                        </Link>
                                    </h3>
                                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                                        {post.excerpt}
                                    </p>
                                </div>
                                <div className="relative mt-8 flex items-center gap-x-4">
                                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">
                                        {post.author.charAt(0)}
                                    </div>
                                    <div className="text-sm leading-6">
                                        <p className="font-semibold text-gray-900">
                                            <span className="absolute inset-0" />
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
