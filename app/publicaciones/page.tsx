import { PublicationsSection } from "@/components/PublicationsSection";
import { MediaAppearancesSection } from "@/components/MediaAppearancesSection";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
    title: "Publicaciones",
    description: "Libros y publicaciones destacadas de los fundadores del Centro de Reflexiones Críticas.",
    path: "/publicaciones",
});

export default function Publicaciones() {
    return (
        <div className="bg-[#fffdf8]">
            <PublicationsSection />
            <div id="medios-publicaciones">
                <MediaAppearancesSection />
            </div>
        </div>
    );
}
