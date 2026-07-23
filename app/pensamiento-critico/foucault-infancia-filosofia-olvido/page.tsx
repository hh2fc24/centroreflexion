import FoucaultEditorialDetail from "./FoucaultEditorialDetail";
import { findPublishedArticle } from "@/lib/server/publicArticles";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
    const post = await findPublishedArticle("columns", "foucault-infancia-filosofia-olvido") ?? await findPublishedArticle("reviews", "foucault-infancia-filosofia-olvido");

    if (!post) {
        return {
            title: "Columna no encontrada",
            description: "La columna que buscas no existe."
        };
    }

    return {
        title: `${post.title} | Pensamiento Crítico | CRC`,
        description: post.excerpt,
        alternates: { canonical: "/pensamiento-critico/foucault-infancia-filosofia-olvido" },
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
            images: [post.image || DEFAULT_OG_IMAGE],
        },
    };
}

export default async function FoucaultPage() {
    const post = await findPublishedArticle("columns", "foucault-infancia-filosofia-olvido") ?? await findPublishedArticle("reviews", "foucault-infancia-filosofia-olvido");

    if (!post) {
        notFound();
    }

    return <FoucaultEditorialDetail article={post} />;
}
