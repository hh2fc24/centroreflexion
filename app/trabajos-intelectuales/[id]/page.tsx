import { findPublishedArticle } from "@/lib/server/publicArticles";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import AcademicArticleReader from "@/components/AcademicArticleReader";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const params = await props.params;
    const post = await findPublishedArticle("academic", params.id);

    if (!post) {
        return {
            title: "Artículo no encontrado",
            description: "El artículo académico que buscas no existe.",
        };
    }

    return {
        title: `${post.title} | Trabajos Intelectuales | CRC`,
        description: post.excerpt,
        alternates: { canonical: `/trabajos-intelectuales/${params.id}` },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
            publishedTime: post.date,
            authors: [post.author],
            images: post.image
                ? [{ url: post.image, width: 1200, height: 630, alt: post.title }]
                : [],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt,
            images: [post.image || DEFAULT_OG_IMAGE],
        },
    };
}

export default async function TrabajoIntelectualDetail(props: {
    params: Promise<{ id: string }>;
}) {
    const params = await props.params;
    const post = await findPublishedArticle("academic", params.id);

    if (!post) {
        notFound();
    }

    return <AcademicArticleReader article={post} />;
}
