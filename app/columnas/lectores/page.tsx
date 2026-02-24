import { MotionList, MotionItem } from "@/components/ui/Motion";
import Image from "next/image";
import Link from "next/link";
import { readers } from "@/lib/data";

export default function ReadersColumns() {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Columnas de Opinión
                    </h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                        Voces y visiones diversas de nuestros lectores.
                    </p>
                </div>

                <MotionList className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {readers.map((post) => (
                        <MotionItem key={post.id} className="flex flex-col items-start justify-between group cursor-pointer">
                            <Link href={`/columnas/lectores/${post.id}`} className="relative w-full overflow-hidden rounded-2xl block">
                                <div className="aspect-[16/9] w-full sm:aspect-[2/1] lg:aspect-[3/2] relative bg-gray-100 flex items-center justify-center">
                                    {post.image ? (
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="text-gray-400 font-medium tracking-widest uppercase text-sm">CRC Opinión</div>
                                    )}
                                </div>
                                <div className="absolute inset-0 ring-1 ring-inset ring-gray-900/10 rounded-2xl" />
                            </Link>
                            <div className="max-w-xl">
                                <div className="mt-8 flex items-center gap-x-4 text-xs">
                                    <time dateTime={post.date} className="text-gray-500">
                                        {post.date}
                                    </time>
                                    <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                                        {post.category}
                                    </span>
                                </div>
                                <div className="group relative">
                                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-blue-600 transition-colors">
                                        <Link href={`/columnas/lectores/${post.id}`}>
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
