import type { Metadata } from "next";
import { PensamientoCriticoPage } from "@/components/PensamientoCriticoPage";
import { readPublishedArticleCollections } from "@/lib/server/publicArticles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Pensamiento Crítico",
    description:
        "Columnas de opinión y artículos de pensamiento crítico sobre infancia, familia, ciencias sociales y política del Centro de Reflexiones Críticas.",
    openGraph: {
        title: "Pensamiento Crítico | Centro de Reflexiones Críticas",
        description: "Columnas de opinión y análisis sobre infancia, familia, ciencias sociales y política.",
    },
};

export default async function PensamientoCritico() {
  const { columns, reviews } = await readPublishedArticleCollections();
  return <PensamientoCriticoPage articles={[...columns, ...reviews]} />;
}
