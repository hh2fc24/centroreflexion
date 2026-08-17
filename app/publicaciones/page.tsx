import { PublicationsSection } from "@/components/PublicationsSection";
import { MediaAppearancesSection } from "@/components/MediaAppearancesSection";
import { AcademicPublicationsSection } from "@/components/AcademicPublicationsSection";
import { pageMetadata } from "@/lib/seo";
import { readPublishedArticleCollections } from "@/lib/server/publicArticles";

export const metadata = pageMetadata({
    title: "Publicaciones",
    description: "Libros y publicaciones destacadas de los fundadores del Centro de Reflexiones Críticas.",
    path: "/publicaciones",
});

export default async function Publicaciones() {
    const { academic } = await readPublishedArticleCollections();

    return (
        <div className="bg-[#fffdf8]">
            <PublicationsSection />
            <AcademicPublicationsSection academic={academic} />
            <div id="medios-publicaciones">
                <MediaAppearancesSection />
            </div>
        </div>
    );
}
