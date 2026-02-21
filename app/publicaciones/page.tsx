import { PublicationsSection } from "@/components/PublicationsSection";

export const metadata = {
    title: "Publicaciones",
    description: "Libros y publicaciones destacadas de los fundadores del Centro de Reflexiones Críticas.",
};

export default function Publicaciones() {
    return (
        <div className="bg-white">
            <PublicationsSection />
        </div>
    );
}
