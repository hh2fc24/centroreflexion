import { Article } from "@/lib/data";

interface JsonLdProps {
    article?: Article;
}

export function JsonLd({ article }: JsonLdProps) {
    if (!article) return null;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "image": [
            `https://centroreflexionescriticas.cl${article.image}`
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
