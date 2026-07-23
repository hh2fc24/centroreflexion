import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
    title: "Conócenos",
    description:
        "Conoce al equipo fundador del Centro de Reflexiones Críticas: trayectoria en salud mental, infancia, trabajo social y consultoría institucional.",
    path: "/conocenos",
    ogTitle: "Conócenos | Centro de Reflexiones Críticas",
    ogDescription: "El equipo y la trayectoria detrás del Centro de Reflexiones Críticas.",
});

export default function ConocenosLayout({ children }: { children: React.ReactNode }) {
    return children;
}
