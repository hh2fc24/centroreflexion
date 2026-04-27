import { PensamientoCriticoPage } from "@/components/PensamientoCriticoPage";
import { readPublishedArticleCollections } from "@/lib/server/publicArticles";

export const dynamic = "force-dynamic";

export default async function PensamientoCritico() {
  const { columns, reviews } = await readPublishedArticleCollections();
  return <PensamientoCriticoPage articles={[...columns, ...reviews]} />;
}
