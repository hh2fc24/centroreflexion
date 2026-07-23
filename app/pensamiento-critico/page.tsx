import type { Metadata } from "next";
import { PensamientoCriticoPage } from "@/components/PensamientoCriticoPage";
import { readPublishedArticleCollections } from "@/lib/server/publicArticles";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
    title: "Pensamiento Crítico",
    description:
        "Columnas de opinión y artículos de pensamiento crítico sobre infancia, familia, ciencias sociales y política del Centro de Reflexiones Críticas.",
    path: "/pensamiento-critico",
    ogTitle: "Pensamiento Crítico | Centro de Reflexiones Críticas",
    ogDescription: "Columnas de opinión y análisis sobre infancia, familia, ciencias sociales y política.",
});

export default async function PensamientoCritico() {
  const { columns, reviews } = await readPublishedArticleCollections();
  return <PensamientoCriticoPage articles={[...columns, ...reviews]} />;
}
