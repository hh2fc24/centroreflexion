import type { Metadata } from "next";
import { MotionList, MotionItem } from "@/components/ui/Motion";
import Image from "next/image";
import Link from "next/link";
import { readPublishedArticleCollections } from "@/lib/server/publicArticles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Crítica",
    description:
        "Crítica literaria, cultural y cinematográfica del Centro de Reflexiones Críticas: reseñas y análisis con mirada social y humanista.",
    openGraph: {
        title: "Crítica | Centro de Reflexiones Críticas",
        description: "Reseñas y crítica literaria, cultural y cinematográfica.",
    },
};

const getAuthorDetails = (author: string) => {
    if (author.includes("Rocío Solar")) {
        return { image: "/images/rocio_solar_real_white.png", role: "Cofundadora CRC · Terapeuta Ocupacional, Magíster (c) en Ocupación y TO, U. de Chile" };
    }
    if (author.includes("Juan Carlos Rauld")) {
        return { image: "/images/juan_carlos_real_white.png", role: "Director CRC · Doctorando en Trabajo Social, Universidad Rovira i Virgili, España" };
    }
    return null;
};

export default async function Criticism() {
    const { reviews } = await readPublishedArticleCollections();

    return (
        <div className="bg-[#fffdf8] py-16 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-[#171713] sm:text-4xl">
                        Crítica Literaria y Cultural
                    </h2>
                    <p className="mt-3 text-base leading-7 text-[#55574f] sm:text-lg sm:leading-8">
                        Reseñas, ensayos y reflexiones sobre el arte, la literatura y las expresiones culturales contemporáneas.
                    </p>
                </div>
                <MotionList className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-14 sm:mt-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {reviews.map((post) => (
                        <MotionItem key={post.id} className="flex flex-col items-start justify-between group cursor-pointer">
                            <Link href={`/critica/${post.id}`} className="relative w-full overflow-hidden rounded-[8px] block">
                                <div className="aspect-[16/9] w-full sm:aspect-[2/1] lg:aspect-[3/2] relative">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="absolute inset-0 ring-1 ring-inset ring-[#171713]/10 rounded-[8px]" />
                            </Link>
                            <div className="max-w-xl">
                                <div className="mt-8 flex items-center gap-x-4 text-xs">
                                    <time dateTime={post.date} className="text-[#70695f]">
                                        {post.date}
                                    </time>
                                    <span className="relative z-10 rounded-full bg-[#f4eadf] px-3 py-1.5 font-medium text-[#9f5528] hover:bg-[#ecd8c7]">
                                        {post.category}
                                    </span>
                                </div>
                                <div className="group relative">
                                    <h3 className="mt-3 text-lg font-semibold leading-6 text-[#171713] group-hover:text-[#bd6f3c] transition-colors">
                                        <Link href={`/critica/${post.id}`}>
                                            <span className="absolute inset-0" />
                                            {post.title}
                                        </Link>
                                    </h3>
                                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-[#55574f]">
                                        {post.excerpt}
                                    </p>
                                </div>
                                <div className="relative mt-8 flex items-center gap-x-4">
                                    {(() => {
                                        const details = getAuthorDetails(post.author);
                                        return (
                                            <>
                                                {details?.image ? (
                                                    <Image src={details.image} alt={post.author} width={40} height={40} className="h-10 w-10 rounded-full bg-[#f8f5ee] object-cover" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-[#eee8dc] flex items-center justify-center text-[#70695f] text-xs font-bold">
                                                        {post.author.charAt(0)}
                                                    </div>
                                                )}
                                                <div className="text-sm leading-6">
                                                    <p className="font-semibold text-[#171713]">
                                                        <span className="absolute inset-0" />
                                                        {post.author}
                                                    </p>
                                                    {details?.role && (
                                                        <p className="text-xs text-[#70695f]">{details.role}</p>
                                                    )}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </MotionItem>
                    ))}
                </MotionList>
            </div>
        </div>
    );
}
