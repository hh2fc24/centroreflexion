import { MotionList, MotionItem } from "@/components/ui/Motion";
import Image from "next/image";
import Link from "next/link";
import { readPublishedArticleCollections } from "@/lib/server/publicArticles";

export const dynamic = "force-dynamic";

const getAuthorDetails = (author: string) => {
    if (author.includes("Rocío Solar")) {
        return { image: "/images/rocio_solar.png", role: "Co-fundadora CRC · Terapeuta Ocupacional, Magíster (c) en Ocupación y TO, U. de Chile" };
    }
    if (author.includes("Juan Carlos Rauld")) {
        return { image: "/images/juan_carlos_20260224.png", role: "Director CRC · Estudiante de doctorado de Trabajo Social, Universidad de Rovira I Virgilli, España" };
    }
    return null;
};

export default async function Criticism() {
    const { reviews } = await readPublishedArticleCollections();

    return (
        <div className="bg-white py-16 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Crítica Literaria y Cultural
                    </h2>
                    <p className="mt-3 text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                        Reseñas, ensayos y reflexiones sobre el arte, la literatura y las expresiones culturales contemporáneas.
                    </p>
                </div>
                <MotionList className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-14 sm:mt-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {reviews.map((post) => (
                        <MotionItem key={post.id} className="flex flex-col items-start justify-between group cursor-pointer">
                            <Link href={`/critica/${post.id}`} className="relative w-full overflow-hidden rounded-2xl block">
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
                                    <span className="relative z-10 rounded-full bg-purple-50 px-3 py-1.5 font-medium text-purple-700 hover:bg-purple-100">
                                        {post.category}
                                    </span>
                                </div>
                                <div className="group relative">
                                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-purple-600 transition-colors">
                                        <Link href={`/critica/${post.id}`}>
                                            <span className="absolute inset-0" />
                                            {post.title}
                                        </Link>
                                    </h3>
                                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                                        {post.excerpt}
                                    </p>
                                </div>
                                <div className="relative mt-8 flex items-center gap-x-4">
                                    {(() => {
                                        const details = getAuthorDetails(post.author);
                                        return (
                                            <>
                                                {details?.image ? (
                                                    <Image src={details.image} alt={post.author} width={40} height={40} className="h-10 w-10 rounded-full bg-gray-50 object-cover" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">
                                                        {post.author.charAt(0)}
                                                    </div>
                                                )}
                                                <div className="text-sm leading-6">
                                                    <p className="font-semibold text-gray-900">
                                                        <span className="absolute inset-0" />
                                                        {post.author}
                                                    </p>
                                                    {details?.role && (
                                                        <p className="text-xs text-gray-500">{details.role}</p>
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
