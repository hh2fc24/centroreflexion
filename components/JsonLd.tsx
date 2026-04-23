import { Article } from "@/lib/data";
import { getSiteUrl } from "@/lib/site";

interface JsonLdProps {
    article?: Article;
}

export function JsonLd({ article }: JsonLdProps) {
    if (!article) return null;
    const siteUrl = getSiteUrl();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "image": [
            `${siteUrl}${article.image}`
        ],
        "author": [
            {
                "@type": "Person",
                "name": article.author,
            },
        ],
        "datePublished": article.date, // Should be ISO 8601 ideally
        "description": article.excerpt,
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
