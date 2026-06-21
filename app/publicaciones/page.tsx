import { PublicationsSection } from "@/components/PublicationsSection";
import { MediaAppearancesSection } from "@/components/MediaAppearancesSection";
import { parseDisplayDate } from "@/lib/articles/date";
import { readPublishedArticleCollections } from "@/lib/server/publicArticles";

export const metadata = {
    title: "Publicaciones",
    description: "Libros y publicaciones destacadas de los fundadores del Centro de Reflexiones Críticas.",
};

export default async function Publicaciones() {
    const { columns, reviews } = await readPublishedArticleCollections();
    const latestArticles = [
        ...columns.map((article) => ({ ...article, href: `/pensamiento-critico/${article.id}` })),
        ...reviews.map((article) => ({ ...article, href: `/critica/${article.id}` })),
    ]
        .sort((a, b) => parseDisplayDate(b.date) - parseDisplayDate(a.date))
        .slice(0, 6)
        .map((article) => ({
            id: article.id,
            title: article.title,
            excerpt: article.excerpt,
            author: article.author,
            date: article.date,
            category: article.category,
            image: article.image,
            href: article.href,
        }));

    return (
        <div className="bg-[#fffdf8]">
            <PublicationsSection latestArticles={latestArticles} articleCount={columns.length + reviews.length} />
            <div id="medios-publicaciones">
                <MediaAppearancesSection />
            </div>
        </div>
    );
}
