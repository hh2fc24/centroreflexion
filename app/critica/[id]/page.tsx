import { reviews } from "@/lib/data";
import ArticleDetail from "@/components/ArticleDetail";
import { notFound } from "next/navigation";

export function generateStaticParams() {
    return reviews.map((post) => ({
        id: post.id,
    }));
}

export default async function CriticismPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const post = reviews.find((p) => p.id === params.id);

    if (!post) {
        notFound();
    }

    return <ArticleDetail article={post} />;
}
