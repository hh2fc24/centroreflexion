import { Article } from "@/lib/data";
import { getSiteUrl } from "@/lib/site";

interface JsonLdProps {
    article?: Article;
}

function toIsoDate(spanishDate: string): string {
    const months: Record<string, string> = {
        ene: "01", feb: "02", mar: "03", abr: "04", may: "05", jun: "06",
        jul: "07", ago: "08", sep: "09", oct: "10", nov: "11", dic: "12",
    };
    const match = spanishDate.trim().match(/^(\d{1,2})\s+([A-Za-záéíóú]+)\.?\s+(\d{4})$/i);
    if (!match) return spanishDate;
    const [, day, monthRaw, year] = match;
    const month = months[monthRaw.toLowerCase().slice(0, 3)];
    if (!month) return spanishDate;
    return `${year}-${month}-${day.padStart(2, "0")}`;
}

export function JsonLd({ article }: JsonLdProps) {
    if (!article) return null;
    const siteUrl = getSiteUrl();
    const isoDate = toIsoDate(article.date);

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
        "publisher": {
            "@type": "Organization",
            "name": "Centro de Reflexiones Críticas",
            "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/logo-crc.png`,
            },
        },
        "datePublished": isoDate,
        "description": article.excerpt,
        "mainEntityOfPage": {
            "@type": "WebPage",
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
