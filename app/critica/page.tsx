import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { readPublishedArticleCollections } from "@/lib/server/publicArticles";
import { pageMetadata } from "@/lib/seo";
import { TypographicCover, isRealPhoto } from "@/components/TypographicCover";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
    title: "Crítica",
    description:
        "Crítica literaria, cultural y cinematográfica del Centro de Reflexiones Críticas: reseñas y análisis con mirada social y humanista.",
    path: "/critica",
    ogTitle: "Crítica | Centro de Reflexiones Críticas",
    ogDescription: "Reseñas y crítica literaria, cultural y cinematográfica.",
});

const getAuthorDetails = (author: string) => {
    if (author.includes("Rocío Solar")) {
        return { image: "/images/rocio_solar_real_white.png", role: "Cofundadora y Directora Clínica del CRC" };
    }
    if (author.includes("Juan Carlos Rauld")) {
        return { image: "/images/juan_carlos_real_white.png", role: "Director del CRC" };
    }
    return null;
};

export default async function Criticism() {
    const { reviews } = await readPublishedArticleCollections();

    return (
        <div className="min-h-screen bg-[#f8f5ee] text-[#171713]">
            <header className="border-b border-[#d8cfc0] bg-[#fffdf8]">
                <div className="mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
                    <p className="text-[0.8125rem] font-semibold text-[#9f5528]">Reseñas y ensayos</p>
                    <h1 className="crc-serif mt-3 max-w-[22ch] text-balance text-[clamp(2rem,3.2vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.01em]">
                        Crítica literaria y cultural
                    </h1>
                    <p className="mt-5 max-w-[62ch] text-[1.0625rem] leading-[1.7] text-[#55574f]">
                        Reseñas, ensayos y lecturas sobre literatura, cine y expresiones culturales contemporáneas,
                        leídas desde la infancia, las instituciones y la salud mental.
                    </p>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-16">
                {reviews.length === 0 ? (
                    <p className="text-[1rem] text-[#55574f]">Aún no hay reseñas publicadas.</p>
                ) : (
                    <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                        {reviews.map((post) => {
                            const details = getAuthorDetails(post.author);
                            return (
                                <article key={post.id}>
                                    <Link
                                        href={`/critica/${post.id}`}
                                        className="group block rounded-[6px] outline-none focus-visible:ring-2 focus-visible:ring-[#bd6f3c] focus-visible:ring-offset-2"
                                    >
                                        {isRealPhoto(post.image) ? (
                                            <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-[#eee8dc]">
                                                <Image src={post.image} alt={post.imageAlt || post.title} fill sizes="(min-width: 1024px) 360px, 100vw" className="object-cover" />
                                            </div>
                                        ) : (
                                            <TypographicCover
                                                category={post.category}
                                                title={post.title}
                                                date={post.date}
                                                titleAs="h2"
                                                className="transition-transform duration-200 group-hover:-translate-y-px"
                                            />
                                        )}
                                        {isRealPhoto(post.image) ? (
                                            <h2 className="crc-serif mt-4 text-[1.35rem] font-semibold leading-[1.2] text-[#171713] group-hover:underline group-hover:underline-offset-4">
                                                {post.title}
                                            </h2>
                                        ) : null}
                                        <p className="mt-4 line-clamp-3 text-[0.9375rem] leading-[1.7] text-[#55574f]">{post.excerpt}</p>
                                    </Link>
                                    <div className="mt-5 flex items-center gap-3 border-t border-[#d8cfc0] pt-4">
                                        {details?.image ? (
                                            <Image src={details.image} alt="" width={36} height={36} className="h-9 w-9 rounded-full bg-[#eee8dc] object-cover" />
                                        ) : null}
                                        <div className="text-[0.875rem] leading-[1.4]">
                                            <p className="font-semibold text-[#171713]">{post.author}</p>
                                            {details?.role ? <p className="text-[#6f675d]">{details.role}</p> : null}
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
