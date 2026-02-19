import { reviews } from "@/lib/data";
import ArticleDetail from "@/components/ArticleDetail";
import { notFound } from "next/navigation";

import { Metadata } from "next";

export function generateStaticParams() {
    return reviews.map((post) => ({
        id: post.id,
    }));
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const params = await props.params;
    const post = reviews.find((p) => p.id === params.id);

    if (!post) {
        return {
            title: "Reseña no encontrada",
            description: "La reseña que buscas no existe."
        };
    }

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
            publishedTime: post.date,
            authors: [post.author],
            images: [
                {
                    url: post.image,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt,
            images: [post.image],
        },
    };
}

export default async function CriticismPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const post = reviews.find((p) => p.id === params.id);

    if (!post) {
        notFound();
    }

    return <ArticleDetail article={post} />;
}
