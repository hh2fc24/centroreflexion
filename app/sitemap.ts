import { MetadataRoute } from "next";
import { columns, reviews } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://centroreflexionescriticas.cl";

    const columnUrls = columns.map((post) => ({
        url: `${baseUrl}/columnas/${post.id}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }));

    const reviewUrls = reviews.map((post) => ({
        url: `${baseUrl}/critica/${post.id}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 1,
        },
        {
            url: `${baseUrl}/conocenos`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/servicios`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/columnas`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/critica`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/pensamiento-critico`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/envia-tu-texto`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contacto`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.7,
        },
        ...columnUrls,
        ...reviewUrls,
    ];
}
