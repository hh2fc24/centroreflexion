import { readers } from "@/lib/data";
import ArticleDetail from "@/components/ArticleDetail";
import { notFound } from "next/navigation";

import { Metadata } from "next";

export function generateStaticParams() {
    return readers.map((post) => ({
        id: post.id,
    }));
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const params = await props.params;
    const post = readers.find((p) => p.id === params.id);

    if (!post) {
        return {
            title: "Columna no encontrada",
            description: "La columna que buscas no existe."
        };
    }

    return {
        title: `${post.title} | Columnas de Lectores`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
            publishedTime: post.date,
            authors: [post.author],
            images: post.image ? [
                {
                    url: post.image,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ] : []
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt,
            images: post.image ? [post.image] : [],
        },
    };
}

export default async function ReaderColumnPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const post = readers.find((p) => p.id === params.id);

    if (!post) {
        notFound();
    }

    return <ArticleDetail article={post} />;
}
